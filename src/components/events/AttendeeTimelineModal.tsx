import type { Attendee } from "@/types/event";
import Modal from "../generics/Modal";

export default function AttendeeTimelineModal ({Attendee, onCLose} : {Attendee: Attendee, onCLose: () => void}) {
    return (
        <Modal title={`${Attendee.name}'s timeline`} isOpen={true} onClose={() => onCLose()}>
            {Attendee.arrivals?.length == 0 && Attendee.leavings?.length === 0 && (
                <div className="text-inactive-tab-text">
                    Timeline for this member is empty, they haven't attended yet
                </div>
            )}
        </Modal>
    )
}