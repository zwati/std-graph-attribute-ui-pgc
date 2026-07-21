# Walkthrough & Deployment Guide - PGC SGCMS PWA

We have successfully implemented Progressive Web App (PWA) capabilities and dynamic 24/7 server endpoint configuration into the **PGC SGCMS** codebase.

---

## Key Changes Made

### 📱 Frontend PWA (`PGC-SGCMS`)
- **[Web App Manifest](file:///d:/Business/PGC/PGC-SGCMS/public/manifest.webmanifest)**: Added PWA metadata, theme color (`#0D1B4B`), display mode (`standalone`), and app shortcuts.
- **[Service Worker (`sw.js`)](file:///d:/Business/PGC/PGC-SGCMS/public/sw.js)**: Pre-caches app shell assets for instant load and handles network-first API requests.
- **[App Icons](file:///d:/Business/PGC/PGC-SGCMS/public)**: Configured 192x192, 512x512, and maskable icons.
- **[index.html & main.jsx](file:///d:/Business/PGC/PGC-SGCMS/src/main.jsx)**: Linked PWA manifest, viewport tags, and automatic service worker registration.
- **[Dynamic Server Config in AuthContext & Login Page](file:///d:/Business/PGC/PGC-SGCMS/src/pages/Login/Login.jsx)**: Added a **⚙ Server Host** button on the Login page allowing users/devices to connect to any server IP (e.g. `http://192.168.1.100:5000/api`).
- **PWA Install Banner**: Automatically prompts users on Desktop/Mobile to install the app.

### ⚙ Backend (`server`)
- **[CORS Configuration (`app.js`)](file:///d:/Business/PGC/server/app.js)**: Configured backend CORS to allow incoming connections from LAN IPs and client devices.

---

## 🛠 Developer Guide: Commands to Run Dev & Production Build

### Running Development Mode
```powershell
# 1. Backend Server
cd D:\Business\PGC\server
npm run dev

# 2. Frontend App
cd D:\Business\PGC\PGC-SGCMS
npm run dev
```

### Production Build (Frontend)
```powershell
cd D:\Business\PGC\PGC-SGCMS
npm run build
```
This generates the optimized static bundle in `PGC-SGCMS/dist/`.

---

## 🖥 How to Declare & Configure ANY Computer as the 24/7 Central Server

Follow these steps when setting up your laptop **now**, or when transferring the system to a **client computer** later:

### Step 1: Install Prerequisites on Server Machine
1. Install **Node.js** (v18 or higher).
2. Install **MongoDB Community Edition**.

### Step 2: Set Up MongoDB Database Service
Create directory `C:\data\db` and run MongoDB as a background service:
```powershell
mongod --dbpath C:\data\db
```

### Step 3: Find the Server Computer's Local IP Address
Open PowerShell on the server computer:
```powershell
ipconfig
```
Look for **IPv4 Address** (e.g., `192.168.1.100` or `10.0.0.15`).

### Step 4: Configure Windows Firewall (Allow Port 5000 & 5173)
Allow inbound connections to the server port so client mobile/desktop devices can connect:
```powershell
netsh advfirewall firewall add rule name="PGC Server API" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="PGC Frontend Web" dir=in action=allow protocol=TCP localport=5173
```

### Step 5: Keep Backend Running 24/7 (Using PM2 Process Manager)
Install PM2 globally so the server runs automatically in the background and restarts on system reboot:
```powershell
npm install -g pm2
cd D:\Business\PGC\server
pm2 start server.js --name "pgc-server"
pm2 save
```

---

## 📲 How to Use as Desktop & Mobile Applications

### 💻 Desktop Application (Windows / Mac)
1. Open Google Chrome or Microsoft Edge and navigate to `http://<SERVER_IP>:5173`.
2. Click the **Install Icon** in the address bar OR click **"📲 Install App on Desktop/Mobile"** on the Login screen.
3. The application will install as a **standalone desktop app** with its own window, taskbar icon, and desktop shortcut.

### 📱 Mobile Application (Android / iOS)
1. Connect mobile phone to the same Wi-Fi network as the server.
2. Open Chrome (Android) or Safari (iOS) and visit `http://<SERVER_IP>:5173`.
3. Tap **"⚙ Server Host"** on login screen if needed to confirm the server IP.
4. Tap **"Add to Home Screen"** or **"Install App"**.

---

## 📦 How to Package for Google Play Store (TWA / Bubblewrap)

To create an `.apk` or `.aab` bundle to publish on the **Google Play Store**:

1. Install **Bubblewrap CLI**:
   ```powershell
   npm install -g @bubblewrap/cli
   ```
2. Initialize Android Project from your PWA Manifest:
   ```powershell
   bubblewrap init --manifest=http://<YOUR_DOMAIN_OR_SERVER_IP>:5173/manifest.webmanifest
   ```
3. Build `.apk` and `.aab` for Google Play Store:
   ```powershell
   bubblewrap build
   ```
4. Upload the generated `app-release-signed.apk` / `app-release-bundle.aab` directly to your **Google Play Console** account!
