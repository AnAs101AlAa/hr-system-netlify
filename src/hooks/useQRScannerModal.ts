import { useQRScanner } from "./useQRScanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { MemberData } from "@/types/attendance";

interface UseQRScannerModalOptions {
  onSuccess?: (memberData: MemberData) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  autoReset?: boolean;
}

export const useQRScannerModal = (options: UseQRScannerModalOptions = {}) => {
  const { onSuccess, onError, onClose, autoReset = true } = options;

  const qrScanner = useQRScanner();

  // Enhanced handlers for modal usage
  const handleScanSuccess = (detectedCodes: IDetectedBarcode[]) => {
    qrScanner.handleScan(detectedCodes);
    if (onSuccess && qrScanner.memberData) {
      onSuccess(qrScanner.memberData);
    }
  };

  const handleScanError = (error: unknown) => {
    qrScanner.handleError(error);
    if (onError && qrScanner.error) {
      onError(qrScanner.error);
    }
  };

  const handleModalClose = () => {
    if (autoReset) {
      qrScanner.resetScanner();
    }
    if (onClose) {
      onClose();
    }
  };

  const confirmAndClose = async () => {
    await qrScanner.handleConfirmAttendance();
    if (autoReset) {
      setTimeout(() => {
        qrScanner.resetScanner();
      }, 2000); // Give time to show success state
    }
  };

  return {
    ...qrScanner,
    handleScan: handleScanSuccess,
    handleError: handleScanError,
    handleClose: handleModalClose,
    confirmAndClose,
  };
};
