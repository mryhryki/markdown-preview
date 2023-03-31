import fs from "fs";
import path from "path";
import { rootDir } from "./directory";
import { Logger } from "./logger";

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
    setInterval(() => {
      Object.keys(this._target).forEach((filepath) => {
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
          console.error(err);
        }
      });
    }, 250 /* check 4 times per second */);
  }

  onFileChanged(callback: (event: FileChangedEvent) => void): void {
    this._onFileChanged = callback;
  }

  addTargetFile(filepath: string): void {
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
    return fs.statSync(path.resolve(rootDir, filepath)).mtimeMs;
  }

  getFileInfo(filepath: string): FileChangedEvent {
    const absolutePath = path.resolve(rootDir, filepath);
    const markdown = fs.readFileSync(absolutePath, "utf-8");
    return { filepath, markdown };
  }
}
