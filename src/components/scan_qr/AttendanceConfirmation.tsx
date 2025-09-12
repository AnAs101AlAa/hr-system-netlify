import { FaCheckCircle } from "react-icons/fa";
import type { MemberData } from "@/types/attendance";
import MemberDetailsCard from "./MemberDetailsCard";
import LateReasonForm from "./LateReasonForm";

interface AttendanceConfirmationProps {
  memberData: MemberData;
  lateReason: string;
  onReasonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AttendanceConfirmation = ({
  memberData,
  lateReason,
  onReasonChange,
}: AttendanceConfirmationProps) => {
  return (
    <div className="w-full bg-white text-center p-6">
      {/* Success Icon */}
      <FaCheckCircle
        className="text-green-500 flex items-center justify-center mx-auto"
        size={40}
      />

      {/* Status Message */}
      <h2 className="text-lg md:text-xl font-semibold text-green-600 mb-2">
        {memberData.status === "late"
          ? "Late Attendance Detected"
          : "Attendance Confirmed"}
      </h2>
      <p className="text-sm text-[var(--color-dashboard-description)] mb-6">
        {memberData.status === "late"
          ? "Please provide a reason for late attendance before confirming."
          : "The attendance status for the recently scanned member has been successfully updated."}
      </p>

      {/* Member Details Card */}
      <MemberDetailsCard memberData={memberData} />

      {/* Late Reason Text Area */}
      {memberData.status === "late" && (
        <LateReasonForm
          lateReason={lateReason}
          onChange={onReasonChange}
          error={
            memberData.status === "late" && !lateReason.trim()
              ? "Reason is required for late attendance"
              : undefined
          }
        />
      )}
    </div>
  );
};

export default AttendanceConfirmation;