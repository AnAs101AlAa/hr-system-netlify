interface VestStatusBadgeProps {
    status: "assigned" | "returned" | "unassigned";
}

const VestStatusBadge = ({ status }: VestStatusBadgeProps) => {
    const getStatusStyles = () => {
        switch (status) {
            case "unassigned":
                return "bg-primary text-white border-primary";
            case "returned":
                return "bg-secondary text-white border-secondary";
            case "assigned":
                return "bg-green-600 text-white border-green-600";
            default:
                return "bg-gray-500 text-white border-gray-500";
        }
    };

    return (
        <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] md:text-[13px] font-medium border ${getStatusStyles()}`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default VestStatusBadge;