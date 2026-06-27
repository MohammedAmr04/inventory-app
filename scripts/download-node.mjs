import fs from "fs";
import { promises as fsp } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const resourcesDir = path.join(root, "src-tauri", "resources");
const nodeExe = path.join(resourcesDir, "node.exe");

async function main() {
  fs.mkdirSync(resourcesDir, { recursive: true });

  // Check if already downloaded
  try {
    await fsp.access(nodeExe);
    const stat = await fsp.stat(nodeExe);
    if (stat.size > 10 * 1024 * 1024) {
      // > 10MB means it's a proper Node.js executable (not a stub)
      console.log("✅ node.exe already exists (skipping download)");
      return;
    }
  } catch {
    // doesn't exist, proceed
  }

  // Determine latest Node.js LTS version
  console.log("Fetching latest Node.js LTS version...");
  const version = await getLatestLtsVersion();
  const url = `https://nodejs.org/dist/${version}/win-x64/node.exe`;

  console.log(`Downloading ${url}...`);
  await downloadFile(url, nodeExe);

  const size = (await fsp.stat(nodeExe)).size;
  console.log(`✅ node.exe downloaded (${(size / 1024 / 1024).toFixed(1)} MB)`);
}

function getLatestLtsVersion() {
  return new Promise((resolve, reject) => {
    https
      .get("https://nodejs.org/dist/index.json", { timeout: 15000 }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const releases = JSON.parse(data);
            const lts = releases.find((r) => r.lts);
            resolve(lts ? lts.version : "v22.14.0");
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { timeout: 120000 }, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          file.close();
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close();
        reject(err);
      });
  });
}

main().catch((err) => {
  console.error("Failed to download Node.js:", err.message);
  console.log("Continuing without bundled node.exe (will use system Node.js)");
});
