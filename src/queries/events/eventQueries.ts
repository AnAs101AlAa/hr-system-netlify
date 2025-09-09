import { useQuery } from "@tanstack/react-query";
import { eventsApiInstance } from "./eventApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
  pastEvents: () => [...eventKeys.all, "past"] as const,
  eventTypes: () => [...eventKeys.all, "types"] as const,
  eventsByType: (type: string) => [...eventKeys.all, "byType", type] as const,
  searchPastEvents: (query: string) => [...eventKeys.all, "searchPast", query] as const,
};

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

// Hook to fetch past events
export const usePastEvents = () => {
  return useQuery({
    queryKey: eventKeys.pastEvents(),
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.fetchPastEvents();
        return data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch past events: ${errorMessage}`);
        throw error;
      }
    },
  });
};

// Hook to fetch event types
export const useEventTypes = () => {
  return useQuery({
    queryKey: eventKeys.eventTypes(),
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.fetchEventTypes();
        return data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch event types: ${errorMessage}`);
        throw error;
      }
    },
  });
};

// Hook to fetch events by type
export const useEventsByType = (eventType: string) => {
  return useQuery({
    queryKey: eventKeys.eventsByType(eventType),
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.fetchEventsByType(eventType);
        return data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch events by type: ${errorMessage}`);
        throw error;
      }
    },
    enabled: !!eventType,
  });
};

// Hook to search past events
export const useSearchPastEvents = (query: string) => {
  return useQuery({
    queryKey: eventKeys.searchPastEvents(query),
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.searchPastEvents(query);
        return data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to search past events: ${errorMessage}`);
        throw error;
      }
    },
    enabled: !!query && query.length > 0,
  });
};
