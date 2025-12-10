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

export interface JudgeQuestion {
    id: string;
    name: string;
    itemNumber: number;
    eventId?: string;
}

export interface EvaluationSubmission {
    teamId: string;
    totalScore?: number;
    evaluationItemScores: EvaluationItem[];
    note?: string;
}

export interface EvaluationItem {
    evaluationItemId: string;
    score: number;
    evaluationItemName?: string;
}