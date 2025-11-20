import { useState } from "react";
import { useParams } from "react-router-dom"
import { useEventQuestions, useSubmitTeamEvaluation, useGetTeamEvaluation, useUpdateTeamEvaluation, useGetTeam } from "@/shared/queries/judgingSystem/judgeQueries";
import { useEvent } from "@/shared/queries/events/eventQueries";
import toast from "react-hot-toast";
import type { EvaluationSubmission } from "@/shared/types/judgingSystem";
import { useNavigate } from "react-router-dom";

export default function UseTeamEvaluationUtils() {
    const navigate = useNavigate();
    const { eventId, teamId } = useParams<{ eventId: string; teamId: string }>();

    const { data: questions, isLoading: isQuestionsLoading, isError: isQuestionsError } = useEventQuestions(eventId!);
    const { data: event, isLoading: isEventLoading, isError: isEventError } = useEvent(eventId!);
    const { data: teamData, isLoading: isTeamLoading, isError: isTeamError } = useGetTeam(teamId!);
    const getTeamEvaluationMutation = useGetTeamEvaluation();
    const submitTeamEvaluationMutation = useSubmitTeamEvaluation();
    const updateTeamEvaluationMutation = useUpdateTeamEvaluation();

    const [assessmentScores, setAssessmentScores] = useState<{ [questionId: string]: number }>({});
    const [judgeName, setJudgeName] = useState<string>("");
    const [formErrors, setFormErrors] = useState<{name: string, questions: { [questionId: string]: string }} | null>(null);

    const handleChangeAssessmentScore = (questionId: string, score: number) => {
        setAssessmentScores(prevScores => ({
            ...prevScores,
            [questionId]: score,
        }));
    }

    const handleChangeJudgeName = (name: string) => {
        setJudgeName(name);
    }

    const handleGetPreviousEvaluation = () => {
        if (!teamId || judgeName.trim() === "") {
            toast.error("Please enter your name to retrieve previous evaluation.");
            return;
        }
        getTeamEvaluationMutation.mutate({ teamId, judgeName }, {
            onSuccess: (evaluation) => {
                if (evaluation) {
                    setAssessmentScores(prevScores => {
                        const newScores = { ...prevScores };
                        evaluation.forEach(item => {
                            newScores[item.evaluationItemId] = item.score;
                        });
                        return newScores;
                    });
                    toast.success("Previous evaluation loaded successfully.");
                } else {
                    toast.error("No previous evaluation found for the given name.");
                }
            }
        });
    }

    const validateData = (): boolean => {
        const errors: {name: string, questions: { [questionId: string]: string }} = { name: "", questions: {} };
        let isValid = true;
        if(judgeName.trim() === "") {
            errors.name = "Judge name is required.";
            isValid = false;
        }
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

        let submissionMode = false; // false for create, true for update

        await getTeamEvaluationMutation.mutateAsync({ teamId: teamId!, judgeName }, {
            onSuccess: (existingEvaluation) => {
                if (existingEvaluation && existingEvaluation?.length > 0) {
                    submissionMode = true;
                }
            }
        });

        const payload : EvaluationSubmission = {
            teamId: teamId!,
            judgeName: judgeName.trim().toLocaleLowerCase(),
            evaluationItemScores: Object.entries(assessmentScores).map(([questionId, score]) => ({
                evaluationItemId: questionId,
                score,
            })),
        }

        if(!submissionMode) {
            submitTeamEvaluationMutation.mutate(payload, {
                onSuccess: () => {
                    toast.success("Evaluation submitted successfully!");
                    setTimeout(() => {
                        navigate(-1);
                    }, 1500);
                },
                onError: () => {
                    toast.error("Failed to submit evaluation. Please try again.");
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

    return {
        questions,
        teamData,
        isFetchingData: isQuestionsLoading || isEventLoading || isTeamLoading,
        isFetchingError: isQuestionsError || isEventError || isTeamError,
        event,
        assessmentScores,
        judgeName,
        handleNavigateBack,
        handleGetPreviousEvaluation,
        handleChangeAssessmentScore,
        handleChangeJudgeName,
        handleSubmitEvaluation,
        isSubmittingEvaluation: submitTeamEvaluationMutation.isPending || updateTeamEvaluationMutation.isPending,
        isFetchingPreviousEvaluation: getTeamEvaluationMutation.isPending,
        formErrors,
    }
}