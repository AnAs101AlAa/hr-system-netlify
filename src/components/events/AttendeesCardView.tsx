import type { Attendee } from "../../types/event";
import { format } from "../../utils";
import StatusBadge from "./StatusBadge";

interface AttendeesCardViewProps {
  attendees: Attendee[];
  eventEndTime?: string;
}

const AttendeesCardView = ({ attendees, eventEndTime }: AttendeesCardViewProps) => {
  return (
    <div className="lg:hidden divide-y divide-gray-100">
      {attendees && attendees.length > 0 ? (
        attendees.map((attendee, index) => (
          <div key={attendee.id || index} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-dashboard-card-text">
                  {attendee.name || "N/A"}
                </h4>
              </div>
              <StatusBadge status={attendee.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
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
                  {format(attendee.arrivalTime, "hour")}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Leaving:
                </span>
                <p className="text-dashboard-card-text text-[13px]">
                    {attendee.status === "left"
                      ? (attendee.earlyLeave ? format(attendee.earlyLeave.leaveTime, "hour") : eventEndTime)
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
                  {attendee.lateArrival?.execuse || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Early Leaving Reason:
                </span>
                <p className="text-dashboard-card-text">
                  {attendee.earlyLeave?.execuse || "N/A"}
                </p>
              </div>
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
