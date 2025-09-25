import type { VestAttendee } from "@/types/event";
import VestAttendeesTable from "./VestAttendeesTable";
import VestAttendeesCardView from "./VestAttendeesCardView";

interface VestAttendeesListProps {
    attendees: VestAttendee[];
    eventId?: string;
    setAttendees: (data: VestAttendee[]) => void;
}

const VestAttendeesList = ({ attendees, eventId, setAttendees }: VestAttendeesListProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
            <div className="p-4 border-b border-dashboard-border">
                <h3 className="text-lg font-bold text-[#727477]">
                    Members {attendees?.length ? `(${attendees.length})` : ""}
                </h3>
            </div>

            {/* Desktop Table View */}
            <VestAttendeesTable attendees={attendees} eventId={eventId} setAttendees={setAttendees} />

            {/* Mobile Card View */}
            <VestAttendeesCardView attendees={attendees} eventId={eventId} setAttendees={setAttendees} />
        </div>
    );
};

export default VestAttendeesList;