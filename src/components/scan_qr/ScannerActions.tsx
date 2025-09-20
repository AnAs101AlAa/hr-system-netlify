/**
 * Renders action buttons and reason inputs for the scanner flow.
 * @module ScannerActions
 */
import Button from "@/components/generics/Button";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import type { MemberData } from "@/types/attendance";

/**
 * Props for ScannerActions.
 * @property attendanceConfirmed - Whether attendance is confirmed.
 * @property memberData - The member's data, if scanned.
 * @property isConfirming - Loading state for confirmation.
 * @property lateReason - Reason for late arrival.
 * @property leaveExcuse - Reason for early leave.
 * @property attendanceStatus - Attendance status code.
 * @property onConfirmAttendance - Handler for confirming attendance.
 * @property onReturnToEvents - Handler for returning to events list.
 * @property onResetScanner - Handler for resetting the scanner.
 * @property onReasonChange - Handler for reason textarea change (late/early).
 */
interface ScannerActionsProps {
  attendanceConfirmed: boolean;
  memberData: MemberData | null;
  isConfirming: boolean;
  lateReason: string;
  leaveExcuse?: string;
  attendanceStatus?: number | null;
  onConfirmAttendance: () => void;
  onReturnToEvents: () => void;
  onResetScanner: () => void;
  onReasonChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ScannerActions = ({
  attendanceConfirmed,
  memberData,
  isConfirming,
  lateReason,
  onConfirmAttendance,
  onReturnToEvents,
  onResetScanner,
  attendanceStatus = null,
  leaveExcuse = "",
  onReasonChange,
}: ScannerActionsProps) => {
  if (attendanceConfirmed) {
    return (
      <div className="space-y-3">
        <Button
          buttonText="Return to Events"
          onClick={onReturnToEvents}
          type={ButtonTypes.SECONDARY}
          width={ButtonWidths.FULL}
        />
        <Button
          buttonText="Scan Another QR Code"
          onClick={onResetScanner}
          type={ButtonTypes.GHOST}
          width={ButtonWidths.FULL}
        />
      </div>
    );
  }

  if (memberData) {
    if (attendanceStatus === 2001) {
      // On time attendance
      return (
        <div className="space-y-3">
          <Button
            buttonText={isConfirming ? "Confirming..." : "Confirm Attendance"}
            onClick={onConfirmAttendance}
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.FULL}
            loading={isConfirming}
          />
          <Button
            buttonText="Scan Another QR Code"
            onClick={onResetScanner}
            type={ButtonTypes.GHOST}
            width={ButtonWidths.FULL}
          />
        </div>
      );
    } else if (attendanceStatus === 2002 || attendanceStatus === 2003) {
      // Late arrival or leaving early
      const isLate = attendanceStatus === 2002;
      const reasonValue = isLate ? lateReason : leaveExcuse || "";
      return (
        <div className="space-y-3">
          <textarea
            value={reasonValue}
            onChange={onReasonChange}
            placeholder={
              isLate
                ? "Enter reason for late arrival..."
                : "Enter reason for leaving early..."
            }
            className="w-full p-2 border rounded"
          />
          <Button
            buttonText={
              isConfirming
                ? isLate
                  ? "Confirming..."
                  : "Confirming..."
                : isLate
                ? "Confirm Late Arrival"
                : "Confirm Leave Early"
            }
            onClick={onConfirmAttendance}
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.FULL}
            disabled={!reasonValue.trim()}
            loading={isConfirming}
          />
          <Button
            buttonText="Scan Another QR Code"
            onClick={onResetScanner}
            type={ButtonTypes.GHOST}
            width={ButtonWidths.FULL}
          />
        </div>
      );
    }
    // Default case if status is not set yet
    return (
      <div className="space-y-3">
        <Button
          buttonText="Confirm Attendance"
          onClick={onConfirmAttendance}
          type={ButtonTypes.SECONDARY}
          width={ButtonWidths.FULL}
          loading={isConfirming}
        />
        <Button
          buttonText="Scan Another QR Code"
          onClick={onResetScanner}
          type={ButtonTypes.GHOST}
          width={ButtonWidths.FULL}
        />
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-2 text-[var(--color-dashboard-description)]">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm">Camera Active - Ready to Scan</span>
      </div>
    </div>
  );
};

export default ScannerActions;
