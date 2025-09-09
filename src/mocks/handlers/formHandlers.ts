import { api } from "@/queries/axiosInstance";
import type { form } from "@/types/form";
import { http, HttpResponse } from "msw";
import mockForms from "../mockForms";

const FORMS_API_URL = api.defaults.baseURL + "form/"

export const formHandlers = [
    http.get(`${FORMS_API_URL}:formId`, async ({params}) => {
        const formIdParam = params.formId;
        const formId = typeof formIdParam === "string"
            ? parseInt(formIdParam, 10)
            : Array.isArray(formIdParam) && formIdParam.length > 0
                ? parseInt(formIdParam[0], 10)
                : 0;
        return HttpResponse.json<form>(mockForms[formId], {status: 200, statusText: "OK"});
    }),
    http.post(`${FORMS_API_URL}:formId/submit`, async () => {
        return HttpResponse.json({ message: "Form submitted successfully"}, {status: 200, statusText: "OK"})
    })
];