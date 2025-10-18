import {getUsageColour} from "../../utils/usageHelpers.ts";
import {AlertCircle, Cpu, HardDrive, MemoryStick} from "lucide-react";

interface MetricCardProps {
    hostname: string;
    isOnline: boolean;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    onClick?: () => void;
}

function MetricCard({ hostname, isOnline, cpuUsage, memoryUsage, diskUsage, onClick }: MetricCardProps) {
    // If the device is offline, show a simplified card
    if (!isOnline) {
        return (
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
                {/*Header*/}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-white">{hostname}</h2>
                    <span className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-400">Offline</span>
                </div>
                {/*Body*/}
                <div className="flex items-center justify-center h-20 text-gray-500">
                    <AlertCircle className="w-8 h-8" />
                </div>
            </div>
        )
    }
    // If the device is online, show the full card with metrics
    return (
        <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 hover:border-blue-500 cursor-pointer transition-all" onClick={onClick}>
            {/*Header*/}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">{hostname}</h2>
                <span className="px-2 py-1 text-xs rounded bg-green-900 text-green-300">Online</span>
            </div>

            {/*Body*/}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-400"/>
                        <span className="text-sm text-gray-300">CPU</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{cpuUsage + "%"}</span>
                        <div className={`w-2 h-2 rounded-full ${getUsageColour(cpuUsage)}`}></div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MemoryStick className="w-4 h-4 text-purple-400"/>
                        <span className="text-sm text-gray-300">Memory</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{memoryUsage + "%"}</span>
                        <div className={`w-2 h-2 rounded-full ${getUsageColour(memoryUsage)}`}></div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-green-400"/>
                        <span className="text-sm text-gray-300">Disk</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{diskUsage + "%"}</span>
                        <div className={`w-2 h-2 rounded-full ${getUsageColour(diskUsage)}`}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MetricCard