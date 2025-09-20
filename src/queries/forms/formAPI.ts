import type { Answer } from "@/types/question";
import { formsApi } from "../axiosInstance";
import type { form } from "@/types/form";

const FORMS_API_URL = formsApi.defaults.baseURL + "/form/";

export async function getForms() {
    const response = await formsApi.get(`${FORMS_API_URL}`);
    return response.data;
}

export async function getForm(formId: string) {
    const response = await formsApi.get(`${FORMS_API_URL}${formId}`);
    return response.data
}

export async function saveAnswer(formId: string, questionId: number, answer: Answer, formName: string) {
    const response = await formsApi.post(`${FORMS_API_URL}${formId}/questions/${questionId}/answers`, { answer, formName });
    return response.data;
}

export async function submitForm(formId: string, answers: Answer[], formName: string) {
    const response = await formsApi.post(`${FORMS_API_URL}${formId}/submit`, { answers, formName })
    return response.data;
}

export async function createForm(formData: form) {
    const response = await formsApi.post(`${FORMS_API_URL}`, formData);
    return response.data;
}