// Assemble dist/ — exactly what gets served from Cloudflare.
//
// That is index.json plus each method/routine *folder* (the per-folder READMEs
// are files, so they're skipped). Repo chrome — .git, .github, scripts, the
// top-level README/CODEOWNERS — never reaches the CDN. Run after build-index.mjs.

import {
  cpSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const DIST = join(ROOT, "dist");

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

copyFileSync(join(ROOT, "index.json"), join(DIST, "index.json"));

let folders = 0;
for (const kind of ["methods", "routines"]) {
  const src = join(ROOT, kind);
  if (!existsSync(src)) continue;
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue; // skip the folder README.md
    cpSync(join(src, entry.name), join(DIST, kind, entry.name), {
      recursive: true,
    });
    folders += 1;
  }
}

console.log(`dist/ ready: index.json + ${folders} item folder(s)`);
