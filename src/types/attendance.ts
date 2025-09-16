export interface MemberData {
  id: string;
  name: string;
  team: string;
  status: "on-time" | "late";
  arrivalTime: string;
  eventStartTime: string;
}

export type AttendanceStatus = "scanning" | "member-found" | "confirming" | "confirmed";