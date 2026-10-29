<div align="center">

# ⚡ AirVault

### **The Ultimate Local Network File Server & Media Streamer**
*Stream media, browse directories, and download files instantly across any device on your Wi-Fi network with zero configuration.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python Version](https://img.shields.io/badge/python-3.8%2B-blueviolet.svg)](https://www.python.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Android%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/Aritra-01/airvault/releases)
[![GitHub Stars](https://img.shields.io/github/stars/Aritra-01/airvault?style=social)](https://github.com/Aritra-01/airvault)

[Features](#-features) • [Quick Start](#-quick-start) • [Releases (.exe & .apk)](#-releases) • [Architecture](#-architecture)

---

</div>

## 🌟 Why AirVault?

Tired of cumbersome cloud uploads or slow file transfers just to watch a movie on your phone or tablet from your PC? **AirVault** turns your PC or any device into a blazing-fast local server on your Wi-Fi network. 

Inspired by minimalist local file servers like `tomfln/local-file-server`, AirVault delivers a gorgeous dark-mode web interface, a self-adjustable media player with playback speed and volume control, instant file/folder downloads, and a zero-config local network architecture.

---

## ✨ Features

- **🌐 Zero-Config Wi-Fi LAN Sharing**: Instantly share your entire PC directory with phones, tablets, smart TVs, and laptops on the same Wi-Fi.
- **🎬 Self-Adjusting Media Player & Viewer**:
  - Full HTML5 video and audio streaming with scrubbing, volume, fullscreen, and playback speed controls.
  - Image preview, code/text highlighter viewer, and PDF viewer.
- **📥 Dedicated Download Buttons**: One-click high-speed downloading for individual files or entire folders.
- **⚡ Blazing Fast & Lightweight**: Zero-dependency Python server with HTTP Range request support for seamless video seeking.
- **📦 Standalone Releases**: Pre-compiled Windows `.exe` and Android `.apk` companion app.

---

## 🚀 Quick Start

### 1. Run from Python Source
```bash
git clone https://github.com/Aritra-01/airvault.git
cd airvault
python server.py
```
Open `http://localhost:8080` on your PC or `http://<your-wifi-ip>:8080` on your phone!

### 2. Run Standalone Windows `.exe`
Download `AirVault.exe` from the [Releases page](https://github.com/Aritra-01/airvault/releases), double-click to launch, and access your vault instantly.

---

## 📦 Releases (`.exe` & `.apk`)

| Asset | Platform | Description |
|---|---|---|
| **`AirVault.exe`** | Windows PC | Standalone executable (built with PyInstaller, no Python needed) |
| **`AirVault.apk`** | Android | Mobile companion app / PWA wrapper for seamless phone access |

---

## 🛠️ Building from Source

### Building Windows `.exe`
```bash
pip install pyinstaller
pyinstaller --onefile --add-data "public;public" server.py
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
