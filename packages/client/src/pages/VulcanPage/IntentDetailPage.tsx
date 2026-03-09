import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Edit3,
    FileText,
    Pause,
    Radio,
    Search,
    XCircle,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    fetchIntentDetail,
    fetchIntentCells,
    fetchIntentDecisions,
    fetchIntentDispatch,
    streamIntentReasoning,
    formatTimestamp,
} from './api';
import type {
    IntentDetail,
    TargetCell,
    IntentCellDecision,
    DispatchRecord,
    ReasoningStreamEvent,
    ReasoningProgressEvent,
    ReasoningCellContextEvent,
    ReasoningCellFeaturesEvent,
    ReasoningCellDecisionEvent,
    ReasoningPlanFieldEvent,
    CellReasoningData,
} from './types';
import LiveReasoningPanel from './LiveReasoningPanel';

// ── helpers ─────────────────────────────────────────────

function formatDate(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

type IntentStatus = 'active' | 'completed' | 'failed';

function deriveStatus(detail: IntentDetail): IntentStatus {
    if (detail.end_time == null) return 'active';
    if (detail.duration_hours != null && detail.duration_hours >= 0)
        return 'completed';
    return 'failed';
}

function statusConfig(s: IntentStatus) {
    const map = {
        active: {
            label: 'Active',
            cls: 'bg-green-100 text-green-800 border-green-300',
        },
        completed: {
            label: 'Completed',
            cls: 'bg-blue-100 text-blue-800 border-blue-300',
        },
        failed: {
            label: 'Failed',
            cls: 'bg-red-100 text-red-800 border-red-300',
        },
    };
    return map[s];
}

function cellStatusLabel(
    decision: boolean | null,
    score: number | null,
): { label: string; cls: string; icon: React.ReactNode } {
    if (decision === true)
        return {
            label: 'Online',
            cls: 'text-green-700',
            icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />,
        };
    if (decision === false)
        return {
            label: 'Degraded',
            cls: 'text-amber-700',
            icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
        };
    if (score == null)
        return {
            label: 'Maintenance',
            cls: 'text-muted-foreground',
            icon: <span className="w-3.5 h-3.5" />,
        };
    return {
        label: 'Pending',
        cls: 'text-muted-foreground',
        icon: <Activity className="w-3.5 h-3.5 text-muted-foreground" />,
    };
}

// ── Decision Tree Visualization ─────────────────────────

interface TreeNodeData {
    label: string;
    children?: TreeNodeData[];
    type?: 'root' | 'decision' | 'filter' | 'result' | 'match';
}

function buildDecisionTree(
    decisions: IntentCellDecision[],
    taskType: string,
): TreeNodeData {
    const approved = decisions.filter((d) => d.decision);
    const rejected = decisions.filter((d) => !d.decision);

    return {
        label: `${taskType} Intent Analysis`,
        type: 'root',
        children: [
            {
                label: 'Cell Thresholds',
                type: 'decision',
                children: [
                    {
                        label: 'Filter by Thresholds',
                        type: 'filter',
                        children: [
                            {
                                label: `Prioritize by Score`,
                                type: 'decision',
                                children: [
                                    {
                                        label: `${approved.length} Approved`,
                                        type: 'match',
                                    },
                                    ...(rejected.length > 0
                                        ? [
                                              {
                                                  label: `${rejected.length} Excluded`,
                                                  type: 'result' as const,
                                              },
                                          ]
                                        : []),
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Filter KPI Thresholds',
                        type: 'filter',
                        children: [
                            {
                                label: 'Matches',
                                type: 'match',
                            },
                        ],
                    },
                ],
            },
        ],
    };
}

function TreeNode({
    node,
    depth = 0,
}: {
    node: TreeNodeData;
    depth?: number;
}) {
    const [expanded, setExpanded] = useState(depth < 3);

    const bgMap: Record<string, string> = {
        root: 'bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800',
        decision: 'bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800',
        filter: 'bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-800',
        result: 'bg-gray-50 border-gray-300 dark:bg-gray-950/30 dark:border-gray-700',
        match: 'bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-800',
    };

    const iconMap: Record<string, React.ReactNode> = {
        root: <AlertTriangle className="w-4 h-4 text-red-600" />,
        decision: <Activity className="w-4 h-4 text-amber-600" />,
        filter: <XCircle className="w-4 h-4 text-red-500" />,
        result: <ChevronRight className="w-4 h-4 text-gray-500" />,
        match: <CheckCircle2 className="w-4 h-4 text-green-600" />,
    };

    const nodeType = node.type ?? 'decision';
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="flex flex-col items-center">
            <div
                className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer select-none transition-colors',
                    bgMap[nodeType],
                )}
                onClick={() => hasChildren && setExpanded(!expanded)}
            >
                {iconMap[nodeType]}
                <span className="text-foreground text-xs">{node.label}</span>
                {hasChildren && (
                    <span className="text-muted-foreground">
                        {expanded ? (
                            <ChevronDown className="w-3 h-3" />
                        ) : (
                            <ChevronRight className="w-3 h-3" />
                        )}
                    </span>
                )}
            </div>

            {expanded && hasChildren && (
                <div className="flex flex-col items-center">
                    <div className="w-px h-6 bg-border" />
                    <div className="flex gap-6">
                        {node.children!.map((child, i) => (
                            <div key={i} className="flex flex-col items-center">
                                {node.children!.length > 1 && (
                                    <div className="w-px h-4 bg-border" />
                                )}
                                <TreeNode node={child} depth={depth + 1} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Cell Analysis Card (content events) ─────────────────

function fmtNum(v: number): string {
    return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(4);
}

const CellAnalysisCard = ({
    cellName,
    data,
}: {
    cellName: string;
    data: CellReasoningData;
}) => {
    const [expanded, setExpanded] = useState(true);

    return (
        <Card className="overflow-hidden">
            <button
                className="flex items-center justify-between w-full px-4 py-3 hover:bg-accent/50 transition-colors"
                onClick={() => setExpanded((p) => !p)}
            >
                <div className="flex items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    <span className="font-mono text-sm font-semibold text-foreground">
                        {cellName}
                    </span>
                    {data.context?.ne_name && (
                        <Badge variant="secondary" className="text-[10px]">
                            {data.context.ne_name}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {data.decision && (
                        <Badge
                            className={cn(
                                'text-[10px]',
                                data.decision.decision
                                    ? 'bg-green-600'
                                    : 'bg-gray-500',
                            )}
                        >
                            {data.decision.decision ? 'Action' : 'Pass'}
                        </Badge>
                    )}
                    {expanded ? (
                        <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                </div>
            </button>

            {expanded && (
                <CardContent className="px-4 pb-4 pt-0 space-y-2">
                    {/* KPI */}
                    {data.context && (
                        <div className="border border-green-200 dark:border-green-800 rounded-lg p-2.5 bg-green-50/50 dark:bg-green-950/20">
                            <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400 block mb-1.5">
                                KPI
                            </span>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                                {Object.entries(data.context.kpi).map(([k, v]) => (
                                    <div key={k} className="flex items-baseline gap-1.5 text-[12px]">
                                        <span className="text-muted-foreground font-medium truncate">{k}:</span>
                                        <span className="font-mono text-foreground">{fmtNum(v)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    {data.context && Object.keys(data.context.metadata).length > 0 && (
                        <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-2.5 bg-purple-50/50 dark:bg-purple-950/20">
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1.5">
                                Metadata
                            </span>
                            <div className="space-y-0.5">
                                {Object.entries(data.context.metadata).map(([k, v]) => (
                                    <div key={k} className="flex items-baseline gap-1.5 text-[12px]">
                                        <span className="text-muted-foreground font-medium">{k}:</span>
                                        <span className="font-mono text-foreground">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    {data.features && (
                        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 bg-blue-50/50 dark:bg-blue-950/20">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                    Features
                                </span>
                                <Badge variant="outline" className="text-[10px] bg-blue-100 text-blue-700">
                                    {data.features.task_type}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                {Object.entries(data.features.features).map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between text-[12px]">
                                        <span className="text-muted-foreground font-medium truncate flex-1">{k}</span>
                                        <span className="font-mono text-foreground ml-2">{fmtNum(v)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Decision */}
                    {data.decision && (
                        <div
                            className={cn(
                                'rounded-lg p-2.5 border',
                                data.decision.decision
                                    ? 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20'
                                    : 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20',
                            )}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Decision</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-muted-foreground">
                                        Score: {(data.decision.decision_score * 100).toFixed(0)}%
                                    </span>
                                    <Badge className={cn('text-xs', data.decision.decision ? 'bg-green-600' : 'bg-red-600')}>
                                        {data.decision.decision ? 'Action Required' : 'No Action'}
                                    </Badge>
                                </div>
                            </div>
                            {data.decision.explain_path?.length > 0 && (
                                <div className="space-y-1 mt-2">
                                    {data.decision.explain_path.map((step, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[12px] pl-2 border-l-2 border-border">
                                            {step.passed ? (
                                                <CheckCircle2 className="size-3.5 text-green-600 shrink-0" />
                                            ) : (
                                                <XCircle className="size-3.5 text-red-400 shrink-0" />
                                            )}
                                            <span className="text-muted-foreground font-medium">{step.featureName}</span>
                                            <span className="font-mono text-foreground/70">{step.condition}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

// ── Plan Field Table ────────────────────────────────────

const PlanFieldCard = ({ plan }: { plan: ReasoningPlanFieldEvent }) => {
    const rows = plan.value.data;
    if (!rows || rows.length === 0) return null;

    const columns = Object.keys(rows[0]);

    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="size-4 text-amber-500" />
                        <h3 className="text-base font-bold text-foreground">
                            Action Plan
                        </h3>
                        <Badge variant="secondary" className="text-[10px]">
                            {plan.task_type}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                            {plan.key}
                        </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                        {plan.value.file_path}
                    </span>
                </div>
                <div className="border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-muted z-10">
                                <tr>
                                    {columns.map((col) => (
                                        <th
                                            key={col}
                                            className="text-left py-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border whitespace-nowrap"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col}
                                                className="py-1.5 px-3 font-mono text-sm text-foreground whitespace-nowrap"
                                            >
                                                {typeof row[col] === 'number'
                                                    ? Number.isInteger(row[col])
                                                        ? row[col]
                                                        : (row[col] as number).toFixed(4)
                                                    : String(row[col] ?? '—')}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                    {plan.value.shape[0]} rows × {plan.value.shape[1]} columns
                </p>
            </CardContent>
        </Card>
    );
};

// ── Main page component ─────────────────────────────────

const IntentDetailPage = () => {
    const { intentId } = useParams<{ intentId: string }>();
    const navigate = useNavigate();

    // Data
    const [detail, setDetail] = useState<IntentDetail | null>(null);
    const [cells, setCells] = useState<TargetCell[]>([]);
    const [decisions, setDecisions] = useState<IntentCellDecision[]>([]);
    const [dispatches, setDispatches] = useState<DispatchRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [cellSearch, setCellSearch] = useState('');
    const [showLogicDetails, setShowLogicDetails] = useState(false);
    const [showReasoning, setShowReasoning] = useState(true);

    // Stream state — uses a ref-based buffer to avoid re-rendering on every
    // single SSE event.  Events are collected in the buffer and flushed to
    // React state at most once per animation frame so the UI stays responsive.
    const [streamEvents, setStreamEvents] = useState<ReasoningStreamEvent[]>([]);
    const [streaming, setStreaming] = useState(false);
    const [streamError, setStreamError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const eventBufferRef = useRef<ReasoningStreamEvent[]>([]);
    const rafRef = useRef<number>(0);

    // Flush buffered events into React state (called via requestAnimationFrame)
    const flushEvents = useCallback(() => {
        rafRef.current = 0;
        const pending = eventBufferRef.current;
        if (pending.length === 0) return;
        eventBufferRef.current = [];
        console.log('[SSE-DEBUG] flushEvents → React state', {
            count: pending.length,
            channels: pending.map(e => `${(e as any).channel}:${e.type}`),
        });
        setStreamEvents((prev) => [...prev, ...pending]);
    }, []);

    // Enqueue a single SSE event — no setState, just buffer + schedule RAF
    const enqueueEvent = useCallback(
        (event: ReasoningStreamEvent) => {
            eventBufferRef.current.push(event);
            if (!rafRef.current) {
                rafRef.current = requestAnimationFrame(flushEvents);
            }
        },
        [flushEvents],
    );

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    // Derived: progress events for the right panel
    const progressEvents = useMemo(() => {
        const filtered = streamEvents.filter((e): e is ReasoningProgressEvent => e.channel === 'progress');
        console.log('[SSE-DEBUG] progressEvents derived', {
            totalStreamEvents: streamEvents.length,
            progressCount: filtered.length,
            allChannels: [...new Set(streamEvents.map(e => (e as any).channel))],
            allTypes: [...new Set(streamEvents.map(e => e.type))],
        });
        return filtered;
    }, [streamEvents]);

    // Derived: cell data grouped by cell name
    const cellDataMap = useMemo(() => {
        const map = new Map<string, CellReasoningData>();
        for (const event of streamEvents) {
            if (event.channel !== 'content') continue;
            if (event.type === 'plan_field') continue;
            const cellEvent = event as ReasoningCellContextEvent | ReasoningCellFeaturesEvent | ReasoningCellDecisionEvent;
            const cell = cellEvent.cell;
            if (!map.has(cell)) map.set(cell, {});
            const data = map.get(cell)!;
            if (event.type === 'cell_context') data.context = event as ReasoningCellContextEvent;
            else if (event.type === 'cell_features') data.features = event as ReasoningCellFeaturesEvent;
            else if (event.type === 'cell_decision') data.decision = event as ReasoningCellDecisionEvent;
        }
        return map;
    }, [streamEvents]);

    // Derived: plan field events
    const planFields = useMemo(
        () => streamEvents.filter((e): e is ReasoningPlanFieldEvent => e.channel === 'content' && e.type === 'plan_field'),
        [streamEvents],
    );

    const startStreaming = useCallback(() => {
        abortRef.current?.abort();
        // Flush any pending RAF and reset buffers
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
        }
        eventBufferRef.current = [];
        setStreamEvents([]);
        setStreamError(null);
        setStreaming(true);

        const cellNames = cells.map((c) => c.cell_name);
        if (cellNames.length === 0) {
            setStreaming(false);
            return;
        }

        const request = {
            task_type: detail?.task_type ?? 'MRO',
            cells: cellNames,
            timestamp: detail?.start_time ?? formatTimestamp(new Date()),
            enable_web_search: false,
            save_to_db: false,
        };

        console.log('[SSE-DEBUG] startStreaming called', { cellNames, request });
        const controller = streamIntentReasoning(
            request,
            enqueueEvent,
            () => {
                // Flush any remaining buffered events before marking done
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                    rafRef.current = 0;
                }
                const pending = eventBufferRef.current;
                if (pending.length > 0) {
                    eventBufferRef.current = [];
                    setStreamEvents((prev) => [...prev, ...pending]);
                }
                setStreaming(false);
            },
            (err) => {
                setStreamError(err.message);
                setStreaming(false);
            },
        );
        abortRef.current = controller;
    }, [cells, detail, enqueueEvent]);

    // Auto-start streaming once data loaded
    useEffect(() => {
        if (detail && cells.length > 0 && showReasoning) {
            startStreaming();
        }
        return () => {
            abortRef.current?.abort();
        };
    }, [detail, cells.length, showReasoning, startStreaming]);

    // Load all data
    const loadData = useCallback(async () => {
        if (!intentId) return;
        setLoading(true);
        setError(null);
        try {
            const [d, c, dec, disp] = await Promise.all([
                fetchIntentDetail(intentId),
                fetchIntentCells(intentId),
                fetchIntentDecisions(intentId),
                fetchIntentDispatch(intentId),
            ]);
            setDetail(d);
            setCells(c);
            setDecisions(dec);
            setDispatches(disp);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [intentId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Filtered cells
    const filteredCells = useMemo(() => {
        if (!cellSearch) return cells;
        const q = cellSearch.toLowerCase();
        return cells.filter((c) => c.cell_name.toLowerCase().includes(q));
    }, [cells, cellSearch]);

    // Decision map for quick lookup
    const decisionMap = useMemo(() => {
        const m = new Map<string, IntentCellDecision>();
        for (const d of decisions) m.set(d.cell_name, d);
        return m;
    }, [decisions]);

    // ── Loading ─────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-40 w-full" />
                <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-80" />
                    <Skeleton className="h-80" />
                </div>
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="self-start"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Intents
                </Button>
                <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg text-center">
                    <XCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                        Intent Not Found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {error ?? `Could not load intent "${intentId}"`}
                    </p>
                    <Button variant="outline" className="mt-4" onClick={loadData}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    const status = deriveStatus(detail);
    const sc = statusConfig(status);

    return (
        <div className="flex h-full overflow-hidden">
        <div className={cn("flex-1 flex flex-col gap-6 p-6 h-full overflow-auto min-w-0")}>
            {/* ── Back button ────────────────────────────── */}
            <Button
                variant="ghost"
                size="sm"
                className="self-start -mb-2"
                onClick={() => navigate(-1)}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Intents
            </Button>

            {/* ── Header ─────────────────────────────────── */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-foreground">
                                    Intent {detail.intent_id}
                                </h1>
                                <span
                                    className={cn(
                                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border',
                                        sc.cls,
                                    )}
                                >
                                    {sc.label}
                                </span>
                            </div>
                            {detail.note && (
                                <p className="text-sm text-muted-foreground max-w-xl">
                                    {detail.note}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant={showReasoning ? 'secondary' : 'default'}
                                size="sm"
                                onClick={() => setShowReasoning((prev) => !prev)}
                            >
                                <Radio className="w-4 h-4 mr-1.5" />
                                {showReasoning ? 'Hide Reasoning' : 'Live Reasoning'}
                            </Button>
                            <Button variant="outline" size="sm">
                                <Edit3 className="w-4 h-4 mr-1.5" />
                                Edit Intent
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                            >
                                <Pause className="w-4 h-4 mr-1.5" />
                                Pause Intent
                            </Button>
                        </div>
                    </div>

                    {/* Metadata row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-4 border-t border-border">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                                Actor
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {detail.actor}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                                Task Type
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {detail.task_type}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                                Created
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                                {formatDate(detail.created_at)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                                Target KPIs JSON
                            </p>
                            {detail.kpi ? (
                                <p className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                                    {JSON.stringify(detail.kpi)}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground/50">
                                    —
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Two-panel layout ───────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Left — Target Cells Table */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-bold text-foreground">
                                    Target Cells
                                </h2>
                                <Badge variant="secondary" className="text-xs">
                                    {cells.length}
                                </Badge>
                            </div>
                            <div className="relative w-48">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                                <Input
                                    placeholder="Search cells..."
                                    value={cellSearch}
                                    onChange={(e) =>
                                        setCellSearch(e.target.value)
                                    }
                                    className="pl-8 h-8 text-xs"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <div className="border border-border rounded-lg overflow-hidden">
                            <div className="grid grid-cols-12 gap-1 px-4 py-2.5 bg-muted text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
                                <div className="col-span-1">SEQ</div>
                                <div className="col-span-3">Cell ID</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2 text-right">
                                    Latency
                                </div>
                                <div className="col-span-2 text-right">
                                    Throughput
                                </div>
                                <div className="col-span-2 text-center">
                                    Actions
                                </div>
                            </div>

                            <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
                                {filteredCells.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No cells found
                                    </p>
                                ) : (
                                    filteredCells.map((cell) => {
                                        const dec = decisionMap.get(
                                            cell.cell_name,
                                        );
                                        const st = cellStatusLabel(
                                            cell.decision,
                                            cell.decision_score,
                                        );

                                        // Derive latency/throughput from decision score
                                        const latency =
                                            cell.decision_score != null
                                                ? `${Math.round(cell.decision_score * 50)} ms`
                                                : '—';
                                        const throughput =
                                            cell.decision_score != null
                                                ? `${Math.round(cell.decision_score * 1000)} Mbps`
                                                : '—';

                                        const isDegraded =
                                            cell.decision === false;

                                        return (
                                            <div
                                                key={cell.cell_name}
                                                className={cn(
                                                    'grid grid-cols-12 gap-1 px-4 py-2.5 text-sm transition-colors hover:bg-accent/50',
                                                    isDegraded &&
                                                        'bg-red-50/30 dark:bg-red-950/10',
                                                )}
                                            >
                                                <div className="col-span-1 text-muted-foreground text-xs flex items-center">
                                                    {cell.sequence_order}
                                                </div>
                                                <div className="col-span-3 flex items-center">
                                                    <span
                                                        className={cn(
                                                            'font-mono text-sm',
                                                            isDegraded
                                                                ? 'text-red-600 font-semibold'
                                                                : 'text-foreground',
                                                        )}
                                                    >
                                                        {cell.cell_name}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 flex items-center gap-1.5">
                                                    {st.icon}
                                                    <span
                                                        className={cn(
                                                            'text-xs font-medium',
                                                            st.cls,
                                                        )}
                                                    >
                                                        {st.label}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-right flex items-center justify-end">
                                                    <span
                                                        className={cn(
                                                            'text-sm',
                                                            isDegraded
                                                                ? 'text-red-600 font-semibold'
                                                                : 'text-foreground',
                                                        )}
                                                    >
                                                        {latency}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-right flex items-center justify-end">
                                                    <span
                                                        className={cn(
                                                            'text-sm',
                                                            isDegraded
                                                                ? 'text-red-600 font-semibold'
                                                                : 'text-foreground',
                                                        )}
                                                    >
                                                        {throughput}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 flex items-center justify-center">
                                                    {dec && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-6 text-xs"
                                                        >
                                                            <ChevronRight className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right — Cell Targeting Decision Tree */}
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-foreground">
                                Cell Targeting Decision Tree
                            </h2>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                                    +
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                                    −
                                </Button>
                            </div>
                        </div>

                        {/* Decision Tree Visualization */}
                        <div className="min-h-[300px] flex items-center justify-center py-6 overflow-auto">
                            {decisions.length > 0 ? (
                                <TreeNode
                                    node={buildDecisionTree(
                                        decisions,
                                        detail.task_type,
                                    )}
                                />
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">
                                        No decisions available yet
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* View Logic Details accordion */}
                        <div className="border-t border-border pt-4 mt-4">
                            <button
                                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors w-full"
                                onClick={() =>
                                    setShowLogicDetails(!showLogicDetails)
                                }
                            >
                                {showLogicDetails ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                                View Logic Details
                            </button>

                            {showLogicDetails && (
                                <div className="mt-3 space-y-3">
                                    {decisions.map((dec) => (
                                        <div
                                            key={dec.cell_name}
                                            className="p-3 rounded-lg border border-border bg-muted/30"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono text-sm font-semibold text-foreground">
                                                    {dec.cell_name}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'text-xs font-bold px-2 py-0.5 rounded',
                                                        dec.decision
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700',
                                                    )}
                                                >
                                                    {dec.decision
                                                        ? 'Approved'
                                                        : 'Rejected'}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                <div>
                                                    <span className="text-muted-foreground">
                                                        Score:{' '}
                                                    </span>
                                                    <span className="font-semibold">
                                                        {(
                                                            dec.decision_score *
                                                            100
                                                        ).toFixed(1)}
                                                        %
                                                    </span>
                                                </div>
                                                {dec.model_version && (
                                                    <div>
                                                        <span className="text-muted-foreground">
                                                            Model:{' '}
                                                        </span>
                                                        <span className="font-mono">
                                                            {dec.model_version}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {dec.explain_path &&
                                                dec.explain_path.length > 0 && (
                                                    <pre className="mt-2 text-[10px] bg-background p-2 rounded border border-border overflow-x-auto">
                                                        {JSON.stringify(
                                                            dec.explain_path,
                                                            null,
                                                            2,
                                                        )}
                                                    </pre>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bottom toolbar */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                            <Button variant="outline" size="sm" className="text-xs">
                                Zoom in
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                                Breakpoints
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                className="text-xs ml-auto"
                            >
                                View Details
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Dispatch Records ───────────────────────── */}
            {dispatches.length > 0 && (
                <Card>
                    <CardContent className="p-5">
                        <h2 className="text-base font-bold text-foreground mb-4">
                            Tactical Dispatch Records
                        </h2>
                        <div className="space-y-3">
                            {dispatches.map((d) => (
                                <div
                                    key={d.dispatch_id}
                                    className="p-4 border border-border rounded-lg bg-muted/20"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <p className="font-mono text-sm font-semibold text-foreground">
                                                {d.dispatch_id}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {d.tactical_agent_endpoint}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {d.task_type}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {d.target_cells.map((c) => (
                                            <span
                                                key={c}
                                                className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2">
                                        Created: {formatDate(d.created_at)} |
                                        Updated: {formatDate(d.updated_at)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* ── Cell Analysis (bottom-left) & Plan Field (bottom-center) ── */}
            {showReasoning && (cellDataMap.size > 0 || planFields.length > 0) && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Cell Analysis */}
                    {cellDataMap.size > 0 && (
                        <Card>
                            <CardContent className="p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="size-4 text-amber-500" />
                                    <h2 className="text-base font-bold text-foreground">
                                        Cell Analysis
                                    </h2>
                                    <Badge variant="secondary" className="text-xs">
                                        {cellDataMap.size}
                                    </Badge>
                                </div>
                                <ScrollArea className="max-h-[500px]">
                                    <div className="space-y-3">
                                        {Array.from(cellDataMap.entries()).map(([cellName, data]) => (
                                            <CellAnalysisCard
                                                key={cellName}
                                                cellName={cellName}
                                                data={data}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    )}

                    {/* Plan Field */}
                    {planFields.length > 0 && (
                        <div className="space-y-6">
                            {planFields.map((plan, i) => (
                                <PlanFieldCard key={i} plan={plan} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Stream error */}
            {streamError && (
                <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                    <p className="text-sm text-red-700 dark:text-red-400 mb-2">{streamError}</p>
                    <Button variant="outline" size="sm" onClick={startStreaming}>
                        Retry
                    </Button>
                </div>
            )}
        </div>

        {/* ── Live Reasoning Panel (right sidebar — progress only) ── */}
        {showReasoning && (
            <div className="w-[420px] border-l border-border shrink-0 bg-background hidden xl:flex">
                <LiveReasoningPanel
                    events={progressEvents}
                    streaming={streaming}
                    taskType={detail.task_type}
                    onReconnect={startStreaming}
                />
            </div>
        )}
        </div>
    );
};

export default IntentDetailPage;
