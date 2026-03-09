export interface CityInfo {
    city_code: string | null;
    city_name: string | null;
    city_number_id: string | null;
}

export interface CellInfoRow {
    cell_name: string;
    cell_identity: number | null;
    station_name: string | null;
    cu_ip: string | null;
    sector: number | null;
    longitude: number | null;
    latitude: number | null;
    city: CityInfo | null;
}

export interface CellListParams {
    city_code?: string;
    station_name?: string;
    search?: string;
    limit?: number;
    offset?: number;
}
