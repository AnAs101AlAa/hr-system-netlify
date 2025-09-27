export type QuestionType = "Essay" | "MCQ" | "Date" | "Number";

export type questionError = {questionIndex: number, questionText?: string, questionType?: string, choices?: string};

export interface EssayQuestion {
  questionType: "Essay";
  questionNumber: number;
  questionText: string;
  maxLength?: number;
  isMandatory: boolean;
  isTextArea?: boolean;
}

export interface MCQQuestion {
  questionType: "MCQ";
  questionNumber: number;
  questionText: string;
  choices: {text: string}[];
  isMandatory: boolean;
  isMultiSelect: boolean;
}

export interface DateQuestion {
  questionType: "Date";
  questionNumber: number;
  questionText: string;
  minDate?: string; 
  maxDate?: string; 
  isMandatory: boolean;
}

export interface NumberQuestion {
  questionType: "Number";
  questionNumber: number;
  questionText: string;
  isInteger?: boolean; 
  isMandatory: boolean;
}

export type Question = EssayQuestion | MCQQuestion | DateQuestion | NumberQuestion;

export type Answer = {qid: number, answer: string | number | string[]};
