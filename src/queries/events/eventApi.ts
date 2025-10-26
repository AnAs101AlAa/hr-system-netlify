import { systemApi } from "../axiosInstance";
import type { Event, Attendee, VestAttendee } from "@/types/event";

const EVENTS_API_URL = "/v1/";

class eventsApi {
  async fetchEventById(id: string): Promise<Event> {
    const response = await systemApi.get(`${EVENTS_API_URL}Events/${id}`);
    return response.data.data;
  }

  async fetchUpcomingEvents(page: number, pageSize: number): Promise<Event[]> {
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?&eventStatuses=Running&eventStatuses=Upcoming&page=${page}&count=${pageSize}`
    );

    const items = response.data?.data?.items;
    if (Array.isArray(items)) {
      return items;
    }

    console.warn(
      "Unexpected response structure for fetchUpcomingEvents:",
      response.data
    );
    return [];
  }

  async fetchUpcomingEventsCount(): Promise<number> {
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?&eventStatuses=Running&eventStatuses=Upcoming`
    );

    const items = response.data?.data?.items;
    if (Array.isArray(items)) {
      return items.length;
    }

    console.warn(
      "Unexpected response structure for fetchUpcomingEvents:",
      response.data
    );
    return 0;
  }

  async createEvent(eventData: Omit<Event, "id">) {
    const response = await systemApi.post(
      EVENTS_API_URL + `Events/`,
      eventData
    );
    return response.data;
  }

  async updateEvent(eventId: string, eventData: Omit<Event, "id">) {
    const response = await systemApi.put(
      EVENTS_API_URL + `Events/${eventId}`,
      eventData
    );
    return response.data;
  }

  async deleteEvent(eventId: string) {
    const response = await systemApi.delete(
      EVENTS_API_URL + `Events/${eventId}`
    );
    return response.data;
  }

  async fetchPastEventsCount(
    eventType: string,
    title: string
  ): Promise<number> {
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?eventStatuses=Past&${
        eventType != "" ? `eventType=${eventType}` : ""
      }&${title != "" ? `title=${title}` : ""}`
    );

    // Access count using the correct structure: response.data.data.items.length
    const items = response.data?.data?.totalCount;
    if (typeof items === "number") {
      return items;
    }

    console.warn(
      "Unexpected response structure for fetchPastEventsCount:",
      response.data
    );
    return 0;
  }

  async checkOngoingEvent(toDate: string): Promise<Event | null> {
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?toDate=${toDate}`
    );
    const items = response.data.data?.items;
    return items && items.length > 0 ? items[0] : null;
  }

  async fetchEventAttendees(eventId: string): Promise<Attendee[]> {
    const response = await systemApi.get(
      `${EVENTS_API_URL}Attendance/${eventId}`
    );

    const items = Array.isArray(response.data?.data)
      ? response.data.data.map((att: any) => ({
          ...att,
          name: att.fullName,
          id: att.memberId,
        }))
      : [];

    return items;
  }

  async fetchVestEventAttendees(eventId: string): Promise<VestAttendee[]> {
    const response = await systemApi.get(`${EVENTS_API_URL}Vest/members`, {
      params: { eventId: eventId, pageSize: 200 },
    });

    const items = response.data.data.data.map((att: any) => ({
      id: att.memberId,
      name: att.name,
      phoneNumber: att.phoneNumber,
      committee: att.committee,
      email: att.email,
      status: att.status,
    }));

    return items;
  }

  async updateVestStatus(memberId: string, eventId: string, action: "Returned" | "Received") {
    await systemApi.put(
      `${EVENTS_API_URL}Vest/status`,
      { status: action, memberId: memberId, eventId: eventId }
     );
  }

  async fetchVestTimeline(memberId: string, eventId: string, pageNumber: number = 1, pageSize: number = 100) {
    const response = await systemApi.get(
      `${EVENTS_API_URL}Vest/activity`,
      {
        params: {
          MemberId: memberId,
          EventId: eventId,
          PageNumber: pageNumber,
          PageSize: pageSize
        }
      }
    );
    
    // The API now returns member data with nested activities array
    // Extract the activities array from the first member (should only be one member matching the memberId)
    const memberData = response.data?.data?.data?.[0];
    if (memberData && Array.isArray(memberData.activities)) {
      return {
        ...response.data.data,
        data: memberData.activities
      };
    }
    
    // Return empty structure if no activities found
    return {
      ...response.data.data,
      data: []
    };
  }
  
  async fetchVestStatus(memberId: string, eventId: string): Promise<string> {
    const response = await systemApi.get(`${EVENTS_API_URL}Vest/status/${eventId}/${memberId}`
    );
    return response.data.data.status;
  }

  async fetchPastEvents(eventType: string,title: string, page: number,pageSize: number): Promise<Event[]> {
    const response = await systemApi.get(`${EVENTS_API_URL}Events/filtered?${eventType != "" ? `eventType=${eventType}` : ""}&eventStatuses=Past&${title != "" ? `title=${title}` : ""}&page=${page}&count=${pageSize}&OrderBy=startDate&Descending=true`
    );

    // Access the array using the correct structure: response.data.data.items
    const items = response.data?.data?.items;
    if (Array.isArray(items)) {
      return items;
    }

    console.warn(
      "Unexpected response structure for fetchPastEvents:",
      response.data
    );
    return [];
  }

  async requestAttendance(memberId: string, eventId: string) {
    const response = await systemApi.post(
      EVENTS_API_URL + `Attendance/${eventId}/${memberId}`,
      {
        scanTime: new Date().toISOString(),
      }
    );
    return response.data;
  }

  async checkAttendanceStatus(
    memberId: string,
    eventId: string
  ): Promise<{ status: number }> {
    const response = await systemApi.post(
      EVENTS_API_URL + `Attendance/${eventId}/${memberId}/status`,
      {
        scanTime: new Date().toISOString(),
      }
    );
    return { status: response.data.data };
  }

  async recordLateArrivalExcuse(
    memberId: string,
    eventId: string,
    excuse: string
  ) {
    // Add 3 hours to current time and format as ISO string
    const now = new Date();

    const scanTime = now.toISOString();
    const response = await systemApi.post(
      EVENTS_API_URL + `Attendance/${eventId}/lateArrival/${memberId}`,
      {
        scanTime,
        execuse: excuse,
      }
    );
    return response.data;
  }

  async recordLeaveEarly(memberId: string, eventId: string, excuse: string) {
    // Add 3 hours to current time and format as ISO string
    const now = new Date();

    const scanTime = now.toISOString();
    const response = await systemApi.post(
      EVENTS_API_URL + `Attendance/${eventId}/earlyLeave/${memberId}`,
      {
        scanTime,
        execuse: excuse,
      }
    );
    return response.data;
  }
}

// Export a singleton instance for use across the application
export const eventsApiInstance = new eventsApi();
