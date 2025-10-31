import { systemApi } from "../axiosInstance";
import type { Team } from "@/shared/types/judgingSystem";

const JUDGING_API_URL = "/v1/JudgingSystem";

export async function getTeams(page: number, count: number, sortBy: string, nameKey: string): Promise<Team[]> {
    return [
        {
            id: "team1",
            name: "Alpha Team",
            code: "ALPHA123",
            scores: [85, 90, 88],
            totalScore: 88,
            members: [
                {
                    id: "member1",
                    name: "John Doe",
                    contribution: "Leader"
                },
                {
                    id: "member2",
                    name: "Jane Smith",
                    contribution: "Member"
                }
            ]
        }
    ]
    let SortBy: string | undefined = undefined;
    let Order: string | undefined = undefined;

    if (sortBy) {
        if(sortBy === "nameAsc" || sortBy === "nameDesc") {
            SortBy = "Name";
            Order = sortBy === "nameAsc" ? "Asc" : "Desc";
        } else {
            SortBy = "Score";
            Order = sortBy === "scoreAsc" ? "Asc" : "Desc";
        }
    }

    const params: Record<string, any> = {
        page,
        count,
    };

    if (SortBy) params.SortBy = SortBy;
    if (Order) params.Order = Order;
    if (nameKey) params.Name = nameKey;

    const response = await systemApi.get(`${JUDGING_API_URL}/teams`, { params });
    return response.data.data.map((team: Team) => ({
        id: team.id,
        name: team.name,
        members: team.members,
        scores: team.scores,
        totalScore: team.totalScore,
        code: team.code,
    }));
};

export async function deleteTeam(teamId: string): Promise<void> {
    await systemApi.delete(`${JUDGING_API_URL}/teams/${teamId}`);
}
