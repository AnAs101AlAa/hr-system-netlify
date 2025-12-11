import { DropdownMenu, Button } from "tccd-ui";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useResearchTeams } from "@/shared/queries/judgingSystem/judgeQueries";
import type { Team } from "@/shared/types/judgingSystem";
import type { FilterSearchParams } from "../types";
import { TEAM_SORTING_OPTIONS } from "@/constants/judgingSystemConstants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import FilterModal from "./FiltersModal";
import Table from "@/shared/components/table/Table";
import CardView from "@/shared/components/table/CardView";
import { useDeleteTeam } from "@/shared/queries/judgingSystem/judgeQueries";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils/errorHandler";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TeamList = ({setModalOpen} : {setModalOpen: (teamData: Team) => void}) => {
  const eventId = useParams().eventId || "";
  const navigate = useNavigate();
  const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [debouncedTeamName, setDebouncedTeamName] = useState<string>("");
  const [debouncedTeamCode, setDebouncedTeamCode] = useState<string>("");
  const [debouncedDepartmentKey, setDebouncedDepartmentKey] = useState<string>("");
  const [debouncedCourseKey, setDebouncedCourseKey] = useState<string>("");
  const deleteTeamMutation = useDeleteTeam();

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

    
    const handleConfirmDelete = (item: Team) => {
      deleteTeamMutation.mutate(item.id, {
        onSuccess: () => {
          toast.success("Form deleted successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        onError: (error: any) => {
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage);
        },
      });
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedTeamName, debouncedTeamCode]);

    const [sortOption, setSortOption] = useState<string>("");
    const { data: teams, isLoading, isError } = useResearchTeams(eventId, currentPage, 20, sortOption, debouncedTeamName, debouncedTeamCode, debouncedCourseKey, debouncedDepartmentKey, userRoles.includes("Judge") && userRoles.length === 1 ? "judge" : "admin");

    return (
      <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} searchParams={searchParams} />
        <div className="p-4 border-b border-dashboard-border space-y-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A]">
              Teams {teams ? `(${teams.total})` : ""}
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
        <>
          <Table
            items={teams?.teams || []}
            columns={[
              { key: "name", label: "Team Name", width: "w-1/3" },
              { key: "code", label: "Team Code", width: "w-1/4" },
              { key: "department", label: "Department", width: "w-1/4" },
              { key: "course", label: "Course", width: "w-1/6" },
              { key: "totalScore", label: "Total Score", width: "w-1/6"}
            ]}
            renderActions={(item, triggerDelete) => 
              <>
                  {(userRoles.includes("Judge") && userRoles.length === 1) ? (
                    <Button
                      type="primary"
                      buttonText="Start Assessment "
                      onClick={() => { navigate(`/judging-system/assess-team/${eventId}/${item.id}`); }}
                      width="fit"
                    />
                  ) : (
                    <>
                      <Button
                        type="tertiary"
                        buttonText="View Details"
                        onClick={() => { navigate(`/judging-system/team/${item.id}`); }}
                        width="fit"
                      />
                      <Button
                        type="secondary"
                        onClick={() => setModalOpen(item)}
                        buttonText="Edit"
                        width="fit"
                      />
                      <Button
                        type="danger"
                        onClick={() => triggerDelete(item.id)}
                        buttonText="Delete"
                        width="fit"
                      />
                    </>
                  )}
            </>}
            confirmationAction={handleConfirmDelete}
            isSubmitting={deleteTeamMutation.isPending}
            modalTitle="Delete Team"
            modalSubTitle="Are you sure you want to delete this team? This action cannot be undone."
          />

          <CardView
            items={teams?.teams || []}
            titleKey="name"
            renderButtons={(item, triggerDelete) =>
              <>
                {(userRoles.includes("Judge") && userRoles.length === 1) ? (
                  <Button
                    type="primary"
                    buttonText="Start Assessment "
                    onClick={() => { navigate(`/judging-system/assess-team/${eventId}/${item.id}`); }}
                    width="fit"
                  />
                ) : (
                  <>
                    <Button
                      type="tertiary"
                      buttonText="View Details"
                      onClick={() => { navigate(`/judging-system/team/${item.id}`); }}
                      width="fit"
                    />
                    <Button
                      type="secondary"
                      onClick={() => setModalOpen(item)}
                      buttonText="Edit"
                      width="fit"
                    />
                    <Button
                      type="danger"
                      onClick={() => triggerDelete(item.id)}
                      buttonText="Delete"
                      width="fit"
                    />
                  </>
                )}
              </>
            }
            renderedFields={[
              { key: "code", label: "Team Code" },
              { key: "department", label: "Department" },
              { key: "course", label: "Course" },
              { key: "totalScore", label: "Total Score" }
            ]}
            modalTitle="Delete Team"
            modalSubTitle="Are you sure you want to delete this team? This action cannot be undone."
            confirmationAction={handleConfirmDelete}
            isSubmitting={deleteTeamMutation.isPending}
            emptyMessage="No teams found."
          />
        </>
        )}
      </div>
    );
};

export default TeamList;
