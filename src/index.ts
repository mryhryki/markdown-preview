"use strict";

import express from "express";
import expressWs from "express-ws";
import serveIndex from "serve-index";
import opener from "opener";
import { getLogger } from "./lib/logger";
import { getVersion, showUsage, showVersion } from "./lib/show";
import { MarkdownHandler } from "./markdown";
import { WebSocketHandler } from "./websocket";
import { rootDir, staticDir } from "./lib/directory";
import { Params } from "./lib/params";

try {
  const params = new Params(process.env, process.argv.slice(2));
  if (params.help) showUsage();
  if (params.version) showVersion();

  const logger = getLogger(params.logLevel);
  const previewUrl = `http://localhost:${params.port}`;

  console.log("Version:        ", getVersion());
  console.log("Root Directory :", rootDir);
  console.log("Default File   :", params.filepath);
  console.log("Extensions     :", params.extensions.join(", "));
  console.log("Template File  :", params.template);
  console.log(`Preview URL    : ${previewUrl}`);

  const app = express();
  expressWs(app);

  app.get("/", (_req, res) => res.redirect(params.filepath));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.ws("/ws", WebSocketHandler(logger));
  params.extensions.forEach((ext) => {
    app.get(new RegExp(`^/.+\.${ext}$`), MarkdownHandler(params.template));
  });
  app.use(express.static(rootDir, { index: false }));
  app.use(express.static(staticDir, { index: false }));
  app.use(serveIndex(rootDir, { icons: true, view: "details" }));
  app.listen(params.port);

  if (!params.noOpener) {
    opener(previewUrl);
  }
} catch (err) {
  console.error(err);
  showUsage(true);
}
