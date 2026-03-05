import { useMemo, useState } from 'react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ReferenceLine,
} from 'recharts';
import {
    BarChart3,
    Clock,
    Cpu,
    Info,
    Power,
    Settings,
    Table2,
    TrendingUp,
} from 'lucide-react';
import type {
    ESForecastEntry,
    ESPlanData,
    ESScheduleEntry,
    MROConfigPlanEntry,
    MROPlanData,
    PlanLoadResponse,
} from './types';

interface Props {
    planResponse: PlanLoadResponse | null;
    loading?: boolean;
}

// ── Palette ──────────────────────────────────────────────

const CELL_COLORS = [
    '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
];
const getColor = (i: number) => CELL_COLORS[i % CELL_COLORS.length];

// ── Helpers ──────────────────────────────────────────────

function extractCellNames(entries: ESScheduleEntry[] | ESForecastEntry[]): string[] {
    if (!entries || entries.length === 0) return [];
    return Object.keys(entries[0]).filter((k) => k !== 'hour');
}

const TTT_MAP: Record<number, number> = {
    1: 40, 2: 64, 3: 80, 4: 100, 5: 128,
    6: 160, 7: 256, 8: 320, 9: 480, 10: 512,
};
const mapTTT = (v: number) => TTT_MAP[v] ?? v;

// ── Tooltip ──────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
    if (!active || !payload) return null;
    return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs max-w-xs">
            <div className="font-semibold text-foreground mb-1.5">Hour {label}:00</div>
            {payload.map((entry, i) => (
                <div key={i} className="flex items-center gap-2 py-0.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: entry.color }} />
                    <span className="text-muted-foreground truncate">{entry.name}:</span>
                    <span className="font-semibold text-foreground ml-auto">
                        {typeof entry.value === 'number' ? entry.value.toFixed(4) : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ── Summary card ─────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
    green: { bg: 'bg-green-50 dark:bg-green-950/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    red: { bg: 'bg-red-50 dark:bg-red-950/40', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
};

function SummaryCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
    const c = COLOR_MAP[color] ?? COLOR_MAP.indigo;
    return (
        <div className={`rounded-lg border ${c.border} ${c.bg} p-4`}>
            <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
            <div className={`text-2xl font-bold ${c.text}`}>{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
        </div>
    );
}

// ── ES Components ─────────────────────────────────────────

function ESSummaryCards({ schedule, forecast }: { schedule: ESScheduleEntry[]; forecast: ESForecastEntry[] }) {
    const cellNames = extractCellNames(schedule);
    const totalSlots = cellNames.length * 24;
    const offSlots = schedule.reduce(
        (sum, entry) => sum + cellNames.filter((c) => entry[c] === 0).length,
        0,
    );
    const savingPct = totalSlots > 0 ? ((offSlots / totalSlots) * 100).toFixed(1) : '0';

    const { avgLoad, peakHour } = useMemo(() => {
        const allValues = forecast.flatMap((e) => cellNames.map((c) => e[c] as number));
        const avg = allValues.length > 0 ? allValues.reduce((a, b) => a + b, 0) / allValues.length : 0;
        let max = 0, maxH = 0;
        forecast.forEach((e) => {
            const h = cellNames.reduce((s, c) => s + (e[c] as number), 0) / cellNames.length;
            if (h > max) { max = h; maxH = e.hour; }
        });
        return { avgLoad: avg, peakHour: { hour: maxH, load: max } };
    }, [forecast, cellNames]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard label="Cells Managed" value={cellNames.length.toString()} sub="active cells" color="indigo" />
            <SummaryCard label="Energy Saving" value={`${savingPct}%`} sub={`${offSlots}/${totalSlots} slots OFF`} color="green" />
            <SummaryCard label="Avg Load" value={`${(avgLoad * 100).toFixed(1)}%`} sub="across all cells" color="amber" />
            <SummaryCard label="Peak Hour" value={`${peakHour.hour}:00`} sub={`load: ${(peakHour.load * 100).toFixed(1)}%`} color="red" />
        </div>
    );
}

function ESScheduleHeatmap({ schedule }: { schedule: ESScheduleEntry[] }) {
    const cellNames = extractCellNames(schedule);
    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Power className="w-4 h-4 text-green-600" />
                24-Hour Cell Schedule (ON/OFF)
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 bg-muted text-left px-2 py-1.5 border border-border font-semibold text-muted-foreground min-w-[140px]">Cell</th>
                            {schedule.map((e) => (
                                <th key={e.hour} className="px-1 py-1.5 border border-border text-center font-medium text-muted-foreground min-w-[32px]">{e.hour}</th>
                            ))}
                            <th className="px-2 py-1.5 border border-border text-center font-semibold text-muted-foreground min-w-[50px]">ON hrs</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cellNames.map((cell, ci) => {
                            const onCount = schedule.filter((e) => e[cell] === 1).length;
                            return (
                                <tr key={cell}>
                                    <td className="sticky left-0 bg-card px-2 py-1.5 border border-border font-mono text-foreground whitespace-nowrap">
                                        <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ background: getColor(ci) }} />
                                        {cell}
                                    </td>
                                    {schedule.map((e) => {
                                        const isOn = e[cell] === 1;
                                        return (
                                            <td
                                                key={e.hour}
                                                className={`px-1 py-1.5 border border-border text-center transition-colors ${isOn ? 'bg-green-500 text-white font-bold' : 'bg-muted text-muted-foreground'}`}
                                                title={`${cell} hour ${e.hour}: ${isOn ? 'ON' : 'OFF'}`}
                                            >
                                                {isOn ? '1' : '0'}
                                            </td>
                                        );
                                    })}
                                    <td className="px-2 py-1.5 border border-border text-center font-semibold text-foreground">{onCount}/{schedule.length}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ESScheduleChart({ schedule }: { schedule: ESScheduleEntry[] }) {
    const cellNames = extractCellNames(schedule);
    const data = schedule.map((e) => {
        const row: Record<string, string | number> = { hour: String(e.hour) };
        cellNames.forEach((c) => { row[c] = e[c]; });
        return row;
    });
    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Active Cells per Hour (Stacked)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} label={{ value: 'Cells ON', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {cellNames.map((cell, i) => (
                        <Bar key={cell} dataKey={cell} stackId="a" fill={getColor(i)} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

function ESForecastChart({ forecast }: { forecast: ESForecastEntry[] }) {
    const cellNames = extractCellNames(forecast);
    const data = forecast.map((e) => {
        const row: Record<string, string | number> = { hour: String(e.hour) };
        cellNames.forEach((c) => { row[c] = parseFloat((e[c] as number).toFixed(4)); });
        return row;
    });
    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Traffic Load Forecast (24h)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                        {cellNames.map((_, i) => (
                            <linearGradient key={i} id={`esGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={getColor(i)} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={getColor(i)} stopOpacity={0.05} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 1]} label={{ value: 'Load Factor', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    {cellNames.map((cell, i) => (
                        <Area key={cell} type="monotone" dataKey={cell} stroke={getColor(i)} fill={`url(#esGrad-${i})`} strokeWidth={2} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

// ── MRO Components ────────────────────────────────────────

function MROSummaryCards({ configPlan }: { configPlan: MROConfigPlanEntry[] }) {
    const avgHOS = configPlan.reduce((s, e) => s + e.predicted_hos, 0) / configPlan.length;
    const minHOS = Math.min(...configPlan.map((e) => e.predicted_hos));
    const maxHOS = Math.max(...configPlan.map((e) => e.predicted_hos));
    const uniqueHOM = new Set(configPlan.map((e) => e.hom)).size;
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <SummaryCard label="Avg HOS" value={`${(avgHOS * 100).toFixed(2)}%`} sub={avgHOS >= 0.95 ? 'Above target' : 'Below 95% target'} color={avgHOS >= 0.95 ? 'green' : 'amber'} />
            <SummaryCard label="HOS Range" value={`${(minHOS * 100).toFixed(1)}–${(maxHOS * 100).toFixed(1)}%`} sub="min – max" color="purple" />
            <SummaryCard label="HOM Variants" value={uniqueHOM.toString()} sub="across 24 hours" color="blue" />
        </div>
    );
}

function MROConfigChart({ configPlan }: { configPlan: MROConfigPlanEntry[] }) {
    const data = configPlan.map((e) => ({ hour: String(e.hour), HOM: e.hom, TTT: mapTTT(e.ttt) }));
    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-600" />
                MRO Configuration Parameters (24h) — HOM &amp; TTT
            </h3>
            <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={data} margin={{ top: 10, right: 50, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" domain={[0, 15]} tick={{ fontSize: 11 }} label={{ value: 'HOM (dB)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 512]} tick={{ fontSize: 11 }} label={{ value: 'TTT (ms)', angle: 90, position: 'insideRight', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar yAxisId="left" dataKey="HOM" fill="#6366f1" radius={[3, 3, 0, 0]} barSize={20} name="HOM (dB)" />
                    <Bar yAxisId="right" dataKey="TTT" fill="#f59e0b" radius={[3, 3, 0, 0]} barSize={20} name="TTT (ms)" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

function MROHOSChart({ configPlan }: { configPlan: MROConfigPlanEntry[] }) {
    const data = configPlan.map((e) => ({ hour: String(e.hour), 'Predicted HOS': parseFloat((e.predicted_hos * 100).toFixed(2)) }));
    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Predicted Handover Success Rate (24h)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <defs>
                        <linearGradient id="hosGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[90, 100]} label={{ value: 'HOS (%)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={95} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '95% target', fontSize: 10, fill: '#ef4444', position: 'right' }} />
                    <Area type="monotone" dataKey="Predicted HOS" stroke="#10b981" strokeWidth={2.5} fill="url(#hosGrad)" dot={{ fill: '#10b981', r: 3 }} name="HOS (%)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

function MROParamTable({ configPlan }: { configPlan: MROConfigPlanEntry[] }) {
    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Hourly Parameter Configuration
            </h3>
            <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
                <table className="w-full text-xs border-collapse">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-muted">
                            <th className="px-3 py-2 border border-border text-left font-semibold text-muted-foreground">Hour</th>
                            <th className="px-3 py-2 border border-border text-center font-semibold text-muted-foreground">HOM (dB)</th>
                            <th className="px-3 py-2 border border-border text-center font-semibold text-muted-foreground">TTT (ms)</th>
                            <th className="px-3 py-2 border border-border text-center font-semibold text-muted-foreground">Predicted HOS</th>
                            <th className="px-3 py-2 border border-border text-center font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {configPlan.map((e) => {
                            const ok = e.predicted_hos >= 0.95;
                            return (
                                <tr key={e.hour} className="hover:bg-accent/40">
                                    <td className="px-3 py-1.5 border border-border font-semibold text-foreground">{String(e.hour).padStart(2, '0')}:00</td>
                                    <td className="px-3 py-1.5 border border-border text-center font-mono text-indigo-700 font-semibold">{e.hom}</td>
                                    <td className="px-3 py-1.5 border border-border text-center font-mono text-amber-700 font-semibold">{mapTTT(e.ttt)}</td>
                                    <td className="px-3 py-1.5 border border-border text-center font-mono">
                                        <span className={ok ? 'text-green-700' : 'text-amber-700'}>{(e.predicted_hos * 100).toFixed(2)}%</span>
                                    </td>
                                    <td className="px-3 py-1.5 border border-border text-center">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${ok ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {ok ? '✓ OK' : '⚠ Below target'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────

export default function PlannerOutputPanel({ planResponse, loading }: Props) {
    const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'detail'>('overview');

    if (loading) {
        return (
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
                <div className="flex items-center justify-center gap-3">
                    <Cpu className="w-6 h-6 animate-pulse text-primary" />
                    <span className="text-muted-foreground">Loading plan data…</span>
                </div>
            </div>
        );
    }

    if (!planResponse) {
        return (
            <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
                <Cpu className="w-12 h-12 mx-auto mb-3 text-muted" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Plan Data</h3>
                <p className="text-sm text-muted-foreground">Could not load plan data from the backend. Please try again.</p>
            </div>
        );
    }

    const { task_type, date, data } = planResponse;
    const isES = task_type === 'ES';

    const tabs = [
        { id: 'overview', label: 'Overview & Charts' },
        { id: 'plan', label: 'Plan' },
        { id: 'detail', label: 'Detailed Data', icon: <Table2 className="w-3.5 h-3.5" /> },
    ] as const;

    return (
        <div className="bg-card rounded-lg shadow-sm border border-border">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-primary" />
                        Action Planner — {isES ? 'Energy Saving' : 'Mobility Robustness Optimization'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isES ? 'bg-green-100 text-green-700 border-green-300' : 'bg-purple-100 text-purple-700 border-purple-300'}`}>
                            {task_type}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                            {date}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-muted rounded-lg p-0.5 w-fit">
                    {tabs.map(({ id, label, icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                                activeTab === id
                                    ? 'bg-card text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6">
                {/* Detail tab placeholder */}
                {activeTab === 'detail' && (
                    <div className="text-center py-12">
                        <Table2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                        <h3 className="text-base font-semibold text-foreground mb-1">Detailed Data</h3>
                        <p className="text-sm text-muted-foreground">
                            CSV data upload not available in this view yet.
                        </p>
                    </div>
                )}

                {/* ES */}
                {isES && activeTab !== 'detail' && (() => {
                    const esData = data as ESPlanData;
                    return (
                        <>
                            {(activeTab === 'overview' || activeTab === 'plan') && (
                                <ESSummaryCards schedule={esData.schedule} forecast={esData.forecast} />
                            )}
                            {activeTab === 'overview' && (
                                <>
                                    <ESScheduleChart schedule={esData.schedule} />
                                    <ESForecastChart forecast={esData.forecast} />
                                </>
                            )}
                            {activeTab === 'plan' && <ESScheduleHeatmap schedule={esData.schedule} />}
                        </>
                    );
                })()}

                {/* MRO */}
                {!isES && activeTab !== 'detail' && (() => {
                    const mroData = data as MROPlanData;
                    return (
                        <>
                            {(activeTab === 'overview' || activeTab === 'plan') && (
                                <MROSummaryCards configPlan={mroData.config_plan} />
                            )}
                            {activeTab === 'overview' && (
                                <>
                                    <MROConfigChart configPlan={mroData.config_plan} />
                                    <MROHOSChart configPlan={mroData.config_plan} />
                                </>
                            )}
                            {activeTab === 'plan' && <MROParamTable configPlan={mroData.config_plan} />}
                        </>
                    );
                })()}

                {/* Footer note */}
                {activeTab !== 'detail' && (
                    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                            Plan loaded via <code className="bg-muted px-1 rounded">POST /plan/load</code> for
                            {' '}<strong>{task_type}</strong> on <strong>{date}</strong>.
                            {isES && ' Schedule shows ON (1) / OFF (0) per cell per hour. Forecast shows predicted load factor (0–1).'}
                            {!isES && ' HOM = Handover Margin (dB), TTT = Time To Trigger (ms), HOS = Handover Success Rate.'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
