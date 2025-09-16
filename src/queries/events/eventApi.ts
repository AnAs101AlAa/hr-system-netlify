import { systemApi } from "../axiosInstance";
import type { Event } from "@/types/event";

const EVENTS_API_URL = systemApi.defaults.baseURL + "/api/v1/";
// const EVENT_TYPES_API_URL = systemApi.defaults.baseURL + "/event-types/"; // TODO: Uncomment when backend is ready

export class eventsApi {
  async fetchEventById(id: string): Promise<Event> {
    const response = await systemApi.get<Event>(
      `${EVENTS_API_URL}Events/${id}`
    );
    console.log(response);
    return response.data;
  }

  async fetchUpcomingEvents(page: number, pageSize: number): Promise<Event[]> {
    const nowDate = new Date().toISOString();
    const response = await systemApi.get<Event[]>(
      `${EVENTS_API_URL}Events/filtered?fromDate=${nowDate}&page=${page}&count=${pageSize}`
    );
    return response.data;
  }

  async fetchEventsCount(fromDate: string): Promise<number> {
    const response = await systemApi.get<number>(
      `${EVENTS_API_URL}Events/filtered?${
        fromDate ? `fromDate=${fromDate}` : ""
      }`
    );
    return response.data.data.items.length;
  }

  async fetchPastEventsCount(
    eventType: string,
    title: string
  ): Promise<number> {
    const nowDate = new Date().toISOString();
    const response = await systemApi.get<number>(
      `${EVENTS_API_URL}Events/filtered?toDate=${nowDate}&${
        eventType != "" ? `eventType=${eventType}` : ""
      }&${title != "" ? `title=${title}` : ""}`
    );
    return response.data.data.items.length;
  }

  async checkOngoingEvent(toDate: string): Promise<Event | null> {
    const response = await systemApi.get<Event | null>(
      `${EVENTS_API_URL}Events/filtered?toDate=${toDate}`
    );
    return response.data.data.items;
  }

  async fetchEventAttendees(eventId: string): Promise<Event> {
    const response = await systemApi.get<Event>(
      `${EVENTS_API_URL}Attendance/${eventId}`
    );
    return response.data;
  }

  async fetchPastEvents(
    eventType: string,
    title: string,
    page: number,
    pageSize: number
  ): Promise<Event[]> {
    const nowDate = new Date().toISOString();
    const response = await systemApi.get<Event[]>(
      `${EVENTS_API_URL}Events/filtered?toDate=${nowDate}&${
        eventType != "" ? `eventType=${eventType}` : ""
      }&${title != "" ? `title=${title}` : ""}&page=${page}&count=${pageSize}`
    );
    return response.data;
  }

  async requestAttendance(memberId: string, eventId: string, reason: string) {
    const response = await systemApi.post(
      EVENTS_API_URL + `Attendance/${eventId}/${memberId}`,
      {
        scanTime: new Date().toISOString(),
        execuse: reason || "",
      }
    );
    console.log("response", response);
    return response.data;
  }
}

// Export a singleton instance for use across the application
export const eventsApiInstance = new eventsApi();
