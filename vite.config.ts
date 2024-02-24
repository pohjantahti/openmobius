/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@extractor": path.resolve(__dirname, "./src/extractor"),
            "@lib": path.resolve(__dirname, "./src/lib"),
            "@utils": path.resolve(__dirname, "./src/utils"),
        },
    },
});
