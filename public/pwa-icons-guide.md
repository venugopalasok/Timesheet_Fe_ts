# PWA Icons Guide

## Current Setup
Your PWA is configured to use `timesheet-logo.png` for all icon sizes.

## Recommended Icon Sizes for Production

For the best PWA experience, create the following icon sizes:

1. **192x192 pixels** - Required for Android
2. **512x512 pixels** - Required for splash screens
3. **180x180 pixels** - Optional for iOS (Apple Touch Icon)

## How to Create Icons

### Option 1: Using Online Tools
- Visit [PWA Asset Generator](https://www.pwabuilder.com/)
- Upload your `timesheet-logo.png`
- Download the generated icons

### Option 2: Using Image Editing Software
- Open your logo in Photoshop, GIMP, or similar
- Resize to each required dimension
- Save as PNG with transparency
- Name them: `icon-192x192.png`, `icon-512x512.png`, etc.

### Option 3: Using Sharp (Node.js)
```bash
npm install -g sharp-cli
sharp -i timesheet-logo.png -o icon-192x192.png resize 192 192
sharp -i timesheet-logo.png -o icon-512x512.png resize 512 512
```

## After Creating Icons

Update the `vite.config.ts` manifest icons array to point to your new icon files.

## Current Configuration
The app is fully functional as a PWA with your existing logo!


