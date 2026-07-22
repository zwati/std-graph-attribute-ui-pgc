// server/scripts/syncTunnel.js — Instant Zero-Cache Cloudflare Tunnel Sync
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const LIVE_JSON = path.join(ROOT_DIR, 'live_tunnel.json');
const NTFY_ENDPOINT = 'https://ntfy.sh/pgc_sahiwal_tunnel_2026';

console.log('⚡ Launching Cloudflare Tunnel & Instant Zero-Cache Sync...');

const cf = spawn('npx', ['cloudflared', 'tunnel', '--url', 'http://localhost:5173'], {
  shell: true,
  cwd: ROOT_DIR,
});

let liveUrl = '';

async function publishLiveUrl(url) {
  try {
    const res = await fetch(NTFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: url,
    });
    if (res.ok) {
      console.log('🚀 Instant Redirect Pointer Synced Successfully to https://pgcswl-sgcms.vercel.app');
    }
  } catch (err) {
    console.error('⚠️ Sync error:', err.message);
  }
}

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

    // Publish to instant zero-cache sync endpoint
    publishLiveUrl(liveUrl);

    // Auto-open default browser exactly when tunnel is ready
    setTimeout(() => {
      require('child_process').exec('start "" "https://pgcswl-sgcms.vercel.app"');
    }, 1500);
  }
}

cf.stdout.on('data', checkText);
cf.stderr.on('data', checkText);

cf.on('close', code => {
  console.log(`Cloudflare Tunnel exited with code ${code}`);
});
