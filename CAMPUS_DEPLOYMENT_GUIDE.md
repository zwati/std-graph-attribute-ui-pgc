# 🎓 PGC SGCMS - Campus Deployment & Setup Guide
### Target Deployment Date: 2nd August 2026 | Sahiwal Campus (Pakpattan Road)

This guide provides step-by-step instructions for deploying and running the **Punjab Group of Colleges Student Growth & Character Management System (SGCMS)** on the permanent campus server computer. Follow this checklist to ensure a successful "plug-and-play" deployment.

---

## 🖥️ 1. Hardware & System Requirements (Server PC)

To ensure smooth 24/7 background operation for all services (MongoDB, Express API, Vite Preview, and Cloudflare Tunnel), the server computer must meet the following minimum specifications:

| Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Operating System** | Windows 10 (64-bit) | Windows 11 (64-bit) |
| **Processor (CPU)** | Intel Core i3 (6th Gen or newer) / AMD Ryzen 3 (1000 Series or newer) | Intel Core i5 (8th Gen or newer) / AMD Ryzen 5 (3000 Series or newer) |
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

## ⚙️ 4. Automatic Power-On & Headless Self-Healing Setup (Power Loss Recovery)

To ensure the server is 100% maintenance-free and automatically boots up, connects to the internet, and starts all services when electricity returns after a power outage, configure the following four layers:

### Layer A: Hardware Auto-Power-On (BIOS Configuration)
This forces the computer to boot automatically as soon as it receives power, without anyone pressing the physical power button:
1. Turn off the computer, turn it back on, and repeatedly press the BIOS key (usually **`Del`**, **`F2`**, **`F10`**, or **`F12`** depending on the PC brand).
2. Use the arrow keys to navigate to the **Advanced**, **Power Management**, or **APM Configuration** tab.
3. Locate settings named **"Restore on AC Power Loss"**, **"AC Power Recovery"**, or **"State after G3"**.
4. Change the value from *Power Off* or *Keep Last State* to **`Power On`** (or **`Enabled`**).
5. Press **`F10`** to Save and Exit.

### Layer B: Bypass Windows Lock Screen (Automatic Auto-Login)
This allows Windows to bypass the login prompt and boot straight to the desktop so startup scripts can execute:
1. **Restore Netplwiz Checkbox (Windows 10/11 Security Patch)**:
   * Press **`Win + R`**, type **`regedit`**, and press **Enter** (opens Registry Editor).
   * Navigate to the path:
     `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\PasswordLess\Device`
   * Double-click **`DevicePasswordLessBuildVersion`** on the right panel and change its value data from `2` to **`0`**. Click OK and close Registry Editor.
2. **Setup Auto-Login**:
   * Press **`Win + R`**, type **`netplwiz`**, and press **Enter**.
   * Select your admin user account from the list.
   * **Uncheck** the box that says: *"Users must enter a username and password to use this computer"*.
   * Click **Apply**. A prompt will appear asking for the account password. Enter the password twice and click **OK**.
   *(Alternatively, you can download Microsoft's official secure utility **Autologon** from [learn.microsoft.com](https://learn.microsoft.com/en-us/sysinternals/downloads/autologon) to configure this securely with one click).*

### Layer C: Automatic Internet Connection
1. Click the Wi-Fi icon in the bottom-right taskbar.
2. Select the campus Wi-Fi network and check **"Connect automatically"**.
3. Click Connect. If using Ethernet, Windows connects to LAN networks automatically by default.

### Layer D: Automatic Service Launch on Boot
1. Press **`Win + R`**, type **`shell:startup`**, and press **Enter** (opens the Windows Startup folder).
2. Create a shortcut to the **[Start_PGC_SGCMS.bat](file:///d:/Software%20Projects/PGC/std-graph-attribute-ui-pgc/Start_PGC_SGCMS.bat)** file.
3. Paste that shortcut inside this Startup folder.
4. **Testing**: Restart the computer. Windows should boot directly to the desktop without prompt, connect to the internet, and instantly launch the green/black PGC terminal with all 4 services!

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