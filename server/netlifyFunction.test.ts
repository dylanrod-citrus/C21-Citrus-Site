import { afterEach, describe, expect, it, vi } from "vitest";
import { handler } from "../netlify/functions/api";

function makeEvent(overrides: Partial<Parameters<typeof handler>[0]> = {}) {
  return {
    httpMethod: "GET",
    path: "/api/health",
    headers: { host: "localhost" },
    multiValueHeaders: {},
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    body: null,
    isBase64Encoded: false,
    ...overrides,
  } as Parameters<typeof handler>[0];
}

afterEach(() => vi.restoreAllMocks());

describe("Netlify API function", () => {
  it("serves the health route through the serverless adapter", async () => {
    const response = await handler(makeEvent(), {} as never);

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('"status":"ok"');
  });

  it("handles representative safe visitor routes through the serverless adapter", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(
      "<rss><channel><item><guid>verified-1</guid><title>Verified Client</title><description>A verified testimonial for adapter coverage.</description></item></channel></rss>",
      { status: 200 },
    )));

    const [mdm, testimonials, contact, privacy, trpc] = await Promise.all([
      handler(makeEvent({ path: "/api/mdm/search" }), {} as never),
      handler(makeEvent({ path: "/api/realsatisfied/testimonials" }), {} as never),
      handler(makeEvent({ httpMethod: "POST", path: "/api/contact", headers: { host: "localhost", "content-type": "application/json" }, body: "{}" }), {} as never),
      handler(makeEvent({ httpMethod: "POST", path: "/api/privacy-request", headers: { host: "localhost", "content-type": "application/json" }, body: "{}" }), {} as never),
      handler(makeEvent({ path: "/api/trpc/auth.me" }), {} as never),
    ]);

    expect(mdm.statusCode).toBe(200);
    expect(mdm.body).toContain('"listings":[]');
    expect(testimonials.statusCode).toBe(200);
    expect(testimonials.body).toContain("Verified Client");
    expect(contact.statusCode).toBe(400);
    expect(contact.body).toContain("Name is required");
    expect(privacy.statusCode).toBe(400);
    expect(privacy.body).toContain("Missing required fields");
    expect(trpc.statusCode).toBe(200);
    expect(trpc.body).toContain('"json":null');
  });
});
