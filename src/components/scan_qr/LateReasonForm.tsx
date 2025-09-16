import TextAreaField from "@/components/generics/TextAreaField";

interface LateReasonFormProps {
  lateReason: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

const LateReasonForm = ({ lateReason, onChange, error }: LateReasonFormProps) => {
  return (
    <div className="mb-6">
      <TextAreaField
        id="late-reason"
        label="Reason for Late Attendance *"
        value={lateReason}
        placeholder="Please provide a reason for being late to this event..."
        onChange={onChange}
        maxLength={500}
        error={error}
      />
    </div>
  );
};

export default LateReasonForm;