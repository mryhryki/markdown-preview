import fs from "node:fs";

export function existsFile(filepath: string): boolean {
  try {
    fs.statSync(filepath);
    return true;
  } catch (_) {
    return false;
  }
}
