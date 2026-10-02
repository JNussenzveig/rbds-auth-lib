import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/auth.ts", "src/auth-pkce.ts", "src/jwt.ts"],
  format: ["cjs", "esm"],
  dts: false,
  clean: true,
  minify: true,
  external: ["react", "react-dom"],
  injectStyle: false,
});