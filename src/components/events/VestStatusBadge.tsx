interface VestStatusBadgeProps {
    status: "assigned" | "returned" | "unassigned";
}

const VestStatusBadge = ({ status }: VestStatusBadgeProps) => {
    const getStatusStyles = () => {
        switch (status) {
            case "assigned":
                return "bg-primary text-white border-primary";
            case "returned":
                return "bg-secondary text-white border-secondary";
            case "unassigned":
                return "bg-black text-white border-black";
            default:
                return "bg-gray-500 text-white border-gray-500";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusStyles()}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default VestStatusBadge;