# 🎓 PGC SGCMS - Campus Deployment & Setup Guide
### Target Deployment Date: 2nd August 2026 | Sahiwal Campus (Pakpattan Road)

This guide provides step-by-step instructions for deploying and running the **Punjab Group of Colleges Student Growth & Character Management System (SGCMS)** on the permanent campus server computer. Follow this checklist to ensure a successful "plug-and-play" deployment.

---

## 🖥️ 1. Hardware & System Requirements (Server PC)

To ensure smooth 24/7 background operation for all services (MongoDB, Express API, Vite Preview, and Cloudflare Tunnel), the server computer must meet the following minimum specifications:

| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Operating System** | Windows 10 (64-bit) | Windows 11 (64-bit) |
| **Processor (CPU)** | Intel Core i3 / AMD Ryzen 3 (Dual-Core) | Intel Core i5 / AMD Ryzen 5 (Quad-Core) |
| **Memory (RAM)** | 8 GB DDR4 | 16 GB DDR4/DDR5 |
| **Storage (SSD)** | 120 GB SSD (with 10 GB free) | 256 GB NVMe SSD (with 20 GB free) |
| **Network** | Active Wi-Fi / Ethernet Connection | Active Broadband / LAN (High stability) |

---

## 🛠️ 2. One-Time Prerequisites Installation

Before running the application for the first time on the server PC, install and configure these required programs:

### A. Install Node.js (Runtime Environment)
1. Download **Node.js LTS** (v18 or higher) from [nodejs.org](https://nodejs.org/).
2. Run the installer and proceed with the default settings (ensure the "Add to PATH" option is checked).
3. Verify the installation by opening **Command Prompt** (cmd) and running:
   ```cmd
   node -v
   npm -v
   ```

### B. Install & Configure MongoDB Database
1. Download **MongoDB Community Server** (.msi) from the [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Start the installation, select **"Complete"** setup type, and make sure **"Install MongoDB as a Service"** is selected.
3. Install **MongoDB Compass** (graphical interface) if prompted (useful for database checks).
4. **CRITICAL STEP (Database Directory)**:
   Open Command Prompt (as Administrator) and create the default directory where MongoDB stores data:
   ```cmd
   mkdir C:\data\db
   ```

---

## 🚀 3. Running the Server (One-Click Startup)

The system is configured as a fully automated stack. To boot up all four core services:

1. Double-click the **[Start_PGC_SGCMS.bat](file:///d:/Software%20Projects/PGC/std-graph-attribute-ui-pgc/Start_PGC_SGCMS.bat)** file located in the root directory.
2. A green/black Command Prompt window will open and execute:
   * **[1/4] MongoDB Database** on port `27017`
   * **[2/4] Node Express API Server** on port `5000`
   * **[3/4] Frontend Web App Preview** on port `5173`
   * **[4/4] Cloudflare Secure Tunnel** (Generates a dynamic public URL and posts it to the redirect pointer)
3. Once the tunnel is ready, your default web browser will automatically open:
   👉 **`https://pgcswl-sgcms.vercel.app`**
4. Keep this Command Prompt window open. To close all services cleanly, press **`ENTER`** inside this terminal.

---

## ⚙️ 4. Configuring Windows Auto-Start / Automatic Boot
To ensure that all services launch automatically as soon as the computer boots up (e.g., in case of a power interruption), follow these steps:

1. Press **`Windows Key + R`** to open the Run dialog.
2. Type **`shell:startup`** and press **Enter**. This opens the Windows **Startup** folder.
3. Right-click inside the Startup folder and select **New $\rightarrow$ Shortcut**.
4. Click **Browse** and select the **[Start_PGC_SGCMS.bat](file:///d:/Software%20Projects/PGC/std-graph-attribute-ui-pgc/Start_PGC_SGCMS.bat)** file.
5. Click **Next**, name the shortcut (e.g. `SGCMS AutoLauncher`), and click **Finish**.
6. **Configure Windows Auto-Login (Optional but Recommended)**:
   * To allow the PC to boot directly to the desktop without waiting at the lock screen:
   * Press **`Win + R`**, type **`netplwiz`**, select the server user account, uncheck *"Users must enter a username and password to use this computer"*, and click Apply to enter your password.

---

## 📲 5. Client Portal Access & QR Code Distribution

The user login endpoints are globally accessible via the dedicated domain. You do not need to configure local firewalls or router settings:

1. The main access point for parents, teachers, and admins is:
   👉 **`https://pgcswl-sgcms.vercel.app`**
2. Print this URL as a **QR Code** (using a tool like [qr-code-generator.com](https://www.qr-code-generator.com/) pointing to the URL above).
3. **Scan and Connect**:
   * Parents and staff scan the QR code using any smartphone connected to Wi-Fi or mobile data (4G/5G).
   * They will be shown the 2.0-second Punjab Group of Colleges redirect splash page, and will then be routed directly to the active localhost tunnel in real-time.
   * If they haven't installed the app, they can click the **"Install App 📥"** button on the login screen to add it directly to their home screen as a standalone application.

---

## 🧹 6. Cleaned Files Registry
The following outdated, redundant instruction files and temporary assets have been safely purged from the workspace to clean up the deployment package:
* `To Run.txt` (Consolidated into this setup guide)
* `server setting.txt` (Consolidated into this setup guide)
* `pwa and server.md` (Consolidated into this setup guide)
* `PGC_Network_Setup_Guide.md` (Redundant local IP/firewall instructions)
* `wahab-pgc-pswd.png` / `zaid-pgc-pswd.png` (Temporary credentials screenshots)
