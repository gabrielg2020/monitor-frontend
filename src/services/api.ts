import type {HostResponse, MetricResponse} from "../types";

const getEnvVar = (key: keyof typeof window.ENV, fallback: string): string => {
    if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
        return window.ENV[key];
    }
    return fallback;
};

const API_ADDRESS = getEnvVar('API_ADDRESS', import.meta.env.VITE_API_ADDRESS || 'http://localhost');
const API_PORT = getEnvVar('API_PORT', import.meta.env.VITE_API_PORT);
const API_VERSION = getEnvVar('API_VERSION', import.meta.env.VITE_API_VERSION || 'v1');

const BASE_URL = API_PORT && API_PORT.trim()
    ? `${API_ADDRESS}:${API_PORT}/api/${API_VERSION}`
    : `${API_ADDRESS}/api/${API_VERSION}`;

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