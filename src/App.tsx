import Dashboard from "./components/dashboard/Dashboard.tsx";
import {useEffect, useState} from "react";
import type {HostResponse} from "./types";
import {getHosts} from "./services/api.ts";

function App() {
    const [hosts, setHosts] = useState<HostResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHosts = async () => {
            try {
                const hostsData = await getHosts();
                setHosts(hostsData);
            } catch (error) {
                console.error("Failed to fetch hosts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHosts();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-gray-900 p-6 text-white">Loading...</div>;
    }

    if (!hosts || hosts.hosts.length === 0) {
        return <div className="min-h-screen bg-gray-900 p-6 text-white">No hosts available.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6">
          <Dashboard hosts={hosts.hosts} />
        </div>
    )
}

export default App
