import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
  },
  plugins: [vue()],
});
