import WithNavbar from "@/components/hoc/WithNavbar";
import {
  ScannerContainer,
  ScannerActions,
  ScannerInstructions,
} from "@/components/scan_qr";
import { useQRScanner } from "@/hooks/useQRScanner";

const ScanQRPage = () => {
  const {
    isScanning,
    error,
    memberData,
    lateReason,
    isConfirming,
    attendanceConfirmed,
    handleScan,
    handleError,
    resetScanner,
    handleConfirmAttendance,
    handleReasonChange,
  } = useQRScanner();

  return (
    <WithNavbar>
      <div className="mx-4 md:mx-6 lg:mx-8 flex flex-col items-center min-h-[calc(100vh-160px)] md:min-h-[calc(100vh-120px)]">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-6 mt-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-contrast)] mb-2">
              {attendanceConfirmed ? "Session Options" : "Attendance Scanner"}
            </h1>
            <p className="text-sm md:text-base text-[var(--color-dashboard-description)]">
              {attendanceConfirmed
                ? "Attendance has been successfully recorded"
                : memberData
                ? "Review member details and confirm attendance"
                : "Scan member QR code to record attendance"}
            </p>
          </div>

          {/* Scanner Container */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden border border-[var(--color-dashboard-card-border)]">
            {/* Scanner Area */}
            <ScannerContainer
              isScanning={isScanning}
              error={error}
              memberData={memberData}
              attendanceConfirmed={attendanceConfirmed}
              lateReason={lateReason}
              onScan={handleScan}
              onError={handleError}
              onReasonChange={handleReasonChange}
              onResetScanner={resetScanner}
            />

            {/* Action Buttons */}
            <div className="p-4 md:p-6 bg-gray-50 border-t border-[var(--color-dashboard-card-border)]">
              <ScannerActions
                attendanceConfirmed={attendanceConfirmed}
                memberData={memberData}
                isConfirming={isConfirming}
                lateReason={lateReason}
                onConfirmAttendance={handleConfirmAttendance}
                onReturnToEvents={() => {
                  console.log("navigating to event details");
                  // Navigate back to events page
                }}
                onResetScanner={resetScanner}
              />
            </div>
          </div>

          {/* Instructions */}
          <ScannerInstructions />
        </div>
      </div>
    </WithNavbar>
  );
};

export default ScanQRPage;
