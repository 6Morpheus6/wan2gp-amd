# Wan2GP - AMD

A pinokio script for [https://github.com/deepbeepmeep/Wan2GP](https://github.com/deepbeepmeep/Wan2GP)

## Desktop control app

This repo includes a local Electron desktop control app in `desktop/`.

After Wan2GP has been installed into `app/`, launch the desktop app with:

```powershell
.\Wan2GP Desktop.bat
```

The desktop app runs the cloned Git version directly. Its main **Web UI** view starts or connects to `http://localhost:7860` and embeds the full WanGP interface, including every model family, presets, plugins, queue controls, and configuration panels exposed by WanGP.

The **Quick Job** view remains available for small direct test jobs. It writes a compact Wan2GP settings JSON file and calls `app\wgp.py --process ... --output-dir ...`, then streams logs and refreshes recent files from `app/outputs`.

### Windows installer

Build the Windows installer with:

```powershell
cd .\desktop
npm run dist
```

The installer is written to:

```text
desktop\dist\Wan2GP AMD Desktop-0.2.3-Setup.exe
```

The installed desktop app stores its selected Wan2GP AMD folder in the normal Windows app data location. If the app is installed somewhere other than this repo, use **Install & Updates > Change** and select the `wan2gp-amd` folder that contains `pinokio.js` and `app\wgp.py`.

### Updates

The desktop app has two update paths:

- **Update Local Files** runs `git pull` for this launcher repo, `git pull` for the cloned Wan2GP app, and refreshes desktop dependencies.
- **Check App Update** checks GitHub release metadata for a newer packaged desktop app. To publish one, bump `desktop/package.json` version, run `npm run dist`, and upload the installer, blockmap, and `latest.yml` to a GitHub release for that version.
