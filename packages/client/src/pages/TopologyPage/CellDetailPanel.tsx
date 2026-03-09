import { X, MapPin, Server, Radio, Navigation2, Building2, Hash, Wifi } from 'lucide-react';
import type { CellInfoRow } from './types';

interface Props {
    cell: CellInfoRow;
    connectedCells: CellInfoRow[];
    onClose: () => void;
    onSelectCell: (cell: CellInfoRow) => void;
}

function Field({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
            <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
            <div className="min-w-0">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-0.5 break-all font-mono text-sm font-medium text-gray-800">
                    {value ?? <span className="italic text-gray-400">—</span>}
                </p>
            </div>
        </div>
    );
}

export default function CellDetailPanel({
    cell,
    connectedCells,
    onClose,
    onSelectCell,
}: Props) {
    return (
        <div className="flex h-full flex-col overflow-hidden border-l border-gray-200 bg-white shadow-lg">
            {/* ── Header ────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 px-4 py-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        LIVE INSPECTOR
                    </p>
                    <h2 className="mt-0.5 truncate text-base font-semibold text-gray-900">
                        {cell.cell_name}
                    </h2>
                    {cell.station_name && (
                        <p className="text-sm text-gray-500">{cell.station_name}</p>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="mt-0.5 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close panel"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* ── Body ──────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* Cell metadata */}
                <section>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Cell Info
                    </p>
                    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1">
                        <Field
                            icon={Hash}
                            label="Cell Identity"
                            value={cell.cell_identity}
                        />
                        <Field
                            icon={Radio}
                            label="Sector"
                            value={cell.sector !== null ? `Sector ${cell.sector}` : null}
                        />
                        <Field
                            icon={Wifi}
                            label="CU IP"
                            value={cell.cu_ip}
                        />
                        <Field
                            icon={Navigation2}
                            label="Coordinates"
                            value={
                                cell.latitude !== null && cell.longitude !== null
                                    ? `${cell.latitude.toFixed(6)}°N, ${cell.longitude.toFixed(6)}°E`
                                    : null
                            }
                        />
                    </div>
                </section>

                {/* City info */}
                {cell.city && (
                    <section className="mt-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            City
                        </p>
                        <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-1">
                            <Field
                                icon={Building2}
                                label="City Name"
                                value={cell.city.city_name}
                            />
                            <Field
                                icon={MapPin}
                                label="City Code"
                                value={cell.city.city_code}
                            />
                            <Field
                                icon={Hash}
                                label="City Number ID"
                                value={cell.city.city_number_id}
                            />
                        </div>
                    </section>
                )}

                {/* Connected cells (same station) */}
                {connectedCells.length > 0 && (
                    <section className="mt-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Connected Cells
                            <span className="ml-1.5 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                                {connectedCells.length}
                            </span>
                        </p>
                        <div className="space-y-1">
                            {connectedCells.map((c) => (
                                <button
                                    key={c.cell_name}
                                    onClick={() => onSelectCell(c)}
                                    className="flex w-full items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-left hover:bg-blue-50 hover:border-blue-200 transition-colors"
                                >
                                    <Server className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                                    <span className="truncate font-mono text-sm text-gray-800">
                                        {c.cell_name}
                                    </span>
                                    {c.sector !== null && (
                                        <span className="ml-auto flex-shrink-0 text-xs text-gray-400">
                                            S{c.sector}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
