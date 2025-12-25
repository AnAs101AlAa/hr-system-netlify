import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { useParams } from "react-router-dom";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { useGetJudgeEvaluationProgress } from "@/shared/queries/judgingSystem/judgeQueries";

export default function AdminJudgePage() {
    const { judgeId, eventId } = useParams();
    const { data: teams, isLoading, isError } = useGetJudgeEvaluationProgress(judgeId!, eventId!);

    if(isLoading) {
        return <LoadingPage />;
    }

    if(isError || !teams) {
        return <ErrorScreen message="Failed to load judge data, please try again later." title="Failed to fetch data" />;
    }

    return (
        <WithNavbar>
            <div className="bg-background shadow-lg rounded-lg border-gray-200 p-4 w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto border mt-6">
                <p className="text-center text-[22px] md:text-[24px] lg:text-[26px] font-bold">Judge Team Evaluations</p>
                <p className="text-center mb-4 md:mb-6 lg:text-[16px] md:text-[15px] text-[14px] text-inactive-tab-text">A detailed listing of all of the judge's evaluations</p>
                <div className="space-y-4">
                {teams.map((team) => (
                    <div key={team.teamId} className="border border-gray-200 rounded-xl p-3 px-5">
                        <div className="flex justify-between items-center">
                            <p className="text-lg md:text-xl font-semibold text-contrast">{team.teamName}</p>
                            <p className={`text-sm md:text-[15px] font-medium ${team.isScored ? "text-green-500" : "text-primary"}`}>{team.isScored ? "Evaluated" : "Not evaluated"}</p>
                        </div>
                    </div>
                ))}
                </div>
            </div>
        </WithNavbar>
    )
}