import WithNavbar from "@/components/hoc/WithNavbar";
import { EventDetailsHeader, VestEventInformation, VestAttendeesList } from "@/components/events";
import type { Event, VestAttendee } from "@/types/event";

interface VestEventDetailsViewProps {
    event: Event;
    attendees: VestAttendee[];
    onBack: () => void;
    setAttendees: (data: VestAttendee[]) => void;
}

const VestEventDetailsView: React.FC<VestEventDetailsViewProps> = ({ event, attendees, onBack, setAttendees }) => {
    return (
        <WithNavbar>
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-6xl mx-auto">
                    <EventDetailsHeader onBack={onBack} />
                    <VestEventInformation event={event} attendees={attendees} />
                    <VestAttendeesList attendees={attendees || []} eventId={event.id} setAttendees={setAttendees} />
                </div>
            </div>
        </WithNavbar>
    );
};

export default VestEventDetailsView;