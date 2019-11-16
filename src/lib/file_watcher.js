'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('./logger');
const { currentDir } = require('./directory');

class FileWatcher {
  constructor() {
    this._target = {};
    setInterval(() => {
      Object.keys(this._target).forEach((filepath) => {
        const fileinfo = this._target[filepath];
        const currentLastModified = this.getFileLastModified(filepath);
        if (fileinfo.lastModified !== currentLastModified) {
          Logger.info('File update:', path.resolve(currentDir, filepath));
          fileinfo.lastModified = currentLastModified;
          if (this._onFileChanged != null) {
            this._onFileChanged(this.getFileInfo(filepath));
          }
        }
      });
    }, 250);
  }

  onFileChanged(callback) {
    this._onFileChanged = callback;
  }

  addTargetFile(filepath) {
    if (this._target[filepath] != null) return;
    Logger.debug('Add watch target:', filepath);
    this._target[filepath] = {
      lastModified: this.getFileLastModified(filepath),
    };
  }

  removeTargetFile(filepath) {
    if (this._target[filepath] == null) return;
    Logger.debug('Remove watch target:', filepath);
    delete this._target[filepath];
  }

  getFileLastModified(filepath) {
    return fs.statSync(path.resolve(currentDir, filepath)).mtimeMs;
  }

  getFileInfo(filepath) {
    const absolutePath = path.resolve(currentDir, filepath);
    const markdown = fs.readFileSync(absolutePath, 'utf-8');
    return { filepath, markdown };
  }
}

module.exports = new FileWatcher();
