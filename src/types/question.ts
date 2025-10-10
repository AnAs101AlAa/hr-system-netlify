export type QuestionType = "Essay" | "MCQ" | "Date" | "Number";

export type questionError = {questionIndex: number, questionText?: string, questionType?: string, choices?: string};

export interface EssayQuestion {
  questionType: "Essay";
  questionNumber: number;
  questionText: string;
  description?: string;
  maxLength?: number;
  isMandatory: boolean;
  isTextArea?: boolean;
}

export interface MCQQuestion {
  questionType: "MCQ";
  questionNumber: number;
  questionText: string;
  description?: string;
  choices: {text: string, choiceNumber: number}[];
  isMandatory: boolean;
  isMultiSelect: boolean;
}

export interface DateQuestion {
  questionType: "Date";
  questionNumber: number;
  questionText: string;
  description?: string;
  minDate?: string; 
  maxDate?: string; 
  isMandatory: boolean;
}

export interface NumberQuestion {
  questionType: "Number";
  questionNumber: number;
  questionText: string;
  description?: string;
  isInteger?: boolean; 
  isMandatory: boolean;
}

export interface UploadQuestion {
  questionType: "Upload";
  questionNumber: number;
  questionText: string;
  description?: string;
  isMandatory: boolean;
  maxFileSizeMB?: number; 
  allowedFileTypes: string[];
  allowMultiple: boolean;
}

export type Question = EssayQuestion | MCQQuestion | DateQuestion | NumberQuestion | UploadQuestion;

export type Answer = {qid: number, answer: string | number | string[] | File | File[]};
