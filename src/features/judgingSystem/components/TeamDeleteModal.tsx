import { Button, ButtonTypes, Modal } from "tccd-ui";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";
import { useDeleteTeam } from "@/shared/queries/judgingSystem/judgeQueries";

export default function TeamDeleteModal({showModal, setShowModal}: {showModal: string, setShowModal: (val: string) => void}) {
    const deleteTeamMutation = useDeleteTeam();

    const handleConfirmDelete = () => {
      if (!showModal) return;
      deleteTeamMutation.mutate(showModal, {
        onSuccess: () => {
          toast.success("Form deleted successfully");
          setShowModal("");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        onError: (error: any) => {
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage);
        },
      });
    };

    return (
        <>
            {showModal !== "" && (
            <Modal
            title="Confirm Delete"
            isOpen={showModal !== ""}
            onClose={() => setShowModal("")}
            >
            <div className="p-4">
                <p className="mb-6 text-center">
                Are you sure you want to delete this Team data? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                <Button
                    type={ButtonTypes.SECONDARY}
                    onClick={() => setShowModal("")}
                    buttonText="Cancel"
                />
                <Button
                    type={ButtonTypes.DANGER}
                    onClick={handleConfirmDelete}
                    loading={deleteTeamMutation.isPending}
                    buttonText="Delete"
                />
                </div>
            </div>
            </Modal>
            )}
        </>
    )
}