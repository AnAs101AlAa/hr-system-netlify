import { useState } from "react";
import type { MemberData } from "@/types/attendance";
import type { IDetectedBarcode } from "@yudiel/react-qr-scanner";
import {
  useRequestAttendance,
  useCheckAttendanceStatus,
  useRecordLateArrivalExcuse,
  useRecordLeaveEarly,
} from "@/queries/events/eventQueries";
import { UserApi } from "@/queries/users";
import { eventsApiInstance } from "@/queries/events/eventApi";
import { getErrorMessage } from "@/utils";
import toast from "react-hot-toast";

export function useAttendanceFlow(eventId: string) {
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<number | null>(null);
  const [lateReason, setLateReason] = useState("");
  const [leaveExcuse, setLeaveExcuse] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [eventType,setEventType]=useState('')

  const requestAttendance = useRequestAttendance();
  const checkAttendanceStatus = useCheckAttendanceStatus();
  const recordLateArrivalExcuse = useRecordLateArrivalExcuse();
  const recordLeaveEarly = useRecordLeaveEarly();

  // Fetch member and event data
  const fetchMemberData = async (userId: string) => {
    try {
      const userInstance = new UserApi();
      const userResponse = await userInstance.getMemberDetails(userId);
      const eventResponse = await eventsApiInstance.fetchEventById(eventId);
      // Get attendance status for this member/event
      const res = await checkAttendanceStatus.mutateAsync({
        memberId: userId,
        eventId,
      });
      setEventType(eventResponse.eventType)
      setAttendanceStatus(res.status);
      const eventStartDate = new Date(eventResponse.startDate);
      const eventStartTime = eventStartDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const currentTime = new Date();
      // Set status based on attendanceStatus code
      let status: "late" | "on-time" = "on-time";
      if (res.status === 2002) status = "late";
      else if (res.status === 2001) status = "on-time";
      setMemberData({
        ...userResponse,
        status,
        arrivalTime: currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        eventStartTime,
      });
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  // Handle QR scan
  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes.length > 0) {
      setIsScanning(false);
      try {
        const parsedData = JSON.parse(detectedCodes[0].rawValue);
        if (parsedData && typeof parsedData.userId === "string") {
          await fetchMemberData(parsedData.userId);
        } else {
          setError("Invalid QR code format. Expected userId.");
        }
      } catch {
        setError("Invalid QR code data. Could not parse QR code.");
      }
    }
  };

  // Check attendance status
  const checkStatus = async (userId: string) => {
    try {
      const res = await checkAttendanceStatus.mutateAsync({
        memberId: userId,
        eventId,
      });
      setAttendanceStatus(res.status);
      return res.status;
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  // Confirm attendance
  const confirmAttendance = async () => {
    if (!memberData) return;
    setIsConfirming(true);
    try {
      if (attendanceStatus === 2002) {
        // Late
        if (!lateReason.trim()) {
          setError("Please provide a reason for being late.");
          setIsConfirming(false);
          return;
        }
        await recordLateArrivalExcuse.mutateAsync({
          memberId: memberData.id,
          eventId,
          excuse: lateReason,
        });
      } else if (attendanceStatus === 2003) {
        // Early leave
        if (!leaveExcuse.trim()) {
          setError("Please provide a reason for early leave.");
          setIsConfirming(false);
          return;
        }
        await recordLeaveEarly.mutateAsync({
          memberId: memberData.id,
          eventId,
          excuse: leaveExcuse,
        });
      } else {
        // On time
        await requestAttendance.mutateAsync({
          memberId: memberData.id,
          eventId,
        });
      }
      setAttendanceConfirmed(true);
      toast.success("Attendance confirmed!");
      setEventType('')
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsConfirming(false);
    }
  };

  const reset = () => {
    setIsScanning(true);
    setError(null);
    setMemberData(null);
    setAttendanceStatus(null);
    setLateReason("");
    setLeaveExcuse("");
    setIsConfirming(false);
    setAttendanceConfirmed(false);
  };

  return {
    isScanning,
    error,
    memberData,
    attendanceStatus,
    lateReason,
    setLateReason,
    leaveExcuse,
    setLeaveExcuse,
    isConfirming,
    attendanceConfirmed,
    handleScan,
    checkStatus,
    confirmAttendance,
    reset,
    setEventType,
    eventType
  };
}
