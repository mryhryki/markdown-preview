import fs from "node:fs";
import path from "node:path";
import { rootDir } from "./directory";
import type { Logger } from "./logger";

interface FileInfo {
  lastModified: number;
}

export interface FileChangedEvent {
  filepath: string;
  markdown: string;
}

export class FileWatcher {
  private logger: Logger;
  private readonly _target: Record</* filepath: */ string, FileInfo>;
  private _onFileChanged?: (event: FileChangedEvent) => void;

  constructor(logger: Logger) {
    this.logger = logger;
    this._target = {};

    let lastErrorMessage: string = "-";
    setInterval(() => {
      for (const filepath in this._target) {
        try {
          const fileinfo = this._target[filepath];
          const currentLastModified = this.getFileLastModified(filepath);
          if (fileinfo.lastModified !== currentLastModified) {
            this.logger.info("File update:", path.resolve(rootDir, filepath));
            fileinfo.lastModified = currentLastModified;
            if (this._onFileChanged != null) {
              this._onFileChanged(this.getFileInfo(filepath));
            }
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          if (errorMessage === lastErrorMessage) continue;
          lastErrorMessage = errorMessage;
          console.error(errorMessage);
        }
      }
    }, 250 /* check 4 times per second */);
  }

  onFileChanged(callback: (event: FileChangedEvent) => void): void {
    this._onFileChanged = callback;
  }

  addTargetFile(filepath: string): void {
    const absolutePath = path.resolve(rootDir, filepath);
    if (!absolutePath.startsWith(rootDir)) {
      this.logger.error("Invalid file path:", filepath);
      return;
    }
    if (this._target[filepath] != null) return;
    this.logger.debug("Add watch target:", filepath);
    this._target[filepath] = {
      lastModified: this.getFileLastModified(filepath),
    };
  }

  removeTargetFile(filepath: string): void {
    if (this._target[filepath] == null) return;
    this.logger.debug("Remove watch target:", filepath);
    delete this._target[filepath];
  }

  getFileLastModified(filepath: string): number {
    const targetFilePath = path.resolve(rootDir, filepath);
    if (!targetFilePath.startsWith(rootDir)) {
      throw new Error(`Invalid file path: ${filepath}`);
    }
    return fs.statSync(targetFilePath).mtimeMs;
  }

  getFileInfo(filepath: string): FileChangedEvent {
    const absolutePath = path.resolve(rootDir, filepath);
    if (!absolutePath.startsWith(rootDir)) {
      throw new Error(`Invalid file path: ${filepath}`);
    }
    const markdown = fs.readFileSync(absolutePath, "utf-8");
    return { filepath, markdown };
  }
}
