// server/scripts/syncTunnel.js
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const LIVE_JSON = path.join(ROOT_DIR, 'live_tunnel.json');

console.log('⚡ Launching Cloudflare Tunnel & Automatic Pointer Sync...');

const cf = spawn('npx', ['cloudflared', 'tunnel', '--url', 'http://localhost:5173'], {
  shell: true,
  cwd: ROOT_DIR,
});

let liveUrl = '';

function checkText(data) {
  const str = data.toString();
  process.stdout.write(str);

  const match = str.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match && !liveUrl) {
    liveUrl = match[0];
    console.log('\n==================================================');
    console.log('✅ LIVE CLOUDFLARE TUNNEL DETECTED:');
    console.log('👉 ' + liveUrl);
    console.log('==================================================\n');

    // Save live tunnel URL locally
    const payload = { url: liveUrl, updatedAt: new Date().toISOString() };
    fs.writeFileSync(LIVE_JSON, JSON.stringify(payload, null, 2));

    // Auto push live_tunnel.json so permanent Vercel redirector points to the new link
    try {
      execSync('git add live_tunnel.json && git commit -m "Update live tunnel URL" && git push origin main', {
        cwd: ROOT_DIR,
        stdio: 'pipe'
      });
      console.log('🚀 Permanent Redirect Pointer Updated Successfully!');
    } catch (e) {
      console.log('ℹ️ Pointer saved locally.');
    }
  }
}

cf.stdout.on('data', checkText);
cf.stderr.on('data', checkText);

cf.on('close', code => {
  console.log(`Cloudflare Tunnel exited with code ${code}`);
});
