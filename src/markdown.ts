import { NextFunction, Request, Response } from "express";
import path from "path";
import { rootDir } from "./lib/directory";
import { existsFile } from "./lib/file";

export function MarkdownHandler(template: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const filepath = path.resolve(rootDir, decodeURIComponent(req.path.substr(1)));
    if (existsFile(filepath)) {
      res.sendFile(template);
    } else {
      next();
    }
  };
}
