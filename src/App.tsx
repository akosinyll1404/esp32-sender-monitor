import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./App.css";

const DEFAULT_ESP32_URL = "http://192.168.1.100";

interface Esp32Status {
  wifiConnected: boolean;
  ip: string;
  bluetoothConnected: boolean;
  receiverAlive: boolean;
  acknowledgements: number;
  lastAckAgoMs: number | null;
}

interface StatusCardProps {
  title: string;
  value: string | number;
  detail?: string;
  online?: boolean;
}

function StatusCard({
  title,
  value,
  detail,
  online,
}: StatusCardProps) {
  return (
    <section className="status-card">
      <div className="card-heading">
        <span>{title}</span>
        <span
          className={`status-dot ${
            online === undefined ? "" : online ? "online" : "offline"
          }`}
        />
      </div>

      <div className="card-value">{value}</div>

      {detail && <div className="card-detail">{detail}</div>}
    </section>
  );
}

function formatLastAck(milliseconds: number | null): string {
  if (milliseconds == null) {
    return "No ACK received yet";
  }

  if (milliseconds < 1000) {
    return "Just now";
  }

  return `${Math.floor(milliseconds / 1000)} seconds ago`;
}

export default function App() {
  const [esp32Url, setEsp32Url] = useState<string>(DEFAULT_ESP32_URL);
  const [activeUrl, setActiveUrl] = useState<string>(DEFAULT_ESP32_URL);
  const [status, setStatus] = useState<Esp32Status | null>(null);
  const [error, setError] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus(): Promise<void> {
      try {
        const response = await fetch(`${activeUrl}/api/status`);

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data: Esp32Status = await response.json();

        if (!cancelled) {
          setStatus(data);
          setError("");
          setLastUpdated(new Date());
        }
      } catch {
        if (!cancelled) {
          setError(
            `Cannot reach ESP32 at ${activeUrl}. Check the IP and Wi-Fi connection.`
          );
        }
      }
    }

    void fetchStatus();

    const intervalId = window.setInterval(() => {
      void fetchStatus();
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeUrl]);

  function connectToDevice(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const cleanedUrl = esp32Url.trim().replace(/\/+$/, "");

    if (!/^https?:\/\/.+/i.test(cleanedUrl)) {
      setError(
        "Enter a complete URL, such as http://192.168.1.100"
      );
      return;
    }

    setStatus(null);
    setError("");
    setActiveUrl(cleanedUrl);
  }

  function handleUrlChange(event: ChangeEvent<HTMLInputElement>): void {
    setEsp32Url(event.target.value);
  }

  const wifiOnline = status?.wifiConnected === true;
  const bluetoothOnline = status?.bluetoothConnected === true;
  const receiverOnline = status?.receiverAlive === true;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">ESP32 · DEVICE MONITOR</p>
          <h1>Sender Dashboard</h1>
          <p className="subtitle">
            Live status from your ESP32 sender and Bluetooth receiver.
          </p>
        </div>

        <div
          className={`connection-badge ${
            status && !error ? "connected" : ""
          }`}
        >
          <span className="status-dot" />
          {status && !error ? "Receiving data" : "Waiting for device"}
        </div>
      </header>

      <form className="device-form" onSubmit={connectToDevice}>
        <label htmlFor="esp32-url">ESP32 sender URL</label>

        <div className="url-controls">
          <input
            id="esp32-url"
            value={esp32Url}
            onChange={handleUrlChange}
            placeholder="http://192.168.1.100"
            spellCheck={false}
          />

          <button type="submit">Connect</button>
        </div>

        <p className="helper-text">
          Use the actual IP address printed in the Arduino Serial Monitor.
        </p>
      </form>

      {error && (
        <div className="error-banner" role="alert">
          <strong>Connection issue</strong>
          <p>{error}</p>
        </div>
      )}

      <div className="section-heading">
        <h2>Device status</h2>
        <span>
          {status ? "Auto-refresh: 2 seconds" : "Connecting…"}
        </span>
      </div>

      <div className="status-grid">
        <StatusCard
          title="Wi-Fi"
          value={
            status
              ? wifiOnline
                ? "Connected"
                : "Disconnected"
              : "—"
          }
          detail={status?.ip || "Waiting for IP address"}
          online={status ? wifiOnline : undefined}
        />

        <StatusCard
          title="Bluetooth"
          value={
            status
              ? bluetoothOnline
                ? "Connected"
                : "Disconnected"
              : "—"
          }
          detail="Sender ↔ receiver link"
          online={status ? bluetoothOnline : undefined}
        />

        <StatusCard
          title="Receiver"
          value={
            status
              ? receiverOnline
                ? "Online"
                : "Offline"
              : "—"
          }
          detail="Based on recent ACK messages"
          online={status ? receiverOnline : undefined}
        />

        <StatusCard
          title="Acknowledgements"
          value={
            status
              ? (status.acknowledgements ?? 0).toLocaleString()
              : "—"
          }
          detail="ACK messages received"
        />
      </div>

      <section className="details-card">
        <h2>Communication details</h2>

        <div className="detail-row">
          <span>Sender IP address</span>
          <strong>{status?.ip || "—"}</strong>
        </div>

        <div className="detail-row">
          <span>Last acknowledgement</span>
          <strong>
            {status ? formatLastAck(status.lastAckAgoMs) : "—"}
          </strong>
        </div>

        <div className="detail-row">
          <span>Last successful poll</span>
          <strong>
            {lastUpdated ? lastUpdated.toLocaleTimeString() : "—"}
          </strong>
        </div>

        <div className="detail-row">
          <span>Status endpoint</span>
          <strong className="endpoint">
            {activeUrl}/api/status
          </strong>
        </div>
      </section>

      <footer className="dashboard-footer">
        ESP32 Sender Monitor · Live values come from the device
      </footer>
    </main>
  );
}