import { useCallback, useEffect, useRef, useState } from 'react';
import { streamSystemScan, formatTimestamp } from './api';
import type { SystemScanEvent, SystemScanRequest } from './types';

/**
 * Hook that manages the SSE streaming lifecycle for a system scan.
 * Lifting this out of the component ensures the stream stays alive
 * regardless of how the UI is split across layout regions.
 */
export function useSystemScan(
    cellName: string | null | undefined,
    selectedDate: Date,
) {
    const [events, setEvents] = useState<SystemScanEvent[]>([]);
    const [payload, setPayload] = useState<Record<string, unknown> | null>(
        null,
    );
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const startScan = useCallback(() => {
        if (!cellName) return;

        abortRef.current?.abort();
        setEvents([]);
        setPayload(null);
        setError(null);
        setStreaming(true);

        const request: SystemScanRequest = {
            task_type: 'MRO',
            cells: [cellName],
            timestamp: formatTimestamp(selectedDate),
            enable_web_search: false,
            save_to_db: false,
        };

        const controller = streamSystemScan(
            request,
            (event) => {
                setEvents((prev: SystemScanEvent[]) => [...prev, event]);
                if (event.type === 'done' && event.payload) {
                    setPayload(event.payload);
                }
                if (event.type === 'error') {
                    setError(event.text);
                }
            },
            () => setStreaming(false),
            (err) => {
                setError(err.message);
                setStreaming(false);
            },
        );

        abortRef.current = controller;
    }, [cellName, selectedDate]);

    useEffect(() => {
        if (cellName) {
            startScan();
        } else {
            abortRef.current?.abort();
            setEvents([]);
            setPayload(null);
            setError(null);
            setStreaming(false);
        }
        return () => {
            abortRef.current?.abort();
        };
    }, [cellName, selectedDate, startScan]);

    return { events, payload, streaming, error, startScan };
}
