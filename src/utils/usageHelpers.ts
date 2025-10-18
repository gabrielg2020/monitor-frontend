// A utility function to determine the usage colour based on usage percentage
// Returns the appropriate Tailwind CSS class
function getUsageColour(usage:number) :string {
    if (usage > 90) {
        return "bg-red-500";
    }
    if (usage > 70) {
        return "bg-yellow-500";
    }
    return "bg-green-500";
}

// A utility function to determine if a host is online based on the latest metric timestamp
// Returns true if the host is considered online, false otherwise
function isHostOnline(latestTimestamp:number) :boolean {
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

    return (currentTime - latestTimestamp) <= 300; // 5 minutes threshold
}
export { getUsageColour, isHostOnline };