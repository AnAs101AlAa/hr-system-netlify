/**
 * Renders action buttons and reason inputs for the scanner flow.
 * @module ScannerActions
 */
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/generics/Button";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import { useUpdateVestStatus } from "@/queries/events";
import { getErrorMessage } from "@/utils";
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
  eventType: string;
  eventId: string;
}

// Attendance status constants
const STATUS = {
  ON_TIME: 2001,
  LATE: 2002,
  LEAVING_EARLY: 2003,
} as const;

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
  eventType,
  eventId,
}: ScannerActionsProps) => {
  const vestStatus = useUpdateVestStatus();
  const isNotMeeting = eventType !== "Meeting";
  const [vestButtonDisabled, setVestButtonDisabled] = useState(false);
  const [isVestLoading, setIsVestLoading] = useState(false);

  const handleVestStatus = async () => {
    if (!memberData?.id) return;

    const action =
      attendanceStatus === STATUS.ON_TIME || attendanceStatus === STATUS.LATE
        ? "Received"
        : "Received";

    setIsVestLoading(true);
    vestStatus.mutate(
      {
        memberId: memberData.id,
        eventId,
        action,
      },
      {
        onSuccess: () => {
          setVestButtonDisabled(true);
          setIsVestLoading(false);
        },
        onError: (error) => {
          setVestButtonDisabled(false);
          setIsVestLoading(false);
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const getVestButtonText = () => {
    return attendanceStatus === STATUS.ON_TIME || attendanceStatus === STATUS.LATE
      ? "Assign Vest"
      : "Return Vest";
  };

  const getConfirmButtonText = () => {
    if (isConfirming) return "Confirming...";

    if (attendanceStatus === STATUS.LATE) return "Confirm Late Arrival";
    if (attendanceStatus === STATUS.LEAVING_EARLY) return "Confirm Leave Early";

    return "Confirm Attendance";
  };

  const isConfirmDisabled = () => {
    const isLate = attendanceStatus === STATUS.LATE;
    const isLeavingEarly = attendanceStatus === STATUS.LEAVING_EARLY;
    const reasonValue = isLate ? lateReason : leaveExcuse || "";

    return (isLate || isLeavingEarly) && !reasonValue.trim();
  };

  // Render confirmed state
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

  // Render member scanned state
  if (memberData) {
    return (
      <div className="space-y-3">
        <Button
          buttonText={getConfirmButtonText()}
          onClick={onConfirmAttendance}
          type={ButtonTypes.SECONDARY}
          width={ButtonWidths.FULL}
          disabled={isConfirmDisabled()}
          loading={isConfirming}
        />
        {isNotMeeting && (
          <Button
            buttonText={getVestButtonText()}
            onClick={handleVestStatus}
            type={ButtonTypes.PRIMARY}
            width={ButtonWidths.FULL}
            disabled={vestButtonDisabled}
            loading={isVestLoading}
          />
        )}
        <Button
          buttonText="Scan Another QR Code"
          onClick={onResetScanner}
          type={ButtonTypes.GHOST}
          width={ButtonWidths.FULL}
        />
      </div>
    );
  }

  // Render idle/waiting state
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
