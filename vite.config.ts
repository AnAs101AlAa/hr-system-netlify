import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://test-prod.runasp.net",
        changeOrigin: true,
        secure: true, // because target is https
        // IMPORTANT: do NOT rewrite /api -> "" because your backend expects /api/...
        // rewrite: (p) => p.replace(/^\/api/, ""), // <-- leave this OUT
        configure: (proxy) => {
          // optional: log what is actually proxied
          proxy.on("proxyReq", (_proxyReq, req) => {
            console.log("[proxy] =>", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("[proxy] <=", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
