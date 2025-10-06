import type { VestAttendee } from "@/types/event";
import VestAttendeesTable from "./VestAttendeesTable";
import VestAttendeesCardView from "./VestAttendeesCardView";
import { useState, useEffect } from "react";
import { SearchField } from "tccd-ui";

interface VestAttendeesListProps {
    attendees: VestAttendee[];
    eventId?: string;
    setAttendees: (data: VestAttendee[]) => void;
}

const VestAttendeesList = ({ attendees, eventId, setAttendees }: VestAttendeesListProps) => {
    const [displayedAttendees, setDisplayedAttendees] =
    useState<VestAttendee[]>(attendees);
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
            <VestAttendeesTable attendees={displayedAttendees} eventId={eventId} setAttendees={setAttendees} />

            {/* Mobile Card View */}
            <VestAttendeesCardView attendees={displayedAttendees} eventId={eventId} setAttendees={setAttendees} />
        </div>
    );
};

export default VestAttendeesList;