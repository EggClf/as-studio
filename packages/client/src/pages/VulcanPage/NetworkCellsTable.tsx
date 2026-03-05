import { memo, useMemo, useState } from 'react';
import {
    AlertCircle,
    ChevronRight,
    Loader2,
    PlayCircle,
    Radio,
    SearchIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { CellFeatures, ModelType } from './types';

// ── helpers ─────────────────────────────────────────────

function hasValidFeatures(cell: CellFeatures, model: ModelType) {
    if (model === 'ES') {
        return (
            cell['Energy Inefficiency Score'] != null &&
            cell['Persistent Low Load Score'] != null
        );
    }
    return (
        cell['Handover Failure Pressure'] != null &&
        cell['Handover Success Stability'] != null
    );
}

function alarmVariant(n: number) {
    if (n > 5) return 'destructive' as const;
    if (n > 2) return 'secondary' as const;
    return 'outline' as const;
}

function fmtPct(v: number | null | undefined) {
    return v != null ? `${(v * 100).toFixed(0)}%` : 'N/A';
}
function fmtNum(v: number | null | undefined) {
    return v != null ? v.toFixed(0) : 'N/A';
}

// ── component ───────────────────────────────────────────

interface Props {
    cells: CellFeatures[];
    selectedModel: ModelType;
    loading?: boolean;
    selectedCellName?: string | null;
    onCellClick: (cell: CellFeatures) => void;
    onBatchPredict?: (cells: CellFeatures[]) => void;
    batchLoading?: boolean;
}

const NetworkCellsTable = ({
    cells,
    selectedModel,
    loading = false,
    selectedCellName,
    onCellClick,
    onBatchPredict,
    batchLoading = false,
}: Props) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search) return cells;
        const q = search.toLowerCase();
        return cells.filter(
            (c) =>
                c.cellname.toLowerCase().includes(q) ||
                c.ne_name.toLowerCase().includes(q),
        );
    }, [cells, search]);

    const validCount = useMemo(
        () => cells.filter((c) => hasValidFeatures(c, selectedModel)).length,
        [cells, selectedModel],
    );

    const withAlarms = useMemo(
        () => cells.filter((c) => (c.n_alarm ?? 0) > 0).length,
        [cells],
    );

    // ── loading skeleton ────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col gap-4 p-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <Radio className="size-5 text-primary-500" />
                    <h2 className="text-base font-semibold text-foreground">
                        Network Cells
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                        {cells.length}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        {selectedModel}
                    </Badge>
                </div>

                {onBatchPredict && (
                    <Button
                        size="sm"
                        disabled={batchLoading || validCount === 0}
                        onClick={() =>
                            onBatchPredict(
                                cells.filter((c) =>
                                    hasValidFeatures(c, selectedModel),
                                ),
                            )
                        }
                    >
                        {batchLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <PlayCircle className="size-4" />
                        )}
                        {batchLoading
                            ? 'Processing…'
                            : `Run All (${validCount})`}
                    </Button>
                )}
            </div>

            {/* search */}
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Search by cell or NE name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* table */}
            <div className="rounded-lg border border-border overflow-hidden">
                {/* header row */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
                    <div className="col-span-3">Cell Name</div>
                    <div className="col-span-2">NE Name</div>
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-1 text-center">Alarms</div>
                    <div className="col-span-3">Key Metrics</div>
                    <div className="col-span-1 text-center">Action</div>
                </div>

                {/* rows */}
                <div className="max-h-96 overflow-y-auto">
                    <div className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                                No cells match your search
                            </p>
                        ) : (
                            filtered.map((cell, i) => {
                                const valid = hasValidFeatures(
                                    cell,
                                    selectedModel,
                                );
                                const alarms = cell.n_alarm ?? 0;
                                const isSelected =
                                    cell.cellname === selectedCellName;

                                return (
                                    <div
                                        key={`${cell.cellname}-${i}`}
                                        role="button"
                                        tabIndex={0}
                                        onClick={() =>
                                            valid && onCellClick(cell)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' &&
                                            valid &&
                                            onCellClick(cell)
                                        }
                                        className={cn(
                                            'grid grid-cols-12 gap-2 px-4 py-2.5 transition-colors cursor-pointer group',
                                            valid
                                                ? 'hover:bg-accent'
                                                : 'opacity-50 cursor-default',
                                            isSelected &&
                                                'bg-accent ring-1 ring-primary-400/30',
                                        )}
                                    >
                                        {/* cell name */}
                                        <div className="col-span-3 flex items-center">
                                            <span
                                                className={cn(
                                                    'text-sm font-mono font-medium',
                                                    isSelected
                                                        ? 'text-foreground'
                                                        : 'text-foreground/80 group-hover:text-foreground',
                                                )}
                                            >
                                                {cell.cellname}
                                            </span>
                                        </div>

                                        {/* ne name */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm text-muted-foreground truncate">
                                                {cell.ne_name}
                                            </span>
                                        </div>

                                        {/* timestamp */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    cell.timestamp,
                                                ).toLocaleString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                        </div>

                                        {/* alarms */}
                                        <div className="col-span-1 flex items-center justify-center">
                                            {alarms > 0 ? (
                                                <Badge
                                                    variant={alarmVariant(
                                                        alarms,
                                                    )}
                                                    className="gap-1 text-xs"
                                                >
                                                    <AlertCircle className="size-3" />
                                                    {alarms}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">
                                                    —
                                                </span>
                                            )}
                                        </div>

                                        {/* metrics */}
                                        <div className="col-span-3 flex items-center">
                                            {selectedModel === 'ES' ? (
                                                <div className="flex flex-col gap-0.5 text-xs">
                                                    <span>
                                                        <span className="text-muted-foreground">
                                                            Load:{' '}
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {fmtPct(
                                                                cell[
                                                                    'Persistent Low Load Score'
                                                                ],
                                                            )}
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span className="text-muted-foreground">
                                                            Inefficiency:{' '}
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {fmtNum(
                                                                cell[
                                                                    'Energy Inefficiency Score'
                                                                ],
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-0.5 text-xs">
                                                    <span>
                                                        <span className="text-muted-foreground">
                                                            HO Fail:{' '}
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {fmtPct(
                                                                cell[
                                                                    'Handover Failure Pressure'
                                                                ],
                                                            )}
                                                        </span>
                                                    </span>
                                                    <span>
                                                        <span className="text-muted-foreground">
                                                            HO Stability:{' '}
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {fmtNum(
                                                                cell[
                                                                    'Handover Success Stability'
                                                                ],
                                                            )}
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* action */}
                                        <div className="col-span-1 flex items-center justify-center">
                                            {valid ? (
                                                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-transform" />
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">
                                                    —
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* summary stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Total Cells
                    </p>
                    <p className="text-xl font-bold text-foreground">
                        {cells.length}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        With Alarms
                    </p>
                    <p className="text-xl font-bold text-foreground">
                        {withAlarms}
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Model
                    </p>
                    <p className="text-xl font-bold text-foreground">
                        {selectedModel}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default memo(NetworkCellsTable);
