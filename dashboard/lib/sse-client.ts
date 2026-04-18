import type { RunEvent } from "./types";

interface SseOptions {
  onEvent: (event: RunEvent) => void;
  onFallback: () => void;
}

const HEARTBEAT_MS = 4000;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function openSseStream(_goal: string, opts: SseOptions): () => void {
  let closed = false;
  const source = new EventSource(`${API_URL}/stream-logs`);
  let lastBeat = Date.now();
  let fallbackTriggered = false;

  const watchdog = setInterval(() => {
    if (closed) return;
    if (Date.now() - lastBeat > HEARTBEAT_MS && !fallbackTriggered) {
      fallbackTriggered = true;
      console.warn("[iteron] SSE heartbeat missed — falling back to demo mode");
      close();
      opts.onFallback();
    }
  }, 1000);

  source.onmessage = (msg) => {
    lastBeat = Date.now();
    try {
      const parsed = JSON.parse(msg.data) as RunEvent;
      opts.onEvent(parsed);
    } catch {
      // ignore heartbeat / non-JSON payloads
    }
  };

  source.onerror = () => {
    if (!fallbackTriggered) {
      fallbackTriggered = true;
      console.warn("[iteron] SSE error — falling back to demo mode");
      close();
      opts.onFallback();
    }
  };

  function close() {
    if (closed) return;
    closed = true;
    clearInterval(watchdog);
    source.close();
  }

  return close;
}
