import type { Event } from "@/types/event";
import { format } from "@/utils";
import type { Attendee } from "@/types/event";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

interface EventInformationProps {
  event: Event;
  attendees?: Attendee[];
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

const EventInformation = ({
  event,
  attendees,
  onEdit,
  onDelete,
}: EventInformationProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.roles || [];
  const isAdmin = userRole.includes("Admin");
  return (
    <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dashboard-heading">
          {event.title || "Untitled Event"}
        </h2>
        <div className="flex gap-2">
          {onEdit && isAdmin && (
            <Button
              buttonText="Edit"
              onClick={() => onEdit(event.id)}
              type={ButtonTypes.TERTIARY}
              width={ButtonWidths.AUTO}
            />
          )}
          {onDelete && isAdmin && (
            <Button
              buttonText="Delete"
              onClick={() => onDelete(event.id)}
              type={ButtonTypes.DANGER}
              width={ButtonWidths.AUTO}
            />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 text-dashboard-description">
        <div className="flex flex-col space-y-1 sm:space-y-2">
          <span className="font-semibold text-dashboard-heading text-xs sm:text-sm lg:text-base">
            Start Date & Time
          </span>
          <div className="text-dashboard-card-text text-sm sm:text-base lg:text-lg">
            {event.startDate ? format(event.startDate, "full") : "N/A"}
          </div>
        </div>
        <div className="flex flex-col space-y-1 sm:space-y-2">
          <span className="font-semibold text-dashboard-heading text-xs sm:text-sm lg:text-base">
            End Date & Time
          </span>
          <div className="text-dashboard-card-text text-sm sm:text-base lg:text-lg">
            {event.endDate ? format(event.endDate, "full") : "N/A"}
          </div>
        </div>
      </div>

      {/* Event Summary */}
      {attendees && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dashboard-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 text-center">
            <div className="bg-gray-100 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-dashboard-heading">
                {attendees.length}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                Total
              </div>
            </div>
            <div className="bg-green-100 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-contrast">
                {
                  attendees.filter((a) => a.status.toLowerCase() === "attended")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                Attended
              </div>
            </div>
            <div className="bg-red-100 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary">
                {
                  attendees.filter((a) => a.status.toLowerCase() === "absent")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                Absent
              </div>
            </div>
            <div className="bg-blue-100 rounded-lg p-2 sm:p-3 lg:p-4">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-secondary">
                {
                  attendees.filter((a) => a.status.toLowerCase() === "left")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                Left
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInformation;
