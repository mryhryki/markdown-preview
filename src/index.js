"use strict";

const express = require("express");
const expressWs = require("express-ws");
const serveIndex = require("serve-index");
const opener = require("opener");
const getLogger = require("./lib/logger");
const { showUsage, showVersion } = require("./lib/show");
const MarkdownHandler = require("./markdown");
const WebSocketHandler = require("./websocket");
const { rootDir, staticDir } = require("./lib/directory");
const Params = require("./lib/params");

try {
  const params = new Params(process.env, process.argv.slice(2));
  if (params.help) showUsage();
  if (params.version) showVersion();

  const logger = getLogger(params.logLevel);
  const previewUrl = `http://localhost:${params.port}`;

  console.log("Root Directory :", rootDir);
  console.log("Default File   :", params.filepath);
  console.log("Extensions     :", params.extensions.join(", "));
  console.log("Template File  :", params.template);
  console.log(`Preview URL    : ${previewUrl}`);

  const app = express();
  expressWs(app);
  app.get("/", (_req, res) => res.redirect(params.filepath));
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
  console.error(err.message);
  showUsage(true);
}
