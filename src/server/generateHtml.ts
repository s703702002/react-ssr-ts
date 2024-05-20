import fs from "node:fs/promises";
import path from "node:path";
import type { ViteDevServer } from "vite";
import type { Request, Response } from "express";

const base = process.env.BASE || "/";
const isProduction = process.env.NODE_ENV === "production";
const cwd = process.cwd();

const generateHtml = async (viteServer: ViteDevServer | null) => {
  // Cached production assets
  const templateHtml = isProduction
    ? await fs.readFile(path.resolve(cwd, "./dist/client/index.html"), "utf-8")
    : "";

  const ssrManifest = isProduction
    ? await fs.readFile(
        path.resolve(cwd, "./dist/client/.vite/ssr-manifest.json"),
        "utf-8",
      )
    : undefined;

  return async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl.replace(base, "");

      let template;
      let render;

      if (viteServer) {
        template = await viteServer.transformIndexHtml(
          url,
          await fs.readFile(path.resolve(cwd, "./index.html"), "utf-8"), // always read fresh html
        );
        render = (
          await viteServer.ssrLoadModule(
            path.resolve(cwd, "./src/entry-server.tsx"),
          )
        ).render;
      } else {
        template = templateHtml;
        render = (await import(path.resolve(cwd, "./dist/entry-server.js")))
          .render;
      }

      const rendered = await render(url, ssrManifest);

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? "")
        .replace(`<!--app-html-->`, rendered.html ?? "");

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e) {
      if (e instanceof Error) {
        viteServer?.ssrFixStacktrace(e);
        res.status(500).end(e.stack);
      }
    }
  };
};

export default generateHtml;
