import { readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get all component packages dynamically from the packages directory
 */
export function getComponents() {
  const packagesDir = join(__dirname, "../packages");
  return readdirSync(packagesDir).filter((dir) => {
    const fullPath = join(packagesDir, dir);
    // Filter out non-directories
    return statSync(fullPath).isDirectory() && !dir.startsWith(".");
  });
}
