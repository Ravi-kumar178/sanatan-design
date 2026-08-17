import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

/**
 * Pulls the framework/UI libraries that every route needs into one long-lived
 * `vendor` chunk. Everything else is left to Rollup's natural code splitting so
 * route-only dependencies (jsPDF, JSZip, html2canvas…) stay in the lazy chunk of
 * the page that imports them — deliberately NOT grouped, since a shared chunk
 * would make the heaviest libraries load for routes that never use them.
 */
const VENDOR_CORE =
  /[\\/]node_modules[\\/](react|react-dom|scheduler|wouter|@radix-ui|lucide-react|clsx|tailwind-merge|class-variance-authority)[\\/]/;

function manualChunks(id: string): string | undefined {
  return VENDOR_CORE.test(id) ? "vendor" : undefined;
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      jsxLocPlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        output: { manualChunks },
      },
    },
    server: {
      port: 3000,
      strictPort: false, // Will find next available port if 3000 is busy
      host: true,
      historyApiFallback: true,
      allowedHosts: [
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
