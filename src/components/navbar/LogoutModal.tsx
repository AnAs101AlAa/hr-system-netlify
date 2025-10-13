import { Modal, Button, ButtonTypes } from "tccd-ui";
import { useLogout } from "@/queries/users";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LogoutModal ({ showLogoutModal, setShowLogoutModal }: { showLogoutModal: boolean; setShowLogoutModal: (value: boolean) => void }) {
    const logoutMutation = useLogout();
    const navigate = useNavigate();

    const handleLogout = () => {
        toast.promise(
            logoutMutation.mutateAsync(),
            {
                loading: "Logging out...",
                success: () => {
                    setShowLogoutModal(false);
                    setTimeout(() => navigate("/login"), 1500);
                    return "Logged out successfully!";
                },
                error: (error) => {
                    console.error("Logout failed:", error);
                    return "Logout failed. Please try again.";
                },
            }
        );
    };

    return (
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Confirm Logout">
        <div className="p-2">
          <p className="text-sm text-gray-600 mb-4 text-center">Are you sure you want to logout?</p>
          <div className="flex justify-center gap-[4%]">
            {logoutMutation.isLoading ? (
                <Button loading={true} type={ButtonTypes.PRIMARY} onClick={() => {}} />
            ) : (
                <>
                    <Button buttonText="Cancel" onClick={() => setShowLogoutModal(false)} type={ButtonTypes.SECONDARY} />
                    <Button buttonText="Logout" onClick={() => handleLogout()} type={ButtonTypes.PRIMARY} />
                </>
            )}
          </div>
        </div>
      </Modal>
    )
}