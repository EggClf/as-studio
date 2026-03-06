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

// ── Decision Tree / ML Model ────────────────────────────

export type IntentLabel = 'MRO' | 'ES';

export interface DecisionTreeNode {
    nodeId: number;
    condition: string;
    threshold: number;
    featureValue: number;
    featureName: string;
    passed: boolean;
}

export interface DecisionTreeTrace {
    intentId: string;
    intentLabel: IntentLabel;
    decision?: boolean;
    confidence?: number;
    path: DecisionTreeNode[];
    topFeatures: { name: string; value: number; importance: number }[];
    counterfactual: {
        feature: string;
        currentValue: number;
        thresholdValue: number;
        alternativeIntent: IntentLabel;
    }[];
    featureSnapshot: Record<string, number>;
}

export interface CellDecisionResult {
    cellId: string;
    modelType: IntentLabel;
    decision: boolean | null;
    confidence: number | null;
    probabilities: number[] | null;
    path: DecisionTreeNode[];
    topFeatures: { name: string; value: number; importance: number }[];
    counterfactual: {
        feature: string;
        currentValue: number;
        thresholdValue: number;
        alternativeIntent: IntentLabel;
    }[];
    featureSnapshot: Record<string, number>;
    error: string | null;
}

export interface BatchTraceResult {
    modelType: IntentLabel;
    totalCells: number;
    appliedCount: number;
    notAppliedCount: number;
    errorCount: number;
    results: CellDecisionResult[];
    timestamp: string;
}

// ── Plan Data ────────────────────────────────────────────

export interface ESScheduleEntry {
    hour: number;
    [cellname: string]: number;
}

export interface ESForecastEntry {
    hour: number;
    [cellname: string]: number;
}

export interface ESPlanData {
    schedule: ESScheduleEntry[];
    forecast: ESForecastEntry[];
}

export interface MROConfigPlanEntry {
    hour: number;
    hom: number;
    ttt: number;
    predicted_hos: number;
}

export interface MROPlanData {
    cell_names: string[];
    config_plan: MROConfigPlanEntry[];
}

export interface PlanLoadResponse {
    task_type: 'MRO' | 'ES';
    date: string;
    data: ESPlanData | MROPlanData;
}

// ── Intent Management (Vulcan Agent API) ────────────────

export interface IntentSummary {
    intent_id: string;
    actor: string;
    task_type: string;
    target_type: string;
    target_count: number;
    start_time: string | null;
    end_time: string | null;
    execution_mode: string | null;
    has_trigger: boolean;
    has_kpi: boolean;
    duration_hours: number | null;
    time_bucket: string;
    created_at: string;
}

export interface IntentDetail extends IntentSummary {
    trigger: Record<string, unknown> | null;
    kpi: Record<string, unknown> | null;
    note: string | null;
}

export interface TargetCell {
    cell_name: string;
    sequence_order: number;
    decision: boolean | null;
    decision_score: number | null;
}

export interface IntentCellDecision {
    cell_name: string;
    decision: boolean;
    decision_score: number;
    explain_path: Record<string, unknown>[] | null;
    model_version: string | null;
    context_snapshot_id: string | null;
    created_at: string;
}

export interface DispatchRecord {
    dispatch_id: string;
    task_type: string;
    tactical_agent_endpoint: string;
    target_cells: string[];
    tactical_response: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}
