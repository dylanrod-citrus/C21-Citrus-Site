import type { Handler } from "@netlify/functions";
import serverless from "serverless-http";
import { createC21NetlifyApi } from "../../server/netlifyApp";

const app = createC21NetlifyApi();

/** Handles existing `/api/*` paths after Netlify’s function redirect. */
export const handler: Handler = serverless(app) as Handler;
