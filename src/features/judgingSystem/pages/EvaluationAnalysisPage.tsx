import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { SearchField, Button, Checkbox } from "tccd-ui";
import { useState } from "react";
import {
  useGetAssignedJudgesForTeam,
  useResearchTeams,
} from "@/shared/queries/judgingSystem/judgeQueries";
import { useParams } from "react-router-dom";
import { getAllTeamEvaluations } from "@/shared/queries/judgingSystem/judgeAPI";
import type { Team, Judge } from "@/shared/types/judgingSystem";

interface SearchData {
  teams: Team[];
  judges: Judge[];
  evaluations: { teamId: string; judgeId: string; isEvaluated: boolean }[];
}

export default function EvaluationAnalysisPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const getJudgesMutation = useGetAssignedJudgesForTeam();
  const {
    refetch: refetchTeams,
  } = useResearchTeams(
    eventId || "",
    1,
    100,
    "nameAsc",
    "",
    searchQuery,
    "",
    "",
    "admin"
  );

  const isEvaluated = (teamId: string, judgeId: string): boolean => {
    try {
      const evaluation = searchData?.evaluations.find(
        (evaluation) =>
          evaluation.teamId === teamId && evaluation.judgeId === judgeId
      );
      return evaluation?.isEvaluated ?? false;
    } catch {
      return false;
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setSearchQuery(searchTerm);

    try {
      const { data: teams } = await refetchTeams();

      if (!teams?.teams || teams.teams.length === 0) {
        setSearchData({ teams: [], judges: [], evaluations: [] });
        setIsSearching(false);
        return;
      }

      const judgesMap = new Map<string, Judge>();
      const allEvaluations: {
        teamId: string;
        judgeId: string;
        isEvaluated: boolean;
      }[] = [];
      const judges = await getJudgesMutation.mutateAsync(teams.teams[0].id);
      if (judges && Array.isArray(judges)) {
        judges.forEach((judge) => {
          judgesMap.set(judge.id, judge);
        });
      }

      for (const team of teams.teams) {
        const evaluatedJudgeIds = new Set<string>();

        try {
          const teamEvaluations = await getAllTeamEvaluations(team.id);
          if (teamEvaluations && Array.isArray(teamEvaluations)) {
            teamEvaluations.forEach((evaluation) => {
              const judgeId = evaluation.judgeId || "";
              evaluatedJudgeIds.add(judgeId);
              allEvaluations.push({
                teamId: team.id,
                judgeId: judgeId,
                isEvaluated: true,
              });
            });
          }
        } catch {
          judgesMap.forEach((judge) => {
            if (!evaluatedJudgeIds.has(judge.id)) {
              allEvaluations.push({
                teamId: team.id,
                judgeId: judge.id,
                isEvaluated: false,
              });
            }
          });
        }
      }

      setSearchData({
        teams: teams.teams,
        judges: Array.from(judgesMap.values()),
        evaluations: allEvaluations,
      });
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <WithNavbar>
      <div className="bg-surface-glass-bg shadow-lg rounded-lg border-surface-glass-border/10 p-4 w-[96%] md:w-[94%] lg:w-[84%] xl:w-[73%] mx-auto border mt-6">
        <p className="text-center text-[22px] md:text-[24px] lg:text-[26px] font-bold text-text-title">
          Evaluation Analysis
        </p>
        <p className="text-center mb-4 md:mb-6 lg:text-[16px] md:text-[15px] text-[14px] text-text-muted-foreground">
          Get statistics and track progress on team and judge evaluations
        </p>
        <div className="max-w-md mx-auto mb-6 flex justify-center gap-2">
          <SearchField
            placeholder="Search by team or judge name"
            value={searchTerm}
            onChange={(value) => setSearchTerm(value)}
          />
          <Button
            buttonText={isSearching ? "Searching..." : "Search"}
            type="primary"
            onClick={handleSearch}
            width="fit"
            disabled={isSearching || !searchTerm.trim()}
          />
        </div>
        <hr className="border-surface-glass-border/10 mb-4" />

        {/* Display search results */}
        {isSearching ? (
          <div className="text-center text-text-muted-foreground">
            Searching and gathering evaluation data...
          </div>
        ) : searchData ? (
          <div className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="shadow-md border-b-8 border-primary p-4 rounded-lg bg-surface-glass-border/5">
                <h3 className="font-medium text-text-muted-foreground text-md mb-2">
                  Teams Found
                </h3>
                <p className="text-2xl font-bold text-text-body-main">
                  {searchData.teams.length}
                </p>
              </div>
              <div className="shadow-md border-b-8 border-primary p-4 rounded-lg bg-surface-glass-border/5">
                <h3 className="font-medium text-text-muted-foreground text-md mb-2">
                  Judges Assigned
                </h3>
                <p className="text-2xl font-bold text-text-body-main">
                  {searchData.judges.length}
                </p>
              </div>
              <div className="shadow-md border-b-8 border-primary p-4 rounded-lg bg-surface-glass-border/5">
                <h3 className="font-medium text-text-muted-foreground text-md mb-2">
                  Total Evaluations
                </h3>
                <p className="text-2xl font-bold text-text-body-main">
                  {searchData.evaluations.length}
                </p>
              </div>
              <div className="shadow-md border-b-8 border-primary p-4 rounded-lg bg-surface-glass-border/5">
                <h3 className="font-medium text-text-muted-foreground text-md mb-2">
                  Completed Evaluations
                </h3>
                <p className="text-2xl font-bold text-text-body-main">
                  {
                    searchData.evaluations.filter(
                      (evaluation) => evaluation.isEvaluated
                    ).length
                  }
                </p>
              </div>
            </div>

            <hr className="border-surface-glass-border/10" />

            {/* Evaluation Matrix Table */}
            {searchData.teams.length > 0 && searchData.judges.length > 0 ? (
              <div className="mt-6 overflow-x-auto">
                <h3 className="font-semibold text-lg mb-3 text-text-title">
                  Evaluation Status
                </h3>
                <table className="w-full border-collapse border border-surface-glass-border/10">
                  <thead>
                    <tr className="bg-muted-primary/10">
                      <th className="border border-surface-glass-border/10 p-2 text-left lg:text-[17px] md:text-[16px] text-[15px] font-medium text-text-muted-foreground text-md">
                        Team
                      </th>
                      {searchData.judges.map((judge) => (
                        <th
                          key={judge.id}
                          className="border border-surface-glass-border/10 p-2 text-center lg:text-[17px] md:text-[16px] text-[15px] font-medium text-text-muted-foreground text-md min-w-[120px]"
                        >
                          {judge.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {searchData.teams.map((team) => (
                      <tr
                        key={team.id}
                        className="hover:bg-muted-primary/5 transition-colors"
                      >
                        <td className="border border-surface-glass-border/10 p-3">
                          <div>
                            <p className="font-medium lg:text-[16px] md:text-[15px] text-[14px] whitespace-nowrap text-text-body-main">
                              {team.name}
                            </p>
                            <p className="lg:text-[15px] md:text-[14px] text-[13px] text-text-muted-foreground">
                              {team.code}
                            </p>
                          </div>
                        </td>
                        {searchData.judges.map((judge) => (
                          <td
                            key={judge.id}
                            className="border border-surface-glass-border/10 p-2 md:p-3 text-center"
                          >
                            <div className="flex justify-center items-center text-text-body-main">
                              <Checkbox
                                label=""
                                checked={isEvaluated(team.id, judge.id)}
                                onChange={() => {}}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-text-muted-foreground">
                No teams or judges found for the search criteria.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-text-muted-foreground">
            Enter a team code and click Search to view analysis data.
          </div>
        )}
      </div>
    </WithNavbar>
  );
}
