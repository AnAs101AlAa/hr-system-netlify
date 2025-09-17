import { useState } from "react";
import type { VestAttendee } from "@/types/event";
import { format } from "@/utils";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import Button from "@/components/generics/Button";
import VestStatusBadge from "./VestStatusBadge";
import VestActionModal from "./VestActionModal";

interface VestAttendeesCardViewProps {
    attendees: VestAttendee[];
}

const VestAttendeesCardView = ({ attendees }: VestAttendeesCardViewProps) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        attendee: VestAttendee | null;
        action: "assign" | "return" | null;
    }>({
        isOpen: false,
        attendee: null,
        action: null,
    });

    const handleActionClick = (attendee: VestAttendee, action: "assign" | "return") => {
        setModalState({
            isOpen: true,
            attendee,
            action,
        });
    };

    const handleModalClose = () => {
        setModalState({
            isOpen: false,
            attendee: null,
            action: null,
        });
    };

    const handleModalConfirm = () => {
        if (modalState.attendee && modalState.action) {
            // TODO: Implement the actual vest status update logic here
            console.log(`${modalState.action} vest for ${modalState.attendee.name}`);
        }
        handleModalClose();
    };

    const renderActionButton = (attendee: VestAttendee) => {
        switch (attendee.vestStatus) {
            case "unassigned":
                return (
                    <div className="[&>button]:!mt-0 [&>button]:!lg:mt-0">
                        <Button
                            buttonText="Assign Vest"
                            onClick={() => handleActionClick(attendee, "assign")}
                            type={ButtonTypes.TERTIARY}
                            width={ButtonWidths.FULL}
                        />
                    </div>
                );
            case "assigned":
                return (
                    <div className="[&>button]:!mt-0 [&>button]:!lg:mt-0">
                        <Button
                            buttonText="Return Vest"
                            onClick={() => handleActionClick(attendee, "return")}
                            type={ButtonTypes.SECONDARY}
                            width={ButtonWidths.FULL}
                        />
                    </div>
                );
            case "returned":
                return (
                    <span className="text-sm text-gray-600 italic text-center block">
                        Vest Returned
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="lg:hidden divide-y divide-gray-100">
            {attendees && attendees.length > 0 ? (
                attendees.map((attendee, index) => (
                    <div key={attendee.id || index} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-medium text-dashboard-card-text">
                                    {attendee.name || "N/A"}
                                </h4>
                            </div>
                            <VestStatusBadge status={attendee.vestStatus} />
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
                                    {format(attendee.phone, "phone")}
                                </p>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                            {renderActionButton(attendee)}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-8 text-center text-gray-500">No attendees found</div>
            )}

            {/* Modal */}
            <VestActionModal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm}
                attendeeName={modalState.attendee?.name || ""}
                action={modalState.action || "assign"}
            />
        </div>
    );
};

export default VestAttendeesCardView;