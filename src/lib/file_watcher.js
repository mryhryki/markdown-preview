"use strict";

const fs = require("fs");
const path = require("path");
const { rootDir } = require("./directory");

class FileWatcher {
  constructor(logger) {
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

  onFileChanged(callback) {
    this._onFileChanged = callback;
  }

  addTargetFile(filepath) {
    if (this._target[filepath] != null) return;
    this.logger.debug("Add watch target:", filepath);
    this._target[filepath] = {
      lastModified: this.getFileLastModified(filepath),
    };
  }

  removeTargetFile(filepath) {
    if (this._target[filepath] == null) return;
    this.logger.debug("Remove watch target:", filepath);
    delete this._target[filepath];
  }

  getFileLastModified(filepath) {
    return fs.statSync(path.resolve(rootDir, filepath)).mtimeMs;
  }

  getFileInfo(filepath) {
    const absolutePath = path.resolve(rootDir, filepath);
    const markdown = fs.readFileSync(absolutePath, "utf-8");
    return { filepath, markdown };
  }
}

module.exports = FileWatcher;
