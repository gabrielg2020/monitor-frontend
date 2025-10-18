import type {Host, MetricResponse} from "../../types";
import {Cpu, HardDrive, MemoryStick} from "lucide-react";
import {formatBytes} from "../../utils/usageHelpers.ts";
import {useEffect, useState} from "react";
import {getMetricsByHostID} from "../../services/api.ts";
import HistoryChart from "./HistoryChart.tsx";

interface DetailedViewProps {
    host: Host,
    metrics: MetricResponse | undefined,
    onBack: () => void,
}

function DetailedView({host, metrics, onBack}: DetailedViewProps) {
    const latestMetric = metrics?.records?.[0];
    const [historyData, setHistoryData] = useState<MetricResponse | null>(null)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await getMetricsByHostID(host.id, 300);
                setHistoryData(history);
            } catch (error) {
                console.error(`Failed to fetch history for host ${host.id}:`, error);
            }
        }

        void fetchHistory();

        const interval = setInterval(fetchHistory, 30000);
        return () => clearInterval(interval);
    }, [host.id]);

    return (
        <div>
            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
                ← Back to Overview
            </button>

            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">{host.hostname}</h2>
                <p className="text-gray-400">{host.ip_address} - {host.role}</p>
            </div>

            {latestMetric ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <Cpu className="w-6 h-6 text-blue-400" />
                                <h3 className="text-lg font-semibold text-white">CPU Usage</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{latestMetric.cpu_usage.toFixed(1)}%</p>
                            <p className="text-sm text-gray-400">Current utilization</p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <MemoryStick className="w-6 h-6 text-purple-400" />
                                <h3 className="text-lg font-semibold text-white">Memory Usage</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{latestMetric.memory_usage_percent.toFixed(1)}%</p>
                            <p className="text-sm text-gray-400">
                                {formatBytes(latestMetric.memory_used_bytes)} / {formatBytes(latestMetric.memory_total_bytes)}
                            </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-3">
                                <HardDrive className="w-6 h-6 text-green-400" />
                                <h3 className="text-lg font-semibold text-white">Disk Usage</h3>
                            </div>
                            <p className="text-4xl font-bold text-white mb-1">{latestMetric.disk_usage_percent.toFixed(1)}%</p>
                            <p className="text-sm text-gray-400">
                                {formatBytes(latestMetric.disk_used_bytes)} / {formatBytes(latestMetric.disk_total_bytes)}
                            </p>
                        </div>
                    </div>

                    {historyData?.records && (
                        <HistoryChart metrics={historyData.records} />
                    )}
                </>
            ) : (
                <p className="text-gray-400">No metrics available</p>
            )}
        </div>
    );
}

export default DetailedView;