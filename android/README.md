# 📱 AirVault Android App

Generate the Android `.apk` for AirVault in under 2 minutes:

## Option 1: Instant PWA APK (Recommended & Easiest)
1. Host your AirVault web server on your local network or GitHub Pages.
2. Go to [PWABuilder](https://www.pwabuilder.com/).
3. Enter your URL and click **Generate APK** — it instantly produces a signed Android `.apk` ready for installation on any phone!

## Option 2: Capacitor Native Android Build
If you have Android Studio installed:
```bash
npm install
npx cap add android
npx cap open android
```
Then build the APK in Android Studio (`Build > Build Bundle(s) / APK(s) > Build APK(s)`).
