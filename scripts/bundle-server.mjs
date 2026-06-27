import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const resourcesDir = path.join(root, "src-tauri", "resources");
const standaloneDir = path.join(root, ".next", "standalone");
const destDir = path.join(resourcesDir, "server");

async function main() {
  await fs.mkdir(resourcesDir, { recursive: true });

  // Remove old
  await fs.rm(destDir, { recursive: true, force: true }).catch(() => {});

  console.log("Copying standalone server to resources (may take a moment)...");
  // robocopy handles symlinks/junctions properly on Windows
  const cmd = `robocopy "${standaloneDir}" "${destDir}" /E /COPY:DAT /R:2 /W:2 /NJH /NJS /NP /NDL`;
  try {
    execSync(cmd, { stdio: "pipe", timeout: 180000, windowsHide: true });
  } catch (e) {
    // robocopy returns non-zero even on success (1 = copied, 2 = extra files)
    // Values > 7 are actual errors
    const exitCode = e.status;
    if (exitCode !== null && exitCode > 7) {
      throw e;
    }
  }

  // Copy public/ into server/.next/ so static files are served
  const publicDir = path.join(root, "public");
  const nextPublic = path.join(destDir, ".next", "public");
  try {
    const cmd2 = `robocopy "${publicDir}" "${nextPublic}" /E /COPY:DAT /R:2 /W:2 /NJH /NJS /NP /NDL`;
    execSync(cmd2, { stdio: "pipe", timeout: 30000, windowsHide: true });
  } catch {
    // public dir may be empty or not exist
  }

  // Remove empty directories (Tauri v2.11.x bug: empty dirs break resource bundling)
  await removeEmptyDirs(destDir);

  // Create server.tar.gz for fast Rust extraction on first launch
  const tarGzPath = path.join(resourcesDir, "server.tar.gz");
  console.log("Creating server.tar.gz...");
  try {
    const tarCmd = `tar -czf "${tarGzPath}" -C "${resourcesDir}" server`;
    execSync(tarCmd, { stdio: "pipe", timeout: 180000, windowsHide: true });
    const tarStat = await fs.stat(tarGzPath);
    console.log(`✅ server.tar.gz created (${(tarStat.size / 1024 / 1024).toFixed(1)} MB)`);
    // Remove loose files — tar.gz is the primary resource for installation
    console.log("Removing loose server/ directory...");
    await fs.rm(destDir, { recursive: true, force: true });
  } catch (e) {
    // tar might not be available on older Windows — fall back to loose files
    console.log("⚠️  tar.exe not available, falling back to loose files");
    const size = await getDirSize(destDir);
    console.log(`✅ server/ copied (${(size / 1024 / 1024).toFixed(1)} MB)`);
  }
}

async function removeEmptyDirs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const full = path.join(dir, entry.name);
        await removeEmptyDirs(full);
      }
    }
    // Re-read after cleaning children
    const remaining = await fs.readdir(dir, { withFileTypes: true });
    if (remaining.length === 0) {
      await fs.rmdir(dir);
    }
  } catch {}
}

async function getDirSize(dir) {
  let total = 0;
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        total += await getDirSize(full);
      } else if (entry.isSymbolicLink()) {
        // skip links (they're handled by robocopy)
      } else {
        try {
          total += (await fs.stat(full)).size;
        } catch {}
      }
    }
  } catch {}
  return total;
}

main().catch(console.error);
