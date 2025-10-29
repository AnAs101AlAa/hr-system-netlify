import type { Answer } from "@/shared/types/question";
import { systemApi } from "../axiosInstance";
import type { serverRequestForm } from "@/shared/types/form";

const FORMS_API_URL = "/v1/Form";

export async function getForms(page: number, count: number, createdAfter: string, searchKey: string, selectedType: string, sortBy: string) {
  let sortKey: string | undefined = undefined;
  let order: string | undefined = undefined;

  if (sortBy) {
    if (sortBy === "CreatedAtDesc" || sortBy === "CreatedAtAsc") {
      sortKey = "CreatedAt";
      order = sortBy === "CreatedAtDesc" ? "Desc" : "Asc";
    } else {
      sortKey = "Title";
      order = sortBy === "az" ? "Asc" : "Desc";
    }
  }

  const params: Record<string, any> = {
    page,
    count,
  };

  if (searchKey) params.Title = searchKey;
  if (createdAfter) params.CreatedAfter = createdAfter;
  if (sortKey) params.SortBy = sortKey;
  if (order) params.Order = order;
  if (selectedType && selectedType !== "All") params.FormType = selectedType;

  const response = await systemApi.get(`${FORMS_API_URL}`, { params });
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
    const response = await systemApi.put(`${FORMS_API_URL}/${formId}`, formData);
    return response.data;
}

export async function modifyFormStatus(formId: string, isClosed: boolean) {
    const response = await systemApi.patch(`${FORMS_API_URL}/${formId}/status`, { isClosed });
    return response.data;
}

export async function uploadSubmissionMedia(formId: string, media: File) {
  const formData = new FormData();
  formData.append("file", media);

  const response = await systemApi.post(
    `${FORMS_API_URL}/${formId}/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 0,
    }
  );

  return response.data.data.webUrl;
}
