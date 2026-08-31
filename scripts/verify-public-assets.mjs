import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const forbiddenPatterns = [
  /files\.manuscdn\.com\/user_upload_by_module\/session_file/i,
];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".html"]);
const buildExtensions = new Set([".js", ".css", ".html"]);

async function filesUnder(directory, extensions, { skipTests = false } = {}) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(absolutePath, extensions, { skipTests });
    if (!entry.isFile() || !extensions.has(path.extname(entry.name))) return [];
    if (skipTests && /\.test\.[cm]?[jt]sx?$/.test(entry.name)) return [];
    return [absolutePath];
  }));
  return nested.flat();
}

async function findForbiddenReferences(directory, extensions, options) {
  const files = await filesUnder(directory, extensions, options);
  const matches = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) matches.push(`${path.relative(projectRoot, file)} matches ${pattern}`);
    }
  }
  return matches;
}

const activeSource = path.join(projectRoot, "client", "src");
const productionBuild = path.join(projectRoot, "dist", "public");

const sourceMatches = await findForbiddenReferences(activeSource, sourceExtensions, { skipTests: true });
const buildMatches = existsSync(productionBuild)
  ? await findForbiddenReferences(productionBuild, buildExtensions)
  : [];
const matches = [...sourceMatches, ...buildMatches];

if (matches.length > 0) {
  console.error("Temporary or retired C21 asset references are not allowed in a release:");
  matches.forEach((match) => console.error(`- ${match}`));
  process.exit(1);
}

console.log("Public asset guard passed: no temporary image-host references found in active source or production build.");
