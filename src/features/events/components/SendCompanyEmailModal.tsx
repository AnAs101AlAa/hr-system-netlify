import { useState, useEffect } from "react";
import { Button, InputField, Modal } from "tccd-ui";
import { useSendCompanyCateringAllocationsEmail } from "@/shared/queries/companies";
import toast from "react-hot-toast";

interface SendCompanyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  companyId: string;
  companyName: string;
}

const SendCompanyEmailModal = ({
  isOpen,
  onClose,
  eventId,
  companyId,
  companyName,
}: SendCompanyEmailModalProps) => {
  const [additionalEmails, setAdditionalEmails] = useState<string>("");
  const sendEmailMutation = useSendCompanyCateringAllocationsEmail();

  useEffect(() => {
    if (!isOpen) {
      setAdditionalEmails("");
    }
  }, [isOpen]);

  const handleSendEmail = async () => {
    try {
      const emailList = additionalEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      const result = await sendEmailMutation.mutateAsync({
        eventId,
        companyId,
        additionalEmails: emailList,
      });
      toast.success(
        `Email sent successfully! Requested: ${result.requestedCount}, Sent: ${result.sentCount}`
      );
      onClose();
      setAdditionalEmails("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send email");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Send Email to ${companyName}`}
    >
      <div className="space-y-4 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This will send an email with the catering allocation to {companyName}.
          You can optionally provide additional email addresses to receive a copy.
        </p>
        <InputField
          id="additional-emails"
          label="Additional Emails"
          placeholder="email1@example.com, email2@example.com"
          value={additionalEmails}
          onChange={(e) => setAdditionalEmails(e.target.value)}
        />
        <p className="text-xs text-gray-400">
          Separate multiple emails with commas.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <Button buttonText="Cancel" onClick={onClose} type="secondary" />
          <Button
            buttonText="Send Email"
            onClick={handleSendEmail}
            type="primary"
            disabled={sendEmailMutation.isPending}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SendCompanyEmailModal;
