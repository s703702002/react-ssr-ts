import express from "express";
import { createServer } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import compression from "compression";
import sirv from "sirv";
import apiRoute from "./routes/api";

const port = process.env.PORT || 5173;
const isProduction = process.env.NODE_ENV === "production";
const base = process.env.BASE || "/";
const cwd = process.cwd();
const app = express();

const startApp = async () => {
  const viteServer = isProduction
    ? null
    : await createServer({
        server: { middlewareMode: true },
        appType: "custom",
        base,
      });

  // Cached production assets
  const templateHtml = isProduction
    ? await fs.readFile(path.resolve(cwd, "./dist/client/index.html"), "utf-8")
    : "";

  const ssrManifest = isProduction
    ? await fs.readFile(
        path.resolve("./dist/client/.vite/ssr-manifest.json"),
        "utf-8",
      )
    : undefined;

  if (isProduction) {
    app.use(compression());
    app.use(base, sirv(path.resolve(cwd, "./dist/client"), { extensions: [] }));
  } else {
    app.use(viteServer!.middlewares);
  }

  app.use("/api", apiRoute);

  // Serve HTML
  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");

      let template;
      let render;

      if (isProduction) {
        template = templateHtml;
        render = (await import(path.resolve(cwd, "./dist/entry-server.cjs")))
          .render;
      } else {
        template = await viteServer!.transformIndexHtml(
          url,
          await fs.readFile(path.resolve(cwd, "./index.html"), "utf-8"),
        );
        render = (await viteServer!.ssrLoadModule("/src/entry-server.tsx"))
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
  });

  // Start http server
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

startApp();
