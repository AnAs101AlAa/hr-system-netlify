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
} from "../types/question";

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
      description: page.description,
      pageNumber: index,
      questions: page.questions.map((q) => {
        switch (q.questionType) {
          case "Essay":
            return {
              questionType: "Essay",
              questionNumber: q.questionNumber,
              questionText: q.questionText,
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
              isMandatory: q.isMandatory,
              choices: q.choices,
              isMultiSelect: q.isMultiSelect,
            } satisfies MCQQuestion;

          case "Date":
            return {
              questionType: "Date",
              questionNumber: q.questionNumber,
              questionText: q.questionText,
              isMandatory: q.isMandatory,
            } satisfies DateQuestion;

          case "Number":
            return {
              questionType: "Number",
              questionNumber: q.questionNumber,
              questionText: q.questionText,
              isMandatory: q.isMandatory,
            } satisfies NumberQuestion;
        }
      }),
    }));

    const formDataWithBranches: serverRequestForm = {
      googleSheetId: formData.googleSheetId,
      pages: mappedPages || [],
      branches: mappedBranches,
      title: formData.title,
      sheetName: formData.sheetName,
      description: formData.description,
    };

    return formDataWithBranches;
}

export const formResponseMapper = (formData: serverResponseForm) => {
    const mappedPages = formData.pages?.map((page) => ({
        ...page,
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
        description: formData.description,
        pages: mappedPages,
        googleSheetId: formData.googleSheetId,
        sheetName: formData.sheetName,
        createdAt: "",
        updatedAt: "",
    } as form;
    };