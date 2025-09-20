/**
 * Container for the QR scanner and all attendance states.
 * @module ScannerContainer
 */
import QRCodeScanner from "./QRCodeScanner";
import ErrorFallBack from "./ErrorFallBack";
import AttendanceConfirmation from "./AttendanceConfirmation";
import FinalConfirmation from "./FinalConfirmation";
import ScannerLoading from "./ScannerLoading";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { MemberData } from "@/types/attendance";

/**
 * Props for ScannerContainer.
 * @property isScanning - Whether the scanner is active.
 * @property error - Error message, if any.
 * @property memberData - The member's data, if scanned.
 * @property attendanceConfirmed - Whether attendance is confirmed.
 * @property lateReason - Reason for late arrival.
 * @property leaveExcuse - Reason for early leave.
 * @property attendanceStatus - Attendance status code.
 * @property isVerifying - Whether verification is in progress.
 * @property onScan - Handler for QR scan event.
 * @property onError - Handler for scanner error.
 * @property onReasonChange - Handler for reason textarea change.
 * @property onResetScanner - Handler for resetting the scanner.
 */
interface ScannerContainerProps {
  isScanning: boolean;
  error: string | null;
  memberData: MemberData | null;
  attendanceConfirmed: boolean;
  lateReason: string;
  attendanceStatus: number | null;
  leaveExcuse: string;
  isVerifying?: boolean;
  onScan: (detectedCodes: IDetectedBarcode[]) => void | Promise<void>;
  onError: (error: unknown) => void;
  onReasonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onResetScanner: () => void;
}

const ScannerContainer = ({
  isScanning,
  error,
  memberData,
  attendanceConfirmed,
  lateReason,
  attendanceStatus,
  leaveExcuse,
  isVerifying = false,
  onScan,
  onError,
  onReasonChange,
  onResetScanner,
}: ScannerContainerProps) => {
  return (
    <div className="relative">
      {/* Scanner State */}
      {isScanning && !error && !memberData && !isVerifying && (
        <QRCodeScanner onScan={onScan} onError={onError} />
      )}

      {/* Verifying State */}
      {isVerifying && <ScannerLoading />}

      {/* Error State */}
      {error && !memberData && (
        <ErrorFallBack error={error} resetScanner={onResetScanner} />
      )}

      {/* Success State - Attendance Confirmation */}
      {memberData && !attendanceConfirmed && !isVerifying && (
        <AttendanceConfirmation
          memberData={memberData}
          attendanceStatus={attendanceStatus}
          lateReason={lateReason}
          leaveExcuse={leaveExcuse}
          onReasonChange={onReasonChange}
        />
      )}

      {/* Final Confirmation State */}
      {attendanceConfirmed && memberData && (
        <FinalConfirmation
          lateReason={lateReason}
          leaveExcuse={leaveExcuse}
          attendanceStatus={attendanceStatus}
        />
      )}
    </div>
  );
};

export default ScannerContainer;
