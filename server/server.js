// server/server.js
require('dotenv').config();
const os        = require('os');
const cluster   = require('cluster');
const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT ?? 5000;
const numCPUs = os.cpus().length;

// Enable Clustering in production or when MULTI_CORE=true
const enableCluster = process.env.MULTI_CORE === 'true' || process.env.NODE_ENV === 'production';

function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Filter out internal (127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push({ interface: name, address: net.address });
      }
    }
  }
  return addresses;
}

if (enableCluster && cluster.isPrimary) {
  console.log(`⚡ Primary cluster process ${process.pid} is running. Spawning ${numCPUs} worker processes…`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`⚠️ Worker process ${worker.process.pid} died. Forking replacement worker…`);
    cluster.fork();
  });
} else {
  connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      const activeIPs = getNetworkIPs();
      console.log(`\n🚀 PGC SGCMS Server active on port ${PORT} [PID: ${process.pid}]`);
      console.log(`📌 Listening on ALL network interfaces (0.0.0.0:${PORT})`);
      if (activeIPs.length > 0) {
        console.log(`🌐 Active Network Access URLs:`);
        activeIPs.forEach(ip => {
          console.log(`   - [${ip.interface}] http://${ip.address}:${PORT}`);
        });
      } else {
        console.log(`   - Local Access: http://localhost:${PORT}`);
      }
      console.log(`👉 Parents & Devices can connect using ANY assigned server IP above.\n`);
    });
  });
}


