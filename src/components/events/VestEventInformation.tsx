import type { VestEvent } from "@/types/event";

interface VestEventInformationProps {
    event: VestEvent;
}

const VestEventInformation = ({ event }: VestEventInformationProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-dashboard-heading mb-3 sm:mb-4">
                {event.title || "Untitled Event"}
            </h2>

            {/* Vest Summary Statistics */}
            {event.attendees && (
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dashboard-border">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 text-center">
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4">
                            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-dashboard-heading">
                                {event.attendees.length}
                            </div>
                            <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                                Total
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-2 sm:p-3 lg:p-4">
                            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-contrast">
                                {event.attendees.filter((a) => a.vestStatus === "assigned").length}
                            </div>
                            <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                                Assigned
                            </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 lg:p-4">
                            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-secondary">
                                {event.attendees.filter((a) => a.vestStatus === "returned").length}
                            </div>
                            <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                                Returned
                            </div>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-2 sm:p-3 lg:p-4">
                            <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary">
                                {event.attendees.filter((a) => a.vestStatus === "unassigned").length}
                            </div>
                            <div className="text-xs sm:text-sm lg:text-base text-dashboard-description">
                                Unassigned
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VestEventInformation;