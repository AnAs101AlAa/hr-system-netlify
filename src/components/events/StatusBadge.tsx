import type { Attendee } from "../../types/event";

interface StatusBadgeProps {
  status: Attendee["status"];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "arrived":
        return "bg-green-500 text-white border-green-500";
      case "absent":
        return "bg-primary text-white border-primary";
      case "left":
        return "bg-secondary text-white border-secondary";
      default:
        return "bg-gray-300 text-gray-600 border-gray-300";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-xl text-xs font-bold capitalize border ${getStatusStyles()} shadow-sm`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
