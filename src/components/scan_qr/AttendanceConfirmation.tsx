import { FaCheckCircle, FaClock, FaSignOutAlt } from "react-icons/fa";
import type { MemberData } from "@/types/attendance";
import MemberDetailsCard from "./MemberDetailsCard";
import LateReasonForm from "./LateReasonForm";

interface AttendanceConfirmationProps {
  memberData: MemberData;
  attendanceStatus: number | null;
  lateReason: string;
  leaveExcuse: string;
  onReasonChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onLeaveExcuseChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AttendanceConfirmation = ({
  memberData,
  attendanceStatus,
  lateReason,
  leaveExcuse,
  onReasonChange,
  onLeaveExcuseChange,
}: AttendanceConfirmationProps) => {
  // Helper function to get status configuration
  const getStatusConfig = (status: number | null) => {
    switch (status) {
      case 2001:
        return {
          icon: <FaCheckCircle className="text-green-500" size={40} />,
          title: "On-Time Attendance",
          message: "The attendance status for the recently scanned member has been successfully updated.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-600",
          iconBg: "bg-green-100",
        };
      case 2002:
        return {
          icon: <FaClock className="text-orange-500" size={40} />,
          title: "Late Arrival Detected",
          message: "Please provide a reason for late attendance before confirming.",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          textColor: "text-orange-600",
          iconBg: "bg-orange-100",
        };
      case 2003:
        return {
          icon: <FaSignOutAlt className="text-blue-500" size={40} />,
          title: "Early Leave Detected",
          message: "Please provide a reason for leaving early before confirming.",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-600",
          iconBg: "bg-blue-100",
        };
      default:
        return {
          icon: <FaCheckCircle className="text-gray-500" size={40} />,
          title: "Attendance Status",
          message: "Processing attendance status...",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-600",
          iconBg: "bg-gray-100",
        };
    }
  };

  const statusConfig = getStatusConfig(attendanceStatus);

  return (
    <div className={`w-full text-center p-6 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      {/* Status Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusConfig.iconBg} mb-4`}>
        {statusConfig.icon}
      </div>

      {/* Status Title */}
      <h2 className={`text-lg md:text-xl font-semibold ${statusConfig.textColor} mb-2`}>
        {statusConfig.title}
      </h2>

      {/* Status Message */}
      <p className="text-sm text-gray-600 mb-6">
        {statusConfig.message}
      </p>

      {/* Member Details Card */}
      <div className="mb-6">
        <MemberDetailsCard memberData={memberData} />
      </div>

      {/* Late Reason Form for Status 2002 */}
      {attendanceStatus === 2002 && (
        <LateReasonForm
          lateReason={lateReason}
          onChange={onReasonChange}
          error={
            attendanceStatus === 2002 && !lateReason.trim()
              ? "Reason is required for late attendance"
              : undefined
          }
        />
      )}

      {/* Leave Excuse Form for Status 2003 */}
      {attendanceStatus === 2003 && (
        <div className="mb-6">
          <label
            htmlFor="leave-excuse"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for Leaving Early *
          </label>
          <textarea
            id="leave-excuse"
            value={leaveExcuse}
            onChange={onLeaveExcuseChange}
            placeholder="Please provide a reason for leaving early..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              attendanceStatus === 2003 && !leaveExcuse.trim()
                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300"
            }`}
            rows={4}
            maxLength={500}
          />
          {attendanceStatus === 2003 && !leaveExcuse.trim() && (
            <p className="mt-1 text-sm text-red-600">
              Reason is required for early leave
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {leaveExcuse.length}/500 characters
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceConfirmation;