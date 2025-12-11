import { Button, SearchField } from "tccd-ui";
// import { TEAM_SORTING_OPTIONS } from "@/constants/judgingSystemConstants";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useGetJudgesForEvent } from "@/shared/queries/judgingSystem/judgeQueries";
import { useState } from "react";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import CardView from "@/shared/components/table/CardView";
import Table from "@/shared/components/table/Table";

const JudgesList = () => {  
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] =  useState(1);
    const [judgeName, setJudgeName] = useState("");
    const { data: judges, isLoading, isError } = useGetJudgesForEvent(currentPage, 10, judgeName);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
        <div className="p-4 border-b border-dashboard-border space-y-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A]">
              Judges {judges ? `(${judges.length})` : ""}
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
                className={`cursor-pointer size-4 ${judges && judges.length < 20 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
                onClick={() => {
                  if (judges && judges.length === 10) {
                    setCurrentPage(currentPage + 1);
                  }
                }}
              />
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="flex gap-2 md:flex-row flex-col justify-between">
              <div className="md:min-w-76">
                <SearchField placeholder="Search by name" value={judgeName} onChange={(value) => setJudgeName(value)} />
              </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-contrast">Loading judges...</p>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-contrast">Error loading judges. Please try again.</p>
          </div>
        ) : (
        <>
          {/* Desktop Table View */}
          <Table
            items={judges || []}
            columns={[
              { key: "name", label: "Name", width: "w-1/2" },
              { key: "email", label: "Email", width: "w-1/2" },
            ]}
            emptyMessage="No judges found."
            renderActions={(item) => (
              <Button buttonText="Manage Assignments" type="secondary" onClick={() => navigate(`/judging-system/assigned-teams/${item.id}/${eventId}`)} width="auto" />
            )}
          />
          <CardView
            items={judges || []}
            titleKey="name"
            renderedFields={[
              { key: "email", label: "Email" },
            ]}
            modalTitle="Confirm Action"
            modalSubTitle="Are you sure you want to perform this action?"
            confirmationAction={() => {}}
            isSubmitting={false}
            renderButtons={(item) => (
              <Button buttonIcon={<TbListDetails className="size-4" />} type="secondary" onClick={() => navigate(`/judging-system/assigned-teams/${item.id}/${eventId}`)} width="auto" />
            )}
          />
          {/* Mobile Card View */}
        </>
        )}
      </div>
    );
};

export default JudgesList;
