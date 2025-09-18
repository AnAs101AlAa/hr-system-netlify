import { useParams } from "react-router-dom";
import { useForm } from "@/queries/forms/formQueries";
import LoadingPage from "@/components/generics/LoadingPage";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import WithNavbar from "@/components/hoc/WithNavbar";
import InputField from "@/components/generics/InputField";
import TextAreaField from "@/components/generics/TextAreaField";
import type { form, formPage } from "@/types/form";
import Button from "@/components/generics/Button";
import { ButtonTypes } from "@/constants/presets";
import type { Question } from "@/types/question";
import { QUESTION_TYPES } from "@/constants/formConstants";
import DropdownMenu from "@/components/generics/dropDownMenu";
import NumberField from "@/components/generics/NumberField";
import { FaXmark } from "react-icons/fa6";

export default function FormEditor() {
    const { formId } = useParams<{ formId: string }>();
    const isEditMode = formId !== "new";
    const emptyForm: form = { id: "", title: "", sheetName: "", createdAt: "", updatedAt: "", pages: [] };

    const { data: formData, isLoading, isError, error } = useForm(formId!);
    const [formDataState, setFormDataState] = useState<form>(formData ?? emptyForm);
    const [questionCount, setQuestionCount] = useState<number>(0);
    const [choiceTextBuffer, setChoiceTextBuffer] = useState<string>("");

    useEffect(() => {
        if (isError && error) {
            toast.error(`Failed to fetch form, please try again`);
        }
    }, [isError, error]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        toChange: string,
        index?: number,
        field?: string
    ) => {
        const value = e.target.value;
        if (toChange === "pages" && typeof index === "number") {
            setFormDataState((prev) => {
                if (!prev || !prev.pages) return prev;
                const updatedPages = [...prev.pages];
                updatedPages[index] = { ...updatedPages[index], [field!]: value };
                return { ...prev, pages: updatedPages };
            });
            return;
        }

        setFormDataState((prev) => {
            if (!prev) return prev;
            return { ...prev, [toChange]: value };
        });
    }

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

    console.log(formDataState);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <WithNavbar>
        <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto">
            <h1 className="lg:text-[24px] md:text-[22px] text-[20px] font-bold mb-4">{isEditMode ? `Edit Form` : "Create New Form"}</h1>
            <div className="space-y-6">
                <div className="space-y-3 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-primary">
                        Google Sheet Details
                    </p>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                        The form responses will be saved in a Google Sheet. Please provide the necessary details below.
                    </p>
                    <InputField
                        label="Sheet Id"
                        id="form-id"
                        value={formDataState?.id || ""}
                        placeholder="enter id here"
                        onChange={(e) => handleInputChange(e, "id")}
                    />
                    <InputField
                        label="Sheet/Tab Name"
                        id="form-tab-name"
                        value={formDataState?.sheetName || ""}
                        placeholder="e.g. Sheet1"
                        onChange={(e) => handleInputChange(e, "sheetName")}
                    />
                </div>
                <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-primary">
                        Form Main Information
                    </p>
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                        Provide a title and description for your form. This information will be displayed to respondents.
                    </p>
                    <InputField
                        label="Form Title"
                        id="form-title"
                        value={formDataState?.title || ""}
                        placeholder="e.g. Orientation title"
                        onChange={(e) => handleInputChange(e, "title")}
                    />
                    <TextAreaField
                        label="Form Description"
                        id="form-description"
                        value={formDataState?.description || ""}
                        placeholder="e.g. Orientation description"
                        onChange={(e) => handleInputChange(e, "description")}
                    />
                </div>
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
                                <InputField label="Page Title" id={`page-title-${index}`} value={page.title} placeholder="Enter page title" onChange={(e) => handleInputChange(e, "pages", index, "title")} />
                                <TextAreaField label="Page Description" id={`page-description-${index}`} value={page.description || ""} placeholder="Enter page description" onChange={(e) => handleInputChange(e, "pages", index, "description")} />
                                <p className="text-label text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold">Questions</p>
                                {page.questions && page.questions.length > 0 ? (
                                    page.questions.map((question, qIndex) => (
                                        <div key={qIndex} className="p-3 border border-gray-200 rounded-md bg-white space-y-3 flex flex-wrap lg:gap-[2%]">
                                            <InputField label="Question Text" id={`question-text-${index}-${qIndex}`} value={question.question} placeholder="Enter question text" onChange={(e) => handleQQuestionChange(qIndex, index, "question", e.target.value)} />
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
                                                            <FaXmark className="text-red-500 cursor-pointer size-4 md:size-5" onClick={() => handleRemoveChoice(qIndex, index, cIndex)} />
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
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-600">No questions added yet. Click "Add Question" to create your first question.</p>
                                )}
                                <Button type={ButtonTypes.PRIMARY} onClick={() => handleAddQuestion(index)} buttonText="Add Question"/>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-600">No pages added yet. Click "Add Page" to create your first page.</p>
                    )}
                    <Button type={ButtonTypes.PRIMARY} onClick={() => handleAddPage()} buttonText="Add Page"/>
                </div>
                <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
                    <div className="flex justify-center items-center gap-3">
                        <Button type={ButtonTypes.SECONDARY} onClick={() => {}} buttonText="Discard" />
                        <Button type={ButtonTypes.PRIMARY} onClick={() => console.log(formDataState)} buttonText="Save Form" />
                    </div>
                </div>
            </div>
        </div>
        </div>
        </WithNavbar>
    );
}