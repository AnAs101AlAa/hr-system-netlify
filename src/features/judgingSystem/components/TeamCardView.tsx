import type { Team } from "@/shared/types/judgingSystem";
import { Button } from "tccd-ui";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoTrashSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import ConfirmActionModal from "./ConfirmActionModal";
import { useSelector } from "react-redux";
import { useDeleteTeam } from "@/shared/queries/judgingSystem/judgeQueries";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils/errorHandler";

interface TeamCardViewProps {
  teams: Team[];
  setOpenModal: (teamData: Team) => void;
  mode?: number;
  handleAdjustTeam?: (team: Team, op: boolean) => void;
}

const TeamCardView = ({
  teams,
  setOpenModal,
  mode = 0,
  handleAdjustTeam,
}: TeamCardViewProps) => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>(teams);
  
  const deleteTeamMutation = useDeleteTeam();

  const handleConfirmDelete = () => {
    if (!showDeleteModal) return;
    deleteTeamMutation.mutate(showDeleteModal, {
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
    <div className="lg:hidden divide-y divide-gray-100">
      <ConfirmActionModal item={teams.find(team => team.id === showDeleteModal) || {} as Team} isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal("")} title="Delete Team" subtitle="Are you sure you want to delete this team? this action cannot be undone." onSubmit={handleConfirmDelete} isSubmitting={deleteTeamMutation.isPending} />
      {displayedTeams && displayedTeams.length > 0 ? (
        displayedTeams.map((team, index) => (
          <div key={team.id || index} className="p-4 space-y-3">
            <div className="flex justify-between items-start mb-1">
              <div>
                <p className="font-semibold text-contrast text-[18px] md:text-[20px]">
                  {`Team: ${team.name || "N/A"}`}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-dashboard-heading">
                {"Department: " + (team.department || "N/A")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 mb-5 gap-4 text-sm mt-4">
              <div>
                <span className="font-medium text-dashboard-heading">
                  Code:
                </span>
                <p className="text-dashboard-card-text">
                  {team.code || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Course:
                </span>
                <p className="text-dashboard-card-text">
                  {team.course || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  Total Score:
                </span>
                <p className="text-dashboard-card-text">
                  {team.totalScore || "N/A"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-center items-center gap-3">
              {mode === 0 ?
                <>
                {(userRoles.includes("Judge") && userRoles.length === 1) ? (
                  <Button
                  type="primary"
                  buttonText="Start Assessment"
                  onClick={() => { navigate(`/judging-system/assess-team/${eventId}/${team.id}`); }}
                  width="fit"
                  />
                ) : (
                  <>
                    <Button
                        type="tertiary"
                        onClick={() => { navigate(`/judging-system/team/${team.id}`); }}
                        width="fit"
                        buttonIcon={<TbListDetails size={16} />}
                    />
                    <Button
                        type="secondary"
                        onClick={() => setOpenModal(team)}
                        buttonIcon={<FaEdit size={16} />}
                        width="fit"
                    />
                    <Button
                        type="danger"
                        onClick={() => setShowDeleteModal(team.id || "")}
                        buttonIcon={<IoTrashSharp size={17} />}
                        width="fit"
                    />
                  </>
                    )}
                </>
                : <Button
                    type={mode === 1 ? "tertiary" : "danger"}
                    buttonText={mode === 1 ? "Add" : "Remove"}
                    onClick={() => { if (handleAdjustTeam) handleAdjustTeam(team, mode === 1); }}
                    width="fit"
                  />
              }
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <div className="text-dashboard-description">
            <p className="text-lg font-medium">No teams found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCardView;
