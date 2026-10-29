<div align="center">

# ⚡ AirVault

### **Instant Local Network File Server & Media Streamer**
*Stream files, browse directories, and download media across any device on your Wi-Fi network with zero configuration.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blueviolet.svg)](https://www.python.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Android%2C%20Linux%20%7C%20macOS-lightgrey.svg)](https://gitlab.com/username/airvault/-/releases)
[![GitLab Pages](https://img.shields.io/badge/gitlab-pages-orange.svg)](https://username.gitlab.io/airvault)

[Features](#-features) • [Quick Start](#-quick-start) • [Downloads (.exe & .apk)](#-releases) • [Architecture](#-architecture)

---

</div>

## ✨ Features

- **🌐 Zero-Config Wi-Fi LAN Sharing**: Instantly share any directory on your PC with phones, tablets, smart TVs, and other laptops on the same Wi-Fi network.
- **🎬 Self-Adjusting Media Player & Viewer**: Built-in video/audio player with seeking, volume, playback speed controls, image previewer, and code/text viewer.
- **📥 Dedicated Download Buttons**: One-click high-speed downloading for any file or folder across the network.
- **⚡ Zero Dependencies**: Powered by Python's blazing-fast built-in HTTP server with HTTP Range requests for seamless video streaming.
- **📱 Cross-Platform Ready**: Standalone Windows `.exe` executable and Android `.apk` companion app.

---

## 🚀 Quick Start

### Running from Source
1. Clone or download this repository:
   ```bash
   git clone https://gitlab.com/username/airvault.git
   cd AirVault
   ```
2. Start the server:
   ```bash
   python server.py
   ```
3. Open the printed local URL (`http://localhost:8080`) or your Wi-Fi LAN IP address on any device connected to your network!

---

## 📦 Releases (`.exe` & `.apk`)

Head over to the [Releases Page](https://gitlab.com/username/airvault/-/releases) to download:
- **`AirVault.exe`**: Standalone Windows desktop executable (no Python installation required).
- **`AirVault.apk`**: Android companion app to access your PC vault on your phone.

---

## 🛠️ Building Windows `.exe`
To package `server.py` into a standalone Windows `.exe` using PyInstaller:
```bash
pip install pyinstaller
pyinstaller --onefile --add-data "public;public" server.py
```
The compiled executable will be located in `dist/server.exe`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
