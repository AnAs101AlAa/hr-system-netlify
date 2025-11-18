export interface Team {
    id: string;
    name: string;
    code: string;
    course: string;
    scores?: number[];
    totalScore?: number;
    teamMembers: TeamMember[];
}

export interface TeamMember {
    id: string;
    name: string;
}