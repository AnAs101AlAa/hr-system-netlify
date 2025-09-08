import type { Attendee } from "../../types/event";
import AttendeesTable from "./AttendeesTable";
import AttendeesCardView from "./AttendeesCardView";

interface AttendeesListProps {
  attendees: Attendee[];
}

const AttendeesList = ({ attendees }: AttendeesListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
      <div className="p-4 border-b border-dashboard-border">
        <h3 className="text-lg font-bold text-[#727477]">
          Attendees {attendees?.length ? `(${attendees.length})` : ""}
        </h3>
      </div>

      {/* Desktop Table View */}
      <AttendeesTable attendees={attendees} />

      {/* Mobile Card View */}
      <AttendeesCardView attendees={attendees} />
    </div>
  );
};

export default AttendeesList;
