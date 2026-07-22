# PGC SGCMS - Global Network & Portal Setup Guide

This guide provides step-by-step instructions for configuring your laptop and network so the **PGC Student Growth & Character Management System (SGCMS)** is accessible both on your local Wi-Fi network and globally from any mobile device over cellular data (4G/5G).

---

## 📌 Step 1: Allow Inbound Connections in Windows Firewall (One-Time Setup)

By default, Windows Defender Firewall blocks incoming connections from other networks. To allow external phones and devices to connect to your laptop:

1. Press `Windows Key + X` and select **Terminal (Admin)** or **PowerShell (Run as Administrator)**.
2. Paste and run this command:
   ```powershell
   New-NetFirewallRule -DisplayName "PGC SGCMS Portal" -Direction Inbound -LocalPort 5000,5173 -Protocol TCP -Action Allow
   ```
   *(This unlocks external traffic through port **5000** for the Express API and port **5173** for the Vite Web Portal).*

---

## 📌 Step 2: Set a Static Local IP on Your Laptop

To prevent your Wi-Fi router from changing your laptop's local IP address when you reboot:

1. Open **Windows Settings** (`Win + I`) $\rightarrow$ **Network & Internet** $\rightarrow$ **Wi-Fi** (or **Ethernet**).
2. Click **Hardware properties** (or your active network name).
3. Next to **IP assignment**, click **Edit** and change it from *Automatic (DHCP)* to **Manual**.
4. Turn on **IPv4** and enter:
   - **IP Address**: `192.168.100.42` (or your current active local IP)
   - **Subnet mask**: `255.255.255.0`
   - **Gateway**: `192.168.100.1` (your router IP)
   - **Preferred DNS**: `8.8.8.8`
5. Click **Save**.

---

## 📌 Step 3: Enable Global Access (Connecting from Outside your Wi-Fi)

To allow parents and staff to access the portal when they are on **cellular data (4G/5G)** or at home:

### Option A: Router Port Forwarding (Direct Public Access)
1. Log into your Internet Router admin dashboard (usually `http://192.168.100.1` or `http://192.168.1.1`).
2. Navigate to **Port Forwarding / Virtual Server / NAT**.
3. Create 2 forwarding rules:
   - **Rule 1 (Web App)**: External Port `5173` $\rightarrow$ Internal IP `192.168.100.42` $\rightarrow$ Internal Port `5173` (TCP)
   - **Rule 2 (API)**: External Port `5000` $\rightarrow$ Internal IP `192.168.100.42` $\rightarrow$ Internal Port `5000` (TCP)
4. Check your Public IP address on [whatismyip.com](https://whatismyip.com).
5. Parents anywhere on 4G/5G can now scan the QR code pointing to `http://<YOUR_PUBLIC_IP>:5173`!

---

### Option B: Cloudflare Free Tunnel (Zero Router Setup — Recommended)
If your internet provider blocks router port forwarding:

1. Open **PowerShell** on your laptop and install Cloudflare CLI:
   ```cmd
   winget install Cloudflare.cloudflared
   ```
2. Start an instant free tunnel pointing to your laptop's frontend port:
   ```cmd
   cloudflared tunnel --url http://localhost:5173
   ```
3. Cloudflare prints a live global link in green text:
   ```
   https://xxxx-xxxx-xxxx.trycloudflare.com
   ```
4. Click **`📱 Share Portal QR Code`** in your Admin Panel to generate the instant access QR card for parents!

---

## 🧪 Testing & Verification

### Test on Local Wi-Fi (Same Network):
- On any mobile phone connected to the same Wi-Fi, open: `http://192.168.100.42:5173` (or scan the QR Code from your Admin Panel).

### Test on Cellular Data (4G/5G / Global Access):
1. Run the instant Cloudflare tunnel in PowerShell:
   ```cmd
   cloudflared tunnel --url http://localhost:5173
   ```
2. Turn off Wi-Fi on your mobile phone, switch to **4G/5G cellular data**, and open your `https://...trycloudflare.com` link.
3. Sign in with parent/admin credentials.

---

## 📱 Generating the QR Code for the Global Link

In your Admin Panel:
1. Click **`📱 Share Portal QR Code`**.
2. Paste your `https://...trycloudflare.com` link into the QR code URL box.
3. Print or share the QR Code card so parents can scan it from any 4G/5G smartphone anywhere in the world!
