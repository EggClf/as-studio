import React, { useState } from 'react';
import {
    AlertTriangle,
    BarChart3,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    GitBranch,
    Info,
    Lightbulb,
    Shield,
    TrendingDown,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import type {
    BatchTraceResult,
    CellDecisionResult,
    DecisionTreeTrace,
    IntentLabel,
} from './types';

interface Props {
    trace?: DecisionTreeTrace;
    batchResult?: BatchTraceResult;
}

// ── Feature context knowledge base ──────────────────────

interface FeatureContext {
    name: string;
    intent: string;
    interpretation: { high: string; medium: string; low: string };
    decisionImpact: { high: string; medium: string; low: string };
    role: string;
    isHardBlock?: boolean;
}

const ES_CONTEXTS: Record<string, FeatureContext> = {
    persistent_low_load_score: {
        name: 'Persistent Low Load',
        intent: 'Detect long-lasting idle behavior',
        interpretation: { high: 'Sustained low traffic over time', medium: 'Intermittent or unstable low load', low: 'No real idle condition' },
        decisionImpact: { high: 'Strongly supports ES', medium: 'Neutral, needs other evidence', low: 'Opposes ES' },
        role: 'Benefit indicator',
    },
    energy_inefficiency_score: {
        name: 'Energy Inefficiency',
        intent: 'Measure energy waste per carried traffic',
        interpretation: { high: 'Significant energy waste', medium: 'Mild inefficiency', low: 'Energy usage is efficient' },
        decisionImpact: { high: 'Strongly supports ES', medium: 'Weak support for ES', low: 'Neutral or against ES' },
        role: 'Energy optimization driver',
    },
    stable_qos_confidence: {
        name: 'QoS Stability',
        intent: 'Ensure ES does not degrade service quality',
        interpretation: { high: 'QoS consistently stable', medium: 'Borderline stability, requires monitoring', low: 'Frequent QoS violations' },
        decisionImpact: { high: 'ES allowed', medium: 'ES with caution', low: 'ES forbidden' },
        role: 'Hard safety constraint',
        isHardBlock: true,
    },
    mobility_safety_index: {
        name: 'Mobility Safety',
        intent: 'Ensure ES does not harm handover performance',
        interpretation: { high: 'Handover safe and stable', medium: 'Mobility risk exists', low: 'High handover failure risk' },
        decisionImpact: { high: 'ES allowed', medium: 'Limit ES aggressiveness', low: 'ES forbidden' },
        role: 'Hard safety constraint',
        isHardBlock: true,
    },
    social_event_score: {
        name: 'Social Event Risk',
        intent: 'Detect abnormal traffic due to mass events',
        interpretation: { high: 'Large event, potential traffic surge', medium: 'Moderate event activity', low: 'No event detected' },
        decisionImpact: { high: 'ES forbidden', medium: 'ES discouraged', low: 'No restriction on ES' },
        role: 'External contextual blocker',
        isHardBlock: true,
    },
    traffic_volatility_index: {
        name: 'Traffic Stability',
        intent: 'Measure predictability of traffic behavior',
        interpretation: { low: 'Traffic highly stable', medium: 'Moderate fluctuation', high: 'Highly volatile traffic' },
        decisionImpact: { low: 'Supports ES', medium: 'Neutral', high: 'Opposes ES' },
        role: 'Risk mitigation feature',
    },
    weather_sensitivity_score: {
        name: 'Weather Impact',
        intent: 'Capture weather-driven traffic and mobility risk',
        interpretation: { high: 'Low operational risk (favorable weather)', medium: 'No significant impact', low: 'Increased operational risk (harsh weather)' },
        decisionImpact: { high: 'Supports ES', medium: 'No effect', low: 'Discourage ES' },
        role: 'External risk modifier',
    },
    neighbor_dependency_score: {
        name: 'Neighbor Dependency',
        intent: 'Identify cluster-critical cells',
        interpretation: { high: 'Cell is critical for cluster mobility', medium: 'Partial dependency', low: 'Non-critical cell' },
        decisionImpact: { high: 'ES forbidden', medium: 'Limit ES', low: 'ES allowed' },
        role: 'Hard topology constraint',
        isHardBlock: true,
    },
    n_alarm: {
        name: 'Alarm Count',
        intent: 'Detect operational issues or network instability',
        interpretation: { low: 'No or minimal alarms', medium: 'Some alarms present', high: 'High number of active alarms' },
        decisionImpact: { low: 'Supports ES', medium: 'ES with caution', high: 'ES forbidden' },
        role: 'Operational health indicator',
        isHardBlock: true,
    },
};

const MRO_CONTEXTS: Record<string, FeatureContext> = {
    handover_failure_pressure: {
        name: 'HO Failure Pressure',
        intent: 'Measure overall handover failure stress',
        interpretation: { high: 'Severe HO failure', medium: 'Noticeable HO degradation', low: 'Acceptable HO performance' },
        decisionImpact: { high: 'Strongly supports MRO', medium: 'Light MRO', low: 'No MRO needed' },
        role: 'Primary trigger',
    },
    handover_success_stability: {
        name: 'HO Stability',
        intent: 'Detect temporal instability of handover success',
        interpretation: { high: 'Stable HO behavior', medium: 'Slight instability', low: 'Highly unstable HO' },
        decisionImpact: { high: 'No MRO', medium: 'Light MRO', low: 'Strong MRO' },
        role: 'Stability indicator',
    },
    congestion_induced_ho_risk: {
        name: 'Congestion-Induced HO Risk',
        intent: 'Identify HO failures caused by target congestion',
        interpretation: { high: 'HO fails mainly due to congestion', medium: 'Partial congestion impact', low: 'HO failures are radio-related' },
        decisionImpact: { high: 'Enable MRO with load balancing', medium: 'Monitor and tune', low: 'Neutral' },
        role: 'Root-cause discriminator',
    },
    mobility_volatility_index: {
        name: 'Mobility Volatility',
        intent: 'Capture abnormal HO fluctuation and ping-pong',
        interpretation: { high: 'Highly volatile mobility', medium: 'Mild volatility', low: 'Stable mobility' },
        decisionImpact: { high: 'Dynamic MRO required', medium: 'Monitor', low: 'No MRO' },
        role: 'Instability detector',
    },
    weather_driven_mobility_risk: {
        name: 'Weather-Driven Mobility Risk',
        intent: 'Capture environmental impact on mobility',
        interpretation: { high: 'Stable conditions (favorable weather)', medium: 'No major impact', low: 'High mobility risk (harsh weather)' },
        decisionImpact: { high: 'Allow aggressive optimization', medium: 'No effect', low: 'Conservative MRO/ES' },
        role: 'External risk modifier',
    },
    mro_necessity_score: {
        name: 'MRO Necessity',
        intent: 'Aggregate need for MRO activation',
        interpretation: { high: 'Strong MRO required', medium: 'Light MRO required', low: 'No MRO needed' },
        decisionImpact: { high: 'Activate strong MRO', medium: 'Activate light MRO', low: 'Do not activate MRO' },
        role: 'Final decision or trigger',
    },
};

// ── Helpers ──────────────────────────────────────────────

function determineLevel(
    featureValue: number,
    threshold: number,
    passed: boolean,
    condition: string,
): 'high' | 'medium' | 'low' {
    const isLte = condition.includes('<=') || condition.includes('<');
    const isGt = condition.includes('>');
    if (isGt) {
        if (passed) return 'high';
        return featureValue / threshold > 0.7 ? 'medium' : 'low';
    }
    if (isLte) {
        if (passed) return 'low';
        return featureValue / threshold < 1.5 ? 'medium' : 'high';
    }
    const ratio = featureValue / threshold;
    if (ratio >= 1.2) return 'high';
    if (ratio >= 0.8) return 'medium';
    return 'low';
}

function getContext(featureName: string, intentLabel: IntentLabel): FeatureContext | null {
    const key = featureName.toLowerCase().replace(/[_\s-]/g, '_');
    return (intentLabel === 'ES' ? ES_CONTEXTS : MRO_CONTEXTS)[key] ?? null;
}

function featureToQuestion(name: string): string {
    const map: Record<string, string> = {
        'Persistent Low Load': 'Is the cell persistently under low load?',
        'Energy Inefficiency': 'Is energy usage inefficient relative to traffic?',
        'QoS Stability': 'Is there a risk of unstable QoS?',
        'Mobility Safety': 'Is there a risk to mobility safety?',
        'Social Event Risk': 'Is there a high-impact social event nearby?',
        'Traffic Stability': 'Is traffic instability detected?',
        'Weather Impact': 'Is weather posing a risk to operation?',
        'Neighbor Dependency': 'Is this cell critical to neighbor mobility?',
        'Alarm Count': 'Are there active alarms indicating operational issues?',
        'HO Failure Pressure': 'Is handover failure pressure high?',
        'HO Stability': 'Is handover stability degraded?',
        'Congestion-Induced HO Risk': 'Is congestion causing handover failures?',
        'Mobility Volatility': 'Is mobility behavior unstable?',
        'Weather-Driven Mobility Risk': 'Is weather increasing mobility risk?',
    };
    return map[name] ?? name;
}

// ── Single-trace panel ───────────────────────────────────

interface SinglePanelProps {
    trace: DecisionTreeTrace;
}

function SingleTracePanel({ trace }: SinglePanelProps) {
    const [activeTab, setActiveTab] = useState<'explanation' | 'details'>('explanation');
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

    const toggleNode = (step: number) => {
        setExpandedNodes((prev: Set<number>) => {
            const next = new Set(prev);
            next.has(step) ? next.delete(step) : next.add(step);
            return next;
        });
    };

    const leafNode = trace.path.find((n) => n.featureName === 'LEAF');
    const leafDecision =
        leafNode
            ? /=\s*true/i.test(leafNode.condition)
                ? true
                : /=\s*false/i.test(leafNode.condition)
                    ? false
                    : undefined
            : undefined;
    const finalDecision = trace.decision !== undefined ? trace.decision : leafDecision;
    const finalLabel =
        trace.intentLabel === 'MRO' || trace.intentLabel === 'ES'
            ? finalDecision === true
                ? `Apply ${trace.intentLabel}`
                : `Do not apply ${trace.intentLabel}`
            : trace.intentLabel;

    type NarrativeItem = {
        stepNumber: number;
        ctx: FeatureContext;
        level: 'high' | 'medium' | 'low';
        interpretation: string;
        impact: string;
        passed: boolean;
    };

    const narratives: NarrativeItem[] = trace.path
        .filter((n) => n.featureName !== 'LEAF')
        .map((node, idx) => {
            const ctx = getContext(node.featureName, trace.intentLabel);
            if (!ctx) return null;
            const level = determineLevel(node.featureValue, node.threshold, node.passed, node.condition);
            return {
                stepNumber: idx + 1,
                ctx,
                level,
                interpretation: ctx.interpretation[level],
                impact: ctx.decisionImpact[level],
                passed: node.passed,
            };
        })
        .filter((x): x is NarrativeItem => x !== null);

    const impactful = narratives.filter(
        (n) => !n.impact.toLowerCase().includes('neutral'),
    );

    return (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Decision Explanation: Why {finalLabel}?
            </h2>

            {/* Tabs */}
            <div className="border-b border-border mb-6">
                <div className="flex gap-2">
                    {(
                        [
                            { id: 'explanation', icon: <Lightbulb className="w-4 h-4" />, label: 'Explanation' },
                            { id: 'details', icon: <GitBranch className="w-4 h-4" />, label: 'Reasoning Path' },
                        ] as const
                    ).map(({ id, icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`px-6 py-3 font-semibold text-sm transition-colors relative flex items-center gap-2 ${
                                activeTab === id
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {icon}
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'explanation' ? (
                <>
                    {/* Decision Banner */}
                    <div className="mb-6 p-4 bg-indigo-600 border-l-4 border-white/20 rounded">
                        <div className="flex items-center gap-3 mb-2">
                            {finalDecision ? (
                                <CheckCircle className="w-8 h-8 text-white" />
                            ) : (
                                <XCircle className="w-8 h-8 text-white" />
                            )}
                            <div>
                                <div className="text-sm text-white font-medium">Final Decision</div>
                                <div className="text-2xl font-bold text-white">{finalLabel}</div>
                            </div>
                        </div>
                        <div className="text-sm text-white mt-2">
                            The decision tree analyzed{' '}
                            <strong>{impactful.length} key factors</strong> with significant impact.
                        </div>
                    </div>

                    {/* Key Factors */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-amber-500" />
                            Key Decision Factors
                        </h3>

                        {impactful.map((n, idx) => {
                            const isExpanded = expandedNodes.has(n.stepNumber);
                            const question = featureToQuestion(n.ctx.name);
                            const combined = `${n.interpretation}. ${n.impact}.`;
                            return (
                                <div
                                    key={n.stepNumber}
                                    className={`border-l-4 rounded-r-lg p-4 ${
                                        n.ctx.isHardBlock
                                            ? 'border-red-500 bg-red-50 dark:bg-red-950/30'
                                            : 'border-primary/50 bg-muted/40'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <h4 className="text-base font-bold text-foreground">{question}</h4>
                                                    {n.ctx.isHardBlock && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                                                            <Shield className="w-3 h-3" />
                                                            CRITICAL
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => toggleNode(n.stepNumber)}
                                                    className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-primary-foreground hover:bg-primary rounded transition-colors"
                                                >
                                                    <Info className="w-4 h-4" />
                                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                </button>
                                            </div>

                                            <div
                                                className={`p-3 rounded-lg mb-3 ${
                                                    n.passed
                                                        ? 'bg-green-100 border border-green-300 dark:bg-green-950/40 dark:border-green-800'
                                                        : 'bg-orange-100 border border-orange-300 dark:bg-orange-950/40 dark:border-orange-800'
                                                }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    {n.passed ? (
                                                        <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                                                    ) : (
                                                        <AlertTriangle className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <div>
                                                        <div className="font-semibold text-sm mb-1">
                                                            {n.passed ? 'Yes' : 'No'}
                                                        </div>
                                                        <div className="text-sm text-foreground/80">{combined}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="space-y-2 text-sm pl-4 border-l-2 border-border ml-2">
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-semibold text-foreground/70 min-w-[90px]">Purpose:</span>
                                                        <span className="text-muted-foreground">{n.ctx.intent}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-semibold text-foreground/70 min-w-[90px]">Observation:</span>
                                                        <span className="text-foreground/80">{n.interpretation}</span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-semibold text-foreground/70 min-w-[90px]">Impact:</span>
                                                        <span className={`font-semibold ${n.passed ? 'text-green-700' : 'text-red-700'}`}>
                                                            {n.impact}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <span className="font-semibold text-foreground/70 min-w-[90px]">Role:</span>
                                                        <span className="text-muted-foreground">{n.ctx.role}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
                        <h4 className="font-bold text-foreground mb-2">📖 How to Interpret This Decision</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <p>
                                Each factor represents a <strong>key question</strong> the AI model considered. Only factors
                                with significant (non-neutral) impact are shown.
                            </p>
                            <p>
                                Click the <Info className="w-3 h-3 inline mx-1" /> icon to see detailed analysis. Factors marked{' '}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-600 text-white text-xs font-semibold rounded">
                                    <Shield className="w-3 h-3" />
                                    CRITICAL
                                </span>{' '}
                                are hard constraints that protect network quality.
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                /* Reasoning Path Tab */
                <div className="space-y-6">
                    <div className="mb-4 p-4 bg-indigo-600 border-l-4 border-white/20 rounded">
                        <div className="flex items-center gap-3 mb-2">
                            {finalDecision ? <CheckCircle className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
                            <div>
                                <div className="text-sm text-white font-medium">Final Decision</div>
                                <div className="text-2xl font-bold text-white">{finalLabel}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-muted/40 rounded-lg p-6 overflow-x-auto">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <GitBranch className="w-5 h-5 text-primary" />
                            Decision Tree Visualization
                        </h3>
                        <div className="flex justify-center py-8">
                            {renderTreeNode(trace.path, 0, finalDecision)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-300 rounded dark:bg-green-950/40">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div className="text-sm">
                                <div className="font-semibold text-green-900 dark:text-green-300">Condition Met</div>
                                <div className="text-green-700 dark:text-green-400">Branch taken</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-300 rounded dark:bg-red-950/40">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <div className="text-sm">
                                <div className="font-semibold text-red-900 dark:text-red-300">Condition Not Met</div>
                                <div className="text-red-700 dark:text-red-400">Branch not taken</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-300 rounded dark:bg-blue-950/40">
                            <GitBranch className="w-5 h-5 text-blue-600" />
                            <div className="text-sm">
                                <div className="font-semibold text-blue-900 dark:text-blue-300">Leaf Node</div>
                                <div className="text-blue-700 dark:text-blue-400">Final decision</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Tree node renderer ───────────────────────────────────

function renderTreeNode(
    path: DecisionTreeTrace['path'],
    index: number,
    finalDecision?: boolean,
): React.ReactNode {
    if (index >= path.length) return null;
    const node = path[index];
    const isLeaf = node.featureName === 'LEAF';
    const nextNode = index + 1 < path.length ? path[index + 1] : null;

    if (isLeaf) {
        return (
            <div className="flex flex-col items-center">
                <div
                    className={`px-6 py-4 rounded-lg border-2 shadow-lg ${
                        finalDecision ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                    }`}
                >
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {finalDecision ? (
                                <CheckCircle className="w-6 h-6 text-green-700" />
                            ) : (
                                <XCircle className="w-6 h-6 text-red-700" />
                            )}
                            <div className="font-bold text-lg">Leaf Node</div>
                        </div>
                        <div className={`text-sm font-semibold ${finalDecision ? 'text-green-800' : 'text-red-800'}`}>
                            {node.condition}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <div
                className={`px-6 py-4 rounded-lg border-2 shadow-md min-w-[280px] bg-card ${
                    node.passed ? 'border-green-400' : 'border-border opacity-60'
                }`}
            >
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        {node.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                        )}
                        <span className="text-xs font-semibold text-muted-foreground">Node {node.nodeId}</span>
                    </div>
                    <div className="font-bold text-sm text-foreground break-words">{node.featureName}</div>
                    <div className="text-xs text-foreground/70 bg-muted rounded px-2 py-1">{node.condition}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                        <div>
                            <div className="text-muted-foreground">Threshold</div>
                            <div className="font-semibold">{node.threshold.toFixed(3)}</div>
                        </div>
                        <div>
                            <div className="text-muted-foreground">Value</div>
                            <div className="font-semibold">{node.featureValue.toFixed(3)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {nextNode && (
                <div className="flex flex-col items-center">
                    <div className={`w-0.5 h-12 ${node.passed ? 'bg-green-500' : 'bg-border'}`} />
                    <div
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                            node.passed ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}
                    >
                        {node.passed ? (
                            <span className="flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                True
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                False
                            </span>
                        )}
                    </div>
                    <div className={`w-0.5 h-8 ${node.passed ? 'bg-green-500' : 'bg-border'}`} />
                    {renderTreeNode(path, index + 1, finalDecision)}
                </div>
            )}
        </div>
    );
}

// ── Batch panel ──────────────────────────────────────────

interface BatchPanelProps {
    batchResult: BatchTraceResult;
    selectedCellId: string | null;
    onSelectCell: (id: string | null) => void;
}

function BatchDecisionPanel({ batchResult, selectedCellId, onSelectCell }: BatchPanelProps) {
    const [filterMode, setFilterMode] = useState<'all' | 'applied' | 'not_applied' | 'error'>('all');
    const [search, setSearch] = useState('');

    const filtered = batchResult.results.filter((r) => {
        if (!r.cellId.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterMode === 'applied') return r.decision === true;
        if (filterMode === 'not_applied') return r.decision === false;
        if (filterMode === 'error') return r.error !== null;
        return true;
    });

    const selectedResult: CellDecisionResult | undefined = selectedCellId
        ? batchResult.results.find((r) => r.cellId === selectedCellId)
        : undefined;

    const selectedTrace: DecisionTreeTrace | null =
        selectedResult && selectedResult.decision !== null
            ? {
                  intentId: selectedResult.cellId,
                  intentLabel: selectedResult.modelType,
                  decision: selectedResult.decision ?? undefined,
                  confidence: selectedResult.confidence ?? undefined,
                  path: selectedResult.path,
                  topFeatures: selectedResult.topFeatures,
                  counterfactual: selectedResult.counterfactual,
                  featureSnapshot: selectedResult.featureSnapshot,
              }
            : null;

    const confidentResults = batchResult.results.filter((r) => r.confidence !== null);
    const avgConf =
        confidentResults.length > 0
            ? confidentResults.reduce((s, r) => s + (r.confidence ?? 0), 0) / confidentResults.length
            : null;

    return (
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Multi-Cell {batchResult.modelType} Decision Results
            </h2>

            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {[
                    { label: 'Total Cells', value: batchResult.totalCells, cls: 'bg-muted text-foreground border-border' },
                    {
                        label: `Apply ${batchResult.modelType}`,
                        value: batchResult.appliedCount,
                        cls: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/40 dark:text-green-300',
                        onClick: () => setFilterMode(filterMode === 'applied' ? 'all' : 'applied'),
                    },
                    {
                        label: 'Do Not Apply',
                        value: batchResult.notAppliedCount,
                        cls: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300',
                        onClick: () => setFilterMode(filterMode === 'not_applied' ? 'all' : 'not_applied'),
                    },
                    {
                        label: 'Errors',
                        value: batchResult.errorCount,
                        cls: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300',
                        onClick: () => setFilterMode(filterMode === 'error' ? 'all' : 'error'),
                    },
                    {
                        label: 'Avg Confidence',
                        value: avgConf != null ? `${(avgConf * 100).toFixed(0)}%` : 'N/A',
                        cls: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300',
                    },
                ].map((s, i) => (
                    <div
                        key={i}
                        className={`rounded-lg border p-3 text-center ${s.cls} ${s.onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
                        onClick={s.onClick}
                    >
                        <div className="text-xs mb-1 opacity-80">{s.label}</div>
                        <div className="text-2xl font-bold">{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            {batchResult.totalCells > 0 && (
                <div className="mb-6">
                    <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                        {batchResult.appliedCount > 0 && (
                            <div
                                className="bg-green-500 transition-all"
                                style={{ width: `${(batchResult.appliedCount / batchResult.totalCells) * 100}%` }}
                            />
                        )}
                        {batchResult.notAppliedCount > 0 && (
                            <div
                                className="bg-orange-400 transition-all"
                                style={{ width: `${(batchResult.notAppliedCount / batchResult.totalCells) * 100}%` }}
                            />
                        )}
                        {batchResult.errorCount > 0 && (
                            <div
                                className="bg-red-500 transition-all"
                                style={{ width: `${(batchResult.errorCount / batchResult.totalCells) * 100}%` }}
                            />
                        )}
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Applied</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" /> Not Applied</span>
                        {batchResult.errorCount > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Error</span>}
                    </div>
                </div>
            )}

            {/* Search + filter */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search by cell ID…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                />
                <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value as typeof filterMode)}
                    className="px-3 py-2 rounded-md border border-input bg-background text-sm"
                >
                    <option value="all">All ({batchResult.totalCells})</option>
                    <option value="applied">Applied ({batchResult.appliedCount})</option>
                    <option value="not_applied">Not Applied ({batchResult.notAppliedCount})</option>
                    {batchResult.errorCount > 0 && (
                        <option value="error">Errors ({batchResult.errorCount})</option>
                    )}
                </select>
            </div>

            {/* Results table */}
            <div className="rounded-lg overflow-hidden border border-border mb-6">
                <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <div className="col-span-4">Cell ID</div>
                    <div className="col-span-3 text-center">Decision</div>
                    <div className="col-span-3 text-center">Confidence</div>
                    <div className="col-span-2 text-center">Details</div>
                </div>
                <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No cells match the current filter
                        </div>
                    ) : (
                        filtered.map((result) => {
                            const isSelected = result.cellId === selectedCellId;
                            return (
                                <div
                                    key={result.cellId}
                                    className={`grid grid-cols-12 gap-2 px-4 py-3 cursor-pointer transition-all hover:bg-accent/50 ${
                                        isSelected ? 'bg-accent border-l-4 border-primary' : ''
                                    } ${result.error ? 'bg-red-50/50 dark:bg-red-950/20' : ''}`}
                                    onClick={() => onSelectCell(isSelected ? null : result.cellId)}
                                >
                                    <div className="col-span-4 flex items-center">
                                        <span className="text-sm font-mono font-semibold text-foreground">{result.cellId}</span>
                                    </div>
                                    <div className="col-span-3 flex items-center justify-center">
                                        {result.error ? (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                                <XCircle className="w-3 h-3" /> Error
                                            </span>
                                        ) : result.decision ? (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                                <CheckCircle className="w-3 h-3" /> Apply {batchResult.modelType}
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                                                <XCircle className="w-3 h-3" /> Do Not Apply
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-3 flex items-center justify-center">
                                        {result.confidence != null ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-muted rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${result.confidence > 0.8 ? 'bg-green-500' : result.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${result.confidence * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">N/A</span>
                                        )}
                                    </div>
                                    <div className="col-span-2 flex items-center justify-center">
                                        <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Detail view */}
            {selectedCellId && selectedTrace && (
                <div className="border-t-2 border-primary/30 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Decision Detail: <span className="font-mono">{selectedCellId}</span>
                        </h3>
                        <button
                            onClick={() => onSelectCell(null)}
                            className="px-3 py-1 text-sm text-muted-foreground hover:text-primary-foreground hover:bg-primary rounded border border-border transition-colors"
                        >
                            Close Detail
                        </button>
                    </div>
                    <SingleTracePanel trace={selectedTrace} />
                </div>
            )}

            {selectedCellId && !selectedTrace && (
                <div className="border-t-2 border-destructive/30 pt-6">
                    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-center text-destructive">
                        Could not load detailed trace for{' '}
                        <span className="font-mono font-bold">{selectedCellId}</span>.
                        {batchResult.results.find((r) => r.cellId === selectedCellId)?.error && (
                            <div className="text-sm mt-1">
                                Error: {batchResult.results.find((r) => r.cellId === selectedCellId)?.error}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Export ───────────────────────────────────────────────

export default function DecisionTreeTracePanel({ trace, batchResult }: Props) {
    const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

    if (batchResult) {
        return (
            <BatchDecisionPanel
                batchResult={batchResult}
                selectedCellId={selectedCellId}
                onSelectCell={setSelectedCellId}
            />
        );
    }

    if (!trace) return null;

    return <SingleTracePanel trace={trace} />;
}
