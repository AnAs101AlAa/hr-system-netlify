import { DropdownMenu } from "tccd-ui";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useResearchTeams } from "@/shared/queries/judgingSystem/judgeQueries";
import type { Team } from "@/shared/types/judgingSystem";
import type { FilterSearchParams } from "../types";
import { TEAM_SORTING_OPTIONS } from "@/constants/judgingSystemConstants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import TeamsTable from "./TeamsTable";
import TeamCardView from "./TeamCardView";
import FilterModal from "./FiltersModal";

const TeamList = ({setModalOpen} : {setModalOpen: (teamData: Team) => void}) => {
    const eventId = useParams().eventId || "";
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [debouncedTeamName, setDebouncedTeamName] = useState<string>("");
    const [debouncedTeamCode, setDebouncedTeamCode] = useState<string>("");
    const [debouncedDepartmentKey, setDebouncedDepartmentKey] = useState<string>("");
    const [debouncedCourseKey, setDebouncedCourseKey] = useState<string>("");

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

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedTeamName, debouncedTeamCode]);

    const [sortOption, setSortOption] = useState<string>("");
    const { data: teams, isLoading, isError } = useResearchTeams(eventId, currentPage, 20, sortOption, debouncedTeamName, debouncedTeamCode, debouncedCourseKey, debouncedDepartmentKey);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} searchParams={searchParams} />
        <div className="p-4 border-b border-dashboard-border space-y-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A]">
              Teams {teams ? `(${teams.length})` : ""}
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
                className={`cursor-pointer size-4 ${teams && teams.length < 20 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
                onClick={() => {
                  if (teams && teams.length === 20) {
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
          {/* Desktop Table View */}
          <TeamsTable
            teams={teams || []}
            setOpenModal={setModalOpen}
          />

          {/* Mobile Card View */}
          <TeamCardView
            teams={teams || []}
            setOpenModal={setModalOpen}
          />
        </>
        )}
      </div>
    );
};

export default TeamList;
