import { useState } from "react";
import Modal from "@/components/generics/Modal";
import { ScannerContainer, ScannerActions } from "@/components/scan_qr";
import { useQRScannerModal } from "@/hooks";
import type { Event } from "@/types/event";
import type { MemberData } from "@/types/attendance";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Omit<Event, "attendees">;
}

const QRScannerModal = ({ isOpen, onClose, event }: QRScannerModalProps) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const scanner = useQRScannerModal({
    eventId: event.id,
    onSuccess: (memberData: MemberData) => {
      // Clear any previous validation errors
      setValidationError(null);
      console.log(
        `Successfully scanned member ${memberData.name} for event ${event.title}`
      );
    },
    onError: (error: string) => {
      console.error("QR Scanner error:", error);
      setValidationError(error);
    },
    onClose: () => {
      setValidationError(null);
      onClose();
    },
    autoReset: false, // We'll handle reset manually after validation
  });

  const handleConfirmAttendance = async () => {
    if (!scanner.memberData) {
      setValidationError("No member data available to record attendance");
      return;
    }

    try {
      // Import eventsApi here to avoid unused import warning
      const { eventsApi } = await import("@/queries/events");

      const eventInstance = new eventsApi();
      const response = await eventInstance.requestAttendance(
        scanner.memberData.id,
        event.id,
        scanner.memberData.status === "late" ? scanner.lateReason : ""
      );

      console.log("Attendance recorded successfully:", response);

      // Call the scanner's confirmation handler
      await scanner.handleConfirmAttendance();

    } catch (error) {
      console.error("Failed to record attendance:", error);
      setValidationError("Failed to record attendance. Please try again.");
    }
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
