import type { Event, Attendee, VestAttendee } from "@/shared/types/event";
import { format } from "@/shared/utils";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import { useSelector } from "react-redux";
import type { RootState } from "@/shared/redux/store/store";

interface EventInformationProps {
  event: Event;
  attendees?: Attendee[];
  vestAttendees?: VestAttendee[];
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  activeTab?: "attendance" | "vest";
}

const EventInformation = ({
  event,
  attendees,
  vestAttendees,
  onEdit,
  onDelete,
  activeTab = "attendance",
}: EventInformationProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.roles || [];
  const isAdmin = userRole.includes("Admin");
  return (
    <div className="bg-white dark:bg-surface-glass-bg rounded-b-lg shadow-sm border border-dashboard-card-border border-t-0 p-4 sm:p-6 mb-4 sm:mb-6 -mt-1">
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

      {/* Event Summary - Attendance Tab */}
      {activeTab === "attendance" && attendees && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dashboard-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 text-center">
            <div className="bg-slate-100 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-gray-100">
                {attendees.length}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-gray-300">
                Total
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-800/40 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-300">
                {
                  attendees.filter((a) => a.status.toLowerCase() === "attended")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-emerald-500 dark:text-emerald-200">
                Attended
              </div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-800/40 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-rose-600 dark:text-rose-300">
                {
                  attendees.filter((a) => a.status.toLowerCase() === "absent")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-rose-500 dark:text-rose-200">
                Absent
              </div>
            </div>
            <div className="bg-sky-50 dark:bg-sky-800/40 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-sky-600 dark:text-sky-300">
                {
                  attendees.filter((a) => a.status.toLowerCase() === "left")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-sky-500 dark:text-sky-200">
                Left
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Summary - Vest Tab */}
      {activeTab === "vest" && vestAttendees && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dashboard-border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 text-center">
            <div className="bg-slate-100 dark:bg-gray-700/50 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-gray-100">
                {vestAttendees.length}
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-gray-300">
                Total
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-800/40 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-300">
                {
                  vestAttendees.filter((a) => a.status === "Received")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-green-500 dark:text-green-200">
                Received
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-800/40 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-300">
                {
                  vestAttendees.filter((a) => a.status === "Returned")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-blue-500 dark:text-blue-200">
                Returned
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-800/40 rounded-lg p-2 sm:p-3 lg:p-4 shadow-sm">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-amber-600 dark:text-amber-300">
                {
                  vestAttendees.filter((a) => a.status === "NotReceived")
                    .length
                }
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-amber-500 dark:text-amber-200">
                Not Received
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInformation;
