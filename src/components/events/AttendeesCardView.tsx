import type { Attendee } from "../../types/event";
import { format } from "../../utils";
import StatusBadge from "./StatusBadge";

interface AttendeesCardViewProps {
  attendees: Attendee[];
  eventEndTime?: string;
  setAttendee: (data: Attendee) => void
}

const AttendeesCardView = ({
  attendees,
  eventEndTime,
  setAttendee
}: AttendeesCardViewProps) => {
  return (
    <div className="lg:hidden divide-y divide-gray-100">
      {attendees && attendees.length > 0 ? (
        attendees.map((attendee, index) => (
          <div key={attendee.id || index} className="p-4 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-dashboard-card-text">
                  {attendee.name || "N/A"}
                </h4>
              </div>
              <StatusBadge status={attendee.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <span className="font-medium text-dashboard-heading">
                  Team:
                </span>
                <p className="text-dashboard-card-text">
                  {attendee.committee || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Phone:
                </span>
                <p className="text-dashboard-card-text">
                  {format(attendee.phoneNumber, "phone")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-dashboard-heading">
                  Arrival:
                </span>
                <p className="text-dashboard-card-text text-[13px]">
                  {attendee.attendanceRecords.length > 0 &&
                    String(attendee.attendanceRecords[0].checkInTime) !== "0001-01-01T00:00:00+00:00"
                      ? format(new Date(attendee.attendanceRecords[0].checkInTime), "full")
                      : "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Leaving:
                </span>
                <p className="text-dashboard-card-text text-[13px]">
                  {attendee.attendanceRecords.length > 0 && attendee.attendanceRecords[attendee.attendanceRecords.length - 1].checkOutTime
                    ? format(new Date(attendee.attendanceRecords[attendee.attendanceRecords.length - 1].checkOutTime!), "full")
                    : eventEndTime
                      ? new Date() < new Date(eventEndTime)
                        ? `Still checked in`
                        : format(new Date(eventEndTime), "full")
                      : "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-dashboard-heading">
                  Late Arrival Reason:
                </span>
                <p className="text-dashboard-card-text">
                  {attendee.attendanceRecords[0]?.lateArrivalExcuse || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Early Leaving Reason:
                </span>
                <p className="text-dashboard-card-text">
                  {attendee.attendanceRecords[attendee.attendanceRecords.length - 1]?.earlyLeaveExcuse || "N/A"}
                </p>
              </div>
            </div>
            <div
              onClick={() => setAttendee(attendee)}
              className={`px-3 py-2 rounded-xl text-center cursor-pointer text-xs font-bold capitalize whitespace-nowrap text-white bg-secondary shadow-sm`}>
              View Timeline
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <div className="text-dashboard-description">
            <p className="text-lg font-medium">No attendees found</p>
            <p className="text-sm">
              This event doesn't have any attendees yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeesCardView;
