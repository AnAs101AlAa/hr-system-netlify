import { api } from "../axiosInstance";
import type { Event } from "@/types/event";

const EVENTS_API_URL = api.defaults.baseURL + "/events/";

export class eventsApi {
  async fetchEventById(id: number): Promise<Event> {
    const response = await api.get<Event>(`${EVENTS_API_URL}${id}`);
    return response.data;
  }
}
