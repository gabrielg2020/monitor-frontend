export interface SystemMetric {
    id: number;
    host_id: number;
    timestamp: number;
    cpu_usage: number;
    memory_usage_percent: number;
    memory_total_bytes: number;
    memory_used_bytes: number;
    memory_available_bytes: number;
    disk_usage_percent: number;
    disk_total_bytes: number;
    disk_used_bytes: number;
    disk_available_bytes: number;
}

export interface Host {
    id: number;
    hostname: string;
    ip_address: string;
    role: string;
}

export interface MetricMeta {
    count: number;
    limit: number;
}

export interface HostMeta {
    count: number;
}

// Response structures for API

export interface MetricResponse {
    meta: MetricMeta;
    records: SystemMetric[];
}

export interface HostResponse {
    meta: HostMeta;
    hosts: Host[];
}