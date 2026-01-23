import { Button } from "tccd-ui";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useResearchTeams } from "@/shared/queries/judgingSystem/judgeQueries";
import type { Team } from "@/shared/types/judgingSystem";
import Table from "@/shared/components/table/Table";
import CardView from "@/shared/components/table/CardView";
import { FaCertificate } from "react-icons/fa";

const CertificatesTab = () => {
  const { eventId } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: teams,
    isLoading,
    isError,
  } = useResearchTeams(
    eventId!,
    currentPage,
    9999,
    "",
    "",
    "",
    "",
    "",
    "admin",
  );

  const finishedTeams =
    teams?.teams?.filter(
      (team: Team) =>
        team.status === "Evaluated" || team.status === "Certified",
    ) || [];

  const handleRollCertificate = (team: Team) => {
    // Placeholder for rolling certificate action
    console.log("Rolling certificate for team:", team.name);
    // You might want to trigger a download or API call here
  };

  return (
    <div className="bg-surface-glass-bg rounded-lg shadow-sm border border-surface-glass-border/10 overflow-hidden">
      <div className="p-4 border-b border-surface-glass-border/10 space-y-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-md md:text-lg lg:text-xl font-bold text-text-muted-foreground">
            Certificates{" "}
            {finishedTeams.length > 0 ? `(${finishedTeams.length})` : ""}
          </p>
        </div>
        <hr className="border-surface-glass-border/10" />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-text-body-main">Loading teams...</p>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-text-body-main">
            Error loading teams. Please try again.
          </p>
        </div>
      ) : (
        <>
          <Table
            items={finishedTeams}
            columns={[
              { key: "name", label: "Team Name", width: "w-1/3" },
              { key: "code", label: "Team Code", width: "w-1/4" },
              { key: "department", label: "Department", width: "w-1/4" },
              { key: "totalScore", label: "Total Score", width: "w-1/6" },
            ]}
            renderActions={(item) => (
              <Button
                type={item.status === "Certified" ? "secondary" : "primary"}
                buttonText={
                  item.status === "Certified"
                    ? "Re-roll Certificate"
                    : "Roll Certificate"
                }
                buttonIcon={<FaCertificate />}
                onClick={() => handleRollCertificate(item)}
                width="fit"
              />
            )}
            emptyMessage="No finished teams found."
          />

          <CardView
            items={finishedTeams}
            titleKey="name"
            renderButtons={(item) => (
              <Button
                type={item.status === "Certified" ? "secondary" : "primary"}
                buttonText={
                  item.status === "Certified"
                    ? "Re-roll Certificate"
                    : "Roll Certificate"
                }
                buttonIcon={<FaCertificate />}
                onClick={() => handleRollCertificate(item)}
                width="fit"
              />
            )}
            renderedFields={[
              { key: "code", label: "Team Code" },
              { key: "department", label: "Department" },
              { key: "totalScore", label: "Total Score" },
            ]}
            emptyMessage="No finished teams found."
          />
        </>
      )}
    </div>
  );
};

export default CertificatesTab;
