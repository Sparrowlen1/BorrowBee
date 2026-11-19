import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Backend proxy is OFF by default so `npm run dev` works without a backend.
// Turn it on when the API is running on :4000:
//   VITE_USE_BACKEND=true npm run dev
const USE_BACKEND = process.env.VITE_USE_BACKEND === "true";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    ...(USE_BACKEND && {
      proxy: {
        "/api": {
          target: "http://localhost:4000",
          changeOrigin: true,
        },
      },
    }),
  },
});