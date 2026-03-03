import { TableColumnsType } from 'antd';
import {
    ActivityIcon,
    CheckCircle2Icon,
    ClockIcon,
    CopyIcon,
    HashIcon,
    XCircleIcon,
} from 'lucide-react';
import { Key, memo, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import NumberCounter from '@/components/numbers/NumberCounter';
import PageTitleSpan from '@/components/spans/PageTitleSpan';
import AsTable from '@/components/tables/AsTable';
import { Button } from '@/components/ui/button.tsx';
import { Sheet, SheetContent } from '@/components/ui/sheet.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { useMessageApi } from '@/context/MessageApiContext';
import { useTraceContext } from '@/context/TraceContext';
import {
    copyToClipboard,
    formatDateTime,
    formatDuration,
    formatDurationWithUnit,
    formatNumber,
} from '@/utils/common';
import { Trace } from '@shared/types';
import TraceDetailPage from '../TraceDetailPage';

// Helper component for statistic cards with icon
const StatCard = ({
    title,
    value,
    unit,
    icon,
    iconColorClass,
}: {
    title: string;
    value: number | string | undefined;
    unit?: string;
    icon?: React.ReactNode;
    iconColorClass?: string;
}) => {
    return (
        <div className="border border-border rounded-lg p-4 flex items-start gap-3 shadow-sm">
            {icon && (
                <div className={`flex items-center justify-center size-9 rounded-md shrink-0 ${iconColorClass || 'bg-primary/10'}`}>
                    {icon}
                </div>
            )}
            <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[13px] font-medium text-muted-foreground">
                    {title}
                </span>
                <div className="flex items-baseline gap-1">
                    {typeof value === 'number' ? (
                        <NumberCounter
                            number={value}
                            style={{ fontSize: 22, fontWeight: 700 }}
                        />
                    ) : (
                        <span style={{ fontSize: 22, fontWeight: 700 }} className="tabular-nums">
                            {value || '-'}
                        </span>
                    )}
                    {unit && (
                        <span className="text-[12px] text-muted-foreground">
                            {unit}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

const TraceListPage = () => {
    const { t } = useTranslation();
    const { messageApi } = useMessageApi();
    const {
        // Filter state
        timeRange,
        setTimeRange,

        tableRequestParams,
        setTableRequestParams,

        // Data
        traces,
        statistics,
        isLoading,
        error,
        total,

        // Selected trace
        selectedTraceId,
        setSelectedTraceId,
        drawerOpen,
        setDrawerOpen,
    } = useTraceContext();

    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

    // Filter the selected rows when traces data changes
    useEffect(() => {
        const existedTraceIds = traces.map((trace) => trace.traceId);
        setSelectedRowKeys((prevRowKeys) =>
            prevRowKeys.filter((id) => existedTraceIds.includes(id as string)),
        );
    }, [traces]);

    const getStatusDisplay = (status: number) => {
        if (status === 2) {
            return (
                <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-4 text-destructive" />
                    <span>{t('trace.status.error')}</span>
                </div>
            );
        } else if (status === 1) {
            return (
                <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-4 text-green-500" />
                    <span>{t('trace.status.ok')}</span>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <CheckCircle2Icon className="size-4 text-muted-foreground" />
                <span>{t('trace.status.unset')}</span>
            </div>
        );
    };

    const getLatencyColor = (seconds: number): string => {
        if (seconds > 30) return 'text-destructive';
        if (seconds > 10) return 'text-orange-500';
        return 'text-green-500';
    };

    const handleCopy = async (text: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            messageApi.success(t('trace.message.copySuccess'));
        } else {
            messageApi.error(t('trace.message.copyFailed'));
        }
    };

    const columns: TableColumnsType<Trace> = useMemo(
        () => [
            {
                key: 'traceName',
                ellipsis: false,
                render: (_, record) => (
                    <div className="group flex items-center gap-1 min-w-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="truncate cursor-default">
                                    {record.traceName}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-xs break-all max-w-[400px]">
                                    {record.traceName}
                                </span>
                            </TooltipContent>
                        </Tooltip>
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(record.traceName);
                            }}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <CopyIcon className="size-3" />
                        </Button>
                    </div>
                ),
            },
            {
                key: 'traceId',
                ellipsis: true,
                render: (_, record) => (
                    <div className="group flex items-center gap-1 min-w-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="truncate cursor-default">
                                    {record.traceId}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span className="text-xs break-all max-w-[400px]">
                                    {record.traceId}
                                </span>
                            </TooltipContent>
                        </Tooltip>
                        <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(record.traceId);
                            }}
                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <CopyIcon className="size-3" />
                        </Button>
                    </div>
                ),
            },
            {
                key: 'startTime',
                render: (_, record) => (
                    <span className="text-xs sm:text-sm">
                        {formatDateTime(record.startTime)}
                    </span>
                ),
            },
            {
                key: 'duration',
                render: (_, record) => (
                    <span
                        className={`text-xs sm:text-sm ${getLatencyColor(record.duration)}`}
                    >
                        {formatDurationWithUnit(record.duration)}
                    </span>
                ),
            },
            {
                key: 'totalTokens',
                render: (_, record) => (
                    <span className="text-xs sm:text-sm">
                        {record.totalTokens
                            ? formatNumber(record.totalTokens)
                            : '-'}
                    </span>
                ),
            },
            {
                key: 'spanCount',
                render: (_, record) => (
                    <span className="text-xs sm:text-sm">
                        {record.spanCount
                            ? formatNumber(record.spanCount)
                            : '-'}
                    </span>
                ),
            },
            {
                key: 'status',
                render: (_, record) => getStatusDisplay(record.status),
            },
        ],
        [t, handleCopy],
    );

    const timeRangeOptions = [
        { value: 'week', label: t('trace.timeRange.week') },
        { value: 'month', label: t('trace.timeRange.month') },
        { value: 'all', label: t('trace.timeRange.all') },
    ];

    return (
        <div className="flex flex-1 flex-col gap-4 py-8 px-4 sm:px-8 lg:px-12 h-full w-full overflow-y-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageTitleSpan title={t('common.traces')} />
                {/* Time selection in top right */}
                <ToggleGroup
                    type="single"
                    value={timeRange}
                    onValueChange={(value) => {
                        if (value) {
                            setTimeRange(value as 'week' | 'month' | 'all');
                        }
                    }}
                    variant="outline"
                    size="sm"
                >
                    {timeRangeOptions.map((option) => (
                        <ToggleGroupItem
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <StatCard
                    title={t('common.total')}
                    value={statistics?.totalTraces}
                    unit={t('unit.times')}
                    icon={<ActivityIcon className="size-4 text-blue-500" />}
                    iconColorClass="bg-blue-500/10"
                />
                <StatCard
                    title={t('common.total-tokens')}
                    value={statistics?.totalTokens}
                    unit={t('unit.tokens')}
                    icon={<HashIcon className="size-4 text-purple-500" />}
                    iconColorClass="bg-purple-500/10"
                />
                <StatCard
                    title={`${t('common.average')} ${t('common.latency')}`}
                    value={
                        statistics?.avgDuration
                            ? formatDuration(statistics.avgDuration)
                            : '-'
                    }
                    unit={
                        statistics?.avgDuration !== undefined &&
                        statistics.avgDuration < 1
                            ? 'ms'
                            : 's'
                    }
                    icon={<ClockIcon className="size-4 text-amber-500" />}
                    iconColorClass="bg-amber-500/10"
                />
            </div>

            {error && (
                <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <XCircleIcon className="size-4 shrink-0" />
                    <span className="text-sm">{t('trace.message.loadFailed')}: {error.message}</span>
                </div>
            )}

            {/* Table */}
            <div className="flex-1 min-h-0 w-full">
                <AsTable<Trace>
                    columns={columns}
                    dataSource={traces}
                    loading={isLoading}
                    rowKey="traceId"
                    searchType="trace"
                    onRow={(record: Trace) => ({
                        onClick: () => {
                            setSelectedTraceId(record.traceId);
                            setDrawerOpen(true);
                        },
                        className: 'cursor-pointer',
                    })}
                    total={total}
                    tableRequestParams={tableRequestParams}
                    setTableRequestParams={setTableRequestParams}
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                    searchableColumns={['traceName', 'traceId']}
                />
            </div>

            {/* Trace Detail Sheet */}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetContent
                    side="right"
                    className="w-full sm:w-[80%] sm:max-w-[80%] p-0"
                >
                    {selectedTraceId && (
                        <TraceDetailPage traceId={selectedTraceId} />
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default memo(TraceListPage);
