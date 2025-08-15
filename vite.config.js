import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    allowedHosts: [
      "1f71958c-da7e-4210-8768-e5a07ee2c6d0-00-1fqfglf4s1idy.picard.replit.dev",
    ],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
