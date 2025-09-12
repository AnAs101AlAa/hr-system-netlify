import type { Question } from "./question";

export interface form { //Speculatory, to be finalized with backend
    id: number;
    title: string;
    description?: string;
    questions: Question[];
}