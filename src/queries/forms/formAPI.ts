import type { Answer } from "@/types/question";
import { api } from "../axiosInstance";
const FORMS_API_URL = api.defaults.baseURL + "form/"; //Speculatory endpoint, to be changed when backend is finalized

//Returns everything about a specific form
export async function getForm(formId: string) {
    const response = await api.get(`${FORMS_API_URL}${formId}`);
    return response.data
}

export async function saveAnswer(formId: string, questionId: number, answer: Answer, formName: string) {
    const response = await api.post(`${FORMS_API_URL}${formId}/questions/${questionId}/answers`, { answer, formName });
    return response.data;
}

export async function submitForm(formId: string, answers: Answer[], formName: string) {
    const response = await api.post(`${FORMS_API_URL}${formId}/submit`, { answers, formName })
    return response.data;
}