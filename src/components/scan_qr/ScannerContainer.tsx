import QRCodeScanner from "./QRCodeScanner";
import ErrorFallBack from "./ErrorFallBack";
import AttendanceConfirmation from "./AttendanceConfirmation";
import FinalConfirmation from "./FinalConfirmation";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { MemberData } from "@/types/attendance";

interface ScannerContainerProps {
  isScanning: boolean;
  error: string | null;
  memberData: MemberData | null;
  attendanceConfirmed: boolean;
  lateReason: string;
  onScan: (detectedCodes: IDetectedBarcode[]) => void;
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
  onScan,
  onError,
  onReasonChange,
  onResetScanner,
}: ScannerContainerProps) => {
  return (
    <div className="relative">
      {/* Scanner State */}
      {isScanning && !error && !memberData && (
        <QRCodeScanner onScan={onScan} onError={onError} />
      )}

      {/* Error State */}
      {error && <ErrorFallBack error={error} resetScanner={onResetScanner} />}

      {/* Success State - Attendance Confirmation */}
      {memberData && !attendanceConfirmed && (
        <AttendanceConfirmation
          memberData={memberData}
          lateReason={lateReason}
          onReasonChange={onReasonChange}
        />
      )}

      {/* Final Confirmation State */}
      {attendanceConfirmed && memberData && (
        <FinalConfirmation memberData={memberData} lateReason={lateReason} />
      )}
    </div>
  );
};

export default ScannerContainer;