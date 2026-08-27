# Office-owned Umami configuration

The C21 Citrus site is configured to load the office-owned Umami Cloud tracker
only after a visitor accepts optional analytics. The tracker script is
`https://cloud.umami.is/script.js` and was verified in the browser with the
office-provided website identifier.

The site records a custom `property_search_location` event only after a user
selects a city or ZIP suggestion. It does not use partial typed search text for
the event. Umami will surface these selections in the website’s Events and
Properties views after the production domain is added to the Umami website.

Before production cutover, add the final C21 domain in Umami and ensure the
same environment values are configured in Netlify.
