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
    Essay: ["question", "type", "maxLength", "isMandatory", "isTextArea", "id"],
    MCQ: ["question", "type", "choices", "isMandatory", "isMultiSelect", "id"],
    Date: ["question", "type", "minDate", "maxDate", "isMandatory", "id"],
    Number: ["question", "type", "isInteger", "isMandatory", "id"],
}

export { SUBMISSION_CATCHER, QUESTION_TYPES, ALLOWED_FIELDS };
export type { AllowedFields };