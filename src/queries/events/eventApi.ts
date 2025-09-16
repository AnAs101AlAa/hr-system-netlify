import { systemApi } from "../axiosInstance";
import type { Event } from "@/types/event";

const EVENTS_API_URL = systemApi.defaults.baseURL + "/api/v1/";
// const EVENT_TYPES_API_URL = systemApi.defaults.baseURL + "/event-types/"; // TODO: Uncomment when backend is ready

export class eventsApi {
  async fetchEventById(id: string): Promise<Event> {
    const response = await systemApi.get<Event>(`${EVENTS_API_URL}Events/${id}`);
    return response.data;
  }

  async fetchUpcomingEvents(page: number, pageSize: number): Promise<Event[]> {
    const nowDate = new Date().toISOString();
    const response = await systemApi.get<Event[]>(`${EVENTS_API_URL}Events/filtered?fromDate=${nowDate}&page=${page}&count=${pageSize}`);
    return response.data;
  }

  async fetchEventsCount(fromDate: string): Promise<number> {
    const response = await systemApi.get<number>(`${EVENTS_API_URL}Events/filtered?${fromDate ? `fromDate=${fromDate}` : ""}`);
    return response.data.data.items.length;
  }

  async fetchEventAttendees(eventId: string): Promise<Event> {
    const response = await systemApi.get<Event>(`${EVENTS_API_URL}Attendance/${eventId}`);
    return response.data;
  }

  async fetchPastEvents(): Promise<Event[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get<Event[]>(`${EVENTS_API_URL}past`);
    // return response.data;

    // Dummy data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: "Team Meeting",
            type: "meeting",
            startD: new Date("2024-10-01T14:00:00"),
            endTime: new Date("2024-10-01T15:00:00"),
            attendees: [],
          },
          {
            id: 2,
            title: "Project Review",
            type: "review",
            startTime: new Date("2024-10-01T14:00:00"),
            endTime: new Date("2024-10-01T15:00:00"),
            attendees: [],
          },
          {
            id: 3,
            title: "Training Session",
            type: "training",
            startTime: new Date("2024-10-01T14:00:00"),
            endTime: new Date("2024-10-01T15:00:00"),
            attendees: [],
          },
          {
            id: 4,
            title: "Client Presentation",
            type: "presentation",
            startTime: new Date("2024-10-01T14:00:00"),
            endTime: new Date("2024-10-01T15:00:00"),
            attendees: [],
          },
          {
            id: 5,
            title: "Code Review",
            type: "review",
            startTime: new Date("2024-10-01T14:00:00"),
            endTime: new Date("2024-10-01T15:00:00"),
            attendees: [],
          },
          {
            id: 6,
            title: "Design Review",
            type: "review",
            startTime: new Date("2024-10-02T10:00:00"),
            endTime: new Date("2024-10-02T11:00:00"),
            attendees: [],
          },
          {
            id: 7,
            title: "Sprint Planning",
            type: "planning",
            startTime: new Date("2024-10-02T14:00:00"),
            endTime: new Date("2024-10-02T16:00:00"),
            attendees: [],
          },
          {
            id: 8,
            title: "Stakeholder Meeting",
            type: "meeting",
            startTime: new Date("2024-10-03T09:00:00"),
            endTime: new Date("2024-10-03T10:30:00"),
            attendees: [],
          },
          {
            id: 9,
            title: "Weekly Standup",
            type: "meeting",
            startTime: new Date("2024-10-04T09:00:00"),
            endTime: new Date("2024-10-04T09:30:00"),
            attendees: [],
          },
          {
            id: 10,
            title: "Technical Workshop",
            type: "training",
            startTime: new Date("2024-10-05T13:00:00"),
            endTime: new Date("2024-10-05T17:00:00"),
            attendees: [],
          },
        ]);
      }, 500); // Simulate network delay
    });
  }

  async fetchEventTypes(): Promise<string[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get<EventType[]>(EVENT_TYPES_API_URL);
    // return response.data;

    // Dummy data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          "meeting",
          "training",
          "review",
          "presentation",
          "planning",
        ]);
      }, 300); // Simulate network delay
    });
  }

  async fetchEventsByType(eventType: string): Promise<Event[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get<Event[]>(`${EVENTS_API_URL}type/${eventType}`);
    // return response.data;

    // Dummy data for development - filter by type
    const allEvents = await this.fetchPastEvents();
    return allEvents.filter((event) => event.type === eventType);
  }

  async searchPastEvents(query: string): Promise<Event[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get<Event[]>(`${EVENTS_API_URL}past/search`, {
    //   params: { q: query }
    // });
    // return response.data;

    // Dummy data for development - filter by title
    const allEvents = await this.fetchPastEvents();
    return allEvents.filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Export a singleton instance for use across the application
export const eventsApiInstance = new eventsApi();
