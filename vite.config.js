import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    strictPort: false,
  },
});
