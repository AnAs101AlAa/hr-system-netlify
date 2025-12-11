import { systemApi } from "../axiosInstance";
import type { JudgeQuestion, Team, EvaluationSubmission, EvaluationItem, Judge, TeamMemberAttendance } from "@/shared/types/judgingSystem";

const JUDGING_API_URL = "/v1";

export async function getEventTeams(eventId: string, page: number, count: number, sortBy: string, nameKey: string, codeKey: string, courseKey: string, departmentKey: string, mode: string): Promise<any> {
    if(mode === "admin") {
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
        if (courseKey) params.Course = courseKey;
        if (departmentKey) params.Department = departmentKey;

        const response = await systemApi.get(`${JUDGING_API_URL}/Team/event/${eventId}`, { params });
        return {total: response.data.data.total, teams: response.data.data.data};
    } else {
        const params: Record<string, any> = {
            PageNumber: page,
            PageSize: count,
        };

        const response = await systemApi.get(`${JUDGING_API_URL}/Judge/teams`, { params });
        return {total: response.data.data.teams.length, teams: response.data.data.teams};
    }
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

export async function getTeamEvaluation(teamId: string): Promise<EvaluationSubmission | null> {
    const response = await systemApi.get(`${JUDGING_API_URL}/Evaluation/team/${teamId}/judge`);
    const data = response.data.data.evaluationItemScores.map((item : EvaluationItem) => ({
        evaluationItemId: item.evaluationItemId,
        score: item.score,
    }));

    return {
        teamId: response.data.data.teamId,
        judgeId: response.data.data.judgeId,
        judgeName: response.data.data.judgeName,
        totalScore: response.data.data.totalScore,
        evaluationItemScores: data,
        note: response.data.data.note,
    };
}

export async function getAllTeamEvaluations(teamId: string): Promise<EvaluationSubmission[]> {
    const response = await systemApi.get(`${JUDGING_API_URL}/Evaluation/team/${teamId}`);
    return response.data.data;
}

export async function getJudgesForEvent(page: number, count: number, nameKey: string): Promise<Judge[]> {
    const params: Record<string, any> = {
        page,
        count,
    };

    if (nameKey) params.Name = nameKey;
    const response = await systemApi.get(`${JUDGING_API_URL}/Admin/judges`, { params });
    return response.data.data.data;
}

export async function createJudge(judgeData: Judge): Promise<void> {
    await systemApi.post(`${JUDGING_API_URL}/Judge`, judgeData);
}

export async function deleteJudge(judgeId: string): Promise<void> {
    await systemApi.delete(`${JUDGING_API_URL}/Judge/${judgeId}`);
}

export async function getAssignedTeamsForJudge(judgeId: string): Promise<Team[]> {
    const response = await systemApi.get(`${JUDGING_API_URL}/Admin/judges/${judgeId}/teams`);
    return response.data.data.assignedTeams;
}

export async function assignTeamToJudge(judgeId: string, teamIds: string[]): Promise<void> {
    await systemApi.post(`${JUDGING_API_URL}/Judge/${judgeId}/teams`, { teamIds });
}

export async function removeTeamFromJudge(judgeId: string, teamId: string): Promise<void> {
    await systemApi.delete(`${JUDGING_API_URL}/Judge/${judgeId}/teams/${teamId}`);
}

export async function addTeamAttendance(teamData: TeamMemberAttendance[]): Promise<void> {
    await systemApi.post(`${JUDGING_API_URL}/ResearchDayAttendance/bulk`, { teamData });
}

export async function updateTeamAttendance(teamMemberData: TeamMemberAttendance): Promise<void> {
    await systemApi.put(`${JUDGING_API_URL}/ResearchDayAttendance`, teamMemberData);
}