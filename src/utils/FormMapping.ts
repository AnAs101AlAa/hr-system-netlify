import type {
  formPage,
  serverResponseBranch,
  serverRequestForm,
  form,
  serverRequestBranch,
  serverResponseForm,
} from "../types/form";
import type {
  EssayQuestion,
  MCQQuestion,
  DateQuestion,
  NumberQuestion,
  UploadQuestion,
} from "../types/question";
import { StringTagFormatter, TagStringFormatter } from "./StringTagFormater";

export const formBranchMapper = (
  pages?: formPage[]
) => {
    const mappedBranches: serverRequestBranch[] = [];
    pages?.forEach((page, pageIndex) => {
      if (page.toBranch) {
        Object.entries(page.toBranch).forEach(([questionId, branchData]) => {
          mappedBranches.push({
            sourcePageNumber: pageIndex,
            questionNumber: Number(questionId),
            assertOn: branchData.assertOn,
            targetPageNumber: branchData.targetPage,
          });
        });
      }
    });
    return mappedBranches;
};

export const formRequestMapper = (formData: form) => {
    const mappedBranches = formBranchMapper(
      formData.pages
    ) as serverResponseBranch[];

    const mappedPages = formData.pages?.map((page, index) => ({
      title: page.title,
      description: StringTagFormatter(page.description) as string,
      pageNumber: index,
      questions: page.questions
        .map((q) => {
          switch (q.questionType) {
            case "Essay":
              return {
                questionType: "Essay",
                questionNumber: q.questionNumber,
                questionText: q.questionText,
                description: StringTagFormatter(q.description),
                isMandatory: q.isMandatory,
                ...(q.maxLength !== undefined ? { maxLength: q.maxLength } : {}),
                ...(q.isTextArea !== undefined
                  ? { isTextArea: q.isTextArea }
                  : {}),
              } satisfies EssayQuestion;

            case "MCQ":
              return {
                questionType: "MCQ",
                questionNumber: q.questionNumber,
                questionText: q.questionText,
                description: StringTagFormatter(q.description),
                isMandatory: q.isMandatory,
                choices: q.choices,
                isMultiSelect: q.isMultiSelect,
              } satisfies MCQQuestion;

            case "Date":
              return {
                questionType: "Date",
                questionNumber: q.questionNumber,
                questionText: q.questionText,
                description: StringTagFormatter(q.description),
                isMandatory: q.isMandatory,
              } satisfies DateQuestion;

            case "Number":
              return {
                questionType: "Number",
                questionNumber: q.questionNumber,
                questionText: q.questionText,
                description: StringTagFormatter(q.description),
                isMandatory: q.isMandatory,
              } satisfies NumberQuestion;
            case "Upload":
              return {
                questionType: "Upload",
                questionNumber: q.questionNumber,
                questionText: q.questionText,
                description: StringTagFormatter(q.description),
                isMandatory: q.isMandatory,
                maxFileSizeMB: q.maxFileSizeMB,
                allowedFileTypes: q.allowedFileTypes,
                allowMultiple: q.allowMultiple,
              } satisfies UploadQuestion;

            default:
              return undefined;
          }
        })
        .filter((q) => q !== undefined),
    }));

    const formDataWithBranches: serverRequestForm = {
      googleSheetId: formData.googleSheetId,
      formType: formData.formType,
      googleDriveId: formData.googleDriveId,
      pages: mappedPages || [],
      branches: mappedBranches,
      title: formData.title,
      isClosed: formData.isClosed,
      sheetName: formData.sheetName,
      description: StringTagFormatter(formData.description) as string,
    };

    return formDataWithBranches;
}

export const formResponseMapper = (formData: serverResponseForm, formTags: boolean) => {
    const mappedPages = formData.pages?.map((page) => ({
        ...page,
        id: crypto.randomUUID(),
        description: formTags ? (page.description ? StringTagFormatter(page.description) as string : undefined) : page.description,
        toBranch: page.toBranches ? page.toBranches.map((branch) => ({
            [branch.questionNumber]: {
                assertOn: branch.assertOn,
                targetPage: branch.targetPageNumber,
            }
        }))[0] : undefined
    }));

    return {
        id: formData.formId,
        title: formData.title,
        formType: formData.formType,
        description: formTags ? (formData.description ? TagStringFormatter(formData.description) as string : undefined) : formData.description,
        pages: mappedPages,
        googleSheetId: formData.googleSheetId,
        googleDriveId: formData.googleDriveId,
        sheetName: formData.sheetName,
        createdAt: formData.createdAt,
        isClosed: formData.isClosed,
        updatedAt: formData.updatedOn,
    } as form;
};

export const formLocalMapper = () => {
  const formData = localStorage.getItem("previewFormData");
  if(formData) {
    const parsedFormData: form = JSON.parse(formData);
    return {
        id: parsedFormData.id,
        title: parsedFormData.title,
        formType: parsedFormData.formType,
        description: StringTagFormatter(parsedFormData.description) as string,
        pages: parsedFormData.pages.map((page) => ({
            ...page,
            description: StringTagFormatter(page.description) as string,
        })),
        googleSheetId: parsedFormData.googleSheetId,
        googleDriveId: parsedFormData.googleDriveId,
        sheetName: parsedFormData.sheetName,
        createdAt: parsedFormData.createdAt,
        isClosed: parsedFormData.isClosed,
        updatedAt: parsedFormData.updatedAt,
    } as form;
  } else {
    return {} as form;
  }
}