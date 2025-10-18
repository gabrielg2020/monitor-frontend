import MetricCard from "./MetricCard.tsx";

function Dashboard() {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <MetricCard
                hostname="pi-01"
                isOnline={true}
                cpuUsage={16.9}
                memoryUsage={77.7}
                diskUsage={99.3}
            />
            <MetricCard
                hostname="pi-02"
                isOnline={false}
                cpuUsage={88.1}
                memoryUsage={22.4}
                diskUsage={19.5}
            />
        </div>
    )
}

export default Dashboard
