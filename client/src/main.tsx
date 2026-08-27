import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { startLogin } from "./const";
import "./index.css";

/**
 * Uploaded source asset URLs were scoped to its original project and no longer
 * resolve in this managed project. Preserve the original component references,
 * while substituting an equivalent available project asset only on image error.
 */
const uploadedAssetFallbacks: Record<string, string> = {
  "century21-citrus-realty-gold-logo_f3913815.png": "/manus-storage/c21-citrus-realty-gold-logo_c9c0b17e.png",
  "hero-luxury-home_04c4fbf5.jpg": "/manus-storage/c21-citrus-hero-estate_b43f73af.jpg",
  "hero-luxury-interior_f79432c6.jpg": "/manus-storage/c21-citrus-interior_dc2ded1c.jpg",
  "hero-neighborhood_4a38234b.jpg": "/manus-storage/c21-citrus-neighbourhood_881ec5cd.jpg",
};

document.addEventListener("error", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) return;
  const originalKey = Object.keys(uploadedAssetFallbacks).find((key) => target.src.includes(key));
  const fallback = originalKey ? uploadedAssetFallbacks[originalKey] : undefined;
  if (fallback && target.src !== fallback) {
    target.src = fallback;
  } else if (!fallback && target.src.includes("/manus-storage/")) {
    target.style.display = "none";
    target.setAttribute("aria-hidden", "true");
  }
}, true);

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  startLogin();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        // Preview auto-login fallback: when the browser blocks iframe cookies
        // (Safari ITP / private browsing / WebView), the runtime mirrors the
        // session into sessionStorage so we can forward it as a Bearer token.
        // The regular OAuth cookie flow keeps working and takes priority server-side.
        try {
          const raw = sessionStorage.getItem("manus-cookie");
          if (raw) {
            const prefix = `${COOKIE_NAME}=`;
            const pair = raw.split(";").find(s => s.trim().startsWith(prefix));
            const token = pair?.trim().slice(prefix.length);
            if (token) {
              return { Authorization: `Bearer ${token}` };
            }
          }
        } catch {
          // sessionStorage unavailable
        }
        return {};
      },
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
