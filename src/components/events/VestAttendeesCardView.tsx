import { useEffect, useState } from "react";
import type { VestAttendee } from "@/types/event";
import { format } from "@/utils";
import { ButtonTypes, ButtonWidths, Button } from "tccd-ui";
import VestStatusBadge from "./VestStatusBadge";
import VestActionModal from "./VestActionModal";
import VestTimelineModal from "./VestTimelineModal";
import { useUpdateVestStatus } from "@/queries/events";
import toast from "react-hot-toast";

interface VestAttendeesCardViewProps {
    attendees: VestAttendee[];
    eventId?: string;
    setAttendees: (data: VestAttendee[]) => void;
}

const VestAttendeesCardView = ({ attendees, eventId, setAttendees }: VestAttendeesCardViewProps) => {
    const updateEventStatus = useUpdateVestStatus();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        attendee: VestAttendee | null;
        action: "assign" | "return" | null;
    }>({
        isOpen: false,
        attendee: null,
        action: null,
    });

    const [timelineModal, setTimelineModal] = useState<{
        isOpen: boolean;
        attendee: VestAttendee | null;
    }>({
        isOpen: false,
        attendee: null,
    });

    const handleActionClick = (attendee: VestAttendee, action: "assign" | "return") => {
        setModalState({
            isOpen: true,
            attendee,
            action,
        });
    };

    const handleTimelineClick = (attendee: VestAttendee) => {
        setTimelineModal({
            isOpen: true,
            attendee,
        });
    };

    const handleModalClose = () => {
        setModalState({
            isOpen: false,
            attendee: null,
            action: null,
        });
    };

    const handleTimelineClose = () => {
        setTimelineModal({
            isOpen: false,
            attendee: null,
        });
    };

    useEffect(() => {
        if (!isSubmitting) return;

        const handleModalConfirm = async () => {
            if (modalState.attendee && modalState.action) {
                try {
                    await updateEventStatus.mutateAsync({
                        eventId: eventId || "",
                        memberId: modalState.attendee.id || "",
                        action: modalState.action === "assign" ? "Received" : "Returned",
                    });

                    setAttendees(
                        attendees.map((attendee: VestAttendee) => {
                            if (attendee.id === modalState.attendee?.id) {
                                return {
                                    ...attendee,
                                    status: modalState.action === "assign" ? "Received" : "Returned",
                                };
                            }
                            return attendee;
                        })
                    )

                    toast.success(`Vest ${modalState.action === "assign" ? "assigned" : "returned"} successfully.`);
                    setTimeout(() => {
                        setIsSubmitting(false);
                        handleModalClose();
                    }, 500);
                } catch (error) {
                    console.error("Error updating vest status:", error);
                    toast.error("Failed to update vest status. Please try again.");
                }
            };
        }

        handleModalConfirm();
    }, [isSubmitting]);

    const renderActionButton = (attendee: VestAttendee) => {
        const actionButton = () => {
            switch (attendee.status) {
                case "NotReceived":
                    return (
                        <Button
                            buttonText="Assign Vest"
                            onClick={() => handleActionClick(attendee, "assign")}
                            type={ButtonTypes.TERTIARY}
                            width={ButtonWidths.FULL}
                        />
                    );
                case "Received":
                    return (
                        <Button
                            buttonText="Return Vest"
                            onClick={() => handleActionClick(attendee, "return")}
                            type={ButtonTypes.SECONDARY}
                            width={ButtonWidths.FULL}
                        />
                    );
                case "Returned":
                    return (
                        <Button
                            buttonText="Assign Vest"
                            onClick={() => handleActionClick(attendee, "assign")}
                            type={ButtonTypes.TERTIARY}
                            width={ButtonWidths.FULL}
                        />
                    );
                default:
                    return null;
            }
        };

        return (
            <div className="space-y-2">
                <div className="[&>button]:!mt-0 [&>button]:!lg:mt-0">
                    {actionButton()}
                </div>
                <div className="[&>button]:!mt-0 [&>button]:!lg:mt-0">
                    <Button
                        buttonText="View Timeline"
                        onClick={() => handleTimelineClick(attendee)}
                        type={ButtonTypes.GHOST}
                        width={ButtonWidths.FULL}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="lg:hidden divide-y divide-gray-100">
            {attendees && attendees.length > 0 ? (
                attendees.map((attendee, index) => (
                    <div key={attendee.id || index} className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h5 className="font-medium text-dashboard-card-text">
                                    {attendee.name || "N/A"}
                                </h5>
                            </div>
                            <VestStatusBadge status={attendee.status} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-dashboard-heading">
                                    Committee:
                                </span>
                                <p className="text-dashboard-card-text">
                                    {attendee.committee || "N/A"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-dashboard-heading">
                                    Phone:
                                </span>
                                <p className="text-dashboard-card-text">
                                    {format(attendee.phoneNumber, "phone")}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            {renderActionButton(attendee)}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-gray-500">No attendees found</div>
            )}

            <VestActionModal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                isSubmitting={isSubmitting}
                onConfirm={() => setIsSubmitting(true)}
                attendeeName={modalState.attendee?.name || ""}
                action={modalState.action || "assign"}
            />

            <VestTimelineModal
                isOpen={timelineModal.isOpen}
                onClose={handleTimelineClose}
                attendeeName={timelineModal.attendee?.name || ""}
                memberId={String(timelineModal.attendee?.id || "")}
                eventId={eventId || ""}
            />
        </div>
    );
};

export default VestAttendeesCardView;