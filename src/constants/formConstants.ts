import type { DateQuestion, MCQQuestion, EssayQuestion, NumberQuestion } from "@/types/question";

const SUBMISSION_CATCHER = {
    title: "finished",
    description: "You have successfully submitted the form. Thank you!",
    questions: [],
}

const QUESTION_TYPES = ["Essay", "MCQ", "Date", "Number"] as const;

type AllowedFields = {
  Essay: (keyof EssayQuestion)[];
  MCQ: (keyof MCQQuestion)[];
  Number: (keyof NumberQuestion)[];
  Date: (keyof DateQuestion)[];
};


const ALLOWED_FIELDS: AllowedFields = {
    Essay: ["questionText", "questionType", "maxLength", "isMandatory", "isTextArea", "questionNumber"],
    MCQ: ["questionText", "questionType", "choices", "isMandatory", "isMultiSelect", "questionNumber"],
    Date: ["questionText", "questionType", "minDate", "maxDate", "isMandatory", "questionNumber"],
    Number: ["questionText", "questionType", "isInteger", "isMandatory", "questionNumber"],
}

export { SUBMISSION_CATCHER, QUESTION_TYPES, ALLOWED_FIELDS };
export type { AllowedFields };