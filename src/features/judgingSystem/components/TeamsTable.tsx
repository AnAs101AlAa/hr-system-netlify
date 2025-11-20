import { useNavigate, useParams } from "react-router-dom";
import { Button } from "tccd-ui";
import { useEffect, useState } from "react";
import type { Team } from "@/shared/types/judgingSystem";
import TeamDeleteModal from "./TeamDeleteModal";
import { useSelector } from "react-redux";

interface TeamsTableProps {
    teams: Team[];
    setOpenModal: (teamData: Team) => void;
}

const TeamsTable = ({ teams, setOpenModal }: TeamsTableProps) => {
  const navigate = useNavigate();
  const { eventId} = useParams<{ eventId: string }>();
  const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>(teams);
  const [showDeleteModal, setShowDeleteModal] = useState("");

  useEffect(() => {
    setDisplayedTeams(teams);
  }, [teams]);
  
  return (
    <div className="hidden lg:block overflow-x-auto">
      <TeamDeleteModal showModal={showDeleteModal} setShowModal={setShowDeleteModal} />
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
              Total Score
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
              Actions
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
                      {team.totalScore || "N/A"}
                    </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
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
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center">
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
