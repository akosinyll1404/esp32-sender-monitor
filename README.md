# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

# ESP32 Sender Monitor

A Windows desktop monitoring application built with **Tauri, React, TypeScript, and Vite** for displaying the live status of an ESP32 sender and its Bluetooth receiver.

## Overview

ESP32 Sender Monitor provides a desktop interface for observing communication between an ESP32 sender and a Bluetooth receiver.

The ESP32 sender exposes an HTTP status endpoint, while the desktop application periodically retrieves and displays the device's current status.

## Features

- Live Wi-Fi connection status
- Bluetooth connection status
- Bluetooth receiver online/offline status
- Acknowledgement (ACK) counter
- ESP32 IP address display
- Last acknowledgement timing
- Configurable ESP32 endpoint
- Automatic status polling every two seconds
- Windows desktop application packaging through Tauri

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Static type checking |
| Vite | Frontend development and production builds |
| Tauri | Native desktop application |
| Rust | Desktop application backend |
| ESP32 Arduino framework | Device communication and HTTP endpoint |
| Bluetooth Serial | Sender-to-receiver communication |

## Architecture

1. The ESP32 sender connects to Wi-Fi.
2. The sender establishes a Bluetooth connection with the receiver.
3. The sender transmits messages and receives ACK responses.
4. The sender exposes device status through `/api/status`.
5. The desktop application polls the endpoint every two seconds.
6. React updates the dashboard with the latest status.

## Requirements

- Node.js and npm
- Rust toolchain
- Windows C++ build tools required by Tauri
- WebView2 Runtime
- Arduino IDE and compatible ESP32 boards for device development

Refer to the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for installation requirements.

## Installation and Development

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd esp32-sender-monitor
```

Install dependencies:

```bash
npm install
```

Start the development application:

```bash
npm run tauri dev
```

## ESP32 Configuration

1. Configure the ESP32 sender with your Wi-Fi credentials.
2. Configure the Bluetooth receiver address.
3. Upload the sender and receiver sketches to their respective boards.
4. Connect your computer to a network that can reach the sender.
5. Open the desktop dashboard and enter the sender's IP address.

The expected status endpoint is:

```text
http://<ESP32_IP_ADDRESS>/api/status
```

Example response:

```json
{
  "wifiConnected": true,
  "ip": "192.168.1.100",
  "bluetoothConnected": true,
  "receiverAlive": true,
  "acknowledgements": 128,
  "lastAckAgoMs": 2000
}
```

The values above are illustrative.

## Build for Windows

Build the application and installer:

```bash
npm run tauri build
```

When NSIS packaging is enabled, the installer is typically generated under:

```text
src-tauri/target/release/bundle/nsis/
```

The resulting setup executable can be used to install the desktop application on a compatible Windows computer.

## Security Notes

- Do not commit Wi-Fi passwords, private credentials, or personal network information.
- Use placeholders in published ESP32 sketches and configure credentials locally.
- The HTTP endpoint should only be accessible on a trusted network unless additional security measures are implemented.
- Consider authentication and transport security before exposing device endpoints beyond a trusted local network.

## Current Limitations

- The desktop application requires network connectivity to the ESP32 sender.
- The sender IP address may change depending on router configuration.
- Status updates depend on the sender's HTTP endpoint and Bluetooth communication.
- The dashboard displays device status; it does not automatically configure the ESP32 hardware.

## Download and Install (Windows)

You can install ESP32 Sender Monitor on a compatible Windows computer using the prebuilt Windows installer. You do not need Node.js, Rust, or the development environment to install the released application.

### Step 1: Download the installer

1. Open the repository's **Releases** page.
2. Select the latest stable release.
3. Under **Assets**, download the Windows installer ending in `-setup.exe`.

> If no release is available yet, the installer has not been published. Check the project's release page again after a release is created.

### Step 2: Install the application

1. Open your Downloads folder.
2. Double-click the downloaded setup executable.
3. Follow the installation prompts.
4. If Windows displays a security warning, verify that the installer was obtained from the official project repository before deciding whether to proceed.

### Step 3: Launch the application

Open ESP32 Sender Monitor from the Windows Start menu or its installed shortcut.

### Step 4: Connect to your ESP32

1. Power on the ESP32 sender and Bluetooth receiver.
2. Ensure the sender has connected to Wi-Fi and the receiver is communicating over Bluetooth.
3. Find the sender's IP address in the Arduino Serial Monitor.
4. Ensure the computer can reach the sender over the network.
5. Enter the sender URL in the dashboard, for example `http://192.168.1.100`.
6. Click **Connect**.

The dashboard should display the Wi-Fi status, Bluetooth status, receiver status, acknowledgement count, and last acknowledgement timing.

The example IP address is only illustrative. Use the actual address assigned to your ESP32 sender.

### Troubleshooting

- **The installer will not open:** Confirm that you downloaded the correct Windows installer and that Windows supports the application.
- **The dashboard cannot connect:** Verify the ESP32 IP address and network connectivity. Open `http://<ESP32_IP_ADDRESS>/api/status` in a browser to test the endpoint.
- **The receiver appears offline:** Check the receiver's power, Bluetooth connection, and ACK responses.
- **Windows displays a security warning:** Verify the release source and publisher information. Unsigned applications may trigger Microsoft Defender SmartScreen warnings.

For firmware configuration and additional troubleshooting, see the [ESP32 Setup Guide](docs/esp32-setup.md).

## License

See [LICENSE](LICENSE) for licensing terms.