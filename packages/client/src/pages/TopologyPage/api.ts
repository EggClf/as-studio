/**
 * Topology / Cell-Info API
 *
 * Reads from the same backend as Vulcan: http://172.16.28.63:8099
 * Override via VITE_VULCAN_API_URL in your .env file.
 */

import type { CellInfoRow, CellListParams } from './types';

const API_BASE =
    import.meta.env.VITE_VULCAN_API_URL || 'http://172.16.28.63:8099';

const CELL_INFO_BASE = `${API_BASE}/cell-info`;

export async function fetchCells(
    params: CellListParams = {},
): Promise<CellInfoRow[]> {
    const query = new URLSearchParams();
    if (params.city_code) query.set('city_code', params.city_code);
    if (params.station_name) query.set('station_name', params.station_name);
    if (params.search) query.set('search', params.search);
    query.set('limit', String(params.limit ?? 1000));
    if (params.offset !== undefined) query.set('offset', String(params.offset));

    const url = `${CELL_INFO_BASE}?${query}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`cell-info list failed: ${res.status}`);
    return res.json() as Promise<CellInfoRow[]>;
}

export async function fetchCellByName(cellName: string): Promise<CellInfoRow> {
    const res = await fetch(
        `${CELL_INFO_BASE}/${encodeURIComponent(cellName)}`,
    );
    if (res.status === 404) throw new Error(`Cell '${cellName}' not found`);
    if (!res.ok) throw new Error(`cell-info fetch failed: ${res.status}`);
    return res.json() as Promise<CellInfoRow>;
}
