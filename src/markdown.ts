import fs from "node:fs/promises";
import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import { rootDir } from "./lib/directory";
import { existsFile } from "./lib/file";

export function MarkdownHandler(template: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const filepath = path.resolve(
      rootDir,
      decodeURIComponent(req.path.substring(1)),
    );
    if (!filepath.startsWith(rootDir)) {
      res.status(403).end();
      return;
    }
    if (existsFile(filepath)) {
      const templateContent = await fs.readFile(template, "utf-8");
      res.status(200).send(templateContent);
    } else {
      next();
    }
  };
}
