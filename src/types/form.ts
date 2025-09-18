import type { Question, Answer } from "./question";

export interface formPage {
    title: string;
    description?: string;
    questions: Question[];
    toBranch?: { [questionId: number]: { assertOn: string, targetPage: number } };
}

export interface form { //Speculatory, to be finalized with backend
    id: number;
    sheetName: string;
    pages: formPage[];
    title: string;
    description?: string;
}

export type QuestionCardHandle = { validate: () => boolean, collect: () => Answer, clear: () => void, reassign: (answer: Answer) => void };
