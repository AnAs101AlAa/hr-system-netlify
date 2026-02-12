import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { useEffect, useState } from "react";
import { Button } from "tccd-ui";
import { FaPlus } from "react-icons/fa";
import UserList from "../components/UserList";
import UserManageModal from "../components/UserManageModal";
import type { member } from "@/shared/types/member";

export default function UsersManagementPage() {
    const [memberData, setMemberData] = useState<member | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (memberData) {
            setIsModalOpen(true);
        }
    }, [memberData]);

  return (
    <WithNavbar>
         <UserManageModal user={memberData} isOpen={isModalOpen} onClose={() => {setMemberData(null); setIsModalOpen(false)}} mode={memberData ? "edit" : "create"} />
      <div className="min-h-screen bg-background dark:bg-background-primary p-4 text-text-body-main">
        <div className="w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto">
          <h1 className="lg:text-[24px] md:text-[22px] text-[20px] font-bold dark:text-text-title">
            Member Management
          </h1>
          <p className="mb-2 lg:text-[16px] md:text-[14px] text-[13px] text-inactive-tab-text dark:text-text-muted-foreground">
            View and manage all members in the system.
          </p>
          <div className="w-full my-4">
            <Button
              buttonText="New Member"
              onClick={() => setIsModalOpen(true)}
              type="primary"
              width="auto"
              buttonIcon={<FaPlus />}
            />
          </div>
          <UserList setModalOpen={setMemberData} />
        </div>
      </div>
    </WithNavbar>
  );
}
