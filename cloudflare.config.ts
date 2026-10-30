import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersCacheConfig } from "@vinext/cloudflare/cache/config";

const cache = await createWorkersCacheConfig();

const workerName = process.env.CLOUDFLARE_WORKER_NAME ?? "webdevblog";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "https://webdevblog.jsquaredadventures.com";

/**
 * Runtime configuration.
 *
 * Everything the app reads from `process.env` at runtime is uploaded as a
 * Worker **secret** by `scripts/deploy-cloudflare.mjs` *after* the code deploy
 * (`cf deploy` rewrites the binding list). Only non-secret values live here.
 */
export default defineConfig({
  worker: defineWorker({
    ...cache,
    name: workerName,
    entrypoint: "./worker-entry.ts",
    compatibilityDate: "2026-10-30",
    compatibilityFlags: ["nodejs_compat", "nodejs_compat_populate_process_env"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ...cache.env,
      ASSETS: bindings.assets(),
      NEXT_PUBLIC_APP_URL: bindings.text(siteUrl),
    },
  }),
});
