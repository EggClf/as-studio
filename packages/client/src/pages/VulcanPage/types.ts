/** Vulcan Network Cell & Context Snapshot types */

// ── Network Scan ────────────────────────────────────────

export interface CellFeatures {
    intent_id: string;
    cellname: string;
    ne_name: string;
    timestamp: string;
    // MRO features
    'Handover Failure Pressure'?: number | null;
    'Handover Success Stability'?: number | null;
    'Congestion-Induced HO Risk'?: number | null;
    'Mobility Volatility Index'?: number | null;
    'Weather-Driven Mobility Risk'?: number | null;
    n_alarm?: number;
    'Social Event Score'?: number | null;
    // ES features
    'Persistent Low Load Score'?: number | null;
    'Energy Inefficiency Score'?: number | null;
    'Stable QoS Confidence'?: number | null;
    'Mobility Safety Index'?: number | null;
    'Traffic Volatility Index'?: number | null;
    'Weather Sensitivity Score'?: number | null;
}

export interface NetworkScanData {
    scan_time: string;
    target_timestamp: string;
    total_cells: number;
    mro_features: CellFeatures[];
    es_features: CellFeatures[];
}

export type ModelType = 'ES' | 'MRO';

// ── Context Snapshot ────────────────────────────────────

export interface ContextSnapshotRow {
    context_snapshot_id?: string;
    cell_name?: string;
    time_bucket?: string;
    metadata?: string;
    common_sense?: string;
    kpi?: string;
    alarm?: string;
    [key: string]: unknown;
}

export interface ContextSnapshotResponse {
    total: number;
    page: number;
    page_size: number;
    columns: string[];
    data: ContextSnapshotRow[];
}

// ── SSE stream events ───────────────────────────────────

export interface SystemScanEvent {
    type: string;
    icon: string;
    text: string;
    payload?: Record<string, unknown>;
}

export interface SystemScanRequest {
    task_type: string;
    cells: string[];
    timestamp?: string;
    start_date?: string;
    end_date?: string;
    enable_web_search?: boolean;
    save_to_db?: boolean;
}
