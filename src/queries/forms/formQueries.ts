import { useMutation, useQuery, type UseQueryResult } from "@tanstack/react-query"
import * as formAPI from "./formAPI"
import type { form } from "@/types/form"
import type { Answer } from "@/types/question"

const formKeys = {
    all: ["forms"] as const,
    getForm: (formId: number) => [...formKeys.all, formId] as const,
    saveAnswer: (formId: number, questionId: number, answer: Answer) => [...formKeys.getForm(formId), "saveAnswer", questionId, answer] as const,
    submitForm: (formId: number, answers: Answer[]) => [...formKeys.getForm(formId), "submitForm", answers] as const,
}

export const useForm = (id: number): UseQueryResult<form, Error> => {
    return useQuery({
        queryKey: formKeys.getForm(id),
        queryFn: () => formAPI.getForm(id),
    })
}

export const useSaveAnswer = (formId: number, questionId: number, answer: Answer) => {
    return useMutation({
        mutationKey: formKeys.saveAnswer(formId, questionId, answer),
        mutationFn: () => formAPI.saveAnswer(formId, questionId, answer),
    })
}

export const useSubmitForm = (formId: number, answers: Answer[]) => {
    return useMutation({
        mutationKey: formKeys.submitForm(formId, answers),
        mutationFn: () => formAPI.submitForm(formId, answers),
    })
}