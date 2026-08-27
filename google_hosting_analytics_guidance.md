# Google Maps, Analytics, and Hosting Decision Notes

## Google Cloud Maps Platform

The current autocomplete integration calls the platform-managed Maps proxy. The Google proxy returned a `412 Precondition Failed` response reporting exhausted usage, so the site now uses a live MDM-location fallback while periodically retrying Google.

For an office-managed integration, Google’s current setup guidance identifies **Places API (New)** as the product to enable. The Cloud project needs account/billing prerequisites, the enabled API, and an API key or OAuth credential. Google’s security guidance should be followed to restrict a browser key by website referrer and restrict the key to only the APIs it needs.

Sources:

- https://developers.google.com/maps/documentation/places/web-service/get-api-key
- https://developers.google.com/maps/api-security-best-practices

## Umami analytics

Umami supports a tracker script, custom JavaScript events, and event-property breakdowns. The existing client code emits a `property_search_location` event only after optional tracking consent, and only on a completed city/ZIP selection; it does not send partial typed input through the application.

Sources:

- https://docs.umami.is/docs/collect-data
- https://docs.umami.is/docs/track-events

## Netlify deployment

The current application uses Express API routes for MDM, contact SMTP, privacy records, and autocomplete. Netlify supports Express via Netlify Functions, typically using an Express adapter and `netlify.toml` redirects from `/api/*` to the deployed function. A direct static deployment would omit those server routes.

Source:

- https://docs.netlify.com/build/frameworks/framework-setup-guides/express/
