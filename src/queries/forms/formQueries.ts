import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query"
import * as formAPI from "./formAPI"
import type { form, serverRequestForm, serverResponseForm } from "@/types/form"
import type { Answer } from "@/types/question"
import { formRequestMapper, formResponseMapper } from "@/utils/FormMapping"

const formKeys = {
    all: ["forms"] as const,
    getForm: (formId: string) => [...formKeys.all, formId] as const,
    saveAnswer: (formId: string, questionId: number, answer: Answer, formName: string) => [...formKeys.getForm(formId), "saveAnswer", questionId, answer, formName] as const,
    submitForm: (formId: string, formName: string) => [...formKeys.getForm(formId), "submitForm", formName] as const,
}

export const useForms = (): UseQueryResult<form[], Error> => {
    return useQuery({
        queryKey: formKeys.all,
        queryFn: async () => {
            const data = await formAPI.getForms();
            const mappedForms = data.data.map((form : serverResponseForm) => formResponseMapper(form));
            return mappedForms;
        },
    })
}

export const useForm = (id: string): UseQueryResult<form, Error> => {
    return useQuery({
        queryKey: formKeys.getForm(id),
        queryFn: async () => {
            const data = await formAPI.getForm(id);
            const mappedForm = formResponseMapper(data.data as serverResponseForm);
            return mappedForm;
        },
        enabled: id != "new",
    })
}

export const useSaveAnswer = (formId: string, questionId: number, answer: Answer, formName: string) => {
    return useMutation({
        mutationKey: formKeys.saveAnswer(formId, questionId, answer, formName),
        mutationFn: () => formAPI.saveAnswer(formId, questionId, answer, formName),
    })
};

export const useSubmitForm = (formId: string, formName: string) => {
    return useMutation({
        mutationKey: formKeys.submitForm(formId, formName),
        mutationFn: (answers: Answer[]) => {
            const mappedAnswers = answers.map((ans) => {
                if (Array.isArray(ans.answer)) {
                    return ans.answer.join(",");
                } else if (typeof ans.answer === "number") {
                    return ans.answer.toString();
                } else if (typeof ans.answer === "string") {
                    return ans.answer;
                } else {
                    return "";
                }
            });
            return formAPI.submitForm(formId, mappedAnswers);
        },
    });
};

export const useCreateForm = () => {
    return useMutation( {
        mutationFn: (formData: form) => {
            const mappedFormData = formRequestMapper(formData) as serverRequestForm;
            return formAPI.createForm(mappedFormData);
        },
    })
}