import { describe, expect, it } from "vitest";
import { filterPublishedOfficeListings, type MdmListing } from "./mdmService";

function listing(listingId: string, status: string, overrides: Partial<MdmListing> = {}): MdmListing {
  return {
    listingId,
    address: "100 Citrus Lane",
    city: "San Dimas",
    state: "CA",
    zip: "91773",
    price: 950_000,
    beds: 3,
    baths: 2,
    sqft: 1_800,
    status,
    propertyType: "SFR",
    photoUrl: null,
    photos: [],
    listingUrl: null,
    description: null,
    agentName: null,
    agentPhone: null,
    listingDate: null,
    yearBuilt: null,
    lotSize: null,
    garageSpaces: null,
    latitude: null,
    longitude: null,
    ...overrides,
  };
}

describe("published office listing filter", () => {
  it("keeps only exact active listing statuses", () => {
    const published = filterPublishedOfficeListings([
      listing("ACTIVE-1", "ACTIVE"),
      listing("INACTIVE-1", "INACTIVE"),
      listing("UNDER-CONTRACT-1", "ACTIVE UNDER CONTRACT"),
      listing("PENDING-1", "PENDING"),
      listing("SOLD-1", "SOLD"),
      listing("RENTAL-1", "ACTIVE", { address: "200 Citrus Lane", propertyType: "RENTAL" }),
    ]);

    expect(published.map((item) => item.listingId)).toEqual(["ACTIVE-1", "RENTAL-1"]);
  });

  it("removes duplicate records with the same MLS listing identifier", () => {
    const published = filterPublishedOfficeListings([
      listing("CV26077738", "ACTIVE", { price: 800_000 }),
      listing(" cv26077738 ", "ACTIVE", { price: 1_200_000 }),
      listing("CV26077739", "ACTIVE", { address: "200 Citrus Lane", price: 900_000 }),
    ]);

    expect(published.map((item) => item.listingId)).toEqual(["CV26077739", "CV26077738"]);
  });

  it("keeps the newer record when separate identifiers share one exact address", () => {
    const published = filterPublishedOfficeListings([
      listing("CV26010001", "ACTIVE", {
        address: "0 Snowdrop",
        city: "Rancho Cucamonga",
        zip: "91737",
        price: 2_600_000,
        listingDate: "2025-06-30T00:00:00Z",
        photos: ["older-photo"],
      }),
      listing("CV26010002", "ACTIVE", {
        address: "0 Snowdrop",
        city: "Rancho Cucamonga",
        zip: "91737",
        price: 800_000,
        listingDate: "2026-02-03T00:00:00Z",
        photos: ["newer-photo", "newer-photo-2"],
      }),
      listing("CV26010003", "ACTIVE", { address: "4459 Merced", city: "Baldwin Park", zip: "91706" }),
    ]);

    expect(published.map((item) => item.listingId)).toEqual(["CV26010003", "CV26010002"]);
  });
});
