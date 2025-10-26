import { SearchField, DropdownMenu } from "tccd-ui";
import { useState } from "react";
import { useResearchTeams } from "@/queries/judgingSystem/judgeQueries";
import { TEAM_SORTING_OPTIONS } from "@/constants/judgingSystemConstants";
import TeamsTable from "./TeamsTable";

const TeamList = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKey, setSearchKey] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("");
    const { data: teams, isLoading, isError } = useResearchTeams(currentPage, 20, searchKey, sortOption);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
      <div className="p-4 border-b border-dashboard-border space-y-2">
        <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A]">
          Teams {teams ? `(${teams.length})` : ""}
        </p>
        <hr className="border-gray-200" />
        <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-contrast">Filters</p>
        <div className="flex gap-2 md:flex-row flex-col justify-between">
          <SearchField
            placeholder="Search Team Name..."
            value={searchKey}
            onChange={(value) => setSearchKey(value)}
          />
          <SearchField
            placeholder="Search Team Code..."
            value={sortOption}
            onChange={(value) => setSortOption(value)}
          />
          <div className="flex-col flex flex-1 justify-end md:flex-row gap-2">
            <div className="flex-grow md:max-w-64">
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
      ) : (
      <>
        {/* Desktop Table View */}
        <TeamsTable
          teams={teams || []}
        />

        {/* Mobile Card View */}
      </>
      )}
    </div>
  );
};

export default TeamList;
