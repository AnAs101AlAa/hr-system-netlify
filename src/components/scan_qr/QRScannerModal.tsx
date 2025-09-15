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

  // Mock function to validate if QR data matches event
  const validateQRForEvent = (qrData: string, eventId: number): boolean => {
    // In real implementation, this would check if the QR code is valid for this specific event
    // For now, we'll simulate different validation scenarios for demo purposes

    /* TODO: Replace with actual API call to validate QR code against event
    const response = await fetch(`/api/events/${eventId}/validate-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qrCode: qrData })
    });
    const { isValid, member } = await response.json();
    return isValid;
    */

    // Mock validation scenarios (comment out in production):
    const scenarios = [
      {
        probability: 0.6,
        result: true,
        reason: "Valid QR code for this event",
      },
      {
        probability: 0.2,
        result: false,
        reason: "QR code is for a different event",
      },
      { probability: 0.1, result: false, reason: "QR code has expired" },
      {
        probability: 0.1,
        result: false,
        reason: "Member not registered for this event",
      },
    ];

    const random = Math.random();
    let cumulative = 0;

    for (const scenario of scenarios) {
      cumulative += scenario.probability;
      if (random <= cumulative) {
        console.log(
          `Validation result for QR "${qrData}" in event ${eventId}: ${
            scenario.result ? "VALID" : "INVALID"
          } - ${scenario.reason}`
        );
        return scenario.result;
      }
    }

    return true; // fallback
  };

  const scanner = useQRScannerModal({
    onSuccess: (memberData: MemberData) => {
      // Validate QR code against current event
      const isValidForEvent = validateQRForEvent(memberData.id, event.id);

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
            {new Date(event.startTime).toLocaleString("en-US", {
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
