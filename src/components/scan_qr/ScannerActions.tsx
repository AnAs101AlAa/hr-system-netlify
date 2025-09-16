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
}

const ScannerActions = ({
  attendanceConfirmed,
  memberData,
  isConfirming,
  lateReason,
  onConfirmAttendance,
  onReturnToEvents,
  onResetScanner,
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
    return (
      <div className="space-y-3">
        <Button
          buttonText={isConfirming ? "Confirming..." : "Confirm Attendance"}
          onClick={onConfirmAttendance}
          type={ButtonTypes.SECONDARY}
          width={ButtonWidths.FULL}
          disabled={memberData.status === "late" && !lateReason.trim()}
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