import { useState } from "react";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import type { MemberData } from "@/types/attendance";
import type { QRScanType } from "@/types/qrcode";
import { UserApi } from "@/queries/users";
import { eventsApiInstance } from "@/queries/events/eventApi";

export const useQRScanner = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [lateReason, setLateReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);

  // Fetch member data from API
  const fetchMemberData = async (
    userId: string,
    eventId: string
  ): Promise<MemberData> => {
    try {
      console.log("Fetching member data for userId:", userId);
      const userInstance = new UserApi();
      const userResponse = await userInstance.getMemberDetails(userId);
      console.log("Raw User API response:", userResponse.data.fullName);
      console.log("User response type:", typeof userResponse);
      console.log(
        "User response keys:",
        userResponse ? Object.keys(userResponse) : "null/undefined"
      );

      console.log("Fetching event data for eventId:", eventId);
      // Fetch event details to get start time
      const eventResponse = await eventsApiInstance.fetchEventById(eventId);
      console.log("Raw Event API response:", eventResponse);
      console.log("Event response type:", typeof eventResponse);
      console.log(
        "Event response keys:",
        eventResponse ? Object.keys(eventResponse) : "null/undefined"
      );
      console.log("Event startDate value:", eventResponse?.data.startDate);

      // Handle invalid responses
      if (!userResponse || typeof userResponse !== "object") {
        throw new Error("Invalid user response from API");
      }

      if (!eventResponse || typeof eventResponse !== "object") {
        throw new Error("Invalid event response from API");
      }

      const eventStartDate = new Date(eventResponse.data.startDate);
      console.log("Parsed event start date:", eventStartDate);
      console.log(
        "Is event start date valid?",
        !isNaN(eventStartDate.getTime())
      );

      if (isNaN(eventStartDate.getTime())) {
        throw new Error("Invalid event start date format");
      }

      const eventStartTime = eventStartDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      // Calculate status and arrival time
      const currentTime = new Date();
      const isLate = currentTime > eventStartDate;
      console.log(
        "Calculated status - isLate:",
        isLate,
        "currentTime:",
        currentTime,
        "eventStart:",
        eventStartDate
      );

      const memberData: MemberData = {
        // API response fields with null checks
        id: userResponse.data.id || userId,
        fullName: userResponse.data.fullName,
        email: userResponse.data.email || "",
        nationalId: userResponse.data.nationalId || "",
        phoneNumber: userResponse.data.phoneNumber || "",
        graduationYear: userResponse.data.graduationYear || 0,
        engineeringMajor: userResponse.data.engineeringMajor || "",
        educationSystem: userResponse.data.educationSystem || "",
        position: userResponse.data.position || "",
        committee: userResponse.data.committee || "",
        isActive: userResponse.data.isActive || false,

        // Backward compatibility aliases
        name: userResponse.data.fullName,
        team: userResponse.data.committee || "",

        // QR scanner specific fields
        status: isLate ? "late" : "on-time",
        arrivalTime: currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        eventStartTime,
      };

      console.log("Final member data object:", memberData);
      return memberData;
    } catch (error) {
      console.error("Error fetching member or event data:", error);
      // Return a fallback member data object
      const currentTime = new Date();
      return {
        id: userId,
        fullName: "Unknown User",
        email: "",
        nationalId: "",
        phoneNumber: "",
        graduationYear: 0,
        engineeringMajor: "",
        educationSystem: "",
        position: "",
        committee: "",
        isActive: false,
        name: "Unknown User",
        team: "",
        status: "on-time",
        arrivalTime: currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        eventStartTime: "Unknown",
      };
    }
  };

  const handleScan = async (
    detectedCodes: IDetectedBarcode[],
    eventId: string
  ) => {
    if (detectedCodes.length > 0) {
      const scannedValue = detectedCodes[0].rawValue;
      console.log("Raw QR scanned value:", scannedValue);
      setIsScanning(false);

      try {
        const parsedData: unknown = JSON.parse(scannedValue);
        console.log("Parsed QR data:", parsedData);
        if (
          typeof parsedData === "object" &&
          parsedData !== null &&
          "userId" in parsedData
        ) {
          const potentialData = parsedData as Record<string, unknown>;
          if (typeof potentialData.userId === "string") {
            const qrData: QRScanType = { userId: potentialData.userId };
            console.log(
              "Valid QR data, fetching member for userId:",
              qrData.userId,
              "eventId:",
              eventId
            );
            try {
              // Fetch member data based on QR code
              const data = await fetchMemberData(qrData.userId, eventId);
              console.log("Successfully fetched member data:", data);
              setMemberData(data);
              console.log("QR Code scanned and validated:", qrData);
            } catch (apiError) {
              console.error("Failed to fetch member data:", apiError);
              setError("Failed to fetch member information. Please try again.");
            }
          } else {
            console.error("Invalid userId type:", typeof potentialData.userId);
            setError("Invalid QR code format. userId must be a string.");
          }
        } else {
          console.error("QR data missing userId field:", parsedData);
          setError("Invalid QR code format. Expected userId.");
        }
      } catch (parseError) {
        console.error(
          "QR parsing error:",
          parseError,
          "Raw value:",
          scannedValue
        );
        setError("Invalid QR code data. Could not parse QR code.");
      }
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
      setError("Please provide a reason for being late.");
      return;
    }

    setIsConfirming(true);
    setError(null);

    try {
      // The actual API call is now handled in the modal component
      // This just handles the UI state transitions
      setTimeout(() => {
        setAttendanceConfirmed(true);
        setIsConfirming(false);
      }, 1000); // Shorter delay since API call is handled elsewhere
    } catch (error) {
      console.error("Error in attendance confirmation:", error);
      setError("Failed to confirm attendance. Please try again.");
      setIsConfirming(false);
    }
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
