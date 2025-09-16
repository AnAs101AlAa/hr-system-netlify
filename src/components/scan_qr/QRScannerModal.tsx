import { useState } from "react";
import Modal from "@/components/generics/Modal";
import { ScannerContainer, ScannerActions } from "@/components/scan_qr";
import { useQRScannerModal } from "@/hooks";
import type { Event } from "@/types/event";
import type { MemberData } from "@/types/attendance";
import { eventsApi } from "@/queries/events";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Omit<Event, "attendees">;
}

const QRScannerModal = ({ isOpen, onClose, event }: QRScannerModalProps) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const attendMember = async (memberId: string, eventId: string) => {
    const eventInsatnce = new eventsApi();
    const response = await eventInsatnce.requestAttendance(
      memberId,
      eventId,
      scanner.memberData?.status === "late" ? scanner.lateReason : ""
    );
    console.log(response);
    return true;
  };

  const scanner = useQRScannerModal({
    eventId: event.id,
    onSuccess: (memberData: MemberData) => {
      // Validate QR code against current event
      const isValidForEvent = attendMember(memberData.id, event.id);

      if (!isValidForEvent) {
        setValidationError(
          `This QR code is not valid for "${event.title}". Please scan the correct QR code for this event.`
        );
        scanner.resetScanner();
        return;
      }

      // Clear any previous validation errors
      setValidationError(null);
      console.log(
        `Successfully validated member ${memberData.name} for event ${event.title}`
      );
    },
    onError: (error: string) => {
      console.error("QR Scanner error:", error);
    },
    onClose: () => {
      setValidationError(null);
      onClose();
    },
    autoReset: false, // We'll handle reset manually after validation
  });

  const handleConfirmAttendance = async () => {
    await scanner.handleConfirmAttendance();

    // TODO: Here you would typically send the attendance data to your backend
    /* Example API call:
    try {
      await fetch(`/api/events/${event.id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: scanner.memberData?.id,
          eventId: event.id,
          arrivalTime: scanner.memberData?.arrivalTime,
          status: scanner.memberData?.status,
          lateReason: scanner.memberData?.status === 'late' ? scanner.lateReason : null
        })
      });
      console.log('Attendance recorded successfully');
    } catch (error) {
      console.error('Failed to record attendance:', error);
    }
    */
  };

  const handleReturnToEvent = () => {
    scanner.resetScanner();
    setValidationError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={scanner.handleClose}
      title={`Scan QR Code - ${event.title}`}
    >
      <div className="p-4">
        {/* Event Info */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">{event.title}</h4>
          <p className="text-sm text-blue-700">
            {new Date(event.startDate).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm font-medium">Validation Error</p>
            <p className="text-red-700 text-sm">{validationError}</p>
          </div>
        )}

        {/* Scanner Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <ScannerContainer
            isScanning={scanner.isScanning}
            error={scanner.error}
            memberData={scanner.memberData}
            attendanceConfirmed={scanner.attendanceConfirmed}
            lateReason={scanner.lateReason}
            onScan={scanner.handleScan}
            onError={scanner.handleError}
            onReasonChange={scanner.handleReasonChange}
            onResetScanner={scanner.resetScanner}
          />

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <ScannerActions
              attendanceConfirmed={scanner.attendanceConfirmed}
              memberData={scanner.memberData}
              isConfirming={scanner.isConfirming}
              lateReason={scanner.lateReason}
              onConfirmAttendance={handleConfirmAttendance}
              onReturnToEvents={handleReturnToEvent}
              onResetScanner={scanner.resetScanner}
            />
          </div>
        </div>

        {/* Modal-specific actions */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={scanner.handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QRScannerModal;
