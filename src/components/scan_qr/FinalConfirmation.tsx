import type { MemberData } from "@/types/attendance";

interface FinalConfirmationProps {
  memberData: MemberData;
  lateReason: string;
}

const FinalConfirmation = ({ memberData, lateReason }: FinalConfirmationProps) => {
  return (
    <div className="w-full bg-green-50 text-center p-6">
      <div className="w-16 h-16 md:w-20 md:h-20 mb-4 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg
          className="w-8 h-8 md:w-10 md:h-10 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h2 className="text-lg md:text-xl font-semibold text-green-600 mb-2">
        Attendance Confirmed!
      </h2>
      <p className="text-sm text-[var(--color-dashboard-description)] mb-4">
        The attendance has been successfully recorded.
      </p>
      {memberData?.status === "late" && (
        <div className="bg-white rounded-lg p-3 border border-green-200">
          <p className="text-xs text-gray-500 mb-1">Late Reason:</p>
          <p className="text-sm text-gray-800">{lateReason}</p>
        </div>
      )}
    </div>
  );
};

export default FinalConfirmation;