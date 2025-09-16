import type { member } from "./member";

export interface Attendee extends member {
  status: "arrived" | "absent" | "left";
  arrivalTime?: Date;
  leaveTime?: Date;
  lateArrival?: {
    execuse:string
  };
  earlyLeave?: { scanTime: string; execuse: string};
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  startDate: string;
  endDate: string;
  attendees?: Attendee[];
}
