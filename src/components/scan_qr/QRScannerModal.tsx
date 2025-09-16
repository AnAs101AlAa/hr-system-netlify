import { useState, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/generics/Modal";
import { ScannerContainer, ScannerActions } from "@/components/scan_qr";
import { useQRScannerModal } from "@/hooks";
import type { Event } from "@/types/event";
import type { MemberData } from "@/types/attendance";
import { getErrorMessage } from "@/utils";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Omit<Event, "attendees">;
}

const QRScannerModal = ({ isOpen, onClose, event }: QRScannerModalProps) => {
  const [attendanceStatus, setAttendanceStatus] = useState<number | null>(null);
  const [leaveExcuse, setLeaveExcuse] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSuccess = useCallback(
    async (memberData: MemberData) => {
      setIsVerifying(true);

      // New: Call endpoint to check attendance status
      try {
        const { eventsApi } = await import("@/queries/events");
        const eventInstance = new eventsApi();
        const statusResponse = await eventInstance.checkAttendanceStatus(
          memberData.id,
          event.id
        );
        console.log(statusResponse);
        setAttendanceStatus(statusResponse.status);
        if (statusResponse.status === 2004) {
          toast.error("Member already registered and left early");
          scanner.resetScanner(true);
        }
      } catch (error) {
        console.error("Failed to check attendance status:", error);
        toast.error(getErrorMessage(error));
        setIsVerifying(false);
        return;
      }

      setIsVerifying(false);
      console.log(
        `Successfully scanned member ${memberData.name} for event ${event.title}`
      );
    },
    [event.id, event.title]
  );

  const handleError = useCallback((error: string) => {
    console.error("QR Scanner error:", error);
    toast.error(error);
  }, []);

  const handleClose = useCallback(() => {
    setIsVerifying(false);
    setAttendanceStatus(null);
    setLeaveExcuse("");
    onClose();
  }, [onClose]);

  const scanner = useQRScannerModal({
    eventId: event.id,
    onSuccess: handleSuccess,
    onError: handleError,
    onClose: handleClose,
    autoReset: true, // We'll handle reset manually after validation
  });

  // Create a stable reference to the reset function
  const resetScanner = useCallback(() => {
    scanner.resetScanner(true);
    setIsVerifying(false);
    setAttendanceStatus(null);
    setLeaveExcuse("");
  }, [scanner]);

  // Reset scanner when modal opens
  useEffect(() => {
    if (isOpen) {
      resetScanner();
    }
  }, [isOpen]);

  const handleConfirmAttendance = useCallback(async () => {
    if (!scanner.memberData) {
      toast.error("No member data available to record attendance");
      return;
    }

    // Set confirming state to show loading
    scanner.setConfirming(true);

    try {
      // Import eventsApi here to avoid unused import warning
      const { eventsApi } = await import("@/queries/events");

      const eventInstance = new eventsApi();
      let response;

      // Use different API methods based on attendance status
      if (attendanceStatus === 2002) {
        // Late arrival
        response = await eventInstance.recordLateArrivalExcuse(
          scanner.memberData.id,
          event.id,
          leaveExcuse
        );
      } else if (attendanceStatus === 2003) {
        // Leaving early
        response = await eventInstance.recordLeaveEarly(
          scanner.memberData.id,
          event.id,
          leaveExcuse
        );
      } else if (attendanceStatus === 2004) {
        // Leaving early
        toast.error("Member already registered and left early");
        scanner.resetScanner(true);
      } else {
        // On-time attendance
        response = await eventInstance.requestAttendance(
          scanner.memberData.id,
          event.id
        );
      }

      console.log("Attendance recorded successfully:", response);

      // Show success toast
      toast.success("Attendance recorded successfully!");

      // Reset confirming state
      scanner.setConfirming(false);

      // Call the scanner's confirmation handler only on success
      await scanner.handleConfirmAttendance();
    } catch (error) {
      console.error("Failed to record attendance:", error);
      toast.error(getErrorMessage(error));
      // Reset confirming state on error so user can try again
      scanner.setConfirming(false);
    }
  }, [attendanceStatus, leaveExcuse, event.id, scanner]);

  const handleReturnToEvent = useCallback(() => {
    // Don't restart scanner since modal is closing
    setIsVerifying(false);
    setAttendanceStatus(null);
    setLeaveExcuse("");
    onClose();
  }, [onClose]);

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

        {/* Scanner Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <ScannerContainer
            isScanning={scanner.isScanning}
            error={scanner.error}
            memberData={scanner.memberData}
            attendanceConfirmed={scanner.attendanceConfirmed}
            lateReason={scanner.lateReason}
            attendanceStatus={attendanceStatus}
            leaveExcuse={leaveExcuse}
            isVerifying={isVerifying}
            onScan={scanner.handleScan}
            onError={scanner.handleError}
            onReasonChange={scanner.handleReasonChange}
            onLeaveExcuseChange={(e) => setLeaveExcuse(e.target.value)}
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
