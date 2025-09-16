import type { Attendee } from "../../types/event";
import AttendeesTable from "./AttendeesTable";
import AttendeesCardView from "./AttendeesCardView";
import { useEffect, useState } from "react";
import SearchField from "../generics/SearchField";
interface AttendeesListProps {
  attendees: Attendee[];
  eventEndTime?: string;
}

const AttendeesList = ({ attendees, eventEndTime }: AttendeesListProps) => {
  const [displayedAttendees, setDisplayedAttendees] =
    useState<Attendee[]>(attendees);
  const [searchKey, setSearchKey] = useState<string>("");

  useEffect(() => {
    if (searchKey.trim() === "") {
      setDisplayedAttendees(attendees);
    } else {
      const lowerSearchKey = searchKey.toLowerCase();
      const filtered = attendees.filter((attendee) =>
        attendee.name.toLowerCase().includes(lowerSearchKey)
      );
      setDisplayedAttendees(filtered);
    }
  }, [searchKey, attendees]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
      <div className="p-4 border-b border-dashboard-border flex md:flex-row flex-col gap-2 md:gap-4 items-center">
        <h3 className="text-lg font-bold text-[#727477]">
          Attendees {attendees?.length ? `(${attendees.length})` : ""}
        </h3>
        <SearchField
          placeholder="Search attendees..."
          value={searchKey}
          onChange={(value) => setSearchKey(value)}
        />
      </div>
      {/* Desktop Table View */}
      <AttendeesTable
        attendees={displayedAttendees}
        eventEndTime={eventEndTime}
      />

      {/* Mobile Card View */}
      <AttendeesCardView
        attendees={displayedAttendees}
        eventEndTime={eventEndTime}
      />
    </div>
  );
};

export default AttendeesList;
