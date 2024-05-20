import express from "express";
import { createServer } from "vite";
import path from "node:path";
import compression from "compression";
import sirv from "sirv";
import apiRoute from "./routes/api";
import generateHtml from "./generateHtml";

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

  if (viteServer) {
    app.use(viteServer.middlewares);
  } else {
    app.use(compression());
    app.use(base, sirv(path.resolve(cwd, "./dist/client"), { extensions: [] }));
  }

  app.use("/api", apiRoute);

  // Serve HTML
  app.use("*", await generateHtml(viteServer));

  // Start http server
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
};

startApp();
