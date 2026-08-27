import "dotenv/config";
import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { registerStorageProxy } from "./_core/storageProxy";
import { createContext } from "./_core/context";
import { appRouter } from "./routers";
import { registerContactRoute } from "./contactRoute";
import { registerMdmRoutes } from "./mdmRoute";
import { registerPrivacyRequestRoute } from "./privacyRequestRoute";
import { realSatisfiedRouter } from "./realSatisfiedRoute";
import { registerGooglePlacesRoutes } from "./googlePlacesRoute";

/**
 * Registers the public API paths in a listener-free Express app so the same
 * source services can run through a Netlify Function instead of `listen()`.
 */
export function createC21NetlifyApi(): Express {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  registerContactRoute(app);
  registerMdmRoutes(app);
  registerPrivacyRequestRoute(app);
  registerGooglePlacesRoutes(app);
  app.use("/api/realsatisfied", realSatisfiedRouter);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}
