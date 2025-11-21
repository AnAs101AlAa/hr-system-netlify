import type { Team } from "@/shared/types/judgingSystem";
import { Button } from "tccd-ui";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoTrashSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import TeamDeleteModal from "./TeamDeleteModal";
import { useSelector } from "react-redux";

interface TeamCardViewProps {
  teams: Team[];
  setOpenModal: (teamData: Team) => void;
}

const TeamCardView = ({
  teams,
  setOpenModal
}: TeamCardViewProps) => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>(teams);
  
  useEffect(() => {
    setDisplayedTeams(teams);
  }, [teams]);

  return (
    <div className="lg:hidden divide-y divide-gray-100">
      <TeamDeleteModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} />
      {displayedTeams && displayedTeams.length > 0 ? (
        displayedTeams.map((team, index) => (
          <div key={team.id || index} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-contrast text-[18px] md:text-[20px]">
                  {team.name || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
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
                  Total Score:
                </span>
                <p className="text-dashboard-card-text">
                  {team.totalScore || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-center items-center gap-3">
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
