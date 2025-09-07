import type { member } from "./member";

export interface Attendee extends member {
  status: "arrived" | "absent" | "left";
  arrivalTime?: Date;
  departureTime?: Date;
  notes?: string;
}

export interface Event {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  attendees: Attendee[];
}
