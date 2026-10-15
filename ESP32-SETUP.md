# ESP32 Setup Guide

This guide describes the expected setup for the ESP32 sender and Bluetooth receiver used by ESP32 Sender Monitor. Confirm pin assignments, board models, and Bluetooth compatibility against your actual hardware; this project description does not specify wiring or GPIO requirements.

## Prerequisites

- Two compatible ESP32 boards, if using separate sender and receiver devices.
- Arduino IDE with the appropriate ESP32 board support package.
- USB cables and drivers required by your boards.
- The sender and receiver firmware sketches.
- A Wi-Fi network accessible to the sender and desktop computer.

## Configure the sender

The sender sketch uses these libraries:

```cpp
#include <BluetoothSerial.h>
#include <WiFi.h>
#include <WebServer.h>
```

Before uploading:

1. Select the correct ESP32 board and serial port in Arduino IDE.
2. Set the Wi-Fi SSID and password locally in the sketch.
3. Set the receiver's Bluetooth MAC address to the address for your actual receiver.
4. Keep credentials out of public repositories. Use placeholders in any sketch you publish.
5. Compile and upload the sketch to the sender board.

Do not copy example credentials or Bluetooth addresses from documentation without confirming they match your environment. Bluetooth Serial support varies by ESP32 model and framework configuration.

## Configure the receiver

The receiver firmware should:

1. Start Bluetooth Serial with a recognizable device name.
2. Read incoming messages terminated by a newline.
3. Reply with `ACK` followed by a newline.

A simplified illustrative receiver loop is:

```cpp
if (SerialBT.available()) {
  String message = SerialBT.readStringUntil('\\n');
  message.trim();

  Serial.println(message);
  SerialBT.println("ACK");
}
```

Integrate this logic into your existing receiver sketch rather than treating this fragment as a complete firmware program.

## Upload and test

1. Upload the receiver sketch to the receiver board.
2. Open its Serial Monitor at the baud rate configured by the sketch.
3. Upload the sender sketch.
4. Open the sender Serial Monitor at the configured baud rate (the current example uses `115200`).
5. Confirm the sender connects to Wi-Fi and prints its assigned IP address.
6. Confirm Bluetooth connects and the sender receives `ACK` responses.
7. Confirm the receiver prints the incoming messages.

## Test the HTTP endpoint

From a computer on the same reachable network, open:

```text
http://<ESP32_IP_ADDRESS>/
```

Then open:

```text
http://<ESP32_IP_ADDRESS>/api/status
```

Replace `<ESP32_IP_ADDRESS>` with the IP printed by the sender. The status endpoint should return JSON containing the Wi-Fi state, IP address, Bluetooth state, receiver state, acknowledgement count, and time since the last acknowledgement.

If the endpoint does not respond:

- Verify the sender's IP address.
- Ensure the sender and computer can communicate on the network.
- Check that the sender is powered and running.
- Check the Serial Monitor for Wi-Fi or server startup errors.
- Verify that the firmware registers `/api/status` and starts the HTTP server.

If the receiver remains offline:

- Check the receiver's power and firmware.
- Confirm the Bluetooth address is correct.
- Confirm both boards support the Bluetooth Serial mode used by the sketch.
- Check that the receiver replies with the exact text `ACK`.
- Check that messages and acknowledgements use newline termination.

## Connect the desktop dashboard

1. Start the desktop app.
2. Enter the sender URL, for example `http://192.168.1.100`.
3. Select **Connect**.
4. Check the Wi-Fi, Bluetooth, receiver, and acknowledgement cards.
5. Confirm the acknowledgement count changes as messages are acknowledged.

The example address is only a placeholder. Use the address printed by your own sender.

## Security

- Never commit real Wi-Fi credentials to a public repository.
- If a credential was published, change it and review the Git history.
- Do not expose the HTTP endpoint to untrusted networks without appropriate security controls.