export interface Team {
    id: string;
    name: string;
    code: string;
    course: string;
    department: string;
    scores?: number[];
    totalScore?: number;
    teamMembers: TeamMember[];
}

export interface TeamMember {
    id: string;
    name: string;
}

export interface TeamMemberAttendance {
    teamMemberId: string;
    attended: boolean;
}

export interface JudgeQuestion {
    id: string;
    name: string;
    itemNumber: number;
    eventId?: string;
}

export interface EvaluationSubmission {
    teamId: string;
    judgeName?: string;
    judgeId?: string;
    totalScore?: number;
    evaluationItemScores: EvaluationItem[];
    note?: string;
}

export interface EvaluationItem {
    evaluationItemId: string;
    score: number;
    evaluationItemName?: string;
}

export interface Judge {
    id: string;
    name: string;
    email: string;
    assignedTeams: Team[];
    judgeId?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}