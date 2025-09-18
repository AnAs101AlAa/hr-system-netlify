import type { member } from "./member";

export interface Attendee extends member {
  status: "Attended" | "Absent" | "Left";
  arrivalTime?: Date;
  leaveTime?: Date;
  lateArrival?: {
    execuse:string
  };
  earlyLeave?: { scanTime: string; execuse: string};
  departureTime?: Date;
  lateArrivalReason?: string;
  earlyLeavingReason?: string;
}

export interface VestAttendee {
  id: number;
  name: string;
  phone: string;
  committee: string;
  vestStatus: "assigned" | "returned" | "unassigned";
}

export interface EventType {
  id: string;
  label: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  attendees?: Attendee[] | VestAttendee[];
}
