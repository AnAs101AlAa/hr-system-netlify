import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query"
import type { Team } from "@/shared/types/judgingSystem"
import * as JudgeAPI from "./judgeAPI";

const judgeKeys = {
    all: ["judgingSystem"] as const,
    getTeams: (page: number, count: number, sortBy: string, nameKey: string) => [...judgeKeys.all, { page, count, sortBy, nameKey }] as const,
    getTeam: (teamId: string) => [...judgeKeys.all, teamId] as const,
    deleteTeam: () => [...judgeKeys.all] as const,
}

export const useResearchTeams = (page: number, count: number, sortBy: string, nameKey: string): UseQueryResult<Team[], Error> => {
    return useQuery({
        queryKey: judgeKeys.getTeams(page, count, sortBy, nameKey),
            queryFn: async () => {
            const teams = await JudgeAPI.getTeams(page, count, sortBy, nameKey);
            return teams;
        },
    });
};

export const useDeleteTeam = () => {
    return useMutation({
        mutationKey: judgeKeys.deleteTeam(),
        mutationFn: async (teamId: string) => {
            await JudgeAPI.deleteTeam(teamId);
        },
    });
};