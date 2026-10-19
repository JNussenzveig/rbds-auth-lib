import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    auth: "src/services/auth.ts",
    "password-reset": "src/services/password-reset.ts",
    "auth-pkce": "src/utils/auth-pkce.ts",
    jwt: "src/utils/jwt.ts",
  },
  format: ["cjs", "esm"],
  dts: false,
  clean: true,
  minify: true,
  external: ["react", "react-dom"],
  injectStyle: false,
});