export interface Choice {
  id: number;
  content: string;
}

export interface EssayQuestion {
  id: number;
  type: "Essay";
  question: string;
  maxLength?: number;
  isMandatory: boolean;
}

export interface MCQQuestion {
  id: number;
  type: "MCQ";
  question: string;
  choices: Choice[];
  isMandatory: boolean;
  isMultiSelect: boolean;
}

export interface DateQuestion {
  id: number;
  type: "Date";
  question: string;
  minDate?: string; 
  maxDate?: string; 
  isMandatory: boolean;
}

export interface NumberQuestion {
  id: number;
  type: "Number";
  question: string;
  isInteger?: boolean; 
  isMandatory: boolean;
}

export type Question = EssayQuestion | MCQQuestion | DateQuestion | NumberQuestion;

export type Answer = {qid: number, answer: string | number | string[]};
