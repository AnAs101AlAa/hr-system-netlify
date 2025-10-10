import { DropdownMenu, InputField, NumberField, TextAreaField, Button, ButtonTypes } from "tccd-ui";
import { FaXmark } from "react-icons/fa6";
import type { form, formPage, formPageError } from "@/types/form";
import type { Question } from "@/types/question";
import toast from "react-hot-toast";
import { QUESTION_TYPES } from "@/constants/formConstants";
import { useState } from "react";
import BranchInfo from "./BranchInfo";
import { forwardRef, useImperativeHandle } from "react";
import { sanitize, addQuestionError} from "@/utils/formBuilderUtils";

interface PagesInfoProps {
    formDataState: form;
    questionCount: number;
    setQuestionCount: React.Dispatch<React.SetStateAction<number>>;
    setFormDataState: React.Dispatch<React.SetStateAction<form>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, toChange: string, index?: number, field?: string) => void;
}

const PagesInfo = forwardRef(({ formDataState, setFormDataState, handleInputChange, questionCount, setQuestionCount }: PagesInfoProps, ref) => {
    const [choiceTextBuffer, setChoiceTextBuffer] = useState<string>("");
    const [pageErrors, setPageErrors] = useState<{[index: number]: formPageError}>({});
    const [mainError, setMainError] = useState<string>("");

    const handleAddPage = () => {
        setFormDataState((prev) => {
            if (!prev) return prev;
            const newPage: formPage = {title: `Page ${prev.pages ? prev.pages.length + 1 : 1}`, description: "", questions: []};
            return { ...prev, pages: [...(prev.pages || []), newPage] };
        });
    }

    const handleAddQuestion = (pageIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const newQuestion : Question = { questionNumber: questionCount + 1, questionText: "", questionType: "Essay", isMandatory: false };
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: [...(updatedPages[pageIndex].questions || []), newQuestion] };
            setQuestionCount(questionCount + 1);
            return { ...prev, pages: updatedPages };
        });
    }

    const handleRemoveQuestion = (pageIndex: number, questionIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const updatedQuestions = (updatedPages[pageIndex].questions || [])
                .filter((_, idx) => idx !== questionIndex)
                .map((q, idx) => ({ ...q, questionNumber: idx + 1 })); // Re-assign ids
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
            return { ...prev, pages: updatedPages };
        });
    }

    const handleQuestionChange = (index: number, pageIndex: number, field: string, value: string | string[] | boolean | number | null) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            if (value === null) {
                const updatedPages = [...prev.pages];
                const updatedQuestions = [...(updatedPages[pageIndex].questions || [])];
                delete (updatedQuestions[index] as any)[field];
                updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
                return { ...prev, pages: updatedPages };
            } else {
                const updatedPages = [...prev.pages];
                const updatedQuestions = [...(updatedPages[pageIndex].questions || [])];
                updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
                updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
                return { ...prev, pages: updatedPages };
            }
        });
    }

    const handleAddChoice = (questionIndex: number, pageIndex: number) => {
        if (choiceTextBuffer.trim() === "") {
            toast.error("Choice text cannot be empty");
            return;
        }
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const updatedQuestions = [...(updatedPages[pageIndex].questions || [])];
            const question = updatedQuestions[questionIndex];
            if (question.questionType !== "MCQ") {
                toast.error("Choices can only be added to MCQ type questions");
                return prev;
            }
            const newChoice = { text: choiceTextBuffer, choiceNumber: (question.choices ? question.choices.length : 0) + 1 };
            updatedQuestions[questionIndex] = { ...question, choices: [...(question.choices || []), newChoice] };
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
            return { ...prev, pages: updatedPages };
        });
        setChoiceTextBuffer("");
    }

    const handleRemoveChoice = (questionIndex: number, pageIndex: number, choiceIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const updatedQuestions = [...(updatedPages[pageIndex].questions || [])];
            const question = updatedQuestions[questionIndex];
            if (question.questionType !== "MCQ" || !question.choices) {
                toast.error("Invalid operation");
                return prev;
            }
            // Remove the choice and reassign choiceNumber
            const updatedChoices = question.choices
                .filter((_, idx) => idx !== choiceIndex)
                .map((choice, idx) => ({ ...choice, choiceNumber: idx + 1 }));
            updatedQuestions[questionIndex] = { ...question, choices: updatedChoices };
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
            return { ...prev, pages: updatedPages };
        });
    }

    const validatePages = (): boolean => {
        const currentPageErrors: formPageError[] = [];

        const sanitizedPages = formDataState.pages?.map((page) => ({...page,questions: page.questions?.map((q) => sanitize(q, q.questionType))})) || [];
        
        if(!formDataState.pages || formDataState.pages.length === 0) {
            setMainError("At least one page is required.");
            return true;
        }

        sanitizedPages.forEach((page, pIndex) => {
            if (!page.title || page.title.trim() === "") {
            currentPageErrors[pIndex] = {
                ...(currentPageErrors[pIndex] || {}),
                title: "Page title is required.",
            };
            }
            if (!page.description || page.description.trim() === "") {
            currentPageErrors[pIndex] = {
                ...(currentPageErrors[pIndex] || {}),
                description: "Page description is required.",
            };
            }
            if (!page.questions || page.questions.length === 0) {
            currentPageErrors[pIndex] = {
                ...(currentPageErrors[pIndex] || {}),
                questionCount: "At least one question is required on this page.",
            };
            }

            page.questions?.forEach((question, qIndex) => {
                if (!question.questionText || question.questionText.trim() === "") {
                    addQuestionError(currentPageErrors, pIndex, qIndex, {
                    questionText: "Question text is required.",
                    });
                }
                if (!question.questionType || !QUESTION_TYPES.includes(question.questionType)) {
                    addQuestionError(currentPageErrors, pIndex, qIndex, {
                    questionType: "Invalid question type.",
                    });
                }
                if (question.questionType === "MCQ" && (!question.choices || question.choices.length === 0)) {
                    addQuestionError(currentPageErrors, pIndex, qIndex, {
                    choices: "Question must have at least one choice.",
                    });
                }
            });

            if (page.toBranch) {
                const branchTargets = Object.values(page.toBranch) as {assertOn: string; targetPage: number;}[];
                const questionNumbers = Object.keys(page.toBranch).map((qNum) => parseInt(qNum));

                if (branchTargets.some((branch) => branch.targetPage > formDataState.pages!.length)) {
                    currentPageErrors[pIndex] = {
                    ...(currentPageErrors[pIndex] || {}),
                    toBranchErrors: [
                        ...(currentPageErrors[pIndex]?.toBranchErrors || []),
                        "Has a branch target that is out of range.",
                    ],
                    };
                }

                if (questionNumbers.some((qNum) => !page.questions.some((q) => q.questionNumber === qNum))) {
                    currentPageErrors[pIndex] = {
                    ...(currentPageErrors[pIndex] || {}),
                    toBranchErrors: [
                        ...(currentPageErrors[pIndex]?.toBranchErrors || []),
                        "Has a branch that references a non-existent question.",
                    ],
                    };
                }

                if (branchTargets.some((branch) => branch.targetPage <= pIndex)) {
                    currentPageErrors[pIndex] = {
                    ...(currentPageErrors[pIndex] || {}),
                    toBranchErrors: [
                        ...(currentPageErrors[pIndex]?.toBranchErrors || []),
                        "Has a branch that targets a previous or the current page.",
                    ],
                    };
                }
            }
        });

        setPageErrors(currentPageErrors);
        setFormDataState((prev) => ({ ...prev, pages: sanitizedPages }));
        return currentPageErrors.length !== 0;
    };

    useImperativeHandle(ref, () => ({
        collect: validatePages
    }));

    const handleAddBranch = (pageIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], toBranch: {0: {assertOn: "example answer", targetPage: pageIndex}} };
            return { ...prev, pages: updatedPages };
        });
    }

    return (
        <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
            <p className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-primary">
                Form Pages
            </p>
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Add and manage the pages of your form. Each page can contain multiple questions.
            </p>
            {formDataState?.pages && formDataState.pages.length > 0 ? (
                formDataState.pages.map((page, index) => (
                    <div key={index} className="p-4 border border-gray-300 rounded-md space-y-3">
                        <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text">Primary information</p>
                        <InputField label="Page Title" id={`page-title-${index}`} value={page.title} placeholder="Enter page title" onChange={(e) => handleInputChange(e, "pages", index, "title")} error={pageErrors[index]?.title} />
                        {pageErrors[index]?.title && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.title}</p>}

                        <TextAreaField label="Page Description" id={`page-description-${index}`} value={page.description || ""} placeholder="Enter page description" onChange={(e) => handleInputChange(e, "pages", index, "description")} error={pageErrors[index]?.description} />
                        {pageErrors[index]?.description && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.description}</p>}

                        <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text mt-4">Questions</p>
                        {page.questions && page.questions.length > 0 ? (
                            page.questions.map((question, qIndex) => (
                                <div key={qIndex} className="p-3 border border-gray-200 rounded-md bg-white space-y-3 flex flex-wrap lg:gap-[2%] relative">
                                    <FaXmark className="text-primary cursor-pointer size-4 md:size-5 absolute right-4 top-4" onClick={() => handleRemoveQuestion(index, qIndex)} />
                                    <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text">Question {qIndex + 1}</p>
                                    <InputField label="Question Text" id={`question-text-${index}-${qIndex}`} value={question.questionText} placeholder="Enter question text" onChange={(e) => handleQuestionChange(qIndex, index, "questionText", e.target.value)} error={pageErrors[index]?.questions?.[qIndex]?.questionText ?? ""} />
                                    <TextAreaField label="Question Description (optional)" id={`question-description-${index}-${qIndex}`} value={question.description || ""} placeholder="Enter question description" onChange={(e) => handleQuestionChange(qIndex, index, "description", e.target.value)} />
                                    <div className="w-full lg:w-[49%]">
                                        <DropdownMenu options={QUESTION_TYPES.map((type) => ({ label: type, value: type }))} value={question.questionType} onChange={(selected) => handleQuestionChange(qIndex, index, "questionType", selected)} label="Question Type" />
                                    </div>
                                    <div className="w-full lg:w-[49%]">
                                        <DropdownMenu options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} value={question.isMandatory ? "true" : "false"} onChange={(selected) => handleQuestionChange(qIndex, index, "isMandatory", selected === "true")} label="Is Required" />
                                    </div>
                                    {question.questionType === "Essay" && (
                                        <>
                                        <div className="w-full lg:w-[49%]">
                                            <DropdownMenu options={[{ label: "multiline", value: "true" }, { label: "single line", value: "false" }]} value={question.isTextArea ? "true" : "false"} onChange={(selected) => handleQuestionChange(qIndex, index, "isTextArea", selected === "true")} label="Answer Format" />
                                        </div>
                                        <div className="w-full lg:w-[49%]">
                                            <NumberField label="Character Limit" id={`question-charlimit-${index}-${qIndex}`} value={question.maxLength ? question.maxLength.toString() : ""} placeholder="e.g. 250" onChange={(e) => handleQuestionChange(qIndex, index, "maxLength", e.target.value !== "" ? parseInt(e.target.value) : null)} />
                                        </div>
                                        </>
                                    )}
                                    {question.questionType === "MCQ" && (
                                        <div className="w-full space-y-3">
                                        <p className="text-label text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold">Added Choices</p>
                                        {question.choices && question.choices.length > 0 ? (
                                            <div className="w-full mb-2">
                                            {question.choices.map((choice, cIndex) => (
                                                <div key={cIndex} className="flex items-center justify-between w-full gap-2 my-3">
                                                    <p className="text-[14px] md:text-[15px] lg:text-[16px]">{cIndex+1 + ". " + choice.text}</p>
                                                    <FaXmark className="text-primary cursor-pointer size-4 md:size-5" onClick={() => handleRemoveChoice(qIndex, index, cIndex)} />
                                                </div>
                                            ))}
                                            </div>) : (
                                                <p className="text-sm text-gray-600">No choices added yet.</p>
                                        )}
                                        <div className="flex gap-2 items-end w-full justify-between">
                                            <div className="max-w-3/4 md:max-w-none w-full">
                                                <InputField label="Add Choice" id={`question-add-choice-${index}-${qIndex}`} value={choiceTextBuffer} placeholder="Enter choice text" onChange={(e) => setChoiceTextBuffer(e.target.value)} />
                                            </div>
                                            <Button type={ButtonTypes.SECONDARY} onClick={() => handleAddChoice(qIndex, index)} buttonText="+"/>
                                        </div>
                                        <DropdownMenu options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} value={question.isMultiSelect ? "true" : "false"} onChange={(selected) => handleQuestionChange(qIndex, index, "isMultiSelect", selected === "true")} label="Allow Multiple Answers" />
                                        </div>
                                    )}
                                    {question.questionType === "Upload" && (
                                        <>
                                        <div className="w-full lg:w-[49%]">
                                            <NumberField label="Max File Size (MB)" id={`question-maxfilesize-${index}-${qIndex}`} value={question.maxFileSizeMB ? question.maxFileSizeMB.toString() : ""} placeholder="e.g. 5" onChange={(e) => handleQuestionChange(qIndex, index, "maxFileSizeMB", e.target.value !== "" ? parseInt(e.target.value) : null)} />
                                        </div>
                                        <div className="w-full lg:w-[49%]">
                                            <DropdownMenu options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} value={question.allowMultiple ? "true" : "false"} onChange={(selected) => handleQuestionChange(qIndex, index, "allowMultiple", selected === "true")} label="Allow Multiple Files" />
                                        </div>
                                        <div className="w-full">
                                            <InputField label="Allowed File Types (comma separated, e.g. .pdf, .docx)" id={`question-allowedfiletypes-${index}-${qIndex}`} value={question.allowedFileTypes ? question.allowedFileTypes.join(", ") : ""} placeholder="e.g. .pdf, .docx" onChange={(e) => handleQuestionChange(qIndex, index, "allowedFileTypes", e.target.value !== "" ? e.target.value.split(", ").map(type => type.trim()) : [])} />
                                        </div>
                                        </>
                                    )}
                                    <div className="space-y-2">
                                        <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questions?.[qIndex]?.questionText ?? ""}</p>
                                        <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questions?.[qIndex]?.questionType ?? ""}</p>
                                        <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questions?.[qIndex]?.choices ?? ""}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-600">No questions added yet. Click "Add Question" to create your first question.</p>
                        )}
                        {page.toBranch && (
                            <BranchInfo setFormDataState={setFormDataState} index={index} page={page} />
                        )}  
                        <div className="flex gap-3 items-center">
                            <Button type={ButtonTypes.PRIMARY} onClick={() => handleAddQuestion(index)} buttonText="Add Question"/>
                            {!page.toBranch && (
                                <Button type={ButtonTypes.SECONDARY} onClick={() => handleAddBranch(index)} buttonText="Add Branching" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questionCount}</p>
                            <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.toBranchErrors?.map((err, i) => <span key={i}>{err}<br/></span>)}</p>
                        </div>
                    </div>
                ))
            ) : (
                <>
                    <p className="text-sm text-gray-600">No pages added yet. Click "Add Page" to create your first page.</p>
                    {mainError && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{mainError}</p>}
                </>
            )}
            <Button type={ButtonTypes.PRIMARY} onClick={() => handleAddPage()} buttonText="Add Page"/>
        </div>
    )
});

export default PagesInfo;