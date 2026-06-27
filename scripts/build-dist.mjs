import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

async function main() {
  const distDir = path.join(root, "dist");

  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  // Write a compact loading page with an inline SVG spinner
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>RetailX</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;padding:20px}
.spinner{width:48px;height:48px;border:4px solid #e2e8f0;border-top-color:#3b82f6;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
h1{font-size:24px;font-weight:600}
p{color:#64748b;font-size:14px;text-align:center;max-width:320px}
.hint{color:#94a3b8;font-size:12px;margin-top:8px}
</style>
<script>
async function start(){const t=Date.now();let phase="Starting server...";for(;;){try{const r=await fetch("http://localhost:3000/en/dashboard",{signal:AbortSignal.timeout(3000)});if(r.ok||r.status<500){location.href="http://localhost:3000/en/dashboard";return}}catch(e){if(e.name==="AbortError"&&Date.now()-t>8000)phase="Server is taking longer than usual — please wait..."}{const e=document.getElementById("status");if(e)e.textContent=\`\${phase} \${Math.floor((Date.now()-t)/1000)}s\`}await new Promise(r=>setTimeout(r,1000))}}start();
</script>
</head>
<body>
<div class="spinner"></div>
<h1>RetailX</h1>
<p id="status">Starting server...</p>
<p class="hint">First launch may take a moment while server files are prepared</p>
</body>
</html>`;

  await fs.writeFile(path.join(distDir, "index.html"), html);
  console.log("✅ dist/ built (loading page)");
}

main().catch(console.error);
