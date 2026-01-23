interface TeamStatusBadgeProps {
  status?: "Not Evaluated" | "Evaluated" | "Certified";
}

const TeamStatusBadge = ({ status }: TeamStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case "Certified":
        return "text-green-600 dark:text-green-400";
      case "Evaluated":
        return "text-blue-600 dark:text-blue-400";
      case "Not Evaluated":
      default:
        return "text-red-600 dark:text-red-400";
    }
  };

  return (
    <span className={`text-md font-bold capitalize ${getStatusConfig()}`}>
      {status || "Not Evaluated"}
    </span>
  );
};

export default TeamStatusBadge;
