import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Cpu,
    Loader2,
    Search,
    XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchIntents, type IntentListParams } from './api';
import type { IntentSummary } from './types';

// ── helpers ─────────────────────────────────────────────

const PAGE_SIZE = 10;

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

function taskTypeBadge(t: string) {
    const map: Record<string, string> = {
        MRO: 'bg-blue-100 text-blue-800 border-blue-200',
        ES: 'bg-green-100 text-green-800 border-green-200',
        QOS: 'bg-purple-100 text-purple-800 border-purple-200',
        TS: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return map[t?.toUpperCase()] ?? 'bg-gray-100 text-gray-700 border-gray-200';
}

// ── component ───────────────────────────────────────────

const IntentsMonitoringPage = () => {
    const navigate = useNavigate();

    // Data
    const [intents, setIntents] = useState<IntentSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [actorFilter, setActorFilter] = useState('');
    const [taskTypeFilter, setTaskTypeFilter] = useState<string>('all');

    // Pagination
    const [page, setPage] = useState(1);

    // ── Load intents ────────────────────────────────────
    const loadIntents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: IntentListParams = { limit: 500 };
            if (taskTypeFilter !== 'all') params.task_type = taskTypeFilter;
            if (actorFilter) params.actor = actorFilter;
            const data = await fetchIntents(params);
            setIntents(data);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [taskTypeFilter, actorFilter]);

    useEffect(() => {
        loadIntents();
    }, [loadIntents]);

    // ── Derived data ────────────────────────────────────
    const filtered = useMemo(() => {
        let list = intents;

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (i) =>
                    i.intent_id.toLowerCase().includes(q) ||
                    i.actor.toLowerCase().includes(q) ||
                    i.task_type.toLowerCase().includes(q),
            );
        }

        if (statusFilter === 'active') {
            list = list.filter((i) => i.end_time == null);
        } else if (statusFilter === 'completed') {
            list = list.filter(
                (i) => i.end_time != null && i.duration_hours != null && i.duration_hours >= 0,
            );
        } else if (statusFilter === 'failed') {
            list = list.filter(
                (i) => i.end_time != null && (i.duration_hours == null || i.duration_hours < 0),
            );
        }

        return list;
    }, [intents, search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pagedIntents = filtered.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
    );

    const activeCount = intents.filter((i) => i.end_time == null).length;
    const completedCount = intents.filter(
        (i) => i.end_time != null && i.duration_hours != null && i.duration_hours >= 0,
    ).length;
    const failedCount = intents.filter(
        (i) => i.end_time != null && (i.duration_hours == null || i.duration_hours < 0),
    ).length;

    // Unique actors for filter
    const actors = useMemo(
        () => [...new Set(intents.map((i) => i.actor))],
        [intents],
    );

    // Task types
    const taskTypes = useMemo(
        () => [...new Set(intents.map((i) => i.task_type))],
        [intents],
    );

    // ── Loading skeleton ────────────────────────────────
    if (loading && intents.length === 0) {
        return (
            <div className="flex flex-col gap-6 p-6">
                <Skeleton className="h-8 w-80" />
                <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <Skeleton className="h-12 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
            {/* ── Page Title ────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Global Intents Monitoring
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Real-time overview of all active and historical intents.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('analysis')}
                >
                    <Cpu className="w-4 h-4 mr-1.5" />
                    ML Analysis
                </Button>
            </div>

            {/* ── Summary Cards ─────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card
                    className={cn(
                        'cursor-pointer transition-shadow hover:shadow-md',
                        statusFilter === 'active' && 'ring-2 ring-primary',
                    )}
                    onClick={() => {
                        setStatusFilter(statusFilter === 'active' ? 'all' : 'active');
                        setPage(1);
                    }}
                >
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">
                                Total Active Intents:
                            </p>
                            <p className="text-3xl font-bold text-foreground">
                                {activeCount}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className={cn(
                        'cursor-pointer transition-shadow hover:shadow-md',
                        statusFilter === 'completed' && 'ring-2 ring-green-500',
                    )}
                    onClick={() => {
                        setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed');
                        setPage(1);
                    }}
                >
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/30">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">
                                Completed Intents:
                            </p>
                            <p className="text-3xl font-bold text-foreground">
                                {completedCount}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className={cn(
                        'cursor-pointer transition-shadow hover:shadow-md border-red-200 dark:border-red-900',
                        statusFilter === 'failed' && 'ring-2 ring-red-500',
                    )}
                    onClick={() => {
                        setStatusFilter(statusFilter === 'failed' ? 'all' : 'failed');
                        setPage(1);
                    }}
                >
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/30">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs text-red-600 font-medium">
                                Failed Intents:
                            </p>
                            <p className="text-3xl font-bold text-red-600">
                                {failedCount}
                            </p>
                        </div>
                        {failedCount > 0 && (
                            <AlertTriangle className="w-5 h-5 text-red-400 ml-auto" />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* ── Filters / DataSelectionPanel ───────────── */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                            DataSelectionPanel
                        </span>

                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Search intents..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="pl-9"
                            />
                        </div>

                        {/* Status filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="all">Status</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>

                        {/* Actor filter */}
                        <select
                            value={actorFilter}
                            onChange={(e) => {
                                setActorFilter(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="">Actor</option>
                            {actors.map((a) => (
                                <option key={a} value={a}>
                                    {a}
                                </option>
                            ))}
                        </select>

                        {/* Task Type filter */}
                        <select
                            value={taskTypeFilter}
                            onChange={(e) => {
                                setTaskTypeFilter(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="all">Task Type</option>
                            {taskTypes.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* ── Error state ────────────────────────────── */}
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
                    <XCircle className="w-5 h-5 shrink-0" />
                    <span className="text-sm">{error}</span>
                    <Button variant="outline" size="sm" className="ml-auto" onClick={loadIntents}>
                        Retry
                    </Button>
                </div>
            )}

            {/* ── All Intents Table ──────────────────────── */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-hidden rounded-lg">
                        {/* Table header */}
                        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none border-b border-border">
                            <div className="col-span-2">Intent ID</div>
                            <div className="col-span-2">Actor</div>
                            <div className="col-span-2">Task Type</div>
                            <div className="col-span-2">Start Time</div>
                            <div className="col-span-3">KPI Summary</div>
                            <div className="col-span-1 text-center">Actions</div>
                        </div>

                        {/* Table rows */}
                        <div className="divide-y divide-border">
                            {loading ? (
                                <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-sm">Loading intents…</span>
                                </div>
                            ) : pagedIntents.length === 0 ? (
                                <p className="py-12 text-center text-sm text-muted-foreground">
                                    No intents match your filters
                                </p>
                            ) : (
                                pagedIntents.map((intent) => (
                                    <div
                                        key={intent.intent_id}
                                        className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-accent/50 transition-colors cursor-pointer group"
                                        onClick={() =>
                                            navigate(intent.intent_id)
                                        }
                                    >
                                        {/* Intent ID */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm font-mono font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {intent.intent_id}
                                            </span>
                                        </div>

                                        {/* Actor */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm text-muted-foreground truncate">
                                                {intent.actor}
                                            </span>
                                        </div>

                                        {/* Task Type */}
                                        <div className="col-span-2 flex items-center">
                                            <span
                                                className={cn(
                                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
                                                    taskTypeBadge(intent.task_type),
                                                )}
                                            >
                                                {intent.task_type}
                                            </span>
                                        </div>

                                        {/* Start Time */}
                                        <div className="col-span-2 flex items-center">
                                            <span className="text-sm text-muted-foreground">
                                                {formatDate(intent.start_time)}
                                            </span>
                                        </div>

                                        {/* KPI Summary */}
                                        <div className="col-span-3 flex items-center">
                                            {intent.has_kpi ? (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                                    <span className="text-xs text-muted-foreground truncate">
                                                        KPI targets set
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground/50">
                                                    No KPI
                                                </span>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="col-span-1 flex items-center justify-center">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="text-xs h-7 px-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(intent.intent_id);
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {filtered.length > 0 && (
                            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/30">
                                <span className="text-xs text-muted-foreground">
                                    Showing {(page - 1) * PAGE_SIZE + 1}–
                                    {Math.min(page * PAGE_SIZE, filtered.length)}{' '}
                                    of {filtered.length}
                                </span>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => p - 1)}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>

                                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={page === pageNum ? 'default' : 'ghost'}
                                                size="sm"
                                                className="h-8 w-8 p-0 text-xs"
                                                onClick={() => setPage(pageNum)}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IntentsMonitoringPage;
