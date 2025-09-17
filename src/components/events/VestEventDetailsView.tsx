import WithNavbar from "@/components/hoc/WithNavbar";
import { EventDetailsHeader, VestEventInformation, VestAttendeesList } from "@/components/events";
import type { VestEvent } from "@/types/event";

interface VestEventDetailsViewProps {
    event: VestEvent;
    onBack: () => void;
}

const VestEventDetailsView: React.FC<VestEventDetailsViewProps> = ({ event, onBack }) => {
    return (
        <WithNavbar>
            <div className="min-h-screen bg-background p-4">
                <div className="max-w-6xl mx-auto">
                    <EventDetailsHeader onBack={onBack} />
                    <VestEventInformation event={event} />
                    <VestAttendeesList attendees={event.attendees || []} />
                </div>
            </div>
        </WithNavbar>
    );
};

export default VestEventDetailsView;