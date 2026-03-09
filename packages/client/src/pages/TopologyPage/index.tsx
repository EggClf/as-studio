import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, RefreshCw, AlertCircle, MapPin } from 'lucide-react';

import { fetchCells } from './api';
import type { CellInfoRow } from './types';
import CellDetailPanel from './CellDetailPanel';

// Lazy-load the heavy Leaflet component so it doesn't block the initial bundle
import { lazy, Suspense } from 'react';
const TopologyMap = lazy(() => import('./TopologyMap'));

export default function TopologyPage() {
    const [cells, setCells] = useState<CellInfoRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCell, setSelectedCell] = useState<CellInfoRow | null>(null);

    // Search / filter state
    const [search, setSearch] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Data loading ─────────────────────────────────────

    const loadCells = useCallback(async (searchValue: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCells({
                search: searchValue || undefined,
                limit: 1000,
            });
            setCells(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load cells');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        void loadCells('');
    }, [loadCells]);

    // Debounced search
    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => void loadCells(value), 400);
    };

    // ── Derived data ─────────────────────────────────────

    /** Cells that share the same station as the selected cell (excluding itself). */
    const connectedCells = useMemo(() => {
        if (!selectedCell?.station_name) return [];
        return cells.filter(
            (c) =>
                c.station_name === selectedCell.station_name &&
                c.cell_name !== selectedCell.cell_name,
        );
    }, [cells, selectedCell]);

    // ── Render ────────────────────────────────────────────

    return (
        <div className="flex h-full w-full flex-col overflow-hidden">
            {/* ── Toolbar ─────────────────────────────── */}
            <div className="flex flex-shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 py-2.5">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                    Topology
                </span>
                <div className="relative ml-2 flex-1 max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search cells or stations…"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                </div>

                <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                    {!loading && !error && (
                        <span>{cells.length} cell{cells.length !== 1 ? 's' : ''}</span>
                    )}
                    <button
                        onClick={() => void loadCells(search)}
                        disabled={loading}
                        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* ── Main content ─────────────────────────── */}
            <div className="relative flex flex-1 overflow-hidden">
                {/* Map area */}
                <div className="relative flex-1 overflow-hidden">
                    {error ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-500">
                            <AlertCircle className="h-8 w-8 text-red-400" />
                            <p className="text-sm font-medium">Failed to load cells</p>
                            <p className="text-xs text-gray-400">{error}</p>
                            <button
                                onClick={() => void loadCells(search)}
                                className="mt-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs hover:bg-gray-50"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <Suspense
                            fallback={
                                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                    Loading map…
                                </div>
                            }
                        >
                            <TopologyMap
                                cells={cells}
                                selectedCellName={selectedCell?.cell_name ?? null}
                                onSelectCell={setSelectedCell}
                            />
                        </Suspense>
                    )}

                    {/* Loading overlay on top of map while refetching */}
                    {loading && !error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow text-sm text-gray-600">
                                <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                                Loading cells…
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                {selectedCell && (
                    <div className="w-80 flex-shrink-0 overflow-hidden">
                        <CellDetailPanel
                            cell={selectedCell}
                            connectedCells={connectedCells}
                            onClose={() => setSelectedCell(null)}
                            onSelectCell={setSelectedCell}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
