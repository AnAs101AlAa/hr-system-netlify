import { z } from "zod";

export const essayAnswerSchema = z.object({
  qid: z.number(),
  answer: z.string(),
});

export const mcqAnswerSchema = z.object({
  qid: z.number(),
  answer: z.array(z.number()).min(1, "Please select at least one option"),
});

export const dateAnswerSchema = z.object({
  qid: z.number(),
  answer: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const numberAnswerSchema = z.object({
  qid: z.number(),
  answer: z.number(),
});

export const createEssayValidationSchema = (question: {
  maxLength?: number;
  isMandatory: boolean;
}) => {
  let schema = z.string();

  if (question.isMandatory) {
    schema = schema.min(1, "This field is required");
  }

  if (question.maxLength) {
    schema = schema.max(question.maxLength, `Maximum ${question.maxLength} characters allowed`);
  }

  return schema;
};

export const createMCQValidationSchema = (isMandatory: boolean, isMultipleChoice: boolean) => {
  let schema = z.array(z.number());

  if (isMandatory) {
    schema = schema.min(1, "Please select at least one option");
  }

  if (!isMultipleChoice) {
    schema = schema.max(1, "Please select only one option");
  }

  return schema;
};

export const createDateValidationSchema = (question: {
  minDate?: string;
  maxDate?: string;
  isMandatory: boolean;
}) => {
  let schema = z.string();

  if (question.isMandatory) {
    schema = schema.min(1, "Please select a date");
  }

  schema = schema.regex(/^\d{4}-\d{2}-\d{2}$|^$/, "Invalid date format");

  if (question.minDate) {
    schema = schema.refine(
      (val) => !val || new Date(val) >= new Date(question.minDate!),
      `Date must be on or after ${question.minDate}`
    );
  }

  if (question.maxDate) {
    schema = schema.refine(
      (val) => !val || new Date(val) <= new Date(question.maxDate!),
      `Date must be on or before ${question.maxDate}`
    );
  }

  return schema;
};

export const createNumberValidationSchema = (question: {
  minValue?: number;
  maxValue?: number;
  isInteger?: boolean;
  decimalPlaces?: number;
  isMandatory: boolean;
}) => {
  if (question.isMandatory) {
    let schema = z.number();

    if (question.minValue !== undefined) {
      schema = schema.min(question.minValue, `Value must be at least ${question.minValue}`);
    }

    if (question.maxValue !== undefined) {
      schema = schema.max(question.maxValue, `Value must be at most ${question.maxValue}`);
    }

    if (question.isInteger) {
      schema = schema.int("Value must be a whole number");
    }

    if (question.decimalPlaces !== undefined && !question.isInteger) {
      schema = schema.refine(
        (val) => {
          const decimalCount = (val.toString().split('.')[1] || '').length;
          return decimalCount <= question.decimalPlaces!;
        },
        `Maximum ${question.decimalPlaces} decimal places allowed`
      );
    }

    return schema;
  } else {
    let schema = z.number().optional();

    if (question.minValue !== undefined) {
      schema = schema.refine(
        (val) => val === undefined || val >= question.minValue!,
        `Value must be at least ${question.minValue}`
      );
    }

    if (question.maxValue !== undefined) {
      schema = schema.refine(
        (val) => val === undefined || val <= question.maxValue!,
        `Value must be at most ${question.maxValue}`
      );
    }

    if (question.isInteger) {
      schema = schema.refine(
        (val) => val === undefined || Number.isInteger(val),
        "Value must be a whole number"
      );
    }

    if (question.decimalPlaces !== undefined && !question.isInteger) {
      schema = schema.refine(
        (val) => {
          if (val === undefined) return true;
          const decimalCount = (val.toString().split('.')[1] || '').length;
          return decimalCount <= question.decimalPlaces!;
        },
        `Maximum ${question.decimalPlaces} decimal places allowed`
      );
    }

    return schema;
  }
};

export type EssayAnswerFormData = z.infer<typeof essayAnswerSchema>;
export type MCQAnswerFormData = z.infer<typeof mcqAnswerSchema>;
export type DateAnswerFormData = z.infer<typeof dateAnswerSchema>;
export type NumberAnswerFormData = z.infer<typeof numberAnswerSchema>;
