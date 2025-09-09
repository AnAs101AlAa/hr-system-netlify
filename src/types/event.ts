import type { member } from "./member";

export interface Attendee extends member {
  status: "arrived" | "absent" | "left";
  arrivalTime?: Date;
  departureTime?: Date;
  lateArrivalReason?: string;
  earlyLeavingReason?: string;
}

export interface EventType {
  id: string;
  label: string;
  description?: string;
}

export interface Event {
  id: number;
  title: string;
  type: string;
  startTime: Date;
  endTime: Date;
  attendees: Attendee[];
}
