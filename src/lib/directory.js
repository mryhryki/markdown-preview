"use strict";

const path = require("path");

const rootDir = process.cwd();
const projectDir = path.resolve(__dirname, "..", "..");
const staticDir = path.resolve(projectDir, "static");
const templateDir = path.resolve(projectDir, "template");

const nodeModulesDir = path.join(projectDir, "node_modules");

const markedDir = path.join(nodeModulesDir, "marked");
const githubMarkdownDir = path.join(nodeModulesDir, "github-markdown-css");

module.exports = {
  rootDir,
  projectDir,
  staticDir,
  templateDir,
  markedDir,
  githubMarkdownDir,
};
