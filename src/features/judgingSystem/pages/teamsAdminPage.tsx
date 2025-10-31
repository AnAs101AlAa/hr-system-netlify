import TeamList from "@/features/judgingSystem/components/TeamList";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { Button } from "tccd-ui";
import { FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function TeamsAdminPage() {
    const [modalOpen, setModalOpen] = useState<number>(0);
    
    useEffect(() => {
        console.log("Modal Open State:", modalOpen);
    }, [modalOpen]);
    
  return (
    <WithNavbar>
        <div className="min-h-screen bg-background p-4">
            <div className="w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto">
                <h1 className="lg:text-[24px] md:text-[22px] text-[20px] font-bold">Research Day Teams</h1>
                <p className="mb-2 lg:text-[16px] md:text-[14px] text-[13px] text-inactive-tab-text">Manage Research Day Teams and track their scoring.</p>
                <div className="w-full my-4">
                <Button buttonText="New Team" onClick={() => setModalOpen(1)} type="primary" width="auto" buttonIcon={<FaPlus />} />
                </div>
                <TeamList setModalOpen={setModalOpen}/>
            </div>
        </div>
    </WithNavbar>
  )
}