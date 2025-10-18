import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import type {SystemMetric} from "../../types";

interface HistoryChartProps {
    metrics: SystemMetric[];
}

function HistoryChart({ metrics }: HistoryChartProps) {
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-EU', { hour: '2-digit', minute: '2-digit' });
    };

    // Prepare chart data (reverse to show oldest to newest)
    const chartData = metrics.slice().reverse().map(record => ({
        timestamp: record.timestamp,
        time: formatTime(record.timestamp),
        cpu: record.cpu_usage,
        memory: record.memory_usage_percent,
        disk: record.disk_usage_percent,
    }));

    if (chartData.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-400 text-center">No historical data available</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Historical Metrics</h3>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="time"
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis
                        stroke="#9CA3AF"
                        tick={{ fill: '#9CA3AF' }}
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#F3F4F6'
                        }}
                        labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#F3F4F6' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="cpu"
                        stroke="#3B82F6"
                        name="CPU %"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="memory"
                        stroke="#A855F7"
                        name="Memory %"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="disk"
                        stroke="#10B981"
                        name="Disk %"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default HistoryChart;