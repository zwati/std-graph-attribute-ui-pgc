// server/app.js
// Express application — middleware chain + route mounting

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes    = require('./routes/authRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const parentRoutes  = require('./routes/parentRoutes');
const reportRoutes  = require('./routes/reportRoutes');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads (dev only)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/admin',   adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent',  parentRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
