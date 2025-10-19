import type {HostResponse, MetricResponse} from "../types";

const getEnvVar = (viteVar: string | undefined, windowKey: keyof typeof window.ENV, fallback: string): string => {
    // First try Vite env vars (for local dev)
    console.log(`Vite var for ${windowKey}:`, viteVar);
    if (viteVar) return viteVar;

    // Then try window.ENV (for Docker runtime)
    if (typeof window !== 'undefined' && window.ENV && window.ENV[windowKey] && window.ENV[windowKey] !== `\${${windowKey}}`) {
        return window.ENV[windowKey];
    }

    return fallback;
};

const API_ADDRESS = getEnvVar(import.meta.env.VITE_API_ADDRESS, 'API_ADDRESS', 'http://localhost');
const API_PORT = getEnvVar(import.meta.env.VITE_API_PORT, 'API_PORT', '8191');
const API_VERSION = getEnvVar(import.meta.env.VITE_API_VERSION, 'API_VERSION', 'v1');

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