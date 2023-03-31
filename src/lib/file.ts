import fs from "fs";

export function existsFile(filepath: string): boolean {
  try {
    fs.statSync(filepath);
    return true;
  } catch (_) {
    return false;
  }
}
