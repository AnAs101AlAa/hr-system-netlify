import { useNavigate, useParams } from "react-router-dom";
import { Button } from "tccd-ui";
import { useEffect, useState } from "react";
import type { Team } from "@/shared/types/judgingSystem";
import ConfirmCationModal from "./ConfirmActionModal";
import { useSelector } from "react-redux";
import { useDeleteTeam } from "@/shared/queries/judgingSystem/judgeQueries";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface TeamsTableProps {
    teams: Team[];
    setOpenModal: (teamData: Team) => void;
    mode?: number;
    handleAdjustTeam?: (team: Team, op: boolean) => void;
}

const TeamsTable = ({ teams, setOpenModal, mode=0, handleAdjustTeam }: TeamsTableProps) => {
  const navigate = useNavigate();
  const { eventId} = useParams<{ eventId: string }>();
  const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>(teams);
  const [showDeleteModal, setShowDeleteModal] = useState("");
  
  const deleteTeamMutation = useDeleteTeam();

  const handleConfirmDelete = (item: Team) => {
    if (!showDeleteModal) return;
    deleteTeamMutation.mutate(item.id, {
      onSuccess: () => {
        toast.success("Form deleted successfully");
        setShowDeleteModal("");
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
    setDisplayedTeams(teams);
  }, [teams]);
  
  return (
    <div className="hidden lg:block overflow-x-auto">
      <ConfirmCationModal item={teams.find(team => team.id === showDeleteModal) || {} as Team} isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal("")} title="Delete Team" subtitle="Are you sure you want to delete this team? this action cannot be undone." onSubmit={handleConfirmDelete} isSubmitting={deleteTeamMutation.isPending} />
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Code
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Course
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Department
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Total Score
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              {mode ? "Actions" : ""}
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {displayedTeams && displayedTeams.length > 0 ? (
            displayedTeams.map((team, index) => (
              <tr
                key={team.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {team.name || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {team.code || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {team.course || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {team.department || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                    <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                      {team.totalScore || "N/A"}
                    </div>
                </td>
                <td className="px-4 py-4">
                  {mode === 0 ? <div className="flex items-center gap-2">
                    {(userRoles.includes("Judge") && userRoles.length === 1) ? (
                      <Button
                        type="primary"
                        buttonText="Start Assessment "
                        onClick={() => { navigate(`/judging-system/assess-team/${eventId}/${team.id}`); }}
                        width="fit"
                      />
                    ) : (
                      <>
                        <Button
                          type="tertiary"
                          buttonText="View Details"
                          onClick={() => { navigate(`/judging-system/team/${team.id}`); }}
                          width="fit"
                        />
                        <Button
                          type="secondary"
                          onClick={() => setOpenModal(team)}
                          buttonText="Edit"
                          width="fit"
                        />
                        <Button
                          type="danger"
                          onClick={() => setShowDeleteModal(team.id)}
                          buttonText="Delete"
                          width="fit"
                        />
                      </>
                    )}
                  </div>
                  : <Button
                      type={mode === 1 ? "tertiary" : "danger"}
                      buttonText={mode === 1 ? "Add" : "Remove"}
                      onClick={() => { if (handleAdjustTeam) handleAdjustTeam(team, mode === 1); }}
                      width="fit"
                    /> }
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center">
                <div className="text-dashboard-description">
                  <p className="text-lg font-medium">No Teams found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeamsTable;
