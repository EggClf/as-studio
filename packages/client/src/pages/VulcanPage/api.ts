/**
 * Vulcan API — Context Snapshot & Network Scan services.
 *
 * Uses the same base URL convention as the legacy app but reads from
 * VITE_API_URL (proxied through vite.config or direct in production).
 */

import type {
    ContextSnapshotResponse,
    NetworkScanData,
    SystemScanEvent,
    SystemScanRequest,
} from './types';

const API_BASE =
    import.meta.env.VITE_VULCAN_API_URL ||
    import.meta.env.VITE_API_URL ||
    '/api/vulcan';

const SCAN_BASE =
    import.meta.env.VITE_NETWORK_SCAN_URL || `${API_BASE}/network-scan/scan`;

// ── Context Snapshot ────────────────────────────────────

export async function fetchContextSnapshot(
    page = 1,
    pageSize = 20,
    cellName?: string,
    startTime?: string,
    endTime?: string,
): Promise<ContextSnapshotResponse> {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    });
    if (cellName) params.set('cell_name', cellName);
    if (startTime) params.set('start_time', startTime);
    if (endTime) params.set('end_time', endTime);

    const res = await fetch(`${API_BASE}/context-snapshot/data?${params}`, {
        headers: { accept: 'application/json' },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(
            err.detail || `Context snapshot failed: ${res.status}`,
        );
    }
    return res.json();
}

// ── Network Scan ────────────────────────────────────────

function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export async function fetchNetworkScan(
    date?: Date,
): Promise<NetworkScanData> {
    const dateStr = formatDate(date ?? new Date());

    const res = await fetch(SCAN_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            timestamp: `${dateStr}T10:00:00`,
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
                const lines = buffer.split('\n\n');
                buffer = lines.pop() ?? '';

                for (const chunk of lines) {
                    const line = chunk.replace(/^data:\s*/, '').trim();
                    if (!line) continue;
                    try {
                        onEvent(JSON.parse(line) as SystemScanEvent);
                    } catch {
                        /* skip malformed */
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
