import { defineConfig } from "tsup";

export default defineConfig({
  format: ["cjs", "esm"],
  entry: ["src/index.ts", "src/react-wrapper.tsx"],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  clean: true,
});
