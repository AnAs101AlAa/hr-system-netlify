import { Modal, Button, Checkbox } from "tccd-ui";
import { useState } from "react";
import DEPARTMENT_LIST from "@/constants/departments";
import { useFinalizeTeamScores } from "@/shared/queries/judgingSystem/judgeQueries";
import * as JudgeAPI from "@/shared/queries/judgingSystem/judgeAPI";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface FinalizeScoresModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FinalizeScoresModal({
  isOpen,
  onClose,
}: FinalizeScoresModalProps) {
  const { eventId } = useParams();
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const finalizeMutation = useFinalizeTeamScores();

  const toggleDepartment = (value: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const handleSubmit = async () => {
    if (!eventId) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Finalizing scores...");

    try {
      for (const deptKey of selectedDepartments) {
        const teamsData = await JudgeAPI.getEventTeams(
          eventId,
          1,
          1000,
          "",
          "",
          "",
          "",
          deptKey,
          "",
          "admin",
        );

        const teams = teamsData.teams || [];
        if (teams.length > 0) {
          const scores = teams.map((t: any) => t.totalScore || 0);
          const maxScore = Math.max(...scores);

          await finalizeMutation.mutateAsync({
            eventId,
            departments: [deptKey],
            maxScore,
          });
        }
      }
      toast.success("Scores finalized successfully!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error finalizing scores:", error);
      toast.error("Failed to finalize scores. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalize Scores">
      <div className="space-y-4 mt-2 w-full">
        <p className="text-[14px] md:text-[15px] lg:text-[16px] text-text-muted-foreground">
          Select the departments you want to finalize scores for:
        </p>
        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {DEPARTMENT_LIST.map((dept) => (
            <div className="w-full" key={dept.value}>
              <Checkbox
                label={dept.label}
                checked={selectedDepartments.includes(dept.value)}
                onChange={() => toggleDepartment(dept.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="secondary"
            onClick={onClose}
            buttonText="Cancel"
            disabled={isSubmitting}
          />
          <Button
            type="primary"
            onClick={handleSubmit}
            buttonText="Submit"
            disabled={selectedDepartments.length === 0 || isSubmitting}
            loading={isSubmitting}
          />
        </div>
      </div>
    </Modal>
  );
}
