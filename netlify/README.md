# Netlify deployment guide

This project is a Vite frontend with server-backed C21 API services. The
`netlify/functions/api.ts` handler wraps those services using `serverless-http`.
`netlify.toml` rewrites `/api/*` to that function while Netlify serves the
compiled Vite frontend from `dist/public`.

## Required configuration

1. Import `dylanrod-citrus/C21-Citrus-Site` into Netlify and use the repository
   root as the base directory.
2. Confirm Netlify detects the supplied build command and publish directory from
   `netlify.toml`.
3. Copy the variables named in `.env.example` into Netlify's environment-variable
   interface. Do not add their real values to GitHub.
4. Update Google Workspace SMTP after moving to a new domain, if necessary.
5. After creating the office Umami website, add its tracker endpoint and website
   identifier using `VITE_ANALYTICS_ENDPOINT` and `VITE_ANALYTICS_WEBSITE_ID`.

## Before production use

After Netlify’s first preview deploy, confirm `/api/health` returns
`{"status":"ok"}`, test the MDM listings and contact form with non-sensitive
test data, then set the production domain before generating final OAuth redirect
URIs.
