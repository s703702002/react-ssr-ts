import * as esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

await esbuild.build({
  entryPoints: ["src/server/server.ts"],
  bundle: true,
  outfile: "dist/server.cjs",
  platform: "node",
  target: ["node20"],
  plugins: [nodeExternalsPlugin()],
});
