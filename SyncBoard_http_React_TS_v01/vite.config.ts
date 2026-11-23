import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Deployed below the SB_TEMP GitHub Pages project site.
  base: "/SB_TEMP/SyncBoard_http_React_TS_v01/",
  server: { port: 5173 },
});
