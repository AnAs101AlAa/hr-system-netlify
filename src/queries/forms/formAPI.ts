import type { Answer } from "@/types/question";
import { systemApi } from "../axiosInstance";
import type { serverRequestForm } from "@/types/form";

const FORMS_API_URL = "/v1/Form";

export async function getForms() {
    const response = await systemApi.get(`${FORMS_API_URL}`);
    return response.data;
}

export async function getForm(formId: string) {
    const response = await systemApi.get(`${FORMS_API_URL}/${formId}`);
    return response.data
}

export async function saveAnswer(formId: string, questionId: number, answer: Answer, formName: string) {
    const response = await systemApi.post(`${FORMS_API_URL}${formId}/questions/${questionId}/answers`, { answer, formName });
    return response.data;
}

export async function submitForm(formId: string, answers: string[]) {
    const response = await systemApi.post(`${FORMS_API_URL}/${formId}/Response`, {response: answers})
    return response.data;
}

export async function createForm(formData: serverRequestForm) {
    const response = await systemApi.post(`${FORMS_API_URL}`, formData);
    return response.data;
}

export async function deleteForm(formId: string) {
    const response = await systemApi.delete(`${FORMS_API_URL}/${formId}`);
    return response.data;
}

export async function updateForm(formId: string, formData: serverRequestForm) {
    const response = await systemApi.put(`/v2/Form/${formId}`, formData);
    return response.data;
}