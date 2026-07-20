import { createFileRoute } from "@tanstack/react-router";
import apkAsset from "@/assets/vmm/downloads/wiseassistant-beta.apk.asset.json";

// Serve labeled Android Beta download at
//   /downloads/WiseAssistant-Beta.v1.1.0.apk
// by redirecting to the CDN-hosted asset. Anything else under /downloads/
// returns 404.
export const Route = createFileRoute("/downloads/$")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const key = (params as { _splat?: string })._splat ?? "";
        if (key === "WiseAssistant-Beta.v1.1.0.apk") {
          return new Response(null, {
            status: 302,
            headers: {
              Location: apkAsset.url,
              "Cache-Control": "public, max-age=300",
            },
          });
        }
        return new Response("Not found", { status: 404 });
      },
    },
  },
});
