import { useEffect, useMemo, useRef } from 'react';
import {
    MapContainer,
    GeoJSON,
    CircleMarker,
    Polyline,
    Tooltip,
    useMap,
} from 'react-leaflet';
import { type LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import type { CellInfoRow } from './types';
import vietnamGeoJson from './vietnam-provinces.json';

// ────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────

/** Deterministic color per city code (falls back to palette index). */
const PALETTE = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
    '#f43f5e', '#6366f1', '#84cc16', '#06b6d4',
];

function colorForKey(key: string | null | undefined): string {
    if (!key) return PALETTE[0];
    let hash = 0;
    for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    return PALETTE[Math.abs(hash) % PALETTE.length];
}

/** Cells that have valid coordinates. */
function positioned(cells: CellInfoRow[]): CellInfoRow[] {
    return cells.filter(
        (c) => c.latitude !== null && c.longitude !== null,
    );
}

/** Build {stationName → cells[]} map for connection lines. */
function stationGroups(
    cells: CellInfoRow[],
): Map<string, CellInfoRow[]> {
    const map = new Map<string, CellInfoRow[]>();
    for (const cell of positioned(cells)) {
        if (!cell.station_name) continue;
        const group = map.get(cell.station_name) ?? [];
        group.push(cell);
        map.set(cell.station_name, group);
    }
    return map;
}

// ────────────────────────────────────────────────────────
// Sub-components
// ────────────────────────────────────────────────────────

/** Fits the map viewport to the bounds of all visible cells on mount. */
function FitBounds({ cells }: { cells: CellInfoRow[] }) {
    const map = useMap();
    const fitted = useRef(false);

    useEffect(() => {
        if (fitted.current) return;
        const pts = positioned(cells);
        if (pts.length === 0) return;
        const bounds: LatLngBoundsExpression = pts.map(
            (c) => [c.latitude!, c.longitude!] as [number, number],
        );
        map.fitBounds(bounds, { padding: [40, 40] });
        fitted.current = true;
    }, [cells, map]);

    return null;
}

// ────────────────────────────────────────────────────────
// GeoJSON style helpers
// ────────────────────────────────────────────────────────

const boundaryStyle = {
    color: '#94a3b8',
    weight: 1,
    fillColor: '#f1f5f9',
    fillOpacity: 0.5,
};

// ────────────────────────────────────────────────────────
// Props
// ────────────────────────────────────────────────────────

export interface TopologyMapProps {
    cells: CellInfoRow[];
    selectedCellName: string | null;
    onSelectCell: (cell: CellInfoRow) => void;
}

// ────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────

export default function TopologyMap({
    cells,
    selectedCellName,
    onSelectCell,
}: TopologyMapProps) {
    // Connection lines grouped by station
    const groups = useMemo(() => stationGroups(cells), [cells]);

    const polylines = useMemo(() => {
        const lines: Array<{
            key: string;
            positions: [number, number][];
            color: string;
        }> = [];
        groups.forEach((groupCells, stationName) => {
            if (groupCells.length < 2) return;
            lines.push({
                key: stationName,
                positions: groupCells.map((c) => [c.latitude!, c.longitude!]),
                color: colorForKey(stationName),
            });
        });
        return lines;
    }, [groups]);

    return (
        <MapContainer
            center={[16.0, 106.0]}   // Vietnam center
            zoom={6}
            zoomControl={true}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', background: '#e8f0fe' }}
        >
            {/* Province boundaries — no tile server needed */}
            <GeoJSON
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={vietnamGeoJson as any}
                style={boundaryStyle}
            />

            {/* Station connection polylines */}
            {polylines.map(({ key, positions, color }) => (
                <Polyline
                    key={key}
                    positions={positions}
                    pathOptions={{
                        color,
                        weight: 1.5,
                        opacity: 0.55,
                        dashArray: '4 4',
                    }}
                />
            ))}

            {/* Cell markers */}
            {positioned(cells).map((cell) => {
                const isSelected = cell.cell_name === selectedCellName;
                const color = colorForKey(cell.city?.city_code ?? cell.station_name);
                return (
                    <CircleMarker
                        key={cell.cell_name}
                        center={[cell.latitude!, cell.longitude!]}
                        radius={isSelected ? 10 : 7}
                        pathOptions={{
                            color: isSelected ? '#ffffff' : color,
                            fillColor: color,
                            fillOpacity: 1,
                            weight: isSelected ? 3 : 1.5,
                        }}
                        eventHandlers={{
                            click: () => onSelectCell(cell),
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -8]} opacity={0.92}>
                            <span className="font-mono text-xs">
                                {cell.cell_name}
                            </span>
                            {cell.station_name && (
                                <span className="block text-xs text-gray-500">
                                    {cell.station_name}
                                </span>
                            )}
                        </Tooltip>
                    </CircleMarker>
                );
            })}

            <FitBounds cells={cells} />
        </MapContainer>
    );
}
