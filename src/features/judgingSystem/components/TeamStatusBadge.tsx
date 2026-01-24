interface TeamStatusBadgeProps {
  status?: "Not Evaluated" | "Evaluated" | "Certified" | "NotEvaluated";
}

const TeamStatusBadge = ({ status }: TeamStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Certified":
        return "text-green-600 dark:text-green-400";
      case "Evaluated":
        return "text-blue-600 dark:text-blue-400";
      case "Not Evaluated":
      case "NotEvaluated":
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  const displayStatus =
    status === "NotEvaluated" ? "Not Evaluated" : status || "Not Evaluated";

  return (
    <span className={`text-md font-bold capitalize ${getStatusConfig()}`}>
      {displayStatus}
    </span>
  );
};

export default TeamStatusBadge;
