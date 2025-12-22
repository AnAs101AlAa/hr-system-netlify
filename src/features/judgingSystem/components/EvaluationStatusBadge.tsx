interface StatusBadgeProps {
  status: "Evaluated" | "Not evaluated";
}

const EvaluationStatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "evaluated":
        return "bg-green-500 text-white border-green-500";
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

export default EvaluationStatusBadge;
