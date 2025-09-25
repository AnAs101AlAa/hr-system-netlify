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
  arrivals?: string[];
  leavings?: string[];
}

export interface VestAttendee extends member {
  status: "NotReceived" | "Received" | "Returned";
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
