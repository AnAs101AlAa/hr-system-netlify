import { systemApi } from "../axiosInstance";
import type { JudgeQuestion, Team, EvaluationSubmission, EvaluationItem } from "@/shared/types/judgingSystem";

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

    if (SortBy) params.OrderBy = SortBy;
    if (Order) params.SortingDirection = Order;
    if (nameKey) params.Name = nameKey;
    if (codeKey) params.Code = codeKey;

    const response = await systemApi.get(`${JUDGING_API_URL}/Team/event/${eventId}`, { params });
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

export async function getTeam(teamId: string): Promise<Team> {
    const response = await systemApi.get(`${JUDGING_API_URL}/Team/${teamId}`);
    return response.data.data;
}

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

export async function getEventQuestions(eventId: string): Promise<JudgeQuestion[]> {
    const response = await systemApi.get(`${JUDGING_API_URL}/Evaluation/event/${eventId}/items`);
    return response.data.data.sort((a: JudgeQuestion, b: JudgeQuestion) => a.itemNumber - b.itemNumber);
}

export async function createEventQuestion(questionData: JudgeQuestion): Promise<void> {
    await systemApi.post(`${JUDGING_API_URL}/Evaluation/item`, questionData);
}

export async function deleteEventQuestion(questionId: string): Promise<void> {
    await systemApi.delete(`${JUDGING_API_URL}/Evaluation/item/${questionId}`);
}

export async function updateEventQuestion(questionData: JudgeQuestion): Promise<void> {
    await systemApi.put(`${JUDGING_API_URL}/Evaluation/item/${questionData.id}`, questionData);
}

export async function submitTeamEvaluation(payload: EvaluationSubmission): Promise<void> {
    await systemApi.post(`${JUDGING_API_URL}/Evaluation/evaluate`, payload);
}

export async function updateTeamEvaluation(payload: EvaluationSubmission): Promise<void> {
    await systemApi.put(`${JUDGING_API_URL}/Evaluation/evaluate`, payload);
}

export async function getTeamEvaluation(teamId: string, judgeName: string): Promise<EvaluationItem[] | null> {
    const response = await systemApi.get(`${JUDGING_API_URL}/Evaluation/team/${teamId}/${judgeName.trim().toLocaleLowerCase()}`);
    const data = response.data.data.evaluationItemScores.map((item : EvaluationItem) => ({
        evaluationItemId: item.evaluationItemId,
        score: item.score,
    }));

    return data || null;
}