import Button from "@/components/generics/Button";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import type { MemberData } from "@/types/attendance";

interface ScannerActionsProps {
  attendanceConfirmed: boolean;
  memberData: MemberData | null;
  isConfirming: boolean;
  lateReason: string;
  onConfirmAttendance: () => void;
  onReturnToEvents: () => void;
  onResetScanner: () => void;
  attendanceStatus?: number | null;
  leaveExcuse?: string;
  onLeaveExcuseChange?: (excuse: string) => void;
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
  onLeaveExcuseChange,
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
    } else if (attendanceStatus === 2002) {
      // Late arrival
      return (
        <div className="space-y-3">
          <textarea
            value={lateReason}
            onChange={onReasonChange}
            placeholder="Enter reason for late arrival..."
            className="w-full p-2 border rounded"
          />
          <Button
            buttonText={isConfirming ? "Confirming..." : "Confirm Late Arrival"}
            onClick={onConfirmAttendance}
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.FULL}
            disabled={!lateReason.trim()}
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
    } else if (attendanceStatus === 2003) {
      // Leaving early
      return (
        <div className="space-y-3">
          <textarea
            value={leaveExcuse}
            onChange={(e) => onLeaveExcuseChange?.(e.target.value)}
            placeholder="Enter reason for leaving early..."
            className="w-full p-2 border rounded"
          />
          <Button
            buttonText={isConfirming ? "Confirming..." : "Confirm Leave Early"}
            onClick={onConfirmAttendance}
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.FULL}
            disabled={!leaveExcuse.trim()}
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