# Netlify environment-variable reference

Configure the following variable names in **Netlify → Site configuration →
Environment variables**. Do not create or commit a local `.env` file with their
values.

| Purpose | Variable names |
| --- | --- |
| Live Anywhere MDM data | `MDM_CLIENT_ID`, `MDM_CLIENT_SECRET`, `MDM_API_KEY` |
| Contact email delivery | `SMTP_USER`, `SMTP_PASS`, `CONTACT_RECIPIENTS` |
| Privacy audit database | `DATABASE_URL` |
| Auth and OAuth | `JWT_SECRET`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID` |
| Office-owned Umami | `VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID` |

After setting or changing an environment variable, trigger a new Netlify deploy
so the server function and frontend build receive the updated configuration.
