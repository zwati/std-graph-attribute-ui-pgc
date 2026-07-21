// server/server.js
require('dotenv').config();
const app       = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT ?? 5000;

connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT} (LAN: http://192.168.137.121:${PORT})`);
  });
});

