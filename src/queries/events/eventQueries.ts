import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApiInstance } from "./eventApi";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils";
import type { Event } from "@/types/event";

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
  eventAttendees: (eventId: string) =>
    [...eventKeys.details(), eventId, "attendees"] as const,
  ongoingEvent: (toDate: string) => ["ongoing", toDate] as const,
  requestAttendance: (eventId: string, memberId: string) =>
    ["requestAttendance", eventId, memberId] as const,
  checkAttendanceStatus: (eventId: string, memberId: string) =>
    ["checkAttendanceStatus", eventId, memberId] as const,
  recordLateArrivalExcuse: (eventId: string, memberId: string) =>
    ["recordLateArrivalExcuse", eventId, memberId] as const,
  recordLeaveEarly: (eventId: string, memberId: string) =>
    ["recordLeaveEarly", eventId, memberId] as const,
  vestTimeline: (eventId: string, memberId: string) =>
    ["vestTimeline", eventId, memberId] as const,
};
// Mutation: Request Attendance
export const useRequestAttendance = () => {
  return useMutation({
    mutationFn: async ({
      memberId,
      eventId,
    }: {
      memberId: string;
      eventId: string;
    }) => {
      try {
        return await eventsApiInstance.requestAttendance(memberId, eventId);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Attendance request failed: ${errorMessage}`);
        throw error;
      }
    },
  });
};

// Mutation: Check Attendance Status
export const useCheckAttendanceStatus = () => {
  return useMutation({
    mutationFn: async ({
      memberId,
      eventId,
    }: {
      memberId: string;
      eventId: string;
    }) => {
      try {
        return await eventsApiInstance.checkAttendanceStatus(memberId, eventId);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Check attendance status failed: ${errorMessage}`);
        throw error;
      }
    },
  });
};

// Mutation: Record Late Arrival Excuse
export const useRecordLateArrivalExcuse = () => {
  return useMutation({
    mutationFn: async ({
      memberId,
      eventId,
      excuse,
    }: {
      memberId: string;
      eventId: string;
      excuse: string;
    }) => {
      try {
        return await eventsApiInstance.recordLateArrivalExcuse(
          memberId,
          eventId,
          excuse
        );
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Late arrival excuse failed: ${errorMessage}`);
        throw error;
      }
    },
  });
};

// Mutation: Record Leave Early
export const useRecordLeaveEarly = () => {
  return useMutation({
    mutationFn: async ({
      memberId,
      eventId,
      excuse,
    }: {
      memberId: string;
      eventId: string;
      excuse: string;
    }) => {
      try {
        return await eventsApiInstance.recordLeaveEarly(
          memberId,
          eventId,
          excuse
        );
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        toast.error(`Leave early excuse failed: ${errorMessage}`);
        throw error;
      }
    },
  });
};

// Hook to fetch event by ID
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const data = await eventsApiInstance.fetchEventById(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useUpcomingEvents = (
  page: number,
  pageSize: number,
  fromDate: string
) => {
  return useQuery({
    queryKey: [...eventKeys.upcomingEvents(), page, pageSize, fromDate],
    queryFn: async () => {
      const data = await eventsApiInstance.fetchUpcomingEvents(page, pageSize);
      const count = await eventsApiInstance.fetchEventsCount(fromDate);
      return { items: data, total: count };
    },
  });
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventData: Omit<Event, "id">) =>
      eventsApiInstance.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcomingEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.pastEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.eventTypes() });
      toast.success("Event created successfully");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      console.error("Error creating event:", errorMessage);
      toast.error("Failed to create event: " + errorMessage);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      eventData,
    }: {
      eventId: string;
      eventData: Omit<Event, "id">;
    }) => eventsApiInstance.updateEvent(eventId, eventData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcomingEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.pastEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.eventTypes() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
      if (variables?.eventId) {
        queryClient.invalidateQueries({
          queryKey: eventKeys.detail(variables.eventId),
        });
      }
      toast.success("Event updated successfully");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      console.error("Error updating event: ", errorMessage);
      toast.error("Failed to update event: " + errorMessage);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => eventsApiInstance.deleteEvent(eventId),
    onSuccess: (_data, eventId) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.upcomingEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.pastEvents() });
      queryClient.invalidateQueries({ queryKey: eventKeys.eventTypes() });
      queryClient.invalidateQueries({ queryKey: eventKeys.details() });
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      }
      toast.success("Event deleted successfully");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      console.error("Error deleting event: ", errorMessage);
      toast.error("Failed to delete event: " + errorMessage);
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
};

export const useEventAttendees = (eventId: string, roles: string[]) => {
  return useQuery({
    queryKey: eventKeys.eventAttendees(eventId),
    queryFn: async () => {
      let data;
      if (roles && roles.includes("Vest")) {
        data = await eventsApiInstance.fetchVestEventAttendees(eventId);
      } else {
        data = await eventsApiInstance.fetchEventAttendees(eventId);
      }
      return data;
    },
    enabled: !!eventId,
  });
};

export const useUpdateVestStatus = () => {
  return useMutation({
    mutationFn: async ({
      eventId,
      memberId,
      action,
    }: {
      eventId: string;
      memberId: string;
      action: "Returned" | "Received";
    }) => {
      await eventsApiInstance.updateVestStatus(memberId, eventId, action);
    },
  });
};

// Hook to fetch past events
export const usePastEvents = (
  eventType: string,
  title: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: [eventKeys.pastEvents(), eventType, title, page],
    queryFn: async () => {
      const data = await eventsApiInstance.fetchPastEvents(
        eventType,
        title,
        page,
        pageSize
      );
      const count = await eventsApiInstance.fetchPastEventsCount(
        eventType,
        title
      );
      return { items: data, total: count };
    },
  });
};

// Hook to fetch vest timeline
export const useVestTimeline = (memberId: string, eventId: string) => {
  return useQuery({
    queryKey: eventKeys.vestTimeline(eventId, memberId),
    queryFn: async () => {
      const data = await eventsApiInstance.fetchVestTimeline(memberId, eventId);
      return data;
    },
    enabled: !!memberId && !!eventId,
  });
};
