import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  appendFileSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

export function previewId(branch) {
  // Keep ordinary branch names verbatim; escape path/URL characters uniquely.
  return branch.replace(
    /[^a-zA-Z0-9_-]/gu,
    (character) => `~${Buffer.from(character).toString("hex")}~`,
  );
}

const productionPaths = new Set([
  "assets",
  "search",
  "404.html",
  "index.html",
  "sitemap.xml",
  "sitemap.xml.gz",
  ...readdirSync(new URL("../docs/", import.meta.url)).map((name) =>
    name.endsWith(".md") ? name.slice(0, -3) : name,
  ),
]);

const manifestName = ".deployments.json";

function manifest(site) {
  const path = join(site, manifestName);
  return existsSync(path)
    ? JSON.parse(readFileSync(path, "utf8"))
    : { production: [], branches: [] };
}

function saveManifest(site, state) {
  writeFileSync(join(site, manifestName), JSON.stringify(state, null, 2) + "\n");
}

function deploymentDirectory(branch) {
  const directory = previewId(branch);
  if (
    !branch ||
    ["master", "gh-pages"].includes(branch) ||
    productionPaths.has(directory)
  ) {
    throw new Error(`Reserved deployment path: ${directory}`);
  }
  return directory;
}

export function deleteDeployment(site, branch, branches) {
  if (
    !branch ||
    branches.has(branch) ||
    ["master", "gh-pages"].includes(branch)
  )
    return;
  const state = manifest(site);
  if (!state.branches.includes(branch)) return;
  const directory = previewId(branch);
  rmSync(join(site, directory), { recursive: true, force: true });
  state.branches = state.branches.filter((name) => name !== branch);
  saveManifest(site, state);
}

// Artifacts are untrusted static files. Never let them replace Git metadata,
// another deployment, or introduce symlinks into the published tree.
function validateArtifact(directory, reserved = new Set()) {
  for (const name of readdirSync(directory)) {
    if (name.startsWith(".") || reserved.has(name)) {
      throw new Error(`Reserved artifact path: ${name}`);
    }
    const path = join(directory, name);
    const stat = lstatSync(path);
    if (stat.isDirectory()) validateArtifact(path);
    else if (!stat.isFile()) throw new Error(`Not a regular file: ${path}`);
  }
}

export function updateSite(site, artifact, branches, build) {
  if (
    !build ||
    build.branch === "gh-pages" ||
    branches.get(build.branch) !== build.sha
  ) {
    return null;
  }
  const relative =
    build.branch === "master" ? "" : deploymentDirectory(build.branch);
  const state = manifest(site);
  if (relative && state.production.includes(relative))
    throw new Error(`Reserved deployment path: ${relative}`);
  const branchDirectories = new Set(
    [...branches.keys()]
      .filter((branch) => !["master", "gh-pages"].includes(branch))
      .map(previewId)
      .filter((directory) => !productionPaths.has(directory)),
  );
  branchDirectories.add("develop");
  for (const branch of state.branches) branchDirectories.add(previewId(branch));
  validateArtifact(artifact, relative ? new Set() : branchDirectories);
  if (
    existsSync(join(artifact, "CNAME")) &&
    readFileSync(join(artifact, "CNAME"), "utf8").trim() !==
      readFileSync(new URL("../docs/CNAME", import.meta.url), "utf8").trim()
  )
    throw new Error("Artifact cannot change the site domain");
  if (!existsSync(join(artifact, "index.html")))
    throw new Error("Missing index.html");
  const destination = join(site, relative);
  if (relative) {
    if (existsSync(destination) && !state.branches.includes(build.branch)) {
      throw new Error(`Deployment path already in use: ${relative}`);
    }
    rmSync(destination, { recursive: true, force: true });
  }
  if (!relative) {
    for (const name of state.production) {
      if (!existsSync(join(artifact, name)))
        rmSync(join(site, name), { recursive: true, force: true });
    }
    state.production = readdirSync(artifact);
  } else if (!state.branches.includes(build.branch)) {
    state.branches.push(build.branch);
  }
  mkdirSync(destination, { recursive: true });
  for (const name of readdirSync(artifact)) {
    // Replace only this build's entries; other branch directories stay intact.
    rmSync(join(destination, name), { recursive: true, force: true });
    cpSync(join(artifact, name), join(destination, name), { recursive: true });
  }
  saveManifest(site, state);
  return `/${relative}${relative ? "/" : ""}`;
}

function publish() {
  const site = resolve(process.env.PAGES_SITE);
  const git = (...args) =>
    execFileSync("git", args, { cwd: site, encoding: "utf8" }).trim();
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  const run = event.workflow_run;
  const branches = new Map(
    git("ls-remote", "--heads", "origin")
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [sha, ref] = line.split("\t");
        return [ref.slice("refs/heads/".length), sha];
      }),
  );
  const deletedBranch =
    event.ref_type === "branch" ? event.ref : event.inputs?.deleted_branch;
  deleteDeployment(site, deletedBranch, branches);
  for (const branch of manifest(site).branches)
    deleteDeployment(site, branch, branches);
  const path = updateSite(
    site,
    resolve(process.env.PAGES_ARTIFACT),
    branches,
    run
      ? {
          branch: run.head_branch,
          sha: run.head_sha,
        }
      : null,
  );
  writeFileSync(join(site, ".nojekyll"), "");
  git("config", "user.name", "github-actions[bot]");
  git(
    "config",
    "user.email",
    "41898282+github-actions[bot]@users.noreply.github.com",
  );
  git("add", "--all");
  if (git("status", "--porcelain")) {
    git("commit", "-m", "pages: update branch deployments");
    git("push", "origin", "HEAD:gh-pages");
  }
  if (path && process.env.GITHUB_STEP_SUMMARY) {
    const domain = readFileSync(join(site, "CNAME"), "utf8").trim();
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `Published build path: https://${domain}${path}\n`,
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  if (process.argv[2] === "base") {
    const branch = process.env.GITHUB_REF_NAME;
    const path = branch === "master" ? "" : `${deploymentDirectory(branch)}/`;
    const domain = readFileSync(new URL("../docs/CNAME", import.meta.url), "utf8").trim();
    console.log(`PAGES_SITE_URL=https://${domain}/${path}`);
    console.log(`PAGES_EDIT_URI=https://github.com/BossHobby/Docs/tree/${encodeURIComponent(branch)}/docs`);
  } else if (process.argv[2] === "publish") {
    publish();
  } else {
    throw new Error("Usage: pages.mjs base|publish");
  }
}
