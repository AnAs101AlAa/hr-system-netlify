import { useState, useEffect } from "react";
import { Modal, TextAreaField, Button } from "tccd-ui";

interface ReasonPopupProps {
  isOpen: boolean;
  onClose: (status: number, reason?: string) => void;
  title: string;
  prompt: string;
  id?: string;
  label?: string;
  initialReason?: string;
}

export default function ReasonPopup({
  isOpen,
  onClose,
  title,
  prompt,
  id = "reason-popup-textarea",
  label = "Reason",
  initialReason = "",
}: ReasonPopupProps) {
  const [reason, setReason] = useState<string>(initialReason);

  useEffect(() => {
    if (isOpen) setReason(initialReason || "");
  }, [isOpen, initialReason]);

  function handleCancel() {
    onClose(1); // status.CANCELLED - allow closing without reason
  }

  function handleSubmit() {
    if (reason.trim() === "") return; // Prevent submission if reason is empty
    onClose(0, reason); // status.SUBMITTED
  }

  return (
    <Modal title={title} isOpen={isOpen} onClose={handleCancel}>
      <div className="p-4 sm:p-6 md:p-8 space-y-4">
        <p className="text-base sm:text-lg md:text-xl font-medium mb-2">
          {prompt}
        </p>

        <TextAreaField
          id={id}
          label={label}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason here."
        />

        <div className="flex justify-between mt-6">
          <Button 
            buttonText="Cancel" 
            onClick={handleCancel} 
            type="ghost"
          />
          <Button
            buttonText="Submit"
            onClick={handleSubmit}
            type="primary"
            disabled={reason.trim() === ""}
          />
        </div>
      </div>
    </Modal>
  );
}
