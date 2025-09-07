type FormatMode = "full" | "hour" | "phone";

const formatDateTime = (date: Date, mode: FormatMode = "full") => {
  if (mode === "hour") {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  }
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatPhone = (phone: string | undefined | null): string => {
  if (!phone) return "N/A";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  return phone;
};

const format = (data: unknown, mode: FormatMode): string => {
  try {
    switch (mode) {
      case "phone":
        return formatPhone(data as string);
      case "hour":
      case "full": {
        if (!data) return "N/A";
        const dateObj =
          typeof data === "string" ? new Date(data) : (data as Date);
        if (isNaN(dateObj.getTime())) return "Invalid Date";
        return formatDateTime(dateObj, mode);
      }
      default:
        return String(data || "N/A");
    }
  } catch {
    return "N/A";
  }
};

export { formatDateTime };
export default format;
