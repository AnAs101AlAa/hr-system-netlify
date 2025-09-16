import { useQRScanner } from "./useQRScanner";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { MemberData } from "@/types/attendance";
import { useEffect } from "react";

interface UseQRScannerModalOptions {
  eventId?: string;
  onSuccess?: (memberData: MemberData) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  autoReset?: boolean;
}

export const useQRScannerModal = (options: UseQRScannerModalOptions = {}) => {
  const { eventId, onSuccess, onError, onClose, autoReset = true } = options;

  const qrScanner = useQRScanner();

  // Watch for memberData changes and trigger onSuccess when data is available
  useEffect(() => {
    if (onSuccess && qrScanner.memberData) {
      console.log('member dataaaa:', qrScanner.memberData)
      onSuccess(qrScanner.memberData);
    }
  }, [qrScanner.memberData, onSuccess]);

  // Enhanced handlers for modal usage
  const handleScanSuccess = async (detectedCodes: IDetectedBarcode[]) => {
    console.log('hhehheheheheheheheeheh')
    if (eventId) {
      console.log(eventId)
      await qrScanner.handleScan(detectedCodes, eventId);
    }
  };

  const handleScanError = (error: unknown) => {
    qrScanner.handleError(error);
    if (onError && qrScanner.error) {
      onError(qrScanner.error);
    }
  };

  const handleModalClose = () => {
    console.log('jellll')
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
