# C21 Citrus Netlify Launch Setup

## Database

The active **Netlify Database** already provides PostgreSQL for the separate C21 Citrus site. Do **not** manually add `NETLIFY_DB_URL`; Netlify injects it for functions that use the database. The SQL files under `netlify/database/migrations/` are applied automatically before an eligible production deployment is published.

## Environment variables

Add the following values in the C21 Citrus Netlify site under **Project configuration → Environment variables**. Select the production scope and deploy-preview scope only where noted. Never add these values to GitHub or send them in chat.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `MDM_CLIENT_ID` | Functions, Deploy Previews | Anywhere MDM OAuth client identifier. |
| `MDM_CLIENT_SECRET` | Functions, Deploy Previews | Anywhere MDM OAuth secret. |
| `MDM_API_KEY` | Functions, Deploy Previews | Anywhere MDM live listing and agent API key. |
| `SMTP_USER` | Functions, Deploy Previews | Google Workspace sender mailbox, `no-reply@c21citrus.com`. |
| `SMTP_PASS` | Functions, Deploy Previews | Google Workspace App Password for the sender mailbox. |
| `CONTACT_RECIPIENTS` | Functions, Deploy Previews | Default comma-separated office recipient list; source page overrides remain in code. |
| `VITE_UMAMI_ENDPOINT` | Builds, Deploy Previews | `https://cloud.umami.is` (no trailing slash). |
| `VITE_UMAMI_WEBSITE_ID` | Builds, Deploy Previews | The C21 Citrus Umami Website ID. |
| `JWT_SECRET` | Functions, Deploy Previews | A new high-entropy production session secret. |

`VITE_` variables are embedded into the browser bundle during each build, so they must be available to the build. All other listed values remain server-side in Netlify Functions.

## First inventory refresh

After the deploy succeeds, open **Functions** in the C21 Citrus Netlify site, select `refresh-inventory`, and use **Run now** once. That fills the initial active-listing cache immediately. Netlify then refreshes the cache every 15 minutes on published deployments. Visitors use the cached inventory for property cards, city/ZIP suggestions, and listing searches.

## Preview and production verification

Verify the root homepage, `/agents`, `/search-results?q=91737`, a contact form, and the privacy-request flow. Then confirm the `refresh-inventory` function shows a successful run and the API endpoints return live listing data. Do not remove the `netlify/database/migrations/` folder; it is required to create the user, privacy-audit, and active-listing cache tables in the Netlify database.
