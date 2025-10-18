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
export { getUsageColour };