import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query"
import * as formAPI from "./formAPI"
import type { form } from "@/types/form"
import type { Answer } from "@/types/question"

const formKeys = {
    all: ["forms"] as const,
    getForm: (formId: string) => [...formKeys.all, formId] as const,
    saveAnswer: (formId: string, questionId: number, answer: Answer, formName: string) => [...formKeys.getForm(formId), "saveAnswer", questionId, answer, formName] as const,
    submitForm: (formId: string, formName: string) => [...formKeys.getForm(formId), "submitForm", formName] as const,
}

export const useForm = (id: string): UseQueryResult<form, Error> => {
    return useQuery({
        queryKey: formKeys.getForm(id),
        queryFn: () => formAPI.getForm(id),
    })
}

export const useSaveAnswer = (formId: string, questionId: number, answer: Answer, formName: string) => {
    return useMutation({
        mutationKey: formKeys.saveAnswer(formId, questionId, answer, formName),
        mutationFn: () => formAPI.saveAnswer(formId, questionId, answer, formName),
    })
}

export const useSubmitForm = (formId: string, formName: string) => {
    return useMutation( {
        mutationKey: formKeys.submitForm(formId, formName),
        mutationFn: (answers: Answer[]) => formAPI.submitForm(formId, answers, formName),
    })
}