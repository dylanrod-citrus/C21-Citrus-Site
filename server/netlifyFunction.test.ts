import { describe, expect, it } from "vitest";
import { handler } from "../netlify/functions/api";

describe("Netlify API function", () => {
  it("serves the health route through the serverless adapter", async () => {
    const response = await handler(
      {
        httpMethod: "GET",
        path: "/api/health",
        headers: { host: "localhost" },
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        body: null,
        isBase64Encoded: false,
      },
      {} as never,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toContain('"status":"ok"');
  });
});
