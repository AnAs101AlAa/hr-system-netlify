import { useParams } from "react-router-dom";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { useGetAllTeamEvaluations, useGetTeam } from "@/shared/queries/judgingSystem/judgeQueries";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { FaChevronLeft } from "react-icons/fa";

export default function EvaluationDetailsPage() {
    const { teamId } = useParams<{ teamId: string }>();
    const { data: evaluations, isLoading: isEvaluationsLoading, isError: isEvaluationsError } = useGetAllTeamEvaluations(teamId!);
    const { data: teamData, isLoading: isTeamLoading, isError: isTeamError } = useGetTeam(teamId!);

    if (isEvaluationsLoading || isTeamLoading) {
        return <LoadingPage />;
    }

    if (isEvaluationsError || isTeamError || !evaluations || !teamData) {
        return <ErrorScreen title="Failed to load evaluation details." message="An error has occurred while loading evaluation data, Please try again." />;
    }

    return (
        <WithNavbar>
            <div className="xl:w-[45%] lg:w-[58%] md:w-[70%] sm:w-[80%] w-[94%] py-4 px-2 mx-auto rounded-lg shadow-md mt-4 border-t-10 border-primary space-y-3 relative">
                <FaChevronLeft className="absolute top-6 left-4 text-contrast text-lg cursor-pointer size-5" onClick={() => window.history.back()} />
                <h1 className="text-[24px] md:text-[26px] lg:text-[28px] font-bold text-primary mb-2 md:mb-3 text-center">Team Evaluation Board</h1>
                <p className="text-[16px] md:text-[17px] lg:text-[18px] text-inactive-tab-text font-semibold mb-1.5">Team Information</p>
                <div className="space-y-1.5 flex-wrap flex">
                    <div className="w-[49%]">
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast"><strong className="font-semibold">Team Name:</strong> {teamData.name}</p>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast"><strong className="font-semibold">Team Code:</strong> {teamData.code}</p>
                    </div>
                    <div className="w-[49%]">
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast"><strong className="font-semibold">Team Course:</strong> {teamData.course}</p>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast"><strong className="font-semibold">Total Score:</strong> {teamData.totalScore}</p>
                    </div>
                    <div className="w-full my-3">
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast font-semibold">Members:</p>
                        {teamData.teamMembers.map((member) => (
                            <p key={member.id} className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast ml-4">- {member.name}</p>
                        ))}
                    </div>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast font-semibold w-full">Statistics:</p>
                    <div className="w-[49%]">
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast ml-4"><strong className="font-semibold">Evaluations:</strong> {evaluations.length}</p>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast ml-4"><strong className="font-semibold">Highest Score:</strong> {Math.max(...(evaluations.map(evaluation => evaluation.totalScore || 0)))} <strong className="font-semibold">By:</strong> {evaluations.find(evaluation => evaluation.totalScore === Math.max(...(evaluations.map(evaluation => evaluation.totalScore || 0))))?.judgeName}</p>
                    </div>
                    <div className="w-[49%]">
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast ml-4"><strong className="font-semibold">Average Score:</strong> {(evaluations.reduce((sum, evaluation) => sum + (evaluation.totalScore || 0), 0) / evaluations.length).toFixed(2)}</p>
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast ml-4"><strong className="font-semibold">Lowest Score:</strong> {Math.min(...(evaluations.map(evaluation => evaluation.totalScore || 0)))} <strong className="font-semibold">By:</strong> {evaluations.find(evaluation => evaluation.totalScore === Math.min(...(evaluations.map(evaluation => evaluation.totalScore || 0))))?.judgeName}</p>
                    </div>
                </div>
                <hr className="my-2 border-contrast/30" />
                <p className="text-[16px] md:text-[17px] lg:text-[18px] text-inactive-tab-text font-semibold mb-1.5">Evaluations</p>
                {evaluations.length === 0 ? (
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast">No evaluations have been submitted for this team yet.</p>
                ) : (
                    <div className="space-y-4">
                        {evaluations.map((evaluation, index) => (
                            <div key={index} className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm">
                                <p className="text-[15px] md:text-[16px] lg:text-[17px] font-semibold text-secondary flex gap-1">Judge: <p className="text-contrast">{evaluation.judgeName}</p></p>
                                <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-secondary mb-3 flex gap-1">Total Score: <p className="text-contrast">{evaluation.totalScore}</p></p>
                                <div className="space-y-3">
                                    {evaluation.evaluationItemScores.sort((a, b) => a.evaluationItemId.localeCompare(b.evaluationItemId)).map((item, itemIndex) => (
                                        <div key={item.evaluationItemId} className="pb-2 border-b-2 last:border-b-0 border-gray-300">
                                            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast flex gap-1"><p className="text-secondary font-semibold">Q{itemIndex + 1}.</p>{item.evaluationItemName}</p>
                                            <p className="text-[16px] md:text-[17px] lg:text-[18px]">Score: <strong className="text-primary">{item.score}</strong></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </WithNavbar>
    );
}