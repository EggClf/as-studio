import { memo, useEffect, useRef } from 'react';
import {
    Loader2,
    Radio,
    RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { ReasoningProgressEvent } from './types';

// ── sub-components ──────────────────────────────────────

const ProgressRow = ({ event }: { event: ReasoningProgressEvent }) => {
    const isDone = event.type === 'done' || event.type === 'scan_done' || event.type === 'strategic_done';
    const isError = event.type === 'error';
    return (
        <div
            className={cn(
                'flex items-start gap-2 px-3 py-2 rounded-md border text-sm',
                isError
                    ? 'bg-destructive/10 border-destructive/20'
                    : isDone
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                      : 'bg-muted/50 border-border/50',
            )}
        >
            <span className="shrink-0 text-base leading-none mt-0.5">
                {event.icon}
            </span>
            <span className="text-xs leading-relaxed text-foreground/80">
                {event.text}
            </span>
        </div>
    );
};

// ── main component ──────────────────────────────────────

interface Props {
    events: ReasoningProgressEvent[];
    streaming: boolean;
    taskType: string;
    onReconnect?: () => void;
}

const LiveReasoningPanel = ({ events, streaming, taskType, onReconnect }: Props) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [events]);

    const isDone = events.some((e) => e.type === 'done');

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                    <Radio
                        className={cn(
                            'size-4',
                            streaming
                                ? 'text-green-500 animate-pulse'
                                : 'text-muted-foreground',
                        )}
                    />
                    <h2 className="text-sm font-bold text-foreground">
                        Live Reasoning
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                        {taskType}
                    </Badge>
                    {streaming && (
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                    )}
                    {isDone && (
                        <Badge className="text-[10px] bg-green-600">
                            Complete
                        </Badge>
                    )}
                    {!streaming && events.length > 0 && onReconnect && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={onReconnect}
                            title="Reconnect stream"
                        >
                            <RefreshCw className="size-3.5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Scrollable content */}
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1.5 p-4">
                    {events.map((evt, i) => (
                        <ProgressRow key={i} event={evt} />
                    ))}

                    {streaming && !isDone && (
                        <div className="flex items-center gap-2 px-3 py-2">
                            <Loader2 className="size-4 animate-spin text-primary" />
                            <span className="text-xs text-muted-foreground">
                                Processing…
                            </span>
                        </div>
                    )}

                    {!streaming && events.length === 0 && (
                        <div className="flex flex-col items-center gap-3 py-12 text-center">
                            <Radio className="size-10 text-muted-foreground/40" />
                            <p className="text-sm text-muted-foreground">
                                No reasoning data available
                            </p>
                            {onReconnect && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onReconnect}
                                >
                                    <RefreshCw className="size-3.5 mr-1.5" />
                                    Connect
                                </Button>
                            )}
                        </div>
                    )}

                    <div ref={scrollRef} />
                </div>
            </ScrollArea>
        </div>
    );
};

export default memo(LiveReasoningPanel);
