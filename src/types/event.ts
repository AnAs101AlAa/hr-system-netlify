import type { member } from "./member";

export interface Attendee extends member {
  status: "arrived" | "absent" | "left";
  arrivalTime?: Date;
  departureTime?: Date;
  lateArrivalReason?: string;
  earlyLeavingReason?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  attendees?: Attendee[];
}
