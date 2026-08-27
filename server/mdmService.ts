/**
 * Anywhere MDM / MLS service restored from the uploaded C21 Citrus source.
 * Credentials remain server-side and every browser request uses the public
 * C21 API routes rather than accessing Anywhere directly.
 */

export interface MdmAgent {
  agentMasterId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  licenseNumber: string | null;
  title: string | null;
  officeName: string | null;
  isActive: boolean;
}

export interface MdmListing {
  listingId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  status: string;
  propertyType: string;
  photoUrl: string | null;
  photos: string[];
  listingUrl: string | null;
  description: string | null;
  agentName: string | null;
  agentPhone: string | null;
  listingDate: string | null;
  yearBuilt: number | null;
  lotSize: number | null;
  garageSpaces: number | null;
  latitude: number | null;
  longitude: number | null;
}

interface TokenCache { token: string; expiresAt: number; }
interface AgentsResponse { paginationMetadata?: { page?: number; pageSize?: number; total?: number }; agents?: Array<Record<string, unknown>>; }
interface MlsListingsResponse { mlsListings?: Array<Record<string, unknown>>; }

const tokenUrl = "https://realogy.okta.com/oauth2/aus7i8b1taFyPOEGc1t7/v1/token";
const scope = "https://dataservices.eap.com/eaplistingsapi";
const apiRoot = "https://api.anywhere.re";
const citrusOfficeMasterId = "P00400000FDdqQNDCYK9VPN53PuW61Wh9YnSRkCj";

// The known C21 Citrus active-listing IDs from the uploaded source package.
const activeListingIds = [
  "CV26077738", "CV25146208", "CV26068004", "CV26064722", "CV26062669", "CV26105194",
  "CV26076118", "CV26024018", "CV26092319", "CV26080740", "CV26092312", "CV26035829",
  "CV26055987", "CV26051847", "CV26096914", "CV26073623", "CV26029654", "CV26016021",
  "CV26050223", "CV26089574", "CV26052037", "CV26092674", "CV26001102", "CV26001155",
  "CV26096886", "CV26096911", "CV25243927", "CV26091655", "CV26090265", "CV26075380",
  "CV26090210", "CV26027477", "CV26071274", "CV26088395", "CV26094235", "CV26025399",
  "CV25144999", "CV26059796", "CV26094078", "CV25117629", "CV26019906", "CV25121879",
  "CV25121893", "CV25146504", "CV26055198", "CV26042566", "CV26087619", "CV26038179",
  "CV26009412", "CV26075561", "CV26096195", "CV25265906", "CV25269998", "CV25159599",
  "CV26043014", "CV26001246", "CV26030405", "CV26081838", "CV26104744", "CV26022307",
];

let tokenCache: TokenCache | null = null;

function required(name: "MDM_CLIENT_ID" | "MDM_CLIENT_SECRET" | "MDM_API_KEY"): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} not configured`);
  return value;
}

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) return tokenCache.token;

  const credentials = Buffer.from(`${required("MDM_CLIENT_ID")}:${required("MDM_CLIENT_SECRET")}`).toString("base64");
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", scope }).toString(),
  });
  if (!response.ok) throw new Error(`MDM token request failed with ${response.status}`);
  const payload = await response.json() as { access_token?: string; expires_in?: number };
  if (!payload.access_token || !payload.expires_in) throw new Error("MDM token response did not include an access token");
  tokenCache = { token: payload.access_token, expiresAt: Date.now() + payload.expires_in * 1_000 };
  return tokenCache.token;
}

async function anywhereGet<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(`${apiRoot}${path}`, {
    headers: { Authorization: `Bearer ${token}`, apiKey: required("MDM_API_KEY"), "x-hous-version": "v2.0", Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Anywhere API request failed with ${response.status} for ${path}`);
  return response.json() as Promise<T>;
}

function record(value: unknown): Record<string, unknown> { return value && typeof value === "object" ? value as Record<string, unknown> : {}; }
function list(value: unknown): Array<Record<string, unknown>> { return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : []; }
function stringOrNull(value: unknown): string | null { return typeof value === "string" && value.trim() ? value : null; }
function numberOrNull(value: unknown): number | null { return typeof value === "number" && Number.isFinite(value) ? value : null; }

function parseAgent(raw: Record<string, unknown>): MdmAgent {
  const info = record(raw.basicPersonInfo);
  const phones = list(info.phoneNumbers);
  const emails = list(info.emailAccounts);
  const media = list(info.media);
  const licenses = list(info.licenses);
  const offices = list(record(raw.companyOfficeAssociation).offices);
  const firstName = stringOrNull(info.firstName) ?? "";
  const lastName = stringOrNull(info.lastName) ?? "";
  const preferredPhone = phones.find((phone) => phone.phoneType === "CellPhone" && phone.isPrimary) ?? phones.find((phone) => phone.isPrimary) ?? phones[0];
  const preferredEmail = emails.find((email) => email.emailType === "BusinessEmail" && email.isPrimary) ?? emails.find((email) => email.isPrimary) ?? emails[0];
  const profilePhoto = media.find((item) => item.mediaUsageType === "ProfilePhoto") ?? media.find((item) => item.mediaType === "Image");
  return {
    agentMasterId: stringOrNull(raw.agentMasterId) ?? "",
    firstName,
    lastName,
    displayName: stringOrNull(info.displayName) ?? `${firstName} ${lastName}`.trim(),
    email: stringOrNull(preferredEmail?.emailAddress),
    phone: stringOrNull(preferredPhone?.phoneNumber),
    photoUrl: stringOrNull(profilePhoto?.cdnURL) ?? stringOrNull(profilePhoto?.url),
    licenseNumber: stringOrNull(licenses[0]?.licenseNumber),
    title: stringOrNull(info.title),
    officeName: stringOrNull(offices[0]?.officeName),
    isActive: raw.isActiveInSource !== false,
  };
}

function parseListing(raw: Record<string, unknown>): MdmListing | null {
  const property = record(raw.property);
  const listing = record(property.listing);
  const locationRoot = record(property.location);
  const location = record(locationRoot.address);
  const structure = record(property.structure);
  const price = record(listing.price);
  const mediaInfo = list(record(raw.media).mediaInfo);
  const agentOffice = record(listing.agentOffice);
  const listAgent = record(agentOffice.listAgent);
  const dates = record(listing.dates);
  const geo = record(locationRoot.geo);
  const listingId = stringOrNull(listing.listingId) ?? stringOrNull(listing.mlsListingId);
  const address = stringOrNull(location.unparsedAddress) ?? "";
  const city = stringOrNull(location.city) ?? "";
  if (!listingId || (!address && !city)) return null;
  const photos = mediaInfo.map((item) => stringOrNull(item.mediaUrl)).filter((url): url is string => Boolean(url));
  const listPrice = numberOrNull(price.listPrice) ?? 0;
  const closePrice = numberOrNull(price.closePrice) ?? 0;
  return {
    listingId, address, city, state: stringOrNull(location.stateOrProvince) ?? "", zip: stringOrNull(location.postalCode) ?? "",
    price: closePrice > 0 ? closePrice : listPrice,
    beds: numberOrNull(structure.bedroomsTotal), baths: numberOrNull(structure.bathroomsTotalDecimal), sqft: numberOrNull(structure.livingArea),
    status: stringOrNull(listing.standardStatus) ?? "UNKNOWN", propertyType: stringOrNull(property.propertyType) ?? "",
    photoUrl: photos[0] ?? null, photos, listingUrl: null, description: stringOrNull(listing.publicRemarks),
    agentName: stringOrNull(listAgent.listAgentFullname), agentPhone: stringOrNull(listAgent.listAgentPhone),
    listingDate: stringOrNull(dates.listingContractDate) ?? stringOrNull(dates.originalEntryTimestamp),
    yearBuilt: numberOrNull(structure.yearBuilt), lotSize: numberOrNull(structure.lotSizeSquareFeet), garageSpaces: numberOrNull(structure.garageSpaces),
    latitude: numberOrNull(geo.latitude), longitude: numberOrNull(geo.longitude),
  };
}

export async function fetchCitrusAgents(): Promise<MdmAgent[]> {
  const agents: MdmAgent[] = [];
  const pageSize = 100;
  let page = 1;

  while (true) {
    const data = await anywhereGet<AgentsResponse>(`/mdmagents/agents?officeMasterId=${citrusOfficeMasterId}&numPerPage=${pageSize}&page=${page}`);
    const currentPage = (data.agents ?? []).map(parseAgent).filter((agent) => agent.isActive && Boolean(agent.firstName || agent.lastName));
    agents.push(...currentPage);
    const total = data.paginationMetadata?.total ?? 0;
    if (page * pageSize >= total || currentPage.length === 0) break;
    page += 1;
  }

  const uniqueAgents = agents.filter((agent, index, all) => all.findIndex((item) => item.agentMasterId === agent.agentMasterId) === index);
  return uniqueAgents.sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
}

async function fetchListingById(listingId: string): Promise<MdmListing | null> {
  try {
    const data = await anywhereGet<MlsListingsResponse>(`/mls/listing/${encodeURIComponent(listingId)}`);
    return data.mlsListings?.[0] ? parseListing(data.mlsListings[0]) : null;
  } catch { return null; }
}

export async function fetchCitrusRecentSales(): Promise<MdmListing[]> {
  const listings: MdmListing[] = [];
  const batchSize = 30;
  for (let start = 0; start < activeListingIds.length; start += batchSize) {
    const batch = await Promise.all(activeListingIds.slice(start, start + batchSize).map(fetchListingById));
    listings.push(...batch.filter((listing): listing is MdmListing => Boolean(listing)));
  }
  return listings.filter((listing) => /active/i.test(listing.status)).sort((a, b) => b.price - a.price);
}

export async function fetchMlsSearch(query: string): Promise<MdmListing[]> {
  const normalized = query.trim();
  if (!normalized) return [];
  const path = /^\d{5}$/.test(normalized) ? `/mls/postalcode/${encodeURIComponent(normalized)}` : `/mls/city/${encodeURIComponent(normalized)}/state/CA`;
  const data = await anywhereGet<MlsListingsResponse>(path);
  return (data.mlsListings ?? []).map(parseListing).filter((listing): listing is MdmListing => Boolean(listing));
}
