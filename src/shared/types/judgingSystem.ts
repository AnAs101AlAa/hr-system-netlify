export interface Team {
    id: string;
    name: string;
    code: string;
    scores: number[];
    totalScore?: number;
    members: TeamMember[];
}

export interface TeamMember {
    id: string;
    name: string;
    contribution: string;
}