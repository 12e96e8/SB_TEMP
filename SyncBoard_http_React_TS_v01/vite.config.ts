import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Repository name must match if deployed at https://USER.github.io/REPO/
  base: "/SyncBoard_http_React_TS/",
  server: { port: 5173 },
});
