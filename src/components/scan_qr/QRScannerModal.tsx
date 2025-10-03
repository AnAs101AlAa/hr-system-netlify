import Modal from "@/components/generics/Modal";
import { ScannerContainer, ScannerActions } from "@/components/scan_qr";
import ReasonPopup from "@/components/QR/ReasonPopup";
import { useAttendanceFlow } from "@/hooks/useAttendanceFlow";
import type { Event } from "@/types/event";
import { useState, useEffect, useRef } from "react";

/**
 * Modal for scanning QR codes and handling attendance flow.
 * @module QRScannerModal
 */
interface QRScannerModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Handler to close the modal */
  onClose: () => void;
  /** Event info (without attendees) */
  event: Omit<Event, "attendees">;
}

const QRScannerModal = ({ isOpen, onClose, event }: QRScannerModalProps) => {
  const {
    isScanning,
    error,
    memberData,
    attendanceStatus,
    lateReason,
    setLateReason,
    leaveExcuse,
    setLeaveExcuse,
    isConfirming,
    attendanceConfirmed,
    handleScan,
    confirmAttendance,
    reset,
    eventType,
  } = useAttendanceFlow(event.id);

  // Which reason popup is currently open
  const [reasonPopupOpen, setReasonPopupOpen] = useState<
    null | "late" | "early" | ""
  >(null);

  // Remember if the user just dismissed the popup for this scan flow,
  // so we don't immediately re-open it due to the same attendanceStatus.
  const dismissedRef = useRef(false);

  // Track if we should confirm after popup closes (submit)
  const confirmAfterPopup = useRef<null | (() => void)>(null);

  // Auto-open popup ONLY if:
  //  - the status requires it (2002 late / 2003 early),
  //  - we still don't have a reason/excuse,
  //  - and the user hasn't just dismissed it.
  useEffect(() => {
    if (attendanceStatus === 2002 && !lateReason && !dismissedRef.current) {
      setReasonPopupOpen("late");
    } else if (
      attendanceStatus === 2003 &&
      !leaveExcuse &&
      !dismissedRef.current
    ) {
      setReasonPopupOpen("early");
    } else {
      setReasonPopupOpen(null);
    }
  }, [attendanceStatus, lateReason, leaveExcuse, reset]);

  // Reset dismissedRef when memberData becomes null (after reset)
  useEffect(() => {
    if (!memberData) {
      dismissedRef.current = false;
    }
  }, [memberData]);

  // After a successful submit closed the popup and queued confirm, run it.
  useEffect(() => {
    if (!reasonPopupOpen && confirmAfterPopup.current) {
      confirmAfterPopup.current();
      confirmAfterPopup.current = null;
    }
  }, [reasonPopupOpen]);

  // Return to events: fully reset the scanner state and clear the dismissal guard
  const handleReturnToEvent = () => {
    dismissedRef.current = false;
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleReturnToEvent}
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
              isScanning={isScanning}
              error={error}
              memberData={memberData}
              attendanceConfirmed={attendanceConfirmed}
              lateReason={lateReason}
              attendanceStatus={attendanceStatus}
              leaveExcuse={leaveExcuse}
              onScan={handleScan}
              onError={(setError) => setError}
              onReasonChange={(e) => setLateReason(e.target.value)}
              onResetScanner={() => {
                dismissedRef.current = false;
                reset();
              }}
            />

            {/* Action Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <ScannerActions
                attendanceConfirmed={attendanceConfirmed}
                memberData={memberData}
                attendanceStatus={attendanceStatus}
                isConfirming={isConfirming}
                lateReason={lateReason}
                leaveExcuse={leaveExcuse}
                onConfirmAttendance={confirmAttendance}
                onReturnToEvents={handleReturnToEvent}
                onResetScanner={() => {
                  dismissedRef.current = false;
                  reset();
                }}
                eventType={eventType}
                eventId={event.id}
              />
            </div>
          </div>

          {/* Modal-specific actions */}
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleReturnToEvent}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* ReasonPopup for late arrival */}
      <ReasonPopup
        isOpen={reasonPopupOpen === "late"}
        onClose={(status, reason) => {
          setReasonPopupOpen(null);
          if (status === 1) {
            // User canceled -> reset scanner and allow rescan
            reset();
          }
          if (status === 0 && reason) {
            // User submitted
            dismissedRef.current = false; // allow future prompts in new flows
            setLateReason(reason);
            confirmAfterPopup.current = confirmAttendance;
          }
        }}
        title="Late Arrival Notice"
        prompt="Please provide the reason for late arrival"
        initialReason={lateReason}
      />

      {/* ReasonPopup for early leave */}
      <ReasonPopup
        isOpen={reasonPopupOpen === "early"}
        onClose={(status, reason) => {
          setReasonPopupOpen(null);
          if (status === 1) {
            // User canceled -> reset scanner and allow rescan
            reset();
          }
          if (status === 0 && reason) {
            dismissedRef.current = false;
            setLeaveExcuse(reason);
            confirmAfterPopup.current = confirmAttendance;
          }
        }}
        title="Early Leave Notice"
        prompt="Please provide the reason for early leave"
        initialReason={leaveExcuse}
      />
    </>
  );
};

export default QRScannerModal;
