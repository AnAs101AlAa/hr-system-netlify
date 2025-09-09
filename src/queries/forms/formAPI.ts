import type { Answer } from "@/types/question";
import { api } from "../axiosInstance";
const FORMS_API_URL = api.defaults.baseURL + "form/"; //Speculatory endpoint, to be changed when backend is finalized

//Returns everything about a specific form
export async function getForm(formId: number) {
    const response = await api.get(`${FORMS_API_URL}${formId}`);
    return response.data
}

export async function saveAnswer(formId: number, questionId: number, answer: Answer) {
    const response = await api.post(`${FORMS_API_URL}${formId}/questions/${questionId}/answers`, answer);
    return response.data;
}

export async function submitForm(formId: number, answers: Answer[]) {
    const response = await api.post(`${FORMS_API_URL}${formId}/submit`, { answers})
    return response.data;
}