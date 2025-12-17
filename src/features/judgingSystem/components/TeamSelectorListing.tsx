import { Button, DropdownMenu } from "tccd-ui";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useResearchTeams, useGetAssignedTeamsForJudge, useAssignTeamsToJudge, useRemoveTeamFromJudge } from "@/shared/queries/judgingSystem/judgeQueries";
import { TEAM_SORTING_OPTIONS } from "@/constants/judgingSystemConstants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Team } from "@/shared/types/judgingSystem";
import toast from "react-hot-toast";
import Table from "@/shared/components/table/Table";
import CardView from "@/shared/components/table/CardView";
import { FaFilter } from "react-icons/fa";
import type { FilterSearchParams } from "../types";
import FilterModal from "./FiltersModal";

const TeamSelectorListing = () => {
    const { eventId, judgeId } = useParams<{ eventId: string; judgeId: string }>();

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [debouncedTeamName, setDebouncedTeamName] = useState<string>("");
    const [debouncedTeamCode, setDebouncedTeamCode] = useState<string>("");
    const [debouncedDepartmentKey, setDebouncedDepartmentKey] = useState<string>("");
    const [debouncedCourseKey, setDebouncedCourseKey] = useState<string>("");

    const [sortOption, setSortOption] = useState<string>("");
    const [availableTeams, setAvailableTeams] = useState<{teams: Team[]; total: number}>({teams: [], total: 0});
    const [assignedTeams, setAssignedTeams] = useState<Team[]>([]);

    const { data: teams, isLoading: isTeamsLoading, isError: isTeamsError } = useResearchTeams(eventId!, currentPage, 15, sortOption, debouncedTeamName, debouncedTeamCode, debouncedDepartmentKey, debouncedCourseKey, "admin");
    const { data: assignedTeamsData, isLoading: isAssignedTeamsLoading, isError: isAssignedTeamsError } = useGetAssignedTeamsForJudge(judgeId!);
    const assignTeamsToJudgeMutation = useAssignTeamsToJudge();
    const removeTeamFromJudgeMutation = useRemoveTeamFromJudge();

    const searchParams: FilterSearchParams = {
        nameKey: debouncedTeamName,
        setNameKey: setDebouncedTeamName,
        codeKey: debouncedTeamCode,
        setCodeKey: setDebouncedTeamCode,
        departmentKey: debouncedDepartmentKey,
        setDepartmentKey: setDebouncedDepartmentKey,
        courseKey: debouncedCourseKey,
        setCourseKey: setDebouncedCourseKey,
    };

    const renderDataSections = (items: Team[], mode: number) => {
      return (
        <>
          <Table
            items={items || []}
            columns={[
              { key: "name", label: "Team Name", width: "w-1/3" },
              { key: "code", label: "Team Code", width: "w-1/4" },
              { key: "department", label: "Department", width: "w-1/4" },
              { key: "course", label: "Course", width: "w-1/6" },
              { key: "totalScore", label: "Total Score", width: "w-1/6"}
            ]}
            renderActions={(item) => 
              <Button
                type={mode === 1 ? "tertiary" : "danger"}
                buttonText={mode === 1 ? "Add" : "Remove"}
                onClick={() => { if (handleAdjustTeam){ handleAdjustTeam(item, mode === 1);} }}
                width="fit"
              /> 
            }
            emptyMessage="No teams found."
          />

          <CardView
            items={teams?.teams || []}
            titleKey="name"
            renderButtons={(item) =>
              <Button
                    type={mode === 1 ? "tertiary" : "danger"}
                    buttonText={mode === 1 ? "Add" : "Remove"}
                    onClick={() => { if (handleAdjustTeam) handleAdjustTeam(item, mode === 1); }}
                    width="fit"
                  />
            }
            renderedFields={[
              { key: "code", label: "Team Code" },
              { key: "department", label: "Department" },
              { key: "course", label: "Course" },
              { key: "totalScore", label: "Total Score" }
            ]}
            emptyMessage="No teams found."
          />
        </>
      )
    }

    const handleAdjustTeam = (team: Team, op: boolean) => {
      if(op) {
      setAvailableTeams((prevState) => {
        const updatedTeams = prevState.teams.filter(t => t.id !== team.id);
        return { teams: updatedTeams, total: updatedTeams.length };
      });
      setAssignedTeams((prevState) => [...prevState, team]);
      } else {
        setAssignedTeams((prevState) => {
          const updatedTeams = prevState.filter(t => t.id !== team.id);
          return updatedTeams;
        });
        setAvailableTeams((prevState) => {
          const updatedTeams = [...prevState.teams, team];
          return { teams: updatedTeams, total: updatedTeams.length };
        });
      }
    };

    const handleSubmit = async () => {
      const assignedTeamIds = new Set(assignedTeams.map(team => team.id));
      const initialTeamIds = new Set(assignedTeamsData?.map(team => team.id) || []);
      
      const teamsToAdd = assignedTeams.filter(team => !initialTeamIds.has(team.id));
      const teamsToRemove = assignedTeamsData?.filter(team => !assignedTeamIds.has(team.id)) || [];
      try {
        if (teamsToAdd.length > 0) {
          await assignTeamsToJudgeMutation.mutateAsync({ judgeId: judgeId!, teamIds: teamsToAdd.map(t => t.id) });
        }
        
        for (const team of teamsToRemove) {
          await removeTeamFromJudgeMutation.mutateAsync({ judgeId: judgeId!, teamId: team.id });
        }
        toast.success("Team assignments updated successfully.");
        setTimeout(() => {
          window.history.back();
        }, 2000);
      } catch {
        toast.error("An error occurred while updating team assignments. Please try again.");
      }
    };

    useEffect(() => {
        if (teams && assignedTeamsData) {
            setAssignedTeams(assignedTeamsData);
            const assignedTeamIds = new Set(assignedTeamsData.map(team => team.id));
            const filteredTeams = teams.teams.filter(team => !assignedTeamIds.has(team.id));
            setAvailableTeams({ teams: filteredTeams, total: filteredTeams.length });
        }
    }, [teams, assignedTeamsData]);

    const isLoading = isTeamsLoading || isAssignedTeamsLoading;
    const isError = isTeamsError || isAssignedTeamsError;

    return (
      <div className="space-y-4">
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} searchParams={searchParams} />
        <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
          <div className="p-4 border-b border-dashboard-border space-y-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A]">
                Assigned Teams {assignedTeams ? `(${assignedTeams.length})` : ""}
              </p>
            </div>
            <hr className="border-gray-200" />
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-contrast">Loading teams...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-contrast">Error loading teams. Please try again.</p>
            </div>
          ) : (
            renderDataSections(assignedTeams, 2)
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
          <div className="p-4 border-b border-dashboard-border space-y-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A]">
                Available Teams {availableTeams ? `(${availableTeams.total})` : ""}
              </p>
              <div className="flex gap-2 items-center justify-center">
                <FaChevronLeft
                  className={`cursor-pointer size-4 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                />
                <span className="text-[14px] md:text-[15px] lg:text-[16px] font-medium text-contrast">
                  Page {currentPage}
                </span>
                <FaChevronRight
                  className={`cursor-pointer size-4 ${teams && teams.teams.length < 20 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
                  onClick={() => {
                    if (teams && teams.teams.length === 20) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                />
              </div>
            </div>
            <hr className="border-gray-200" />
              <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-contrast">Filters</p>
              <div className="flex gap-2 md:flex-row flex-col justify-between">
                  <div className="md:min-w-76 flex flex-row-reverse justify-between items-center gap-2 cursor-pointer border rounded-full px-3.5 py-1.5 hover:bg-gray-100 transition-colors" onClick={() => setIsFilterModalOpen(true)}>
                    <FaFilter className="size-3 text-secondary mt-0.5" />
                    <p className="text-[12px] md:text-[13px] lg:text-[14px] font-semibold text-center">
                        Open Filters
                    </p>
                    <div/>
                  </div>
                  <div className="flex-grow md:max-w-72">
                    <DropdownMenu
                      options={TEAM_SORTING_OPTIONS}
                      value={sortOption}
                      onChange={(val) => setSortOption(val)}
                      placeholder="Sort By"
                    />
                  </div>
              </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-contrast">Loading teams...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-contrast">Error loading teams. Please try again.</p>
            </div>
          ) : (
            renderDataSections(availableTeams.teams, 1)
          )}
        </div>
        <hr className="border-gray-200" />
        <div className="flex justify-center gap-2 items-center">
          <Button buttonText="cancel" type="secondary" width="auto" onClick={() => window.history.back()} disabled={assignTeamsToJudgeMutation.isPending || removeTeamFromJudgeMutation.isPending} />
          <Button buttonText="Save Changes" type="primary" width="auto" onClick={handleSubmit} loading={assignTeamsToJudgeMutation.isPending || removeTeamFromJudgeMutation.isPending} />
        </div>
      </div>
    );
};

export default TeamSelectorListing;
