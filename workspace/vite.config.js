import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    allowedHosts: [
      "ddc62ebe-280d-41ef-8677-9b95dadb52f4-00-2qa041l1jexey.janeway.replit.dev",
    ],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
