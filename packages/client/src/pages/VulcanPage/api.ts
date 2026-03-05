/**
 * Vulcan API — Context Snapshot & Network Scan services.
 *
 * Default backend: http://172.16.28.63:8099
 * Override via VITE_VULCAN_API_URL in your .env file.
 */

import type {
    ContextSnapshotResponse,
    ContextSnapshotRow,
    NetworkScanData,
    SystemScanEvent,
    SystemScanRequest,
} from './types';

const API_BASE =
    import.meta.env.VITE_VULCAN_API_URL ||
    'http://172.16.28.63:8099';

const SCAN_BASE =
    import.meta.env.VITE_NETWORK_SCAN_URL || `${API_BASE}/network-scan/scan`;

// ── Context Snapshot (via system-scan/stream) ───────────

export async function fetchContextSnapshot(
    _page = 1,
    _pageSize = 20,
    cellName?: string,
    _startTime?: string,
    _endTime?: string,
): Promise<ContextSnapshotResponse> {
    if (!cellName) {
        return { total: 0, page: 1, page_size: _pageSize, columns: [], data: [] };
    }

    const body: SystemScanRequest = {
        task_type: 'MRO',
        cells: [cellName],
        timestamp: _startTime
            ? new Date(_startTime).toISOString()
            : new Date().toISOString(),
        enable_web_search: false,
        save_to_db: false,
    };

    const res = await fetch(`${API_BASE}/system-scan/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok || !res.body) {
        throw new Error(`Context snapshot (system-scan) failed: ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let payload: Record<string, unknown> | undefined;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() ?? '';

        for (const chunk of chunks) {
            const line = chunk.replace(/^data:\s*/, '').trim();
            if (!line) continue;
            try {
                const evt = JSON.parse(line) as SystemScanEvent;
                if (evt.type === 'done' && evt.payload) {
                    payload = evt.payload;
                }
            } catch {
                /* skip malformed */
            }
        }
    }

    if (!payload) {
        return { total: 0, page: 1, page_size: _pageSize, columns: [], data: [] };
    }

    // Normalise the payload into ContextSnapshotResponse
    if (Array.isArray(payload.data)) {
        const rows = payload.data as ContextSnapshotRow[];
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        return {
            total: rows.length,
            page: 1,
            page_size: rows.length,
            columns,
            data: rows,
        };
    }

    // Single-object payload — wrap as one row
    const columns = Object.keys(payload);
    return {
        total: 1,
        page: 1,
        page_size: 1,
        columns,
        data: [payload as unknown as ContextSnapshotRow],
    };
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
