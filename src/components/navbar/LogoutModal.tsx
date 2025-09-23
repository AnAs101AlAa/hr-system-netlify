import Modal from "@/components/generics/Modal";
import Button from "@/components/generics/Button";
import { ButtonTypes } from "@/constants/presets";
import { useLogout } from "@/queries/users";
import { TbLoader2 } from "react-icons/tb";
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
                <button className="rounded-xl px-6 py-2 border font-bold text-[12px] md:text-[13px] lg:text-[14px] transition-all duration-200 ease-in-out flex items-center justify-center h-fit bg-inactive-tab-text" disabled={true}>
                    <TbLoader2 className="animate-spin" />
                </button>
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