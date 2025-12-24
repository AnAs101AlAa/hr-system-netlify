import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { useParams } from "react-router-dom";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { useGetAssignedTeamsForJudge } from "@/shared/queries/judgingSystem/judgeQueries";
import TeamSelectorListing from "../components/TeamSelectorListing";

export default function AssignedTeamsPage() {
    const { judgeId, eventId } = useParams();
    const { data: assignmentData, isLoading, isError } = useGetAssignedTeamsForJudge(judgeId!, eventId!);

    if(isLoading) {
        return <LoadingPage />;
    }

    if(isError || !assignmentData) {
        return <ErrorScreen message="Failed to load event data, please try again later." title="Failed to fetch data" />;
    }

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