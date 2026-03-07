import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Activity,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Loader2,
    Radio,
    RefreshCw,
    XCircle,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { streamIntentReasoning, formatTimestamp } from './api';
import type {
    ReasoningStreamEvent,
    ReasoningProgressEvent,
    ReasoningCellContextEvent,
    ReasoningCellFeaturesEvent,
    ReasoningCellDecisionEvent,
    CellReasoningData,
} from './types';

// ── helpers ─────────────────────────────────────────────

function fmtNum(v: number): string {
    return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(4);
}

// ── sub-components ──────────────────────────────────────

/** Progress timeline row */
const ProgressRow = ({ event }: { event: ReasoningProgressEvent }) => {
    const isDone = event.type === 'scan_done';
    return (
        <div
            className={cn(
                'flex items-start gap-2 px-3 py-2 rounded-md border text-sm',
                isDone
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                    : 'bg-muted/50 border-border/50',
            )}
        >
            <span className="shrink-0 text-base leading-none mt-0.5">
                {event.icon}
            </span>
            <span className="text-xs leading-relaxed text-foreground/80">
                {event.text}
            </span>
        </div>
    );
};

/** Collapsible KPI section */
const KpiSection = ({ kpi }: { kpi: Record<string, number> }) => {
    const [open, setOpen] = useState(false);
    const entries = Object.entries(kpi);

    return (
        <div className="border border-green-200 dark:border-green-800 rounded-lg p-2.5 bg-green-50/50 dark:bg-green-950/20">
            <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setOpen((p) => !p)}
            >
                <span className="text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-400">
                    KPI
                </span>
                <div className="flex items-center gap-1">
                    <Badge
                        variant="outline"
                        className="text-[10px] bg-green-100 text-green-700"
                    >
                        {entries.length} metrics
                    </Badge>
                    {open ? (
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                    ) : (
                        <ChevronRight className="size-3.5 text-muted-foreground" />
                    )}
                </div>
            </button>
            {open && (
                <div className="mt-2 space-y-0.5">
                    {entries.map(([k, v]) => (
                        <div
                            key={k}
                            className="flex items-baseline gap-1.5 text-[12px]"
                        >
                            <span className="text-muted-foreground font-medium truncate">
                                {k}:
                            </span>
                            <span className="font-mono text-foreground">
                                {fmtNum(v)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/** Collapsible Features section */
const FeaturesSection = ({
    features,
    taskType,
}: {
    features: Record<string, number>;
    taskType: string;
}) => {
    const [open, setOpen] = useState(true);
    const entries = Object.entries(features);

    return (
        <div className="border border-blue-200 dark:border-blue-800 rounded-lg p-2.5 bg-blue-50/50 dark:bg-blue-950/20">
            <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setOpen((p) => !p)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                        Features
                    </span>
                    <Badge
                        variant="outline"
                        className="text-[10px] bg-blue-100 text-blue-700"
                    >
                        {taskType}
                    </Badge>
                </div>
                {open ? (
                    <ChevronDown className="size-3.5 text-muted-foreground" />
                ) : (
                    <ChevronRight className="size-3.5 text-muted-foreground" />
                )}
            </button>
            {open && (
                <div className="mt-2 space-y-1">
                    {entries.map(([k, v]) => (
                        <div
                            key={k}
                            className="flex items-center justify-between text-[12px]"
                        >
                            <span className="text-muted-foreground font-medium truncate flex-1">
                                {k}
                            </span>
                            <span className="font-mono text-foreground ml-2">
                                {fmtNum(v)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/** Decision with explain_path visualization */
const DecisionSection = ({
    decision,
}: {
    decision: ReasoningCellDecisionEvent;
}) => {
    return (
        <div
            className={cn(
                'rounded-lg p-2.5 border',
                decision.decision
                    ? 'border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20'
                    : 'border-red-300 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20',
            )}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Decision
                </span>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                        Score: {(decision.decision_score * 100).toFixed(0)}%
                    </span>
                    <Badge
                        className={cn(
                            'text-xs',
                            decision.decision ? 'bg-green-600' : 'bg-red-600',
                        )}
                    >
                        {decision.decision ? 'Action Required' : 'No Action'}
                    </Badge>
                </div>
            </div>
            {decision.explain_path && decision.explain_path.length > 0 && (
                <div className="space-y-1 mt-2">
                    {decision.explain_path.map((step, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 text-[12px] pl-2 border-l-2 border-border"
                        >
                            {step.passed ? (
                                <CheckCircle2 className="size-3.5 text-green-600 shrink-0" />
                            ) : (
                                <XCircle className="size-3.5 text-red-400 shrink-0" />
                            )}
                            <span className="text-muted-foreground font-medium">
                                {step.featureName}
                            </span>
                            <span className="font-mono text-foreground/70">
                                {step.condition}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/** Metadata mini section */
const MetadataSection = ({
    metadata,
}: {
    metadata: Record<string, string>;
}) => {
    const entries = Object.entries(metadata);
    if (entries.length === 0) return null;

    return (
        <div className="border border-purple-200 dark:border-purple-800 rounded-lg p-2.5 bg-purple-50/50 dark:bg-purple-950/20">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 block mb-1.5">
                Metadata
            </span>
            <div className="space-y-0.5">
                {entries.map(([k, v]) => (
                    <div
                        key={k}
                        className="flex items-baseline gap-1.5 text-[12px]"
                    >
                        <span className="text-muted-foreground font-medium">
                            {k}:
                        </span>
                        <span className="font-mono text-foreground">{v}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

/** Card grouping all reasoning data for one cell */
const CellCard = ({
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
                    {data.context && (
                        <>
                            <KpiSection kpi={data.context.kpi} />
                            <MetadataSection
                                metadata={data.context.metadata}
                            />
                        </>
                    )}
                    {data.features && (
                        <FeaturesSection
                            features={data.features.features}
                            taskType={data.features.task_type}
                        />
                    )}
                    {data.decision && (
                        <DecisionSection decision={data.decision} />
                    )}
                </CardContent>
            )}
        </Card>
    );
};

// ── main component ──────────────────────────────────────

interface Props {
    cells: string[];
    taskType: string;
    timestamp?: string;
}

const LiveReasoningPanel = ({ cells, taskType, timestamp }: Props) => {
    const [events, setEvents] = useState<ReasoningStreamEvent[]>([]);
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    // Derived: progress events
    const progressEvents = useMemo(
        () =>
            events.filter(
                (e): e is ReasoningProgressEvent => e.channel === 'progress',
            ),
        [events],
    );

    // Derived: cell data grouped by cell name
    const cellDataMap = useMemo(() => {
        const map = new Map<string, CellReasoningData>();
        for (const event of events) {
            if (event.channel !== 'content') continue;
            const cellEvent = event as
                | ReasoningCellContextEvent
                | ReasoningCellFeaturesEvent
                | ReasoningCellDecisionEvent;
            const cell = cellEvent.cell;
            if (!map.has(cell)) map.set(cell, {});
            const data = map.get(cell)!;

            if (event.type === 'cell_context')
                data.context = event as ReasoningCellContextEvent;
            else if (event.type === 'cell_features')
                data.features = event as ReasoningCellFeaturesEvent;
            else if (event.type === 'cell_decision')
                data.decision = event as ReasoningCellDecisionEvent;
        }
        return map;
    }, [events]);

    const startStreaming = useCallback(() => {
        abortRef.current?.abort();
        setEvents([]);
        setError(null);
        setStreaming(true);

        const request = {
            task_type: taskType,
            cells,
            timestamp: timestamp ?? formatTimestamp(new Date()),
            enable_web_search: false,
            save_to_db: false,
        };

        const controller = streamIntentReasoning(
            request,
            (event) => setEvents((prev) => [...prev, event]),
            () => setStreaming(false),
            (err) => {
                setError(err.message);
                setStreaming(false);
            },
        );
        abortRef.current = controller;
    }, [cells, taskType, timestamp]);

    useEffect(() => {
        startStreaming();
        return () => {
            abortRef.current?.abort();
        };
    }, [startStreaming]);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, [events]);

    const cellEntries = Array.from(cellDataMap.entries());
    const isDone = progressEvents.some((e) => e.type === 'scan_done');

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                    <Radio
                        className={cn(
                            'size-4',
                            streaming
                                ? 'text-green-500 animate-pulse'
                                : 'text-muted-foreground',
                        )}
                    />
                    <h2 className="text-sm font-bold text-foreground">
                        Live Reasoning
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                        {taskType}
                    </Badge>
                    {streaming && (
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                    )}
                    {isDone && (
                        <Badge className="text-[10px] bg-green-600">
                            Complete
                        </Badge>
                    )}
                    {!streaming && events.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={startStreaming}
                            title="Reconnect stream"
                        >
                            <RefreshCw className="size-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Scrollable content */}
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-3 p-4">
                    {/* Progress timeline */}
                    {progressEvents.length > 0 && (
                        <div className="space-y-1.5">
                            {progressEvents.map((evt, i) => (
                                <ProgressRow key={i} event={evt} />
                            ))}
                        </div>
                    )}

                    {/* Streaming indicator */}
                    {streaming && !isDone && (
                        <div className="flex items-center gap-2 px-3 py-2">
                            <Loader2 className="size-4 animate-spin text-primary" />
                            <span className="text-xs text-muted-foreground">
                                Analyzing cells…
                            </span>
                        </div>
                    )}

                    {/* Cell data cards */}
                    {cellEntries.length > 0 && (
                        <div className="space-y-3 mt-2">
                            <div className="flex items-center gap-2">
                                <Zap className="size-4 text-amber-500" />
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    Cell Analysis ({cellEntries.length})
                                </span>
                            </div>
                            {cellEntries.map(([cellName, data]) => (
                                <CellCard
                                    key={cellName}
                                    cellName={cellName}
                                    data={data}
                                />
                            ))}
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="p-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
                            <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                                {error}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={startStreaming}
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!streaming && events.length === 0 && !error && (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                            <Radio className="size-10 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">
                                No reasoning data available
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={startStreaming}
                            >
                                <RefreshCw className="size-3.5 mr-1.5" />
                                Connect
                            </Button>
                        </div>
                    )}

                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
};

export default memo(LiveReasoningPanel);
