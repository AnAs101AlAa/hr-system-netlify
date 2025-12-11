import { useEffect, useState } from "react";
import type { Team } from "@/shared/types/judgingSystem";
import { useCreateTeam, useUpdateTeam } from "@/shared/queries/judgingSystem/judgeQueries";
import toast from "react-hot-toast";

export default function useManageTeamModalUtils (eventId: string, mode: number, teamData: Team | undefined) {
    const [teamDataState, setTeamDataState] = useState<Team | undefined>({id: "", name: "", code: "", course: "", department: "", teamMembers: []});
    const [formErrors, setFormErrors] = useState<{attr: string, value:string}[]>([]);
    const createTeamMutation = useCreateTeam();
    const updateTeamMutation = useUpdateTeam();
    const isLoading = createTeamMutation.isPending || updateTeamMutation.isPending;

    useEffect(() => {
        if(mode == 2 && teamData) {
            setTeamDataState(teamData);
        }
    }, [teamData]);

    const validateTeamData = (): {attr: string, value:string}[] => {
        const errors: {attr: string, value:string}[] = [];

        if (!teamDataState?.name || teamDataState.name.trim() === "") errors.push({attr: "name", value: "Team name is required."});
        if (!teamDataState?.code || teamDataState.code.trim() === "") errors.push({attr: "code", value: "Team Code is required."});
        if (!teamDataState?.course || teamDataState.course.trim() === "") errors.push({attr: "course", value: "Team Course is required"});
        if (!teamDataState?.department || teamDataState.department.trim() === "") errors.push({attr: "department", value: "Team Department is required"});
        if (!teamDataState?.teamMembers || teamDataState.teamMembers.length === 0) errors.push({attr: "teamMembers", value: "Team Must include at least 1 member."});
        return errors;
    }

    const submitTeam = () => {
        setTeamDataState((prev : Team | undefined) => {
            if (!prev) return prev;
            return {id: prev.id, name: prev.name.trim(), code: prev.code.trim(), course: prev.course.trim(), department: prev.department.trim(), teamMembers: prev.teamMembers.map(mem => {return {...mem, name: mem.name.trim()}})};
        });
        const errors = validateTeamData();
        if(errors.length > 0) {
            setFormErrors(errors);
            return;
        }
        if(mode === 1) {
            createTeamMutation.mutate({eventId: eventId, teamData: teamDataState as Team }, {
                onSuccess: () => {
                    toast.success("Team created successfully.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                onError: () => {
                    toast.error("Failed to create team, please try again later.")
                }
            });
        } else if (mode === 2) {
            updateTeamMutation.mutate({teamData: teamDataState as Team, oldTeamData: teamData as Team}, {
                onSuccess: () => {
                    toast.success("Team updated successfully.");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                },
                onError: () => {
                    toast.error("Failed to update team, please try again later.")
                }
            });
        }
    }

    const handleChangeTeamData = (attr: keyof Team, value: string) => {
        setTeamDataState((prev : Team | undefined) => prev ? {...prev, [attr]: value} : prev);
    }

    const handleAddMember = () => {
        if (!teamDataState) return;
        const newMember = { id: (teamDataState.teamMembers.length + 1).toString(), name: "" };
        setTeamDataState({ ...teamDataState, teamMembers: [...teamDataState.teamMembers, newMember] });
    }

    const handleChangeMemberName = (memberId: string, newName: string) => {
        if (!teamDataState) return;
        const updatedMembers = teamDataState.teamMembers.map(member => 
            member.id === memberId ? { ...member, name: newName } : member
        );
        setTeamDataState({ ...teamDataState, teamMembers: updatedMembers });
    }

    const handleDeleteMember = (memberId: string) => {
        if (!teamDataState) return;
        const updatedMembers = teamDataState.teamMembers.filter(member => member.id !== memberId);
        setTeamDataState({ ...teamDataState, teamMembers: updatedMembers });
    }

    return {
        teamDataState,
        handleAddMember,
        handleDeleteMember,
        handleChangeMemberName,
        validateTeamData,
        handleChangeTeamData,
        formErrors,
        submitTeam,
        isLoading,
    }
};