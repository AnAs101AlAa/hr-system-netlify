import { formatDateTime } from "@/utils";
import type { Attendee } from "../../types/event";
import StatusBadge from "./StatusBadge";
import { format } from "@/utils";

interface AttendeesTableProps {
  attendees: Attendee[];
  eventEndTime?: string;
}

const AttendeesTable = ({ attendees, eventEndTime }: AttendeesTableProps) => {
  console.log(attendees, eventEndTime, typeof eventEndTime);
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Name
            </th>
            <th className="w-42 min-w-42 px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Team
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Arrival
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Leaving
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Late Arrival Reason
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Early Leaving Reason
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {attendees && attendees.length > 0 ? (
            attendees.map((attendee, index) => (
              <tr
                key={attendee.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {attendee.name || "N/A"}
                  </div>
                </td>
                <td
                  className="w-32 min-w-32 px-4 py-4"
                  style={{ width: "8rem", minWidth: "8rem" }}
                >
                  <div className="text-sm text-dashboard-card-text font-mono">
                    {format(attendee.phoneNumber, "phone")}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-dashboard-card-text">
                    {attendee.committee || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={attendee.status} />
                </td>
                <td className="px-4 py-4 w-40 min-w-40">
                  <div className="text-sm text-dashboard-card-text">
                    {attendee.arrivalTime &&
                    String(attendee.arrivalTime) !== "0001-01-01T00:00:00+00:00"
                      ? formatDateTime(new Date(attendee.arrivalTime), "full")
                      : "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4 w-40 min-w-40">
                  <div className="text-sm text-dashboard-card-text">
                    {attendee.earlyLeave
                      ? formatDateTime(
                          new Date(attendee.earlyLeave.scanTime),
                          "full"
                        )
                      : formatDateTime(
                          new Date(eventEndTime as string),
                          "full"
                        )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-dashboard-card-text">
                    <p className="break-words leading-relaxed">
                      {attendee.lateArrival?.execuse || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-dashboard-card-text">
                    <p className="break-words leading-relaxed">
                      {attendee.earlyLeave?.execuse || "N/A"}
                    </p>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center">
                <div className="text-dashboard-description">
                  <p className="text-lg font-medium">No attendees found</p>
                  <p className="text-sm">
                    This event doesn't have any attendees yet.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendeesTable;
