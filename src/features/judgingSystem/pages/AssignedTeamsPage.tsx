import WithNavbar from "@/shared/components/hoc/WithNavbar";
import TeamSelectorListing from "../components/TeamSelectorListing";

export default function AssignedTeamsPage() {

    return (
        <WithNavbar>
            <div className="bg-background shadow-lg rounded-lg border-gray-200 p-4 w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto border mt-6">
                <p className="text-center text-[22px] md:text-[24px] lg:text-[26px] font-bold">Judge Team Assignments</p>
                <p className="text-center mb-4 md:mb-6 lg:text-[16px] md:text-[15px] text-[14px] text-inactive-tab-text">Manage teams assigned to judge for evaluation and scoring</p>
                <TeamSelectorListing />
            </div>
        </WithNavbar>
    )
}