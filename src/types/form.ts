import type { Question, Answer, questionError } from "./question";

export interface formPage {
    id?: string;
    title: string;
    description: string;
    questions: Question[];
    toBranch?: { [questionId: number]: { assertOn: string, targetPage: number } };
    toBranches? : serverResponseBranch[];
}

export interface serverRequestForm {
    googleSheetId: string;
    sheetName: string;
    title: string;
    description: string;
    pages: formPage[];
    branches?: { sourcePageNumber: number; questionNumber: number; assertOn: string; targetPageNumber: number }[];
};

export interface serverRequestBranch {
    sourcePageNumber: number;
    questionNumber: number;
    assertOn: string;
    targetPageNumber: number;
};

export interface serverResponseForm {
    formId: string;
    sheetName: string;
    googleSheetId: string;
    title: string;
    description: string;
    pages: formPage[];
    branches: serverResponseBranch[];
};

export interface serverResponseBranch {
    assertOn : string;
    sourcePageNumber : number;
    questionNumber : number;
    targetPageNumber : number;
    id: string;
    questionId: string;
    sourcePageId: string;
    targetPageId: string;
}

export interface formPageError {
    pageIndex: number;
    title: string;
    description: string;
    questionCount?: string;
    questions: questionError[];
    toBranchErrors?: string[];
}

export interface form {
    id: string;
    googleSheetId: string;
    sheetName: string;
    pages: formPage[];
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}


export interface clientSideBranch {
    [questionId: number]: { assertOn: string, targetPage: number }
};

export type QuestionCardHandle = { validate: () => boolean, collect: () => Answer, clear: () => void, reassign: (answer: Answer) => void };

export type FormEditorHandle = { collect: () => boolean };
