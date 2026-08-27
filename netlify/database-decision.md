# Netlify Database decision notes

Netlify Database is a managed PostgreSQL service built into Netlify. Its
production deploys access the main database while deploy previews use isolated
database branches. Netlify also provides database migration support as part of
the deploy lifecycle.

For this project, Netlify Database is the recommended option over a separate
provider because it removes an additional vendor and aligns the data store with
the planned GitHub-driven Netlify deployment. The current application uses
Drizzle with a MySQL/TiDB driver, so a deliberate dialect migration to Drizzle
PostgreSQL and a standard Netlify Database connection will be required before
production deployment.

Sources:

- https://docs.netlify.com/build/data-and-storage/netlify-database/
- https://orm.drizzle.team/docs/connect-netlify-db
