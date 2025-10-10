import type { DateQuestion, MCQQuestion, EssayQuestion, NumberQuestion, UploadQuestion } from "@/types/question";

const SUBMISSION_CATCHER = {
    title: "finished",
    description: "You have successfully submitted the form. Thank you!",
    questions: [],
}

const QUESTION_TYPES = ["Essay", "MCQ", "Date", "Number", "Upload"] as const;

type AllowedFields = {
  Essay: (keyof EssayQuestion)[];
  MCQ: (keyof MCQQuestion)[];
  Number: (keyof NumberQuestion)[];
  Date: (keyof DateQuestion)[];
  Upload: (keyof UploadQuestion)[];
};


const ALLOWED_FIELDS: AllowedFields = {
    Essay: ["questionText", "questionType", "maxLength", "isMandatory", "isTextArea", "questionNumber", "description"],
    MCQ: ["questionText", "questionType", "choices", "isMandatory", "isMultiSelect", "questionNumber", "description"],
    Date: ["questionText", "questionType", "minDate", "maxDate", "isMandatory", "questionNumber", "description"],
    Number: ["questionText", "questionType", "isInteger", "isMandatory", "questionNumber", "description"],
    Upload: ["questionText", "questionType", "isMandatory", "maxFileSizeMB", "allowedFileTypes", "questionNumber", "description"],
}

export { SUBMISSION_CATCHER, QUESTION_TYPES, ALLOWED_FIELDS };
export type { AllowedFields };