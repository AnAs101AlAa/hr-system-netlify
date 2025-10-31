import type { Attendee } from "@/shared/types/event";
import AttendeesTable from "./AttendeesTable";
import AttendeesCardView from "./AttendeesCardView";
import { useEffect, useState } from "react";
import AttendeeTimelineModal from "./AttendeeTimelineModal";
import { SearchField } from "tccd-ui";

interface AttendeesListProps {
  attendees: Attendee[];
  eventEndTime?: string;
}

const AttendeesList = ({ attendees, eventEndTime }: AttendeesListProps) => {
  const [displayedAttendees, setDisplayedAttendees] =
    useState<Attendee[]>(attendees);
  const [searchKey, setSearchKey] = useState<string>("");
  const [attendeeTimeline, setAttendeeTimeline] = useState<Attendee | null>(null);

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
      {attendeeTimeline !== null && (<AttendeeTimelineModal onCLose={() => setAttendeeTimeline(null)} Attendee={attendeeTimeline}/>)}
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
        setAttendee={(data) => setAttendeeTimeline(data)}
        eventEndTime={eventEndTime}
      />

      {/* Mobile Card View */}
      <AttendeesCardView
        attendees={displayedAttendees}
        setAttendee={(data) => setAttendeeTimeline(data)}
        eventEndTime={eventEndTime}
      />
    </div>
  );
};

export default AttendeesList;
