import { Modal, Button } from "tccd-ui";
import { useDeleteEvent } from "@/shared/queries/events";
import toast from "react-hot-toast";
export default function EventDeleteModal({ isOpen, onClose, eventId }: { isOpen: boolean; onClose: () => void; eventId: string }) {
    const deleteEventMutation = useDeleteEvent();
    const handleDelete = () => {
        deleteEventMutation.mutate(eventId, {
            onSuccess: () => {
                toast.success("Event deleted successfully");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            onError: () => {
                toast.error("Failed to delete event");
            }
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete Event">
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-center">Are you sure you want to delete this event?</p>
            <div className="flex justify-center space-x-2 mt-4">
                <Button type="secondary" onClick={onClose} buttonText="Cancel" disabled={deleteEventMutation.isPending} />
                <Button type="danger" buttonText="Delete" onClick={handleDelete} loading={deleteEventMutation.isPending} />
            </div>
        </Modal>
    );
}