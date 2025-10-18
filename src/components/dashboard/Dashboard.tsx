import MetricCard from "./MetricCard.tsx";
import type {Host, MetricResponse} from "../../types";
import {useEffect, useState} from "react";
import {getMetricsByHostID} from "../../services/api.ts";
import {isHostOnline} from "../../utils/usageHelpers.ts";

interface DashboardProps {
    hosts: Host[];
}

function Dashboard({ hosts }: DashboardProps) {
    const [metricsMap, setMetricsMap] = useState<Record<number, MetricResponse>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllMetrics = async () => {
            setLoading(true);
            const newMetrics: Record<number, MetricResponse> = {};

            for (const host of hosts) {
                try {
                    newMetrics[host.id] = await getMetricsByHostID(host.id, 1);
                } catch (error) {
                    console.error(`Failed to fetch metrics for host ${host.id}:`, error);
                }
            }

            setMetricsMap(newMetrics);
            setLoading(false);
        };

        void fetchAllMetrics();

        // Refresh every 5 seconds
        const interval = setInterval(fetchAllMetrics, 5000);
        return () => clearInterval(interval);
    }, [hosts]);

    if (loading) {
        return <div className="text-white text-center py-8">Loading metrics...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hosts.map((host: Host) => {
                const metrics = metricsMap[host.id];
                const latestMetric = metrics?.records?.[0];

                return (
                    <MetricCard
                        key={host.id}
                        hostname={host.hostname}
                        isOnline={!!latestMetric && isHostOnline(latestMetric.timestamp)}
                        cpuUsage={latestMetric?.cpu_usage || 0}
                        memoryUsage={latestMetric?.memory_usage_percent || 0}
                        diskUsage={latestMetric?.disk_usage_percent || 0}
                    />
                )
            })}
        </div>
    )
}

export default Dashboard