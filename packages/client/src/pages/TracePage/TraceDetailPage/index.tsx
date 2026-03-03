import {
    CheckCircle2Icon,
    ChevronDownIcon,
    ChevronRightIcon,
    ClockIcon,
    CopyIcon,
    EyeIcon,
    HashIcon,
    LoaderIcon,
    XCircleIcon,
    ZapIcon,
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PageTitleSpan from '@/components/spans/PageTitleSpan';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { useTraceContext } from '@/context/TraceContext';
import {
    copyToClipboard,
    formatDateTime,
    formatDurationWithUnit,
} from '@/utils/common';
import { SpanData } from '@shared/types/trace';
import { getNestedValue } from '@shared/utils/objectUtils';

interface SpanTreeNode {
    span: SpanData;
    children?: SpanTreeNode[];
}

const getStatusIcon = (statusCode: number) => {
    if (statusCode === 2) {
        return <XCircleIcon className="size-4 text-destructive" />;
    } else if (statusCode === 1) {
        return <CheckCircle2Icon className="size-4 text-green-500" />;
    }
    return null;
};

const getSpanKindLabel = (kind: number): string => {
    switch (kind) {
        case 1: return 'INTERNAL';
        case 2: return 'SERVER';
        case 3: return 'CLIENT';
        case 4: return 'PRODUCER';
        case 5: return 'CONSUMER';
        default: return '';
    }
};

interface TraceDetailPageProps {
    traceId: string;
}

const TraceDetailPage = ({ traceId }: TraceDetailPageProps) => {
    const { t } = useTranslation();
    const {
        traceData,
        isLoadingTrace: isLoading,
        selectedTraceId,
        setSelectedTraceId,
    } = useTraceContext();
    const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);
    const [idPanelOpen, setIdPanelOpen] = useState(false);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

    // Sync traceId prop with context's selectedTraceId
    useEffect(() => {
        if (traceId && traceId !== selectedTraceId) {
            setSelectedTraceId(traceId);
        }
    }, [traceId, selectedTraceId, setSelectedTraceId]);

    // Use all spans from trace data
    const filteredSpans = useMemo(() => {
        if (!traceData?.spans) return [];
        return traceData.spans;
    }, [traceData]);

    // Build tree structure from spans
    const treeData = useMemo(() => {
        if (!filteredSpans.length) return [];

        const spanMap = new Map<string, SpanTreeNode>();
        const rootNodes: SpanTreeNode[] = [];

        // First pass: create all nodes
        filteredSpans.forEach((span) => {
            const node: SpanTreeNode = {
                span,
                children: [],
            };
            spanMap.set(span.spanId, node);
        });

        // Second pass: build tree structure
        filteredSpans.forEach((span) => {
            const node = spanMap.get(span.spanId)!;
            if (!span.parentSpanId || !spanMap.has(span.parentSpanId)) {
                rootNodes.push(node);
            } else {
                const parent = spanMap.get(span.parentSpanId)!;
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(node);
            }
        });

        return rootNodes;
    }, [filteredSpans]);

    // Auto-expand all tree nodes when trace data loads
    useEffect(() => {
        if (filteredSpans.length > 0) {
            const allIds = new Set(filteredSpans.map((s) => s.spanId));
            setExpandedNodes(allIds);
        }
    }, [filteredSpans]);

    const selectedSpan = useMemo(() => {
        if (!selectedSpanId || !filteredSpans.length) return null;
        return filteredSpans.find((s) => s.spanId === selectedSpanId) || null;
    }, [selectedSpanId, filteredSpans]);

    // Get root span for overall trace info
    const rootSpan = useMemo(() => {
        if (!filteredSpans.length) return null;
        return (
            filteredSpans.find((s) => !s.parentSpanId) ||
            filteredSpans[0] ||
            null
        );
    }, [filteredSpans]);

    // Calculate trace total duration (from earliest start to latest end)
    const traceTimingContext = useMemo(() => {
        if (!filteredSpans.length) return { duration: 0, earliestStart: BigInt(0) };
        const startTimes = filteredSpans.map((s) =>
            BigInt(s.startTimeUnixNano),
        );
        const endTimes = filteredSpans.map((s) => BigInt(s.endTimeUnixNano));
        const earliestStart = startTimes.reduce((a, b) => (a < b ? a : b));
        const latestEnd = endTimes.reduce((a, b) => (a > b ? a : b));
        return {
            duration: Number(latestEnd - earliestStart) / 1e9,
            earliestStart,
            totalNanos: Number(latestEnd - earliestStart),
        };
    }, [filteredSpans]);

    const traceDuration = traceTimingContext.duration;

    // Display span (selected or root)
    const displaySpan = selectedSpan || rootSpan;

    const handleCopy = async (text: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            // TODO: Add toast notification
            console.log(t('trace.message.copySuccess'));
            setIdPanelOpen(false);
        } else {
            console.error(t('trace.message.copyFailed'));
        }
    };

    const getStatusText = (statusCode: number): string => {
        if (statusCode === 2) return t('trace.status.error');
        if (statusCode === 1) return t('trace.status.ok');
        return t('trace.status.unset');
    };

    const extractInput = (span: SpanData): unknown => {
        const attrs = span.attributes || {};
        const genAiMessages = getNestedValue(attrs, 'gen_ai.input.messages');
        if (genAiMessages !== undefined) {
            return genAiMessages;
        }
        const agentscopeInput = getNestedValue(
            attrs,
            'agentscope.function.input',
        );
        if (agentscopeInput !== undefined) {
            return agentscopeInput;
        }
        const directInput = getNestedValue(attrs, 'input');
        if (directInput !== undefined) {
            return directInput;
        }
        return attrs;
    };

    const extractOutput = (span: SpanData): unknown => {
        const attrs = span.attributes || {};
        const genAiMessages = getNestedValue(attrs, 'gen_ai.output.messages');
        if (genAiMessages !== undefined) {
            return genAiMessages;
        }
        const agentscopeOutput = getNestedValue(
            attrs,
            'agentscope.function.output',
        );
        if (agentscopeOutput !== undefined) {
            return agentscopeOutput;
        }
        const directOutput = getNestedValue(attrs, 'output');
        if (directOutput !== undefined) {
            return directOutput;
        }
        return null;
    };

    const getTotalTokens = (span: SpanData): number | undefined => {
        const attrs = span.attributes || {};
        const inputTokens = getNestedValue(
            attrs,
            'gen_ai.usage.input_tokens',
        ) as number | undefined;
        const outputTokens = getNestedValue(
            attrs,
            'gen_ai.usage.output_tokens',
        ) as number | undefined;
        if (inputTokens !== undefined || outputTokens !== undefined) {
            return (inputTokens || 0) + (outputTokens || 0);
        }
        return undefined;
    };

    // Toggle expand/collapse for a node
    const toggleNode = useCallback((spanId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setExpandedNodes((prev) => {
            const next = new Set(prev);
            if (next.has(spanId)) {
                next.delete(spanId);
            } else {
                next.add(spanId);
            }
            return next;
        });
    }, []);

    const renderTreeNode = (node: SpanTreeNode, level = 0): React.ReactNode => {
        const spanStartNano = BigInt(node.span.startTimeUnixNano);
        const spanEndNano = BigInt(node.span.endTimeUnixNano);
        const duration = Number(spanEndNano - spanStartNano) / 1e9;
        const isSelected = selectedSpanId === node.span.spanId;
        const hasChildren = node.children && node.children.length > 0;

        // Waterfall bar calculations
        const totalNanos = traceTimingContext.totalNanos || 1;
        const offsetPercent = Number(spanStartNano - traceTimingContext.earliestStart) / totalNanos * 100;
        const widthPercent = Math.max(Number(spanEndNano - spanStartNano) / totalNanos * 100, 0.5);

        const statusCode = node.span.status?.code || 0;
        const barColor = statusCode === 2 ? 'bg-destructive/60' : statusCode === 1 ? 'bg-green-500/60' : 'bg-primary/40';

        return (
            <div key={node.span.spanId} className="w-full">
                <div
                    className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors hover:bg-muted/80 overflow-hidden ${
                        isSelected ? 'bg-muted ring-1 ring-primary/30' : ''
                    }`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    onClick={() => setSelectedSpanId(node.span.spanId)}
                >
                    {hasChildren ? (
                        <button
                            onClick={(e) => toggleNode(node.span.spanId, e)}
                            className="p-0.5 rounded hover:bg-muted-foreground/10"
                        >
                            {expandedNodes.has(node.span.spanId) ? (
                                <ChevronDownIcon className="size-3" />
                            ) : (
                                <ChevronRightIcon className="size-3" />
                            )}
                        </button>
                    ) : (
                        <div className="w-4" />
                    )}
                    {getStatusIcon(statusCode)}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="text-sm truncate min-w-0 flex-shrink">
                                {node.span.name}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span className="text-xs break-all max-w-[400px]">
                                {node.span.name}
                            </span>
                        </TooltipContent>
                    </Tooltip>
                    {/* Waterfall timeline bar */}
                    <div className="flex-1 min-w-[60px] h-4 relative mx-1">
                        <div className="absolute inset-0 bg-muted/50 rounded-sm" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className={`absolute top-0.5 bottom-0.5 rounded-sm ${barColor} transition-all`}
                                    style={{
                                        left: `${offsetPercent}%`,
                                        width: `${widthPercent}%`,
                                        minWidth: '2px',
                                    }}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-xs">{formatDurationWithUnit(duration)}</span>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                        {formatDurationWithUnit(duration)}
                    </span>
                </div>
                {hasChildren &&
                    expandedNodes.has(node.span.spanId) &&
                    node.children?.map((child) =>
                        renderTreeNode(child, level + 1),
                    )}
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            {/* Sidebar - Span Tree with Waterfall */}
            <div className="w-full lg:w-[440px] lg:min-w-[440px] bg-background border-b lg:border-b-0 lg:border-r border-border overflow-auto max-h-[40vh] lg:max-h-none">
                <div className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                        <PageTitleSpan title={t('trace.nodeDetails')} />
                        {filteredSpans.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                                {filteredSpans.length} spans
                            </Badge>
                        )}
                    </div>
                    {rootSpan && (
                        <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="p-2 bg-muted rounded-md text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                    {t('common.status')}
                                </div>
                                <Badge
                                    variant={rootSpan.status?.code === 2 ? 'destructive' : rootSpan.status?.code === 1 ? 'default' : 'secondary'}
                                    className="text-[10px] px-1.5 py-0"
                                >
                                    {getStatusText(rootSpan.status?.code || 0)}
                                </Badge>
                            </div>
                            <div className="p-2 bg-muted rounded-md text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                    {t('table.column.duration')}
                                </div>
                                <span className="text-xs font-semibold tabular-nums">
                                    {formatDurationWithUnit(traceDuration)}
                                </span>
                            </div>
                            <div className="p-2 bg-muted rounded-md text-center">
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
                                    {t('table.column.startTime')}
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="text-xs font-medium truncate block">
                                            {formatDateTime(rootSpan.startTimeUnixNano).split(' ')[1] || formatDateTime(rootSpan.startTimeUnixNano)}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {formatDateTime(rootSpan.startTimeUnixNano)}
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    )}
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
                        <LoaderIcon className="size-4 animate-spin" />
                        <span className="text-sm">{t('trace.detail.loading')}</span>
                    </div>
                ) : treeData.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground text-sm">
                        {t('trace.selectSpan')}
                    </div>
                ) : (
                    <div className="px-2 pb-4">
                        {treeData.map((node) => renderTreeNode(node))}
                    </div>
                )}
            </div>

            {/* Main Content - Span Detail */}
            <div className="flex-1 bg-background p-4 sm:p-6 overflow-auto min-h-0">
                {displaySpan ? (
                    <>
                        {/* Span Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                            <div className="flex items-center gap-2 min-w-0">
                                {getStatusIcon(displaySpan.status?.code || 0)}
                                <h2 className="m-0 text-lg sm:text-xl break-words truncate">
                                    {displaySpan.name}
                                </h2>
                                {getSpanKindLabel(displaySpan.kind) && (
                                    <Badge variant="outline" className="text-[10px] shrink-0">
                                        {getSpanKindLabel(displaySpan.kind)}
                                    </Badge>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIdPanelOpen(!idPanelOpen)}
                                className="shrink-0"
                            >
                                <HashIcon className="size-3 mr-1.5" />
                                {t('common.id')}
                            </Button>
                        </div>

                        {/* ID Panel */}
                        {idPanelOpen && (
                            <div className="mb-4 p-3 bg-muted/50 border border-border rounded-lg">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="min-w-0">
                                            <span className="text-xs text-muted-foreground">{t('trace.spanId')}</span>
                                            <p className="text-sm font-mono break-all m-0">{displaySpan.spanId}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleCopy(displaySpan.spanId)}
                                            className="shrink-0"
                                        >
                                            <CopyIcon className="size-3" />
                                        </Button>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center gap-2">
                                        <div className="min-w-0">
                                            <span className="text-xs text-muted-foreground">{t('trace.traceId')}</span>
                                            <p className="text-sm font-mono break-all m-0">{traceId}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleCopy(traceId)}
                                            className="shrink-0"
                                        >
                                            <CopyIcon className="size-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Performance Metrics */}
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                                <div className="flex items-center justify-center size-8 rounded-md bg-blue-500/10">
                                    <ClockIcon className="size-4 text-blue-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        {t('common.start-time')}
                                    </div>
                                    <div className="text-sm font-medium break-words">
                                        {formatDateTime(displaySpan.startTimeUnixNano)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                                <div className="flex items-center justify-center size-8 rounded-md bg-amber-500/10">
                                    <ZapIcon className="size-4 text-amber-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        {t('table.column.duration')}
                                    </div>
                                    <div className="text-sm font-semibold tabular-nums">
                                        {formatDurationWithUnit(
                                            Number(
                                                BigInt(displaySpan.endTimeUnixNano) -
                                                BigInt(displaySpan.startTimeUnixNano),
                                            ) / 1e9,
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                                <div className="flex items-center justify-center size-8 rounded-md bg-purple-500/10">
                                    <HashIcon className="size-4 text-purple-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        {t('common.total-tokens')}
                                    </div>
                                    <div className="text-sm font-semibold tabular-nums">
                                        {getTotalTokens(displaySpan)?.toLocaleString() || '-'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Data Sections - both open by default */}
                        <Accordion
                            type="multiple"
                            defaultValue={['info', 'attributes']}
                        >
                            <AccordionItem value="info">
                                <AccordionTrigger>
                                    {t('common.metadata')}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-medium flex items-center gap-1.5">
                                                    <span className="inline-block size-2 rounded-full bg-blue-500" />
                                                    {t('common.input')}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() =>
                                                        handleCopy(
                                                            JSON.stringify(
                                                                extractInput(displaySpan),
                                                                null,
                                                                2,
                                                            ),
                                                        )
                                                    }
                                                    className="h-6 w-6"
                                                >
                                                    <CopyIcon className="size-3" />
                                                </Button>
                                            </div>
                                            <pre className="bg-muted p-3 rounded-lg overflow-auto max-h-[300px] text-xs font-mono leading-relaxed border border-border/50">
                                                {JSON.stringify(
                                                    extractInput(displaySpan),
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </div>
                                        <Separator />
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-medium flex items-center gap-1.5">
                                                    <span className="inline-block size-2 rounded-full bg-green-500" />
                                                    {t('common.output')}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() =>
                                                        handleCopy(
                                                            JSON.stringify(
                                                                extractOutput(displaySpan),
                                                                null,
                                                                2,
                                                            ),
                                                        )
                                                    }
                                                    className="h-6 w-6"
                                                >
                                                    <CopyIcon className="size-3" />
                                                </Button>
                                            </div>
                                            <pre className="bg-muted p-3 rounded-lg overflow-auto max-h-[300px] text-xs font-mono leading-relaxed border border-border/50">
                                                {JSON.stringify(
                                                    extractOutput(displaySpan),
                                                    null,
                                                    2,
                                                )}
                                            </pre>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="attributes">
                                <AccordionTrigger>
                                    {t('common.attributes')}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="text-sm font-medium">
                                            {t('common.attributes')}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() =>
                                                handleCopy(
                                                    JSON.stringify(
                                                        displaySpan.attributes,
                                                        null,
                                                        2,
                                                    ),
                                                )
                                            }
                                            className="h-6 w-6"
                                        >
                                            <CopyIcon className="size-3" />
                                        </Button>
                                    </div>
                                    <pre className="bg-muted p-3 rounded-lg overflow-auto max-h-[400px] text-xs font-mono leading-relaxed border border-border/50">
                                        {JSON.stringify(
                                            displaySpan.attributes,
                                            null,
                                            2,
                                        )}
                                    </pre>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                        <EyeIcon className="size-8 opacity-30" />
                        <span className="text-sm">{t('trace.selectSpan')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(TraceDetailPage);