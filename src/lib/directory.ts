import path from "node:path";

export const rootDir = process.cwd();
export const projectDir = path.resolve(__dirname, "..", "..");
export const staticDir = path.resolve(projectDir, "static");
export const templateDir = path.resolve(projectDir, "template");
