# Windows Build and Installer Guide

This guide explains how to build ESP32 Sender Monitor as a Windows installer using Tauri.

## Prerequisites

Install the prerequisites required by your Tauri version. For Tauri v2 on Windows, these generally include:

- Node.js and npm.
- Rust and Cargo.
- Microsoft C++ build tools with the Desktop development with C++ workload.
- WebView2 Runtime, which is present on most supported Windows installations.

See the official Tauri prerequisites documentation:
https://v2.tauri.app/start/prerequisites/

## Install frontend dependencies

Open PowerShell in the project root—the directory containing `package.json`—and run:

```powershell
npm install
```

## Run the development app

```powershell
npm run tauri dev
```

Confirm the dashboard opens and can reach the ESP32 sender before creating a release build.

## Configure the installer target

Open the existing Tauri configuration file, usually:

```text
src-tauri/tauri.conf.json
```

For a Tauri v2 NSIS installer, the `bundle` section can include:

```json
{
  "bundle": {
    "active": true,
    "targets": ["nsis"]
  }
}
```

Merge these values into your existing configuration rather than replacing the whole file. Preserve the application identifier, product name, version, icons, and other settings. If your project already configures all bundle targets, you may not need to change it.

## Build the installer

From the project root, run:

```powershell
npm run tauri build
```

If your `package.json` does not define a `tauri` script, use:

```powershell
npx tauri build
```

If the Tauri CLI is not installed locally, add it to development dependencies:

```powershell
npm install -D @tauri-apps/cli
```

The first release build may take several minutes. If packaging fails because an installer tool is missing, follow the error message and the official Tauri Windows installer guide:
https://v2.tauri.app/distribute/windows-installer/

## Find the installer

For an NSIS target, the installer is typically created in:

```text
src-tauri/target/release/bundle/nsis/
```

The file name depends on your Tauri product name and architecture. It commonly ends in `-setup.exe`.

You can open the output folder from PowerShell:

```powershell
explorer .\src-tauri\target\release\bundle\nsis
```

Do not commit the generated `src-tauri/target/` directory to Git. Publish release installers through GitHub Releases instead.

## Test before distribution

1. Install the generated setup executable on your development computer.
2. Launch the installed application without running Vite.
3. Confirm the dashboard loads.
4. Enter the correct ESP32 sender URL.
5. Confirm the HTTP status endpoint is reachable and status values update.
6. Test behavior when the ESP32 is powered off and then restored.
7. If possible, test installation on another compatible Windows computer.

The computer must be able to reach the ESP32 over the network. The application cannot show live device values when the sender is unreachable.

## Common issues

### `npm run tauri build` is not recognized

Check the scripts in `package.json`. Try `npx tauri build`, or install the Tauri CLI as a development dependency.

### C++ or Rust build errors

Verify that Rust/Cargo and the required Microsoft C++ build tools are installed. Read the first meaningful compiler error and address the missing prerequisite or code issue.

### No NSIS output folder

Check that the NSIS target is enabled and the build completed successfully. Review the terminal output for bundling errors.

### Installer opens, but the dashboard cannot connect

Verify the sender IP address, network connectivity, and `/api/status` endpoint. A successful development build does not guarantee the ESP32 is reachable from every network.

### Windows SmartScreen warning

Unsigned installers may trigger a warning. Code signing can improve publisher verification; it does not replace safe distribution practices.

## Release checklist

- [ ] Production build succeeds.
- [ ] Installer installs and launches.
- [ ] ESP32 URL can be configured.
- [ ] Live status and acknowledgement count work.
- [ ] No real credentials are included in the repository.
- [ ] Version and release notes are prepared.
- [ ] Installer is attached to a GitHub Release.