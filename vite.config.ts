import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  define: {
    "process.env.STRIPE_PUBLIC_KEY": JSON.stringify(
      "pk_live_51IZk6CLWcouNeT9dEsKDBTHFbAkgA0Rw2tgDPtQGoSh3o9O4iIau65jUfwScLfle9ZsFctQ46j51wrRMN3dK0HlX009Sq9G9oR"
    ),
  },
  server: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  },
});
