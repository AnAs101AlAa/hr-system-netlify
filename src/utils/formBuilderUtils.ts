import { ALLOWED_FIELDS } from "@/constants/formConstants";
import type { AllowedFields } from "@/constants/formConstants";
import type { formPageError } from "@/types/form";
import type { questionError } from "@/types/question";

function sanitize<T extends keyof AllowedFields>(
    obj: Record<string, any>,
    type: T
): Pick<typeof obj, AllowedFields[T][number]> {
    const allowed = new Set(ALLOWED_FIELDS[type]);
    const result: any = {};
    for (const key of Object.keys(obj)) {
        if (allowed.has(key as any)) {
        result[key] = obj[key];
        }
    }
    return result;
    }

function addQuestionError(errors: formPageError[], pIndex: number, qIndex: number, newError: Partial<Omit<questionError, "questionIndex">>
) {
    const pageError = errors[pIndex] || {};
    const questions = [...(pageError.questions || [])];

    const existing = questions.find((q) => q.questionIndex === qIndex);
    if (existing) {
        Object.assign(existing, newError);
    } else {
        questions.push({ questionIndex: qIndex, ...newError });
    }

    errors[pIndex] = { ...pageError, questions };
}

export { sanitize, addQuestionError };