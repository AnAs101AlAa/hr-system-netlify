import { useState } from "react";
import type { VestAttendee } from "@/types/event";
import { format } from "@/utils";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import Button from "@/components/generics/Button";
import VestStatusBadge from "./VestStatusBadge";
import VestActionModal from "./VestActionModal";

interface VestAttendeesTableProps {
    attendees: VestAttendee[];
}

const VestAttendeesTable = ({ attendees }: VestAttendeesTableProps) => {
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
                    <div className="flex items-center">
                        <div className="[&>button]:!mt-0 [&>button]:!lg:mt-0">
                            <Button
                                buttonText="Assign Vest"
                                onClick={() => handleActionClick(attendee, "assign")}
                                type={ButtonTypes.TERTIARY}
                                width={ButtonWidths.AUTO}
                            />
                        </div>
                    </div>
                );
            case "assigned":
                return (
                    <div className="flex items-center">
                        <div className="[&>button]:!mt-0 [&>button]:!lg:mt-0">
                            <Button
                                buttonText="Return Vest"
                                onClick={() => handleActionClick(attendee, "return")}
                                type={ButtonTypes.SECONDARY}
                                width={ButtonWidths.AUTO}
                            />
                        </div>
                    </div>
                );
            case "returned":
                return (
                    <div className="text-sm text-gray-600 italic">
                        Vest Returned
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
                {/* Table Header */}
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
                            Name
                        </th>
                        <th
                            className="w-42 min-w-42 px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
                            Phone
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
                            Committee
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
                            Vest Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
                            Actions
                        </th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100">
                    {attendees && attendees.length > 0 ? (
                        attendees.map((attendee, index) => (
                            <tr
                                key={attendee.id || index}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-4">
                                    <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                                        {attendee.name || "N/A"}
                                    </div>
                                </td>
                                <td
                                    className="w-32 min-w-32 px-4 py-4"
                                    style={{ width: "8rem", minWidth: "8rem" }}
                                >
                                    <div className="text-sm text-dashboard-card-text font-mono">
                                        {format(attendee.phoneNumber, "phone")}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="text-sm text-dashboard-card-text">
                                        {attendee.committee || "N/A"}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <VestStatusBadge status={attendee.vestStatus} />
                                </td>
                                <td className="px-4 py-4">
                                    {renderActionButton(attendee)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-4 py-8 text-center">
                                <div className="text-dashboard-description">
                                    <p className="text-lg font-medium">No attendees found</p>
                                    <p className="text-sm">
                                        This event doesn't have any attendees yet.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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

export default VestAttendeesTable;