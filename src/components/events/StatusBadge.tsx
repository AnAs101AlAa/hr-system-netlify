import type { Attendee } from "../../types/event";

interface StatusBadgeProps {
  status: Attendee["status"];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "arrived":
        return "bg-contrast text-white border-contrast";
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
