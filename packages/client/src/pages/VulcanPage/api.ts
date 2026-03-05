/**
 * Vulcan API — Context Snapshot & Network Scan services.
 *
 * Default backend: http://172.16.28.63:8099
 * Override via VITE_VULCAN_API_URL in your .env file.
 */

import type {
    NetworkScanData,
    SystemScanEvent,
    SystemScanRequest,
} from './types';

const API_BASE =
    import.meta.env.VITE_VULCAN_API_URL ||
    'http://172.16.28.63:8099';

const SCAN_BASE =
    import.meta.env.VITE_NETWORK_SCAN_URL || `${API_BASE}/network-scan/scan`;

// ── Helpers ─────────────────────────────────────────────

/** Format a Date as "YYYY-MM-DDTHH:mm:ss" (no Z, no ms) — matches backend expectation. */
export function formatTimestamp(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day}T${h}:${min}:${s}`;
}

// ── Network Scan ────────────────────────────────────────

function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// TODO: remove hardcoded fallback when switching to live data
const DEFAULT_TIMESTAMP = '2026-02-04T10:00:00';

export async function fetchNetworkScan(
    date?: Date,
): Promise<NetworkScanData> {
    const timestamp = date
        ? `${formatDate(date)}T10:00:00`
        : DEFAULT_TIMESTAMP;

    const res = await fetch(SCAN_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timestamp,
            enable_web_search: false,
        }),
    });

    if (!res.ok) throw new Error(`Network scan failed: ${res.status}`);
    return res.json();
}

// ── System-Scan SSE Stream ──────────────────────────────

export function streamSystemScan(
    request: SystemScanRequest,
    onEvent: (event: SystemScanEvent) => void,
    onDone: () => void,
    onError: (err: Error) => void,
): AbortController {
    const controller = new AbortController();

    (async () => {
        try {
            const res = await fetch(`${API_BASE}/system-scan/stream`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
                signal: controller.signal,
            });

            if (!res.ok || !res.body) {
                throw new Error(`SSE stream failed: ${res.status}`);
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop() ?? '';

                for (const part of parts) {
                    // Each SSE chunk may have one or more "data: ..." lines
                    for (const raw of part.split('\n')) {
                        const line = raw.replace(/^data:\s*/, '').trim();
                        if (!line) continue;
                        try {
                            onEvent(JSON.parse(line) as SystemScanEvent);
                        } catch {
                            /* skip malformed */
                        }
                    }
                }
            }
            onDone();
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                onError(err as Error);
            }
        }
    })();

    return controller;
}
