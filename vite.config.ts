import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// BASE_PATH supports subpath hosting (GitHub Pages preview at /harmonia/).
// Default "/" keeps the Vercel/root build untouched.
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
