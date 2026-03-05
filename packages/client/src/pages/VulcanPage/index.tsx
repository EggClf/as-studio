import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PageTitleSpan from '@/components/spans/PageTitleSpan';
import { Activity } from 'lucide-react';
import NetworkCellsTable from './NetworkCellsTable';
import ContextSnapshotPanel from './ContextSnapshotPanel';
import DecisionTreeTracePanel from './DecisionTreeTracePanel';
import PlannerOutputPanel from './PlannerOutputPanel';
import {
    fetchNetworkScan,
    extractMLFeatures,
    fetchDecisionTreeTrace,
    fetchBatchDecisionTraces,
    fetchPlanData,
} from './api';
import type {
    CellFeatures,
    ModelType,
    DecisionTreeTrace,
    BatchTraceResult,
    PlanLoadResponse,
} from './types';

// ── helpers ──────────────────────────────────────────────

function formatDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

// ── Page ─────────────────────────────────────────────────

const VulcanPage = () => {
    // TODO: revert to new Date() when switching to live data
    const [selectedDate] = useState<Date>(() => new Date('2026-02-04T10:00:00'));
    const [selectedModel] = useState<ModelType>('ES');

    // Network cells
    const [cells, setCells] = useState<CellFeatures[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCell, setSelectedCell] = useState<CellFeatures | null>(null);

    // Decision trace (single cell)
    const [decisionTrace, setDecisionTrace] = useState<DecisionTreeTrace | null>(null);
    const [decisionTraceLoading, setDecisionTraceLoading] = useState(false);

    // Batch trace
    const [batchResult, setBatchResult] = useState<BatchTraceResult | null>(null);
    const [batchLoading, setBatchLoading] = useState(false);

    // Plan data
    const [planData, setPlanData] = useState<PlanLoadResponse | null>(null);
    const [planLoading, setPlanLoading] = useState(false);

    // ── Load network cells ──────────────────────────────
    const loadCells = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchNetworkScan(selectedDate);
            const map = new Map<string, CellFeatures>();
            for (const c of data.mro_features) map.set(c.cellname, { ...c });
            for (const c of data.es_features) {
                const existing = map.get(c.cellname);
                if (existing) {
                    for (const [k, v] of Object.entries(c)) {
                        if (v != null)
                            (existing as unknown as Record<string, unknown>)[k] = v;
                    }
                } else {
                    map.set(c.cellname, { ...c });
                }
            }
            setCells(Array.from(map.values()));
        } catch (err) {
            console.error('Failed to load network cells:', err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    // ── Load plan data ──────────────────────────────────
    const loadPlan = useCallback(async () => {
        setPlanLoading(true);
        try {
            const plan = await fetchPlanData(selectedModel, formatDateStr(selectedDate));
            setPlanData(plan);
        } catch (err) {
            console.error('Failed to load plan data:', err);
            setPlanData(null);
        } finally {
            setPlanLoading(false);
        }
    }, [selectedDate, selectedModel]);

    useEffect(() => { loadCells(); }, [loadCells]);
    useEffect(() => { loadPlan(); }, [loadPlan]);

    // ── Single-cell click → decision trace ─────────────
    const handleCellClick = useCallback(async (cell: CellFeatures) => {
        setSelectedCell(cell);
        setBatchResult(null);
        setDecisionTraceLoading(true);
        try {
            const features = extractMLFeatures(cell, selectedModel);
            const trace = await fetchDecisionTreeTrace(
                cell.intent_id || cell.cellname,
                selectedModel,
                features,
            );
            setDecisionTrace(trace);
        } catch (err) {
            console.error('Decision trace failed:', err);
            setDecisionTrace(null);
        } finally {
            setDecisionTraceLoading(false);
        }
    }, [selectedModel]);

    // ── Batch predict ───────────────────────────────────
    const handleBatchPredict = useCallback(async (validCells: CellFeatures[]) => {
        setBatchLoading(true);
        setDecisionTrace(null);
        setSelectedCell(null);
        try {
            const batchCells = validCells.map((c) => ({
                cell_id: c.cellname,
                features: extractMLFeatures(c, selectedModel),
            }));
            const result = await fetchBatchDecisionTraces(selectedModel, batchCells);
            setBatchResult(result);
        } catch (err) {
            console.error('Batch trace failed:', err);
            setBatchResult(null);
        } finally {
            setBatchLoading(false);
        }
    }, [selectedModel]);

    // ── Render ──────────────────────────────────────────
    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
            <PageTitleSpan title="Context Snapshot" />

            <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
                {/* Left — Context Snapshot */}
                <Card className="xl:max-h-[calc(100vh-140px)] overflow-hidden">
                    <CardContent className="p-4 overflow-auto max-h-[calc(100vh-160px)]">
                        <ContextSnapshotPanel
                            cellName={selectedCell?.cellname}
                            selectedDate={selectedDate}
                        />
                    </CardContent>
                </Card>

                {/* Right — Network Cells Table */}
                <Card>
                    <CardContent className="p-4">
                        <NetworkCellsTable
                            cells={cells}
                            selectedModel={selectedModel}
                            loading={loading}
                            selectedCellName={selectedCell?.cellname}
                            onCellClick={handleCellClick}
                            onBatchPredict={handleBatchPredict}
                            batchLoading={batchLoading}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Selected cell banner */}
            {selectedCell && (
                <div className={`p-3 border-2 rounded-lg ${selectedModel === 'ES' ? 'bg-green-500 border-green-600' : 'bg-blue-500 border-blue-600'}`}>
                    <div className="text-sm font-semibold text-white">
                        📍 Viewing {selectedModel} analysis for Cell:{' '}
                        <span className="font-mono">{selectedCell.cellname}</span>
                        {' '}(NE: {selectedCell.ne_name})
                    </div>
                </div>
            )}

            {/* Decision Tree Trace */}
            {decisionTraceLoading ? (
                <div className="bg-card rounded-lg border border-border shadow-sm p-8">
                    <div className="flex items-center justify-center gap-3">
                        <Activity className="w-6 h-6 animate-pulse text-primary" />
                        <span className="text-muted-foreground">Loading decision trace from ML model…</span>
                    </div>
                </div>
            ) : batchResult || decisionTrace ? (
                <DecisionTreeTracePanel
                    trace={decisionTrace ?? undefined}
                    batchResult={batchResult ?? undefined}
                />
            ) : (
                <div className="bg-card rounded-lg border border-border shadow-sm p-8 text-center text-muted-foreground">
                    <Activity className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Analysis Selected</h3>
                    <p className="text-sm">
                        Click any cell above to run ML prediction, or use{' '}
                        <strong>Run All</strong> to process all cells at once.
                    </p>
                </div>
            )}

            {/* Action Planner */}
            <PlannerOutputPanel planResponse={planData} loading={planLoading} />
        </div>
    );
};

export default VulcanPage;

