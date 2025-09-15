import { useState } from "react";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { MemberData } from "@/types/attendance";

export const useQRScanner = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [lateReason, setLateReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);

  // Mock function to simulate fetching member data
  const fetchMemberData = (qrData: string): MemberData => {
    const eventStartTime = "10:00 AM";
    const currentTime = new Date();
    const isLate =
      currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }) === eventStartTime;

    return {
      id: qrData,
      name: "Aisha Al-Mansouri",
      team: "HR Operations",
      status: isLate ? "late" : "on-time",
      arrivalTime: currentTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      eventStartTime,
    };
  };

  const handleScan = (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      const scannedValue = detectedCodes[0].rawValue;
      setIsScanning(false);

      // Fetch member data based on QR code
      const data = fetchMemberData(scannedValue);
      setMemberData(data);

      console.log("QR Code scanned:", scannedValue);
    }
  };

  const handleError = (error: unknown) => {
    console.error("QR Scanner error:", error);
    setError("Failed to access camera or scan QR code. Please try again.");
  };

  const resetScanner = () => {
    setIsScanning(true);
    setError(null);
    setMemberData(null);
    setLateReason("");
    setIsConfirming(false);
    setAttendanceConfirmed(false);
  };

  const handleConfirmAttendance = async () => {
    if (memberData?.status === "late" && !lateReason.trim()) {
      return; // Don't proceed if late and no reason provided
    }

    setIsConfirming(true);

    // Simulate API call
    setTimeout(() => {
      setAttendanceConfirmed(true);
      setIsConfirming(false);
    }, 1500);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLateReason(e.target.value);
  };

  return {
    // State
    isScanning,
    error,
    memberData,
    lateReason,
    isConfirming,
    attendanceConfirmed,

    // Actions
    handleScan,
    handleError,
    resetScanner,
    handleConfirmAttendance,
    handleReasonChange,
  };
};
