import { memo, useCallback, useEffect, useState } from 'react';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Database,
    Eye,
    Loader2,
    SearchIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { fetchContextSnapshot } from './api';
import type { ContextSnapshotResponse, ContextSnapshotRow } from './types';

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

const MAX_INLINE_KEYS = 4;

const JsonChips = ({
    value,
    column,
    onExpand,
}: {
    value: unknown;
    column: string;
    onExpand: () => void;
}) => {
    const parsed = tryParseJson(value);
    const t = themeFor(column);

    if (!parsed) {
        const s = String(value ?? '');
        if (!s)
            return (
                <span className="text-muted-foreground/50 italic text-xs">
                    —
                </span>
            );
        return (
            <span
                className="text-xs text-foreground/70 truncate block max-w-[220px]"
                title={s}
            >
                {s}
            </span>
        );
    }

    const entries = Object.entries(parsed);
    const shown = entries.slice(0, MAX_INLINE_KEYS);
    const remaining = entries.length - shown.length;

    return (
        <div className="flex flex-wrap gap-1 items-center max-w-[320px]">
            {shown.map(([k, v]) => (
                <span
                    key={k}
                    className={cn(
                        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-tight border',
                        t.badge,
                        t.border,
                    )}
                    title={`${k}: ${JSON.stringify(v)}`}
                >
                    <span className="font-semibold opacity-70">{k}:</span>
                    <span className="font-mono">{formatValue(v)}</span>
                </span>
            ))}
            {remaining > 0 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onExpand();
                    }}
                    className={cn(
                        'inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] leading-tight border hover:opacity-80 cursor-pointer',
                        t.badge,
                        t.border,
                    )}
                >
                    +{remaining} more
                </button>
            )}
        </div>
    );
};

const CellValue = ({
    value,
    column,
    onExpand,
}: {
    value: unknown;
    column: string;
    onExpand: () => void;
}) => {
    if (value == null || value === '')
        return (
            <span className="text-muted-foreground/50 italic text-xs">—</span>
        );
    if (JSON_COLUMNS.has(column))
        return <JsonChips value={value} column={column} onExpand={onExpand} />;
    const s = String(value);
    return (
        <span
            className="text-sm text-foreground truncate block max-w-[200px]"
            title={s}
        >
            {s}
        </span>
    );
};

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

/** Expanded row showing all JSON fields inline */
const ExpandedRow = ({
    row,
    columns,
}: {
    row: ContextSnapshotRow;
    columns: string[];
}) => {
    const jsonCols = columns.filter((c) => JSON_COLUMNS.has(c));

    return (
        <tr>
            <td colSpan={columns.length + 2} className="px-4 py-3 bg-muted/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jsonCols.map((col) => {
                        const parsed = tryParseJson(row[col]);
                        const t = themeFor(col);
                        if (!parsed) return null;

                        return (
                            <div
                                key={col}
                                className={cn(
                                    'rounded-lg border p-3',
                                    t.border,
                                    'bg-card',
                                )}
                            >
                                <p
                                    className={cn(
                                        'text-xs font-bold uppercase tracking-wider mb-2',
                                        t.text,
                                    )}
                                >
                                    {col.replace(/_/g, ' ')}
                                </p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                    {Object.entries(parsed).map(([k, v]) => (
                                        <div
                                            key={k}
                                            className="flex items-baseline gap-1.5"
                                        >
                                            <span className="text-[11px] text-muted-foreground font-medium truncate">
                                                {k}:
                                            </span>
                                            <span className="text-[12px] font-mono text-foreground">
                                                {formatValue(v)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </td>
        </tr>
    );
};

// ── main component ──────────────────────────────────────

interface Props {
    cellName?: string | null;
    selectedDate: Date;
}

const ContextSnapshotPanel = ({ cellName, selectedDate }: Props) => {
    const [data, setData] = useState<ContextSnapshotResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
    const [modal, setModal] = useState<{
        column: string;
        value: string;
    } | null>(null);

    const dateStr = (() => {
        const y = selectedDate.getFullYear();
        const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectedDate.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    })();

    const startTime = `${dateStr} 00:00:00`;
    const endTime = `${dateStr} 23:59:59`;

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const effectiveSearch = cellName || searchQuery || undefined;
            const resp = await fetchContextSnapshot(
                page,
                PAGE_SIZE,
                effectiveSearch,
                startTime,
                endTime,
            );
            setData(resp);
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : 'Failed to load data',
            );
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, cellName, startTime, endTime]);

    // reset on filter changes
    useEffect(() => {
        setPage(1);
        setExpandedRows(new Set());
    }, [dateStr, searchQuery, cellName]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSearch = () => {
        setPage(1);
        setSearchQuery(searchInput);
    };

    const toggleRow = (idx: number) =>
        setExpandedRows((prev) => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });

    const totalPages = data
        ? Math.max(1, Math.ceil(data.total / PAGE_SIZE))
        : 1;

    // ── states ──────────────────────────────────────────

    if (loading && !data) {
        return (
            <div className="flex flex-col gap-4 p-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Database className="size-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="outline" size="sm" onClick={loadData}>
                    Retry
                </Button>
            </div>
        );
    }

    const columns = data?.columns ?? [];
    const rows = data?.data ?? [];
    const plainCols = columns.filter((c) => !JSON_COLUMNS.has(c));
    const jsonCols = columns.filter((c) => JSON_COLUMNS.has(c));

    return (
        <div className="flex flex-col gap-4">
            {/* header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <Database className="size-5 text-primary-500" />
                    <h2 className="text-base font-semibold text-foreground">
                        Context Snapshot
                    </h2>
                    {data && (
                        <span className="text-sm text-muted-foreground">
                            {dateStr} · {data.total} rows
                        </span>
                    )}
                    {cellName && (
                        <Badge variant="secondary" className="text-xs">
                            {cellName}
                        </Badge>
                    )}
                </div>

                {/* search — hidden when pre-filtered by cell */}
                {!cellName && (
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search cell name…"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleSearch()
                                }
                                className="pl-9 w-52"
                            />
                        </div>
                        <Button size="sm" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>
                )}
            </div>

            {/* legend */}
            {jsonCols.length > 0 && rows.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {jsonCols.map((col) => {
                        const t = themeFor(col);
                        return (
                            <span
                                key={col}
                                className={cn(
                                    'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border',
                                    t.badge,
                                    t.border,
                                )}
                            >
                                <span
                                    className={cn(
                                        'size-2 rounded-full',
                                        t.badge.split(' ')[0],
                                    )}
                                />
                                {col.replace(/_/g, ' ')}
                            </span>
                        );
                    })}
                    <span className="text-xs text-muted-foreground self-center ml-1">
                        Click row to expand
                    </span>
                </div>
            )}

            {/* table */}
            {rows.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <Database className="size-12 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-foreground/70">
                        No Data Available
                    </p>
                    <p className="text-xs text-muted-foreground">
                        No context snapshot for {dateStr}.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted sticky top-0 z-10">
                            <tr>
                                <th className="px-2 py-2 w-8" />
                                <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    #
                                </th>
                                {plainCols.map((col) => (
                                    <th
                                        key={col}
                                        className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                                    >
                                        {col}
                                    </th>
                                ))}
                                {jsonCols.map((col) => {
                                    const t = themeFor(col);
                                    return (
                                        <th
                                            key={col}
                                            className={cn(
                                                'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap',
                                                t.text,
                                            )}
                                        >
                                            {col.replace(/_/g, ' ')}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-card">
                            {rows.map((row, idx) => {
                                const expanded = expandedRows.has(idx);
                                return (
                                    <tr key={idx} className="contents">
                                        <tr
                                            className={cn(
                                                'hover:bg-accent/50 transition-colors cursor-pointer',
                                                expanded && 'bg-accent/30',
                                            )}
                                            onClick={() => toggleRow(idx)}
                                        >
                                            <td className="px-2 py-2 text-center">
                                                {expanded ? (
                                                    <ChevronUp className="size-3.5 text-muted-foreground mx-auto" />
                                                ) : (
                                                    <ChevronDown className="size-3.5 text-muted-foreground mx-auto" />
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-xs text-muted-foreground font-mono">
                                                {(page - 1) * PAGE_SIZE +
                                                    idx +
                                                    1}
                                            </td>
                                            {plainCols.map((col) => (
                                                <td
                                                    key={col}
                                                    className="px-3 py-2"
                                                >
                                                    <CellValue
                                                        value={row[col]}
                                                        column={col}
                                                        onExpand={() => {}}
                                                    />
                                                </td>
                                            ))}
                                            {jsonCols.map((col) => (
                                                <td
                                                    key={col}
                                                    className="px-3 py-2"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <CellValue
                                                        value={row[col]}
                                                        column={col}
                                                        onExpand={() =>
                                                            setModal({
                                                                column: col,
                                                                value: String(
                                                                    row[col] ??
                                                                        '',
                                                                ),
                                                            })
                                                        }
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                        {expanded && (
                                            <ExpandedRow
                                                row={row}
                                                columns={columns}
                                            />
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* pagination */}
            {data && data.total > PAGE_SIZE && (
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                        {(page - 1) * PAGE_SIZE + 1}–
                        {Math.min(page * PAGE_SIZE, data.total)} of {data.total}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <span className="text-sm text-foreground font-medium">
                            {page} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* loading overlay for subsequent fetches */}
            {loading && data && (
                <div className="flex justify-center py-2">
                    <Loader2 className="size-5 animate-spin text-primary-500" />
                </div>
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
