import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import { startLogin } from "./const";
import { portableAssetFor, replacePortableAssetPath } from "./lib/portableAssets";
import "./index.css";

/**
 * Uploaded source asset URLs were scoped to its original project. Replace only
 * the known branding and editorial paths with public CDN copies so Netlify can
 * render them independently of the original project storage proxy.
 */
function replacePortableAssetOnElement(element: Element): void {
  if (element instanceof HTMLImageElement) {
    const replacement = portableAssetFor(element.src);
    if (replacement && element.src !== replacement) element.src = replacement;
  }

  if (element instanceof HTMLElement) {
    const style = element.getAttribute("style");
    if (style?.includes("/manus-storage/")) {
      const replacement = replacePortableAssetPath(style);
      if (replacement !== style) element.setAttribute("style", replacement);
    }
  }
}

function replacePortableAssetsIn(node: Node): void {
  if (!(node instanceof Element)) return;
  replacePortableAssetOnElement(node);
  node.querySelectorAll("img, [style*='/manus-storage/']").forEach(replacePortableAssetOnElement);
}

const portableAssetObserver = new MutationObserver((records) => {
  records.forEach((record) => {
    if (record.type === "attributes" && record.target instanceof Element) replacePortableAssetOnElement(record.target);
    record.addedNodes.forEach(replacePortableAssetsIn);
  });
});

portableAssetObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "style"] });

document.addEventListener("error", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLImageElement)) return;
  const fallback = portableAssetFor(target.src);
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
