export interface Choice {
  id: string;
  content: string;
}

export interface EssayQuestion {
  id: string;
  type: "Essay";
  question: string;
  maxLength?: number;
  isMandatory: boolean;
}

export interface MCQQuestion {
  id: string;
  type: "MCQ";
  question: string;
  choices: Choice[];
  isMandatory: boolean;
}

export interface DateQuestion {
  id: string;
  type: "Date";
  question: string;
  minDate?: string; 
  maxDate?: string; 
  isMandatory: boolean;
}

export interface NumberQuestion {
  id: string;
  type: "Number";
  question: string;
  isInteger?: boolean; 
  isMandatory: boolean;
}

export type Question = EssayQuestion | MCQQuestion | DateQuestion | NumberQuestion;

export type Answer = {qid: string, answer: string | number};
