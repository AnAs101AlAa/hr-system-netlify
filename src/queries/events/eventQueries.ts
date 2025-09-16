import { useQuery } from "@tanstack/react-query";
import { eventsApiInstance } from "./eventApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils";

export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  pastEvents: () => [...eventKeys.all, "past"] as const,
  eventTypes: () => [...eventKeys.all, "types"] as const,
  eventsByType: (type: string) => [...eventKeys.all, "byType", type] as const,
  searchPastEvents: (query: string) =>
    [...eventKeys.all, "searchPast", query] as const,
  upcomingEvents: () => [...eventKeys.all, "upcoming"] as const,
  eventAttendees: (eventId: string) => [...eventKeys.details(), eventId, "attendees"] as const,
  ongoingEvent: (toDate: string) => ["ongoing", toDate] as const,
};

// Hook to fetch event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.fetchEventById(id);
        return data.data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch event: ${errorMessage}`);
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useUpcomingEvents = (page: number, pageSize: number, fromDate: string) => {
  return useQuery({
    queryKey: [...eventKeys.upcomingEvents(), page, pageSize, fromDate],
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.fetchUpcomingEvents(page, pageSize);
        const count = await eventsApiInstance.fetchEventsCount(fromDate);
        return { items: data.data.items, total: count };
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch upcoming events: ${errorMessage}`);
        throw error;
      }
    },
  });
};

export const useOngoingEvent = (toDate: string) => {
  return useQuery({
    queryKey: [...eventKeys.ongoingEvent(toDate)],
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.checkOngoingEvent(toDate);
        return data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch ongoing event: ${errorMessage}`);
        throw error;
      }
    },
    enabled: !!toDate,
  });
}

export const useEventAttendees = (eventId: string) => {
  return useQuery({
    queryKey: eventKeys.eventAttendees(eventId),
    queryFn: async () => {
      try {
        const data = await eventsApiInstance.fetchEventAttendees(eventId);
        return data.data;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Failed to fetch event attendees: ${errorMessage}`);
        throw error;
      }
    },
    enabled: !!eventId,
  });
}

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
