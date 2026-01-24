import { Button } from "tccd-ui";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useResearchTeams,
  useUpdateTeamStatus,
} from "@/shared/queries/judgingSystem/judgeQueries";
import type { Team } from "@/shared/types/judgingSystem";
import Table from "@/shared/components/table/Table";
import CardView from "@/shared/components/table/CardView";
import { FaCertificate } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CertificatesTab = () => {
  const { eventId } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const updateTeamStatusMutation = useUpdateTeamStatus();
  const queryClient = useQueryClient();

  const {
    data: teams,
    isLoading,
    isError,
  } = useResearchTeams(
    eventId!,
    currentPage,
    1000, // Fetch a large number since we are filtering client-side for now
    "",
    "",
    "",
    "",
    "",
    "", // Fetch all statuses
    "admin",
  );

  const finishedTeams =
    teams?.teams?.filter(
      (team: Team) =>
        team.status === "Evaluated" || team.status === "Certified",
    ) || [];

  const handleRollCertificate = async (team: Team) => {
    const newStatus = team.status === "Evaluated" ? "Certified" : "Evaluated";
    const actionText = team.status === "Evaluated" ? "roll" : "cancel";

    try {
      await updateTeamStatusMutation.mutateAsync({
        teamId: team.id,
        status: newStatus,
      });
      toast.success(
        `Certificate ${actionText === "roll" ? "rolled" : "cancelled"} successfully.`,
      );
      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["judgingSystem", "unassignedTeams"],
      });
      queryClient.invalidateQueries({
        queryKey: ["judgingSystem", "getTeams"],
      });
    } catch {
      toast.error(`Failed to ${actionText} certificate. Please try again.`);
    }
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
              { key: "finalScore", label: "Final Score", width: "w-1/6" },
            ]}
            renderActions={(item) => (
              <Button
                type={item.status === "Certified" ? "secondary" : "primary"}
                buttonText={
                  item.status === "Certified"
                    ? "Cancel Certificate"
                    : "Roll Certificate"
                }
                buttonIcon={<FaCertificate />}
                onClick={() => handleRollCertificate(item)}
                width="fit"
                loading={updateTeamStatusMutation.isPending}
                disabled={updateTeamStatusMutation.isPending}
              />
            )}
            emptyMessage="No evaluated or certified teams found."
          />

          <CardView
            items={finishedTeams}
            titleKey="name"
            renderButtons={(item) => (
              <Button
                type={item.status === "Certified" ? "secondary" : "primary"}
                buttonText={
                  item.status === "Certified"
                    ? "Cancel Certificate"
                    : "Roll Certificate"
                }
                buttonIcon={<FaCertificate />}
                onClick={() => handleRollCertificate(item)}
                width="fit"
                loading={updateTeamStatusMutation.isPending}
                disabled={updateTeamStatusMutation.isPending}
              />
            )}
            renderedFields={[
              { key: "code", label: "Team Code" },
              { key: "department", label: "Department" },
              { key: "totalScore", label: "Total Score" },
              { key: "finalScore", label: "Final Score" },
            ]}
            emptyMessage="No evaluated or certified teams found."
          />
        </>
      )}
    </div>
  );
};

export default CertificatesTab;
