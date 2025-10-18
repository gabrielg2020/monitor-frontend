import type {HostResponse, MetricResponse} from "../types";

const API_ADDRESS = import.meta.env.VITE_API_ADDRESS as string || 'http://localhost';
const API_PORT = import.meta.env.VITE_API_PORT as string || '8191';
const API_VERSION = import.meta.env.VITE_API_VERSION as string || 'v1';

const BASE_URL = `${API_ADDRESS}:${API_PORT}/api/${API_VERSION}`;

export const getMetricsByHostID = async (hostID: number, limit: number = 10): Promise<MetricResponse> => {
    const response = await fetch(`${BASE_URL}/metrics?host_id=${hostID}&limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Error fetching metrics for hostname ${hostID}: ${response.statusText}`);
    }

    return await response.json();
}

export const getHosts = async (): Promise<HostResponse> => {
    const response = await fetch(`${BASE_URL}/hosts`);

    if (!response.ok) {
        throw new Error(`Error fetching hosts: ${response.statusText}`);
    }

    return await response.json();
}