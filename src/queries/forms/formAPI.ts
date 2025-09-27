import type { Answer } from "@/types/question";
import { formsApi } from "../axiosInstance";
import type { serverRequestForm } from "@/types/form";

const FORMS_API_URL = formsApi.defaults.baseURL + "/v1/Form";

export async function getForms() {
    const response = await formsApi.get(`${FORMS_API_URL}`);
    return response.data;
}

export async function getForm(formId: string) {
    const response = await formsApi.get(`${FORMS_API_URL}/${formId}`);
    return response.data
}

export async function saveAnswer(formId: string, questionId: number, answer: Answer, formName: string) {
    const response = await formsApi.post(`${FORMS_API_URL}${formId}/questions/${questionId}/answers`, { answer, formName });
    return response.data;
}

export async function submitForm(formId: string, answers: string[]) {
    const response = await formsApi.post(`${FORMS_API_URL}/${formId}/Response`, {response: answers})
    return response.data;
}

export async function createForm(formData: serverRequestForm) {
    const response = await formsApi.post(`${FORMS_API_URL}`, formData);
    return response.data;
}