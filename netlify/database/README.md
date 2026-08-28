# C21 Citrus Netlify Database Migration

Netlify applies the SQL files in `netlify/database/migrations/` to the C21 Citrus production database immediately before a production deployment is published and to an isolated database branch for deploy previews. The migrations are ordered lexicographically by their filename prefix.

The application uses `drizzle-orm/netlify-db`, which discovers Netlify’s `NETLIFY_DB_URL` automatically at runtime. Do not add a database connection string to source control or create a duplicate `DATABASE_URL` manually in Netlify. The same adapter chooses an HTTP-backed driver in functions and a Node Postgres driver in server mode.

This first migration creates only C21-owned records: the optional user table used by the application’s existing session layer and the data-minimized privacy/opt-out audit records. MLS listings, property photographs, and agent profiles remain live Anywhere MDM provider data and are not imported into this database.
