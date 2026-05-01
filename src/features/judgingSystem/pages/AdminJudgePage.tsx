import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { useParams } from "react-router-dom";
import { LoadingPage, ErrorScreen } from "tccd-ui";
import { useGetJudgeEvaluationProgress } from "@/shared/queries/judgingSystem/judgeQueries";
import { useMemo } from "react";
import { FaChevronLeft } from "react-icons/fa";

export default function AdminJudgePage() {
  const { judgeId, eventId } = useParams();
  const {
    data: teams,
    isLoading,
    isError,
  } = useGetJudgeEvaluationProgress(judgeId!, eventId!);

  const sortedTeams =useMemo(() => {
    return teams
      ? [...teams].sort((a, b) => {
          if (a.teamCode && b.teamCode) {
            return a.teamCode.localeCompare(b.teamCode);
          } else if (a.teamCode) {
            return -1;
          } else if (b.teamCode) {
            return 1;
          } else {
            return 0;
          }
        })
      : [];
  }, [teams]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || !teams) {
    return (
      <ErrorScreen
        message="Failed to load judge data, please try again later."
        title="Failed to fetch data"
      />
    );
  }

  return (
    <WithNavbar>
      <div className="w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto mt-6">
        <div className="flex gap-2 items-center cursor-pointer group" onClick={() => window.history.back()}>
          <FaChevronLeft
            className="size-4 cursor-pointer text-text-body-main group-hover:text-primary transition-colors duration-150"
          />
          <p className="text-md md:text-lg font-bold text-text-title group-hover:text-primary transition-colors duration-150">
            Back
          </p>
        </div>
      </div>
      <div className="bg-surface-glass-bg shadow-lg rounded-lg border-surface-glass-border/10 p-4 w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto border mt-3">
        <p className="text-center text-[22px] md:text-[24px] lg:text-[26px] font-bold text-text-title">
          Judge Team Evaluations
        </p>
        <p className="text-center mb-4 md:mb-6 lg:text-[16px] md:text-[15px] text-[14px] text-text-muted-foreground">
          A detailed listing of all of the judge's evaluations
        </p>
        <div className="space-y-4">
          {sortedTeams.length === 0 ? (
            <p className="text-center text-[15px] md:text-[16px] lg:text-[17px] text-text-muted-foreground">
              No teams assigned to this judge yet.
            </p>
          ) : null}
          {sortedTeams.map((team) => (
            <div
              key={team.teamId}
              className="border border-surface-glass-border/10 rounded-xl p-3 px-5"
            >
              <div className="flex justify-between items-center">
                <p className="w-[40%] text-sm md:text-[16px] font-semibold text-text-body-main">
                  {team.teamName}
                </p>
                <p className="w-[40%] text-sm md:text-[16px] font-semibold text-text-body-main">
                  {team.teamCode || "N/A"}
                </p>
                <p
                  className={`w-[20%] text-end text-sm md:text-[15px] font-medium ${
                    team.isScored ? "text-green-500" : "text-primary"
                  }`}
                >
                  {team.isScored ? "Evaluated" : "Not evaluated"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WithNavbar>
  );
}
