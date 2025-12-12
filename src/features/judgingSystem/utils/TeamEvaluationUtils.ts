import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useEventQuestions, useSubmitTeamEvaluation, useGetTeamEvaluation, useUpdateTeamEvaluation, useGetTeam, useAddTeamAttendance, useGetTeamAttendance } from "@/shared/queries/judgingSystem/judgeQueries";
import { useEvent } from "@/shared/queries/events/eventQueries";
import toast from "react-hot-toast";
import type { EvaluationSubmission, TeamMemberAttendance } from "@/shared/types/judgingSystem";
import { useNavigate } from "react-router-dom";

export default function UseTeamEvaluationUtils() {
    const navigate = useNavigate();
    const { eventId, teamId } = useParams<{ eventId: string; teamId: string }>();

    const { data: questions, isLoading: isQuestionsLoading, isError: isQuestionsError } = useEventQuestions(eventId!);
    const { data: event, isLoading: isEventLoading, isError: isEventError } = useEvent(eventId!);
    const { data: teamData, isLoading: isTeamLoading, isError: isTeamError } = useGetTeam(teamId!);
    const { data: teamEvaluation, isLoading: isEvaluationLoading, isError: isEvaluationError } = useGetTeamEvaluation(teamId!);
    const { data: teamAttendanceData, isLoading: isAttendanceLoading, isError: isAttendanceError } = useGetTeamAttendance(eventId!, teamId!);

    console.log("teamAttendanceData", teamAttendanceData);
    
    const submitTeamEvaluationMutation = useSubmitTeamEvaluation();
    const updateTeamEvaluationMutation = useUpdateTeamEvaluation();
    const addTeamAttendanceMutation = useAddTeamAttendance();
    
    const [assessmentScores, setAssessmentScores] = useState<{ [questionId: string]: number }>({});
    const [extraNotes, setExtraNotes] = useState<string>("");
    const [teamAttendance, setTeamAttendance] = useState<TeamMemberAttendance[]>([]);
    const [formErrors, setFormErrors] = useState<{name: string, questions: { [questionId: string]: string }} | null>(null);

    console.log("teamEvaluation", teamEvaluation);
    useEffect(() => {
        if(teamEvaluation) {
            const initialScores: { [questionId: string]: number } = {};
            teamEvaluation.evaluationItemScores.forEach(item => {
                initialScores[item.evaluationItemId] = item.score;
            });
            setAssessmentScores(initialScores);
            setExtraNotes(teamEvaluation.note || "");
        }
        if(teamData && teamData.teamMembers) {
            const attendanceStatus: TeamMemberAttendance[] = [];
            teamData.teamMembers.forEach(member => {
                attendanceStatus.push({ teamMemberId: member.id, attended: false });
            });
            setTeamAttendance(attendanceStatus);
        }
    }, [teamEvaluation, teamData]);

    const handleChangeAssessmentScore = (questionId: string, score: number) => {
        setAssessmentScores(prevScores => ({
            ...prevScores,
            [questionId]: score,
        }));
    }

    const validateData = (): boolean => {
        const errors: {name: string, questions: { [questionId: string]: string }} = { name: "", questions: {} };
        let isValid = true;
        questions?.forEach(question => {
            const score = assessmentScores[question.id];
            if(score === undefined || score < 0 || score > 10) {
                errors.questions[question.id] = "Score must be between 0 and 10.";
                isValid = false;
            }
        });
        setFormErrors(errors);
        return isValid;
    }
    
    const handleSubmitEvaluation = async () => {
        setFormErrors(null);
        if (!validateData()) {
            return;
        }

        const payload : EvaluationSubmission = {
            teamId: teamId!,
            evaluationItemScores: Object.entries(assessmentScores).map(([questionId, score]) => ({
                evaluationItemId: questionId,                
                score,
            })),

            note: extraNotes,
        }

        if(!teamEvaluation) {
            await submitTeamEvaluationMutation.mutateAsync(payload, {
                onError: () => {
                    toast.error("Failed to submit evaluation. Please try again.");
                }
            });

            await addTeamAttendanceMutation.mutateAsync(teamAttendance, {
                onSuccess: () => {
                    toast.success("Evaluation submitted successfully!");
                    setTimeout(() => {
                        navigate(-1);
                    }, 1500);
                },
                onError: () => {
                    toast.error("Failed to submit attendance. Please try again.");
                }
            });
        } else {
            updateTeamEvaluationMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Evaluation updated successfully!");
                    setTimeout(() => {
                        navigate(-1);
                    }, 1500);
                },
                onError: () => {
                    toast.error("Failed to update evaluation. Please try again.");
                }
            });
        }
    }

    const handleNavigateBack = () => {
        navigate(-1);
    }

    const handleChangeTeamAttendance = (memberId: string, attended: boolean) => {
        setTeamAttendance((prevAttendance) => {
            return prevAttendance.map(att => att.teamMemberId === memberId ? { ...att, attended } : att);
        });
    }

    return {
        questions,
        extraNotes,
        teamAttendance,
        setExtraNotes,
        teamData,
        isFetchingData: isQuestionsLoading || isEventLoading || isTeamLoading || isEvaluationLoading,
        isFetchingError: isQuestionsError || isEventError || isTeamError || isEvaluationError,
        event,
        assessmentScores,
        handleNavigateBack,
        handleChangeAssessmentScore,
        handleSubmitEvaluation,
        handleChangeTeamAttendance,
        isSubmittingEvaluation: submitTeamEvaluationMutation.isPending || updateTeamEvaluationMutation.isPending,
        formErrors,
    }
}