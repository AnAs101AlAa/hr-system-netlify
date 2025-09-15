import { systemApi } from "../axiosInstance";
import type { Event, EventType } from "@/types/event";

const EVENTS_API_URL = systemApi.defaults.baseURL + "/events/";
// const EVENT_TYPES_API_URL = systemApi.defaults.baseURL + "/event-types/"; // TODO: Uncomment when backend is ready

export class eventsApi {
  async fetchEventById(id: number): Promise<Event> {
    const response = await systemApi.get<Event>(`${EVENTS_API_URL}${id}`);
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
            startTime: new Date("2024-10-01T14:00:00"),
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

  async fetchEventTypes(): Promise<EventType[]> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get<EventType[]>(EVENT_TYPES_API_URL);
    // return response.data;

    // Dummy data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "meeting",
            label: "Meetings",
            description: "Team meetings and discussions",
          },
          {
            id: "review",
            label: "Reviews",
            description: "Code and project reviews",
          },
          {
            id: "training",
            label: "Training",
            description: "Learning and development sessions",
          },
          {
            id: "presentation",
            label: "Presentations",
            description: "Client and internal presentations",
          },
          {
            id: "planning",
            label: "Planning",
            description: "Sprint and project planning sessions",
          },
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
