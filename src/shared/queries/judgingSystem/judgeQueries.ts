import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query"
import type { Team } from "@/shared/types/judgingSystem"
import * as JudgeAPI from "./judgeAPI";

const judgeKeys = {
    all: ["judgingSystem"] as const,
    getTeams: (page: number, count: number, sortBy: string, nameKey: string) => [...judgeKeys.all, { page, count, sortBy, nameKey }] as const,
    getTeam: (teamId: string) => [...judgeKeys.all, teamId] as const,
    createTeam: () => [...judgeKeys.all] as const,
    updateTeam: () => [...judgeKeys.all] as const,
    deleteTeam: () => [...judgeKeys.all] as const,
}

export const useResearchTeams = (eventId: string, page: number, count: number, sortBy: string, nameKey: string, codeKey: string): UseQueryResult<Team[], Error> => {
    return useQuery({
        queryKey: judgeKeys.getTeams(page, count, sortBy, nameKey),
            queryFn: async () => {
            const teams = await JudgeAPI.getEventTeams(eventId, page, count, sortBy, nameKey, codeKey);
            return teams;
        },
    });
};

export const useCreateTeam = () => {
    return useMutation({
        mutationKey: judgeKeys.createTeam(),
        mutationFn: async ({ eventId, teamData }: { eventId: string; teamData: Team }) => {
            await JudgeAPI.createTeam(eventId, teamData);
        },
    });
}

export const useUpdateTeam = () => {
    return useMutation({
        mutationKey: judgeKeys.updateTeam(),
        mutationFn: async ({teamData, oldTeamData}: {teamData: Team, oldTeamData: Team}) => {
            const addedMembers = teamData.teamMembers.filter(tm => !oldTeamData.teamMembers.some(otm => otm.id === tm.id));
            const removedMembers = oldTeamData.teamMembers.filter(otm => !teamData.teamMembers.some(tm => tm.id === otm.id));

            for (const member of addedMembers) {
                await JudgeAPI.addTeamMember(teamData.id, member.name);
            }
            for (const member of removedMembers) {
                await JudgeAPI.removeTeamMember(member.id);
            }
            for (const member of teamData.teamMembers) {
                const oldMember = oldTeamData.teamMembers.find(otm => otm.id === member.id);
                if (oldMember && oldMember.name !== member.name) {
                    await JudgeAPI.updateTeamMember(member.id, member.name);
                }
            }
            await JudgeAPI.updateTeam(teamData);
        },
    });
}

export const useDeleteTeam = () => {
    return useMutation({
        mutationKey: judgeKeys.deleteTeam(),
        mutationFn: async (teamId: string) => {
            await JudgeAPI.deleteTeam(teamId);
        },
    });
};