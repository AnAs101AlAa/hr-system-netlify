import { useState } from "react";
import Modal from "../generics/Modal";
import { status } from "@/types/qrcode";
import TextAreaField from "../generics/TextAreaField";
import Button from "../generics/Button";

export default function EarlyLeavePopup({
  isPopupOpen,
  onPopupClose,
}: {
  isPopupOpen: boolean;
  onPopupClose: (status: number, reason?: string) => void;
}) {
  const [reason, setReason] = useState<string>("");
  function handleCancel() {
    onPopupClose(status.CANCELLED);
  }
  function handleSubmit() {
    onPopupClose(status.SUBMITTED, reason);
  }
  return (
    <Modal
      title="Late Arrival Notice"
      isOpen={isPopupOpen}
      onClose={handleCancel}
    >
      <div className="p-4 sm:p-6 md:p-8 space-y-4">
        <p className="text-base sm:text-lg md:text-xl font-medium mb-2">
          Please provide the reason for early leave
        </p>
        <TextAreaField
          id="Early Leave Reasoning"
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason here..."
        />
        <div className="flex justify-between mt-6">
          <Button buttonText="Cancel" onClick={handleCancel} type="ghost" />
          <Button
            buttonText="Submit"
            onClick={handleSubmit}
            type="primary"
            disabled={reason == ""}
          />
        </div>
      </div>
    </Modal>
  );
}