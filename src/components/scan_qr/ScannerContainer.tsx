import QRCodeScanner from "./QRCodeScanner";
import ErrorFallBack from "./ErrorFallBack";
import AttendanceConfirmation from "./AttendanceConfirmation";
import FinalConfirmation from "./FinalConfirmation";
import ScannerLoading from "./ScannerLoading";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { MemberData } from "@/types/attendance";

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
  onLeaveExcuseChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
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
  onLeaveExcuseChange,
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
      {error && <ErrorFallBack error={error} resetScanner={onResetScanner} />}

      {/* Success State - Attendance Confirmation */}
      {memberData && !attendanceConfirmed && !isVerifying && (
        <AttendanceConfirmation
          memberData={memberData}
          attendanceStatus={attendanceStatus}
          lateReason={lateReason}
          leaveExcuse={leaveExcuse}
          onReasonChange={onReasonChange}
          onLeaveExcuseChange={onLeaveExcuseChange}
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