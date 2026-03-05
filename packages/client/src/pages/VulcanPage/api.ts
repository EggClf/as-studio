/**
 * Vulcan API — Context Snapshot & Network Scan services.
 *
 * Default backend: http://172.16.28.63:8099
 * Override via VITE_VULCAN_API_URL in your .env file.
 */

import type {
    CellFeatures,
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

// ── ML Model API (172.16.28.63:8181) ────────────────────

const ML_BASE =
    import.meta.env.VITE_ML_API_URL ||
    'http://172.16.28.63:8181';

/** Extract a flat feature map from a CellFeatures object for the given model type */
export function extractMLFeatures(
    cell: CellFeatures,
    modelType: 'ES' | 'MRO',
): Record<string, number> {
    const features: Record<string, number> = {};
    const names =
        modelType === 'ES'
            ? [
                  'Persistent Low Load Score',
                  'Energy Inefficiency Score',
                  'Stable QoS Confidence',
                  'Mobility Safety Index',
                  'Social Event Score',
                  'Traffic Volatility Index',
                  'Weather Sensitivity Score',
                  'n_alarm',
              ]
            : [
                  'Handover Failure Pressure',
                  'Handover Success Stability',
                  'Congestion-Induced HO Risk',
                  'Mobility Volatility Index',
                  'Weather-Driven Mobility Risk',
                  'n_alarm',
                  'Social Event Score',
              ];

    names.forEach((n) => {
        if (n === 'n_alarm') {
            features[n] = cell.n_alarm ?? 0;
        } else {
            const v = (cell as unknown as Record<string, unknown>)[n];
            features[n] = v != null ? (v as number) : 0;
        }
    });
    return features;
}

export interface BatchCellInput {
    cell_id: string;
    features: Record<string, number>;
}

export async function fetchDecisionTreeTrace(
    intentId: string,
    modelType: 'ES' | 'MRO',
    features: Record<string, number>,
): Promise<import('./types').DecisionTreeTrace> {
    const res = await fetch(`${ML_BASE}/predict/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_type: modelType, features, intent_id: intentId }),
    });
    if (!res.ok) throw new Error(`Trace prediction failed: ${res.status}`);
    const data = await res.json();
    return {
        intentId: data.intentId,
        intentLabel: data.intentLabel,
        decision: data.decision,
        confidence: data.confidence,
        path: data.path,
        topFeatures: data.topFeatures,
        counterfactual: data.counterfactual,
        featureSnapshot: data.featureSnapshot,
    };
}

export async function fetchBatchDecisionTraces(
    modelType: 'ES' | 'MRO',
    cells: BatchCellInput[],
): Promise<import('./types').BatchTraceResult> {
    const res = await fetch(`${ML_BASE}/predict/batch-trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_type: modelType, cells }),
    });
    if (!res.ok) throw new Error(`Batch trace failed: ${res.status}`);
    const data = await res.json();
    return {
        modelType: data.model_type,
        totalCells: data.total_cells,
        appliedCount: data.applied_count,
        notAppliedCount: data.not_applied_count,
        errorCount: data.error_count,
        results: data.results.map((r: Record<string, unknown>) => ({
            cellId: r.cell_id,
            modelType: r.model_type,
            decision: r.decision,
            confidence: r.confidence,
            probabilities: r.probabilities,
            path: r.path,
            topFeatures: r.topFeatures,
            counterfactual: r.counterfactual,
            featureSnapshot: r.featureSnapshot,
            error: r.error,
        })),
        timestamp: data.timestamp,
    };
}

export async function fetchPlanData(
    taskType: 'ES' | 'MRO',
    date: string,
): Promise<import('./types').PlanLoadResponse> {
    const res = await fetch(`${ML_BASE}/plan/load`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_type: taskType, date }),
    });
    if (!res.ok) throw new Error(`Plan load failed: ${res.status}`);
    return res.json();
}
