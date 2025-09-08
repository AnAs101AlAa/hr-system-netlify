import { useQuery } from "@tanstack/react-query";
import { eventsApi } from "./eventApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
};

const eventsApiInstance = new eventsApi();

// Hook to fetch event by ID
export const useEvent = (id: number) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.fetchEventById(id);
        return data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch event: ${errorMessage}`);
        throw error;
      }
    },
    enabled: !!id,
  });
};
