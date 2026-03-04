import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PageTitleSpan from '@/components/spans/PageTitleSpan';
import NetworkCellsTable from './NetworkCellsTable';
import ContextSnapshotPanel from './ContextSnapshotPanel';
import { fetchNetworkScan } from './api';
import type { CellFeatures, ModelType } from './types';

const VulcanPage = () => {
    const [cells, setCells] = useState<CellFeatures[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedModel] = useState<ModelType>('ES');
    const [selectedCell, setSelectedCell] = useState<CellFeatures | null>(null);
    const [selectedDate] = useState<Date>(() => new Date());

    const loadCells = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchNetworkScan(selectedDate);
            // Merge features
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

    useEffect(() => {
        loadCells();
    }, [loadCells]);

    const handleCellClick = useCallback((cell: CellFeatures) => {
        setSelectedCell(cell);
    }, []);

    return (
        <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
            <PageTitleSpan title="Context Snapshot" />

            <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6 min-h-0">
                {/* Left — Context Snapshot */}
                <Card className="overflow-hidden">
                    <CardContent className="p-4 overflow-auto">
                        <ContextSnapshotPanel
                            cellName={selectedCell?.cellname}
                            selectedDate={selectedDate}
                        />
                    </CardContent>
                </Card>

                {/* Right — Network Cells Table */}
                <Card className="overflow-hidden">
                    <CardContent className="p-4 overflow-auto">
                        <NetworkCellsTable
                            cells={cells}
                            selectedModel={selectedModel}
                            loading={loading}
                            selectedCellName={selectedCell?.cellname}
                            onCellClick={handleCellClick}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VulcanPage;
