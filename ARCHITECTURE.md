# System Architecture

## Overview

ESP32 Sender Monitor is a Windows desktop application built with Tauri, React, TypeScript, and Vite. It displays status information reported by an ESP32 sender, which communicates with a Bluetooth receiver.

The desktop application reads status from the sender's HTTP endpoint. Bluetooth communication happens between the two ESP32 devices; the desktop app does not communicate with the receiver directly.

## Components

### 1. ESP32 sender

The sender firmware is responsible for:

- Connecting to the configured Wi-Fi network.
- Starting an HTTP server.
- Connecting to the Bluetooth receiver using Bluetooth Serial.
- Sending periodic messages to the receiver.
- Reading acknowledgement messages (`ACK`) from the receiver.
- Tracking the acknowledgement count and time of the most recent acknowledgement.
- Returning status data from `GET /api/status`.

The exact Bluetooth connection behavior depends on the sender firmware and the configured receiver Bluetooth address.

### 2. Bluetooth receiver

The receiver firmware starts a Bluetooth Serial service, receives newline-terminated messages from the sender, and replies with `ACK`.

The sender treats the receiver as online when a recent acknowledgement has been received. In the current firmware, the receiver status becomes offline when no acknowledgement has been received within the configured timeout.

### 3. HTTP status endpoint

The sender exposes:

```text
GET http://<ESP32_IP_ADDRESS>/api/status
```

An illustrative JSON response is:

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

These values are examples, not guaranteed live values. `lastAckAgoMs` may be `null` if no acknowledgement has been received since startup.

### 4. Tauri desktop application

The React dashboard:

- Lets the user enter the sender's base URL.
- Requests `/api/status` immediately after connecting.
- Polls the endpoint every two seconds.
- Displays Wi-Fi, Bluetooth, receiver, acknowledgement count, IP address, last acknowledgement age, and last successful poll time.
- Displays a connection error when a request fails.

TypeScript types describe the expected JSON structure. They do not validate the response at runtime; runtime validation can be added if needed.

## Data flow

```text
Bluetooth receiver
       ^ |
       | | Messages / ACK replies
       | v
ESP32 sender
       |
       | HTTP GET /api/status
       v
Tauri desktop app
       |
       v
React + TypeScript dashboard
```

1. The sender transmits a message to the receiver over Bluetooth Serial.
2. The receiver replies with `ACK`.
3. The sender updates its acknowledgement state.
4. The desktop app polls the sender's HTTP status endpoint.
5. The dashboard renders the returned values.

## Network and security considerations

- The desktop computer must be able to reach the ESP32 sender over the network.
- The configured IP address may change if the router assigns addresses dynamically.
- The endpoint should be used on a trusted network unless authentication and other security controls are implemented.
- CORS configuration may be required by the webview depending on the app's configuration.
- Do not publish Wi-Fi passwords, private tokens, or other secrets in source code or documentation.

## Known limitations

- The dashboard depends on the sender's HTTP endpoint being reachable.
- Receiver status is inferred from recent ACK messages; it is not a direct measurement of the receiver's full health.
- The example status payload and IP address in this document are illustrative.

