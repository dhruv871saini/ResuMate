import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/dist/core-web-vitals.js";
import nextTs from "eslint-config-next/dist/typescript.js";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);