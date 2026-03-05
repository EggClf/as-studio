import { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Database,
    Eye,
    Loader2,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { streamSystemScan, formatTimestamp } from './api';
import type { SystemScanEvent, SystemScanRequest } from './types';

// ── constants ───────────────────────────────────────────

const JSON_COLUMNS = new Set(['metadata', 'common_sense', 'kpi', 'alarm']);

const PAGE_SIZE = 20;

/** Theme tokens per JSON category — uses CSS vars from the design system */
const COLUMN_THEME: Record<
    string,
    { badge: string; text: string; border: string }
> = {
    metadata: {
        badge: 'bg-primary-100 text-primary-700',
        text: 'text-primary-600',
        border: 'border-primary-200',
    },
    common_sense: {
        badge: 'bg-blue-100 text-blue-700',
        text: 'text-blue-600',
        border: 'border-blue-200',
    },
    kpi: {
        badge: 'bg-green-100 text-green-700',
        text: 'text-green-600',
        border: 'border-green-200',
    },
    alarm: {
        badge: 'bg-orange-100 text-orange-700',
        text: 'text-orange-600',
        border: 'border-orange-200',
    },
};

const DEFAULT_THEME = {
    badge: 'bg-muted text-muted-foreground',
    text: 'text-muted-foreground',
    border: 'border-border',
};

// ── helpers ─────────────────────────────────────────────

function tryParseJson(val: unknown): Record<string, unknown> | null {
    if (val == null || val === '') return null;
    const str = String(val);
    try {
        const p = JSON.parse(str);
        if (typeof p === 'object' && p !== null && !Array.isArray(p)) return p;
    } catch {
        try {
            const fixed = str.replace(/'/g, '"');
            const p = JSON.parse(fixed);
            if (typeof p === 'object' && p !== null && !Array.isArray(p))
                return p;
        } catch {
            /* not parsable */
        }
    }
    return null;
}

function formatValue(v: unknown): string {
    if (v == null) return '—';
    if (typeof v === 'number')
        return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(4);
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    return String(v);
}

function themeFor(col: string) {
    return COLUMN_THEME[col] ?? DEFAULT_THEME;
}

// ── sub-components ──────────────────────────────────────

/** Full key-value detail — rendered inside a Dialog */
const JsonDetailContent = ({
    column,
    value,
}: {
    column: string;
    value: string;
}) => {
    const t = themeFor(column);
    const parsed = tryParseJson(value);

    if (!parsed)
        return (
            <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80 bg-muted p-4 rounded-md">
                {value}
            </pre>
        );

    return (
        <div className="overflow-auto max-h-[60vh]">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase w-1/3">
                            Key
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(parsed).map(([k, v]) => (
                        <tr
                            key={k}
                            className="border-b border-border/50 hover:bg-muted/50"
                        >
                            <td
                                className={cn(
                                    'py-2 px-3 font-medium text-sm',
                                    t.text,
                                )}
                            >
                                {k}
                            </td>
                            <td className="py-2 px-3 font-mono text-sm text-foreground">
                                {typeof v === 'object' && v !== null ? (
                                    <pre className="text-xs whitespace-pre-wrap">
                                        {JSON.stringify(v, null, 2)}
                                    </pre>
                                ) : (
                                    formatValue(v)
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/** Render a JSON object as collapsible key-value card */
const JsonCard = ({
    label,
    value,
    onExpandDetail,
}: {
    label: string;
    value: unknown;
    onExpandDetail: (col: string, val: string) => void;
}) => {
    const [open, setOpen] = useState(false);
    const parsed = tryParseJson(value);
    const t = themeFor(label);

    if (!parsed) return null;

    const entries = Object.entries(parsed);

    return (
        <div className={cn('rounded-lg border p-3', t.border, 'bg-card')}>
            <button
                className="flex items-center justify-between w-full text-left"
                onClick={() => setOpen((p) => !p)}
            >
                <span
                    className={cn(
                        'text-xs font-bold uppercase tracking-wider',
                        t.text,
                    )}
                >
                    {label.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center gap-1">
                    <Badge
                        variant="outline"
                        className={cn('text-[10px]', t.badge)}
                    >
                        {entries.length} fields
                    </Badge>
                    {open ? (
                        <ChevronUp className="size-3.5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                    )}
                </div>
            </button>
            {open && (
                <div className="mt-2 space-y-1">
                    {entries.map(([k, v]) => (
                        <div
                            key={k}
                            className="flex items-baseline gap-1.5 text-[12px]"
                        >
                            <span className="text-muted-foreground font-medium truncate min-w-0 shrink-0">
                                {k}:
                            </span>
                            <span className="font-mono text-foreground truncate">
                                {typeof v === 'object' && v !== null
                                    ? JSON.stringify(v)
                                    : formatValue(v)}
                            </span>
                        </div>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-[11px] mt-1"
                        onClick={(e) => {
                            e.stopPropagation();
                            onExpandDetail(label, String(value));
                        }}
                    >
                        <Eye className="size-3 mr-1" />
                        View full detail
                    </Button>
                </div>
            )}
        </div>
    );
};

/** Streaming event row in the timeline */
const EventRow = ({ event }: { event: SystemScanEvent }) => {
    const bgClass =
        event.type === 'error'
            ? 'bg-destructive/10 border-destructive/20'
            : event.type === 'done'
              ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
              : 'bg-muted/50 border-border/50';

    return (
        <div
            className={cn(
                'flex items-start gap-2 px-3 py-2 rounded-md border text-sm',
                bgClass,
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

/** Render the final payload from the done event */
const PayloadResult = ({
    payload,
    onExpandDetail,
}: {
    payload: Record<string, unknown>;
    onExpandDetail: (col: string, val: string) => void;
}) => {
    // Separate JSON-like fields from plain fields
    const entries = Object.entries(payload);
    const jsonEntries: [string, unknown][] = [];
    const plainEntries: [string, unknown][] = [];

    for (const [k, v] of entries) {
        if (JSON_COLUMNS.has(k) || tryParseJson(v) !== null) {
            jsonEntries.push([k, v]);
        } else {
            plainEntries.push([k, v]);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Plain fields */}
            {plainEntries.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Summary
                    </p>
                    <div className="space-y-1">
                        {plainEntries.map(([k, v]) => {
                            // Render arrays as comma-joined
                            const display = Array.isArray(v)
                                ? v.length > 0
                                    ? v.join(', ')
                                    : '(none)'
                                : v != null && typeof v === 'object'
                                  ? JSON.stringify(v)
                                  : formatValue(v);
                            return (
                                <div
                                    key={k}
                                    className="flex items-baseline gap-1.5 text-[12px]"
                                >
                                    <span className="text-muted-foreground font-medium shrink-0">
                                        {k.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="font-mono text-foreground truncate">
                                        {display}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* JSON fields as collapsible cards */}
            {jsonEntries.map(([k, v]) => (
                <JsonCard
                    key={k}
                    label={k}
                    value={v}
                    onExpandDetail={onExpandDetail}
                />
            ))}
        </div>
    );
};

// ── main component ──────────────────────────────────────

interface Props {
    cellName?: string | null;
    selectedDate: Date;
}

const ContextSnapshotPanel = ({ cellName, selectedDate }: Props) => {
    const [events, setEvents] = useState<SystemScanEvent[]>([]);
    const [payload, setPayload] = useState<Record<string, unknown> | null>(
        null,
    );
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState<{
        column: string;
        value: string;
    } | null>(null);

    const abortRef = useRef<AbortController | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const startScan = useCallback(() => {
        if (!cellName) return;

        // Abort previous stream
        abortRef.current?.abort();
        setEvents([]);
        setPayload(null);
        setError(null);
        setStreaming(true);

        const request: SystemScanRequest = {
            task_type: 'MRO',
            cells: [cellName],
            timestamp: formatTimestamp(selectedDate),
            enable_web_search: false,
            save_to_db: false,
        };

        const controller = streamSystemScan(
            request,
            (event) => {
                setEvents((prev) => [...prev, event]);
                if (event.type === 'done' && event.payload) {
                    setPayload(event.payload);
                }
                if (event.type === 'error') {
                    setError(event.text);
                }
            },
            () => setStreaming(false),
            (err) => {
                setError(err.message);
                setStreaming(false);
            },
        );

        abortRef.current = controller;
    }, [cellName, selectedDate]);

    // Start scan when cell or date changes
    useEffect(() => {
        if (cellName) {
            startScan();
        } else {
            // Reset when cell deselected
            abortRef.current?.abort();
            setEvents([]);
            setPayload(null);
            setError(null);
            setStreaming(false);
        }
        return () => {
            abortRef.current?.abort();
        };
    }, [cellName, selectedDate, startScan]);

    // Auto-scroll events
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [events]);

    // ── empty state ─────────────────────────────────────
    if (!cellName) {
        return (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Database className="size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                    Select a cell to view context snapshot
                </p>
            </div>
        );
    }

    const dateStr = formatTimestamp(selectedDate).slice(0, 10);

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                    <Database className="size-5 text-primary-500" />
                    <h2 className="text-base font-semibold text-foreground">
                        Context Snapshot
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        {dateStr}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                        {cellName}
                    </Badge>
                    {!streaming && events.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={startScan}
                            title="Re-run scan"
                        >
                            <RefreshCw className="size-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Streaming events timeline */}
            <ScrollArea className="max-h-[200px]">
                <div className="flex flex-col gap-1.5">
                    {events.map((evt, i) => (
                        <EventRow key={i} event={evt} />
                    ))}
                    {streaming && (
                        <div className="flex items-center gap-2 px-3 py-2">
                            <Loader2 className="size-4 animate-spin text-primary" />
                            <span className="text-xs text-muted-foreground">
                                Processing…
                            </span>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Error retry */}
            {error && !streaming && (
                <div className="text-center">
                    <Button variant="outline" size="sm" onClick={startScan}>
                        Retry
                    </Button>
                </div>
            )}

            {/* Payload result */}
            {payload && (
                <PayloadResult
                    payload={payload}
                    onExpandDetail={(col, val) =>
                        setModal({ column: col, value: val })
                    }
                />
            )}

            {/* JSON detail dialog */}
            <Dialog
                open={!!modal}
                onOpenChange={(open) => !open && setModal(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="size-4" />
                            {modal?.column
                                .replace(/_/g, ' ')
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </DialogTitle>
                    </DialogHeader>
                    {modal && (
                        <JsonDetailContent
                            column={modal.column}
                            value={modal.value}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default memo(ContextSnapshotPanel);
