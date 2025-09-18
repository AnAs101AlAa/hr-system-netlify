import { systemApi } from "../axiosInstance";
import type { Event, Attendee, VestAttendee } from "@/types/event";

const EVENTS_API_URL = systemApi.defaults.baseURL + "/api/v1/";
// const EVENT_TYPES_API_URL = systemApi.defaults.baseURL + "/event-types/"; // TODO: Uncomment when backend is ready

export class eventsApi {
  async fetchEventById(id: string): Promise<Event> {
    //const response = await systemApi.get(`${EVENTS_API_URL}Events/${id}`);
    //return response.data.data;
    return {
      id: "1",
      title: "Annual Company Meeting",
      type: "meeting",
      startDate: "2023-10-15T09:00:00",
      endDate: "2023-10-15T17:00:00",
      description: "A meeting to discuss company performance and future plans.",
      location: "Main Conference Room",
    }
  }

  async fetchUpcomingEvents(page: number, pageSize: number): Promise<Event[]> {
    const nowDate = new Date().toISOString();
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?fromDate=${nowDate}&page=${page}&count=${pageSize}`
    );

    // Access the array using the correct structure: response.data.data.items
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

  async fetchEventsCount(fromDate: string): Promise<number> {
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?${
        fromDate ? `fromDate=${fromDate}` : ""
      }`
    );

    // Access count using the correct structure: response.data.data.items.length
    const items = response.data?.data?.items;
    if (Array.isArray(items)) {
      return items.length;
    }

    console.warn(
      "Unexpected response structure for fetchEventsCount:",
      response.data
    );
    return 0;
  }

  async fetchPastEventsCount(
    eventType: string,
    title: string
  ): Promise<number> {
    const nowDate = new Date().toISOString();
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?toDate=${nowDate}&${
        eventType != "" ? `eventType=${eventType}` : ""
      }&${title != "" ? `title=${title}` : ""}`
    );

    // Access count using the correct structure: response.data.data.items.length
    const items = response.data?.data?.items;
    if (Array.isArray(items)) {
      return items.length;
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

  async fetchEventAttendees(eventId: string): Promise<Attendee[] | VestAttendee[]> {
    // const response = await systemApi.get(
    //   `${EVENTS_API_URL}Attendance/${eventId}`
    // );
    // // Access the array using the correct structure: response.data.data.items
    // const items = response.data?.data.map((att: any) => ({
    //   id: att.memberId,
    //   name: att.fullName,
    //   phoneNumber: att.phoneNumber,
    //   committee: att.committee,
    //   email: att.email,
    //   status: att.status,
    //   arrivalTime: att.attendanceDate,
    //   lateArrival: { execuse: att.lateArrivalExcuse?.execuse },
    //   earlyLeave: att.earlyLeave,
    // }));

    // if (Array.isArray(items)) {
    //   return items;
    // }    
    return [
      {
        id: "1",
        name: "John Doe",
        phoneNumber: "123-456-7890",
        committee: "Finance",
        email: "john.doe@example.com",
        vestStatus: "unassigned",
      },
    ];
  }

  async fetchPastEvents(
    eventType: string,
    title: string,
    page: number,
    pageSize: number
  ): Promise<Event[]> {
    const nowDate = new Date().toISOString();
    const response = await systemApi.get(
      `${EVENTS_API_URL}Events/filtered?toDate=${nowDate}&${
        eventType != "" ? `eventType=${eventType}` : ""
      }&${title != "" ? `title=${title}` : ""}&page=${page}&count=${pageSize}
      &OrderBy=date&Descending=true`
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

  async checkAttendanceStatus(memberId: string, eventId: string): Promise<{ status: number }> {
    const response = await systemApi.post(
      EVENTS_API_URL + `Attendance/${eventId}/${memberId}/status`,
      {
        scanTime: new Date().toISOString(),
      }
    );
    return { status: response.data.data };
  }

  async recordLateArrivalExcuse(memberId: string, eventId: string, excuse: string) {
  // Add 3 hours to current time and format as ISO string
  const now = new Date();
  now.setHours(now.getHours() + 3);
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
  now.setHours(now.getHours() + 3);
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
