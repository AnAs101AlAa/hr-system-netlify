import { SearchField, DropdownMenu } from "tccd-ui";
import { useState, useEffect } from "react";
import { useResearchTeams } from "@/shared/queries/judgingSystem/judgeQueries";
import { TEAM_SORTING_OPTIONS } from "@/constants/judgingSystemConstants";
import TeamsTable from "./TeamsTable";
import TeamCardView from "./TeamCardView";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import type { Team } from "@/shared/types/judgingSystem";

const TeamList = ({setModalOpen} : {setModalOpen: (teamData: Team) => void}) => {
    const eventId = useParams().eventId || "";
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [teamName, setTeamName] = useState<string>("");
    const [teamCode, setTeamCode] = useState<string>("");
    const [debouncedTeamName, setDebouncedTeamName] = useState(teamName);
    const [debouncedTeamCode, setDebouncedTeamCode] = useState(teamCode);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedTeamName(teamName), 300);
        const t2 = setTimeout(() => setDebouncedTeamCode(teamCode), 300);
        return () => {
            clearTimeout(t);
            clearTimeout(t2);
        };
    }, [teamName, teamCode]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedTeamName, debouncedTeamCode]);

    const [sortOption, setSortOption] = useState<string>("");
    const { data: teams, isLoading, isError } = useResearchTeams(eventId, currentPage, 20, sortOption, debouncedTeamName, debouncedTeamCode);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
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
            <SearchField
              className="md:max-w-[250px]"
              placeholder="Search Name..."
              value={teamName}
              onChange={(value) => setTeamName(value)}
            />
            <SearchField
              className="md:max-w-[250px]"
              placeholder="Search Code..."
              value={teamCode}
              onChange={(value) => setTeamCode(value)}
            />
            <div className="flex-col flex flex-1 justify-end md:flex-row gap-2">
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
