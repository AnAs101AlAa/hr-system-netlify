import { systemApi } from "../axiosInstance";
import type { Team } from "@/shared/types/judgingSystem";

const JUDGING_API_URL = "/v1";

export async function getEventTeams(eventId: string, page: number, count: number, sortBy: string, nameKey: string, codeKey: string): Promise<Team[]> {
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

    //if (SortBy) params.SortBy = SortBy;
    //if (Order) params.Order = Order;
    //if (nameKey) params.Name = nameKey;

    const response = await systemApi.get(`${JUDGING_API_URL}/Team/${eventId}`, { params });
    return response.data.data.data.map((team: Team) => ({
        id: team.id,
        name: team.name,
        teamMembers: team.teamMembers,
        scores: team.scores,
        totalScore: team.totalScore,
        code: team.code,
        course: team.course,
    }));
};

export async function createTeam(eventId: string, teamData: Team) {
    const teamPayload = {
        ...teamData,
        teamMembers: teamData.teamMembers.map(member => ({ name: member.name })),
    }

    await systemApi.post(`${JUDGING_API_URL}/Team/${eventId}`, teamPayload );
}

export async function updateTeam(teamData: Team) {
    await systemApi.patch(`${JUDGING_API_URL}/Team/${teamData.id}`, teamData);
}

export async function addTeamMember(teamId: string, memberName: string): Promise<void> {
    await systemApi.post(`${JUDGING_API_URL}/TeamMember/${teamId}`, { name: memberName });
}

export async function removeTeamMember(memberId: string): Promise<void> {
    await systemApi.delete(`${JUDGING_API_URL}/TeamMember/${memberId}`);
}

export async function updateTeamMember(memberId: string, memberName: string): Promise<void> {
    await systemApi.patch(`${JUDGING_API_URL}/TeamMember/${memberId}`, { name: memberName });
}

export async function deleteTeam(teamId: string): Promise<void> {
    await systemApi.delete(`${JUDGING_API_URL}/Team/${teamId}`);
}
