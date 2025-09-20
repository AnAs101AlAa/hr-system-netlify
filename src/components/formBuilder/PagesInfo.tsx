import InputField from "@/components/generics/InputField";
import TextAreaField from "@/components/generics/TextAreaField";
import NumberField from "@/components/generics/NumberField";
import DropdownMenu from "@/components/generics/dropDownMenu";
import Button from "@/components/generics/Button";
import { FaXmark } from "react-icons/fa6";
import { ButtonTypes } from "@/constants/presets";
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
    setFormDataState: React.Dispatch<React.SetStateAction<form>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, toChange: string, index?: number, field?: string) => void;
}
    
const PagesInfo = forwardRef(({ formDataState, setFormDataState, handleInputChange }: PagesInfoProps, ref) => {
    const [questionCount, setQuestionCount] = useState<number>(0);
    const [choiceTextBuffer, setChoiceTextBuffer] = useState<string>("");
    const [branchCarrier, setBranchCarrier] = useState<{[pageIndex: number]: {questionNumber: number}}>({});
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
            const newQuestion : Question = { id: questionCount + 1, question: "", type: "Essay", isMandatory: false };
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
                .map((q, idx) => ({ ...q, id: idx + 1 })); // Re-assign ids
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
            return { ...prev, pages: updatedPages };
        });
    }

    const handleQQuestionChange = (index: number, pageIndex: number, field: string, value: string | boolean | number | null) => {
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
            if (question.type !== "MCQ") {
                toast.error("Choices can only be added to MCQ type questions");
                return prev;
            }
            const newChoice = { id: (question.choices ? question.choices.length : 0) + 1, content: choiceTextBuffer };
            updatedQuestions[questionIndex] = { ...question, choices: [...(question.choices || []), newChoice] };
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
            return { ...prev, pages: updatedPages };
        }
        );
        setChoiceTextBuffer("");
    }

    const validatePages = (): boolean => {
        const currentPageErrors: formPageError[] = [];
        const sanitizedPages = formDataState.pages?.map((page) => ({...page,questions: page.questions?.map((q) => sanitize(q, q.type))})) || [];

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
                if (!question.question || question.question.trim() === "") {
                    addQuestionError(currentPageErrors, pIndex, qIndex, {
                    questionText: "Question text is required.",
                    });
                }
                if (!question.type || !QUESTION_TYPES.includes(question.type)) {
                    addQuestionError(currentPageErrors, pIndex, qIndex, {
                    questionType: "Invalid question type.",
                    });
                }
                if (question.type === "MCQ" && (!question.choices || question.choices.length === 0)) {
                    addQuestionError(currentPageErrors, pIndex, qIndex, {
                    choices: "Question must have at least one choice.",
                    });
                }
            });

            if (page.toBranch) {
                const branchTargets = Object.values(page.toBranch) as {assertOn: string; targetPage: number;}[];
                if (branchTargets.some((branch) => branch.targetPage >= formDataState.pages!.length)) {
                    currentPageErrors[pIndex] = {
                    ...(currentPageErrors[pIndex] || {}),
                    toBranchErrors: [
                        ...(currentPageErrors[pIndex]?.toBranchErrors || []),
                        "Has a branch target that is out of range.",
                    ],
                    };
                }

                if (branchTargets.some((branch) => !page.questions.some((q) => q.id === parseInt(branch.assertOn)))) {
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


    const handleRemoveChoice = (questionIndex: number, pageIndex: number, choiceIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const updatedQuestions = [...(updatedPages[pageIndex].questions || [])];
            const question = updatedQuestions[questionIndex];
            if (question.type !== "MCQ" || !question.choices) {
                toast.error("Invalid operation");
                return prev;
            }
            const updatedChoices = question.choices.filter((_, idx) => idx !== choiceIndex);
            updatedQuestions[questionIndex] = { ...question, choices: updatedChoices };
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
            return { ...prev, pages: updatedPages };
        });
    }

    const handleAddBranch = (pageIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], toBranch: {0: {assertOn: "example answer", targetPage: pageIndex}} };
            setBranchCarrier((prev) => ({ ...prev, [pageIndex]: { questionNumber: 0 } }));
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
                                    <InputField label="Question Text" id={`question-text-${index}-${qIndex}`} value={question.question} placeholder="Enter question text" onChange={(e) => handleQQuestionChange(qIndex, index, "question", e.target.value)} error={pageErrors[index]?.questions?.[qIndex]?.questionText ?? ""} />
                                    <div className="w-full lg:w-[49%]">
                                        <DropdownMenu options={QUESTION_TYPES.map((type) => ({ label: type, value: type }))} value={question.type} onChange={(selected) => handleQQuestionChange(qIndex, index, "type", selected)} label="Question Type" />
                                    </div>
                                    <div className="w-full lg:w-[49%]">
                                        <DropdownMenu options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} value={question.isMandatory ? "true" : "false"} onChange={(selected) => handleQQuestionChange(qIndex, index, "isMandatory", selected === "true")} label="Is Required" />
                                    </div>
                                    {question.type === "Essay" && (
                                        <>
                                        <div className="w-full lg:w-[49%]">
                                            <DropdownMenu options={[{ label: "multiline", value: "true" }, { label: "single line", value: "false" }]} value={question.isTextArea ? "true" : "false"} onChange={(selected) => handleQQuestionChange(qIndex, index, "isTextArea", selected === "true")} label="Answer Format" />
                                        </div>
                                        <div className="w-full lg:w-[49%]">
                                            <NumberField label="Character Limit" id={`question-charlimit-${index}-${qIndex}`} value={question.maxLength ? question.maxLength.toString() : ""} placeholder="e.g. 250" onChange={(e) => handleQQuestionChange(qIndex, index, "maxLength", e.target.value !== "" ? parseInt(e.target.value) : null)} />
                                        </div>
                                        </>
                                    )}
                                    {question.type === "MCQ" && (
                                        <div className="w-full space-y-3">
                                        <p className="text-label text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold">Added Choices</p>
                                        {question.choices && question.choices.length > 0 ? (
                                            <div className="w-full mb-2">
                                            {question.choices.map((choice, cIndex) => (
                                                <div key={cIndex} className="flex items-center justify-between w-full gap-2 my-3">
                                                    <p className="text-[14px] md:text-[15px] lg:text-[16px]">{cIndex+1 + ". " + choice.content}</p>
                                                    <FaXmark className="text-primary cursor-pointer size-4 md:size-5" onClick={() => handleRemoveChoice(qIndex, index, cIndex)} />
                                                </div>
                                            ))}
                                            </div>) : (
                                                <p className="text-sm text-gray-600">No choices added yet.</p>
                                        )}
                                        <div className="flex gap-2 items-end w-full justify-between">
                                            <InputField label="Add Choice" id={`question-addchoice-${index}-${qIndex}`} value={choiceTextBuffer} placeholder="Enter choice text" onChange={(e) => setChoiceTextBuffer(e.target.value)} />
                                            <Button type={ButtonTypes.SECONDARY} onClick={() => handleAddChoice(qIndex, index)} buttonText="Add"/>
                                        </div>
                                        <DropdownMenu options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]} value={question.isMultiSelect ? "true" : "false"} onChange={(selected) => handleQQuestionChange(qIndex, index, "isMultiSelect", selected === "true")} label="Allow Multiple Answers" />
                                        </div>
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
                            <BranchInfo setFormDataState={setFormDataState} index={index} page={page} branchCarrier={branchCarrier} setBranchCarrier={setBranchCarrier} />
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