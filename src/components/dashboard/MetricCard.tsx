function MetricCard() {

    return (
        <div>
            // Header
            <div><h2>pi-name</h2></div>
            <div><h2>status</h2></div>

            // Body
            <div>
                <div>
                    <h5>CPU</h5>
                    <p>16.9%</p>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div>
                    <h5>Memory</h5>
                    <p>77.7%</p>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                </div>
                <div>
                    <h5>Disk</h5>
                    <p>99.3%</p>
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
            </div>
        </div>
    )
}

export default MetricCard