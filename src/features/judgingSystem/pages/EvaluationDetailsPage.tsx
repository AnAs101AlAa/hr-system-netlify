import { useParams } from "react-router-dom";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import {
  useGetAllTeamEvaluations,
  useGetTeam,
} from "@/shared/queries/judgingSystem/judgeQueries";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { FaChevronLeft } from "react-icons/fa";

export default function EvaluationDetailsPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const {
    data: evaluations,
    isLoading: isEvaluationsLoading,
    isError: isEvaluationsError,
  } = useGetAllTeamEvaluations(teamId!);
  const {
    data: teamData,
    isLoading: isTeamLoading,
    isError: isTeamError,
  } = useGetTeam(teamId!);

  if (isEvaluationsLoading || isTeamLoading) {
    return <LoadingPage />;
  }

  if (isEvaluationsError || isTeamError || !evaluations || !teamData) {
    return (
      <ErrorScreen
        title="Failed to load evaluation details."
        message="An error has occurred while loading evaluation data, Please try again."
      />
    );
  }

  return (
    <WithNavbar>
      <div className="xl:w-[45%] lg:w-[58%] md:w-[70%] sm:w-[80%] w-[94%] py-4 px-2 mx-auto rounded-lg shadow-md mt-4 border-t-10 border-primary space-y-3 relative">
        <FaChevronLeft
          className="absolute top-6 left-4 text-contrast text-lg cursor-pointer size-5"
          onClick={() => window.history.back()}
        />
        <h1 className="text-[24px] md:text-[26px] lg:text-[28px] font-bold text-primary mb-2 md:mb-3 text-center">
          Team Evaluation Board
        </h1>
        <p className="text-[16px] md:text-[17px] lg:text-[18px] text-inactive-tab-text font-semibold mb-1.5">
          Team Information
        </p>
        <div className="shadow-md rounded-lg p-3 border border-gray-300 bg-white">
          <div className="w-full flex justify-between mb-3 gap-x-4">
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-contrast font-medium">
              <div className="font-semibold text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px]">
                Name
              </div>
              {teamData.name}
            </p>
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-contrast font-medium w-[49%]">
              <div className="font-semibold text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px]">
                Course
              </div>
              {teamData.course}
            </p>
          </div>
          <hr className="w-full border-gray-300 my-2" />
          <div className="w-full flex justify-between mb-3 gap-x-4">
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-contrast font-medium">
              <div className="font-semibold text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px]">
                Code
              </div>
              {teamData.code}
            </p>
            <p className="text-[16px] md:text-[18px] lg:text-[20px] text-contrast font-medium w-[49%]">
              <div className="font-semibold text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px]">
                Score
              </div>
              {teamData.department}
            </p>
          </div>
        </div>
        <p className="text-[16px] md:text-[17px] lg:text-[18px] text-inactive-tab-text font-semibold mb-1.5">
          Team Members
        </p>
        <div className=" flex-wrap flex shadow-md gap-x-1 rounded-lg p-3 border border-gray-300 bg-white">
          {teamData.teamMembers.map((member) => (
            <p
              key={member.id}
              className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast bg-muted-primary/30 px-3 border-primary border rounded-md"
            >
              {member.name}
            </p>
          ))}
        </div>
        <p className="text-[16px] md:text-[17px] lg:text-[18px] text-inactive-tab-text font-semibold mt-4 mb-1.5">
          Evaluation Statistics
        </p>
        <div className="shadow-md gap-x-1 rounded-lg p-3 border border-gray-300 bg-white">
          <div className="w-full flex justify-between mb-3 gap-x-4">
            <p className="text-[20px] md:text-[22px] lg:text-[24px] text-contrast font-medium">
              <div className="font-semibold text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px]">
                Total evaluations
              </div>
              {evaluations.length}
            </p>
            <p className="text-[20px] md:text-[22px] lg:text-[24px] text-contrast font-medium w-[49%]">
              <div className="font-semibold text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px]">
                Average Score
              </div>
              {(
                evaluations.reduce(
                  (sum, evaluation) => sum + (evaluation.totalScore || 0),
                  0
                ) / evaluations.length
              ).toFixed(2)}
            </p>
          </div>
          <hr className="w-full border-gray-300 my-2" />
          <div className="w-full flex justify-between mb-3 gap-x-4">
            <p className=" text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px]">
              Highest Score
              <div className="text-[20px] md:text-[22px] lg:text-[24px] text-contrast font-medium">
                {Math.max(
                  ...evaluations.map((evaluation) => evaluation.totalScore || 0)
                )}
              </div>
              By:{" "}
              {
                evaluations.find(
                  (evaluation) =>
                    evaluation.totalScore ===
                    Math.max(
                      ...evaluations.map(
                        (evaluation) => evaluation.totalScore || 0
                      )
                    )
                )?.judgeName
              }
            </p>
            <p className="text-inactive-tab-text text-[13px] md:text-[14px] lg:text-[15px] w-[49%]">
              Lowest Score
              <div className="text-[20px] md:text-[22px] lg:text-[24px] text-contrast font-medium">
                {Math.min(
                  ...evaluations.map((evaluation) => evaluation.totalScore || 0)
                )}
              </div>
              By:{" "}
              {
                evaluations.find(
                  (evaluation) =>
                    evaluation.totalScore ===
                    Math.min(
                      ...evaluations.map(
                        (evaluation) => evaluation.totalScore || 0
                      )
                    )
                )?.judgeName
              }
            </p>
          </div>
        </div>
        <p className="text-[16px] md:text-[17px] lg:text-[18px] text-inactive-tab-text font-semibold mb-1.5">
          Evaluations
        </p>
        {evaluations.length === 0 ? (
          <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast">
            No evaluations have been submitted for this team yet.
          </p>
        ) : (
          <div className="space-y-4">
            {evaluations.map((evaluation, index) => (
              <div
                key={index}
                className="p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between">
                  <p className="text-[17px] md:text-[18px] lg:text-[19px] font-semibold text-secondary flex gap-1">
                    {evaluation.judgeName}
                  </p>
                  <p className="text-[19px] md:text-[21px] lg:text-[23px] font-semibold text-contrast mb-3 flex gap-1">
                    {evaluation.totalScore}
                  </p>
                </div>
                <div className="space-y-3">
                  {evaluation.evaluationItemScores
                    .sort((a, b) =>
                      a.evaluationItemId.localeCompare(b.evaluationItemId)
                    )
                    .map((item, itemIndex) => (
                      <div
                        key={item.evaluationItemId}
                        className="pb-2 border-b-2 last:border-b-0 border-gray-300"
                      >
                        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-contrast flex gap-1">
                          <p className="text-secondary font-semibold">
                            Q{itemIndex + 1}.
                          </p>
                          {item.evaluationItemName}
                        </p>
                        <p className="text-[16px] md:text-[17px] lg:text-[18px]">
                          Score:{" "}
                          <strong className="text-primary">{item.score}</strong>
                        </p>
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
