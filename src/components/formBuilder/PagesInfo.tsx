import { DropdownMenu, InputField, NumberField, TextAreaField, Button, ButtonTypes } from "tccd-ui";
import { IoCaretUp, IoCaretDown, IoTrashSharp, IoLockOpen, IoLockClosed } from "react-icons/io5";
import type { form, formPage, formPageError, FormBranchHandle, formBranch, formBranchError } from "@/types/form";
import toast from "react-hot-toast";
import { QUESTION_TYPES } from "@/constants/formConstants";
import React, { useState, useEffect } from "react";
import BranchInfo from "./BranchInfo";
import { forwardRef, useImperativeHandle } from "react";
import { sanitize, addQuestionError} from "@/utils/formBuilderUtils";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { Question } from "@/types/question";
import { TiTick, TiPlus } from "react-icons/ti";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

interface PagesInfoProps {
    formDataState: form;
    questionCount: number;
    setQuestionCount: React.Dispatch<React.SetStateAction<number>>;
    setFormDataState: React.Dispatch<React.SetStateAction<form>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, toChange: string, index?: number, field?: string) => void;
    isFetchSuccessful: boolean;
}

const PagesInfo = forwardRef(({ formDataState, setFormDataState, handleInputChange, setQuestionCount, isFetchSuccessful }: PagesInfoProps, ref) => {
    const [choiceTextBuffer, setChoiceTextBuffer] = useState<string>("");
    const [pageErrors, setPageErrors] = useState<{[index: number]: formPageError}>({});
    const [showHidePages, setShowHidePages] = useState<{[index: number]: boolean}>({});
    const [mainError, setMainError] = useState<string>("");
    const [allowModifiers, setAllowModifiers] = useState<boolean>(true);
    const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
    const [clipboard, setClipboard] = useState<Question[]>([]);
    const [branchSections, setBranchSections] = useState<{formBranch: formBranch, ref: React.RefObject<FormBranchHandle | null>}[]>([]);
    const [branchSectionErrors, setBranchSectionErrors] = useState<{[branchId: string]: formBranchError}>({});
    const isInitialized = React.useRef(false);

    useEffect(() => {
        if(Object.keys(showHidePages).length === 0) {
            setShowHidePages(formDataState.pages ? formDataState.pages.reduce((acc, _, idx) => ({ ...acc, [idx]: true }), {}) : {});
        }
    }, [formDataState.pages]);

    useEffect(() => {
    if (!isFetchSuccessful || isInitialized.current || !formDataState.pages || formDataState.pages.length === 0) return;

    const newBranches = formDataState.pages.flatMap((page, pageIndex) =>
        (page.toBranch ?? []).map(branch => ({
        formBranch: { ...branch, sourcePage: pageIndex },
        ref: React.createRef<FormBranchHandle>(),
        }))
    );

    if (newBranches.length > 0) {
        setBranchSections(prev => [...prev, ...newBranches]);
        isInitialized.current = true;
    }
    }, [isFetchSuccessful, formDataState.pages]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!(e.ctrlKey || e.metaKey)) return;
            const key = e.key.toLowerCase();
            if (!(["c", "x"].includes(key) && selectedQuestions.length > 0)) return;
            e.preventDefault();

            setFormDataState((prev) => {
                if (!prev?.pages) return prev;

                const copied = prev.pages.flatMap((p) =>
                p.questions.filter((q) => selectedQuestions.includes(q.id || ""))
                );

                setClipboard(copied);

                if (key === "c") {
                return prev;
                }

                const updatedPages = prev.pages.map((page) => {
                const filteredQuestions = page.questions.filter(
                    (q) => !selectedQuestions.includes(q.id || "")
                );
                return { ...page, questions: filteredQuestions };
                });

                let counter = 1;
                const pagesWithReindexed = updatedPages.map((page) => ({
                ...page,
                questions: page.questions.map((q) => ({ ...q, questionNumber: counter++ })),
                }));

                return { ...prev, pages: pagesWithReindexed };
            });

            if (key === "x") {
                setSelectedQuestions([]);
            }

            toast.success(`${key === "c" ? "Copied" : "Cut"} ${selectedQuestions.length} question(s) to clipboard`);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedQuestions, clipboard]);

    const handlePasteQuestions = (pageIndex: number) => {
        if (clipboard.length === 0) {
            toast.error("Clipboard is empty");
            return;
        }
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const newQuestions = clipboard.map((q) => ({ ...q, id: crypto.randomUUID() }));
            const questions = [...(updatedPages[pageIndex].questions || []), ...newQuestions];
            let newQuestionNumber = 1;
            const reindexedPages = updatedPages.map((page, idx) => {
            const qs = idx === pageIndex ? questions : (page.questions || []);
            return {
                ...page,
                questions: qs.map(q => ({ ...q, questionNumber: newQuestionNumber++ })),
            };
            });
            setQuestionCount(newQuestionNumber - 1);
            setClipboard([]);
            setSelectedQuestions([]);
            return { ...prev, pages: reindexedPages };
        });
    }

    const handleAddPage = () => {
        setFormDataState((prev) => {
            if (!prev) return prev;
            const newPage: formPage = {title: `Page ${prev.pages ? prev.pages.length + 1 : 1}`, nextPage: 0, description: "", questions: []};
            return { ...prev, pages: [...(prev.pages || []), newPage] };
        });
        setShowHidePages((prev) => ({ ...prev, [Object.keys(prev).length]: true }));
    }

    const handleDeletePage = (pageIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            // Remove the page
            const updatedPages = [...prev.pages];
            updatedPages.splice(pageIndex, 1);

            // Reindex questionNumber across all pages
            let newQuestionCount = 0;
            const reindexedPages = updatedPages.map((page) => {
                const questions = (page.questions || []).map((q) => ({
                    ...q,
                    questionNumber: ++newQuestionCount,
                }));
                return { ...page, questions };
            });

            setQuestionCount(newQuestionCount);

            return { ...prev, pages: reindexedPages };
        });

        setShowHidePages((prev) => {
            const newState = { ...prev };
            newState[pageIndex] = !newState[pageIndex];
            return newState;
        });
    };
    
    const handleMovePage = (pageIndex: number, direction: "up" | "down") => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const [movedPage] = updatedPages.splice(pageIndex, 1);
            updatedPages.splice(direction === "up" ? pageIndex - 1 : pageIndex + 1, 0, movedPage);

            let newQuestionNumber = 1;
            const reindexedPages = updatedPages.map(page => ({
                ...page,
                questions: (page.questions || []).map(q => ({
                    ...q,
                    questionNumber: newQuestionNumber++,
                })),
            }));
            return { ...prev, pages: reindexedPages };
        });

        setShowHidePages((prev) => {
            const newState = { ...prev };
            if(direction === "up") {
                const temp = newState[pageIndex - 1];
                newState[pageIndex - 1] = prev[pageIndex];
                newState[pageIndex] = temp;
            } else {
                const temp = newState[pageIndex + 1];
                newState[pageIndex] = prev[pageIndex + 1];
                newState[pageIndex + 1] = temp;
            }
            return newState;
        });
    };

    const handleAddQuestion = (pageIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const questions = [...(updatedPages[pageIndex].questions || [])];
            questions.push({ questionNumber: 0, questionText: "", questionType: "Essay", isMandatory: false, id: crypto.randomUUID() });
            // Reindex questionNumber for all questions in all pages
            let newQuestionNumber = 1;
            const reindexedPages = updatedPages.map((page, idx) => {
                const qs = idx === pageIndex ? questions : (page.questions || []);
                return {
                    ...page,
                    questions: qs.map(q => ({ ...q, questionNumber: newQuestionNumber++ })),
                };
            });
            setQuestionCount(newQuestionNumber - 1);
            return { ...prev, pages: reindexedPages };
        });
    }

    const handleRemoveQuestion = (pageIndex: number, questionIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const questions = (updatedPages[pageIndex].questions || []).filter((_, idx) => idx !== questionIndex);

            let newQuestionNumber = 1;
            const reindexedPages = updatedPages.map((page, idx) => {
                const qs = idx === pageIndex ? questions : (page.questions || []);
                return {
                    ...page,
                    questions: qs.map(q => ({ ...q, questionNumber: newQuestionNumber++ })),
                };
            });

            setQuestionCount(newQuestionNumber - 1);
            return { ...prev, pages: reindexedPages };
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

    const handleMoveChoice = (questionIndex: number, pageIndex: number, choiceIndex: number, direction: "up" | "down") => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const updatedQuestions = [...(updatedPages[pageIndex].questions || [])];
            const question = updatedQuestions[questionIndex];
            if (question.questionType !== "MCQ" || !question.choices) {
                toast.error("Invalid operation");
                return prev;
            }
            const choices = [...question.choices];
            const [movedChoice] = choices.splice(choiceIndex, 1);
            choices.splice(direction === "up" ? choiceIndex - 1 : choiceIndex + 1, 0, movedChoice);
            // Reassign choiceNumber
            const reindexedChoices = choices.map((choice, idx) => ({ ...choice, choiceNumber: idx + 1 }));
            updatedQuestions[questionIndex] = { ...question, choices: reindexedChoices };
            updatedPages[pageIndex] = { ...updatedPages[pageIndex], questions: updatedQuestions };
            return { ...prev, pages: updatedPages };
        })
    };

    const validatePages = (): { hasErrors: boolean; pages: formPage[] } => {
        const currentPageErrors: formPageError[] = [];
        const currentBranchErrors: {[branchId: string]: formBranchError} = {};


        const sanitizedPages: formPage[] = formDataState.pages?.map((page) => ({ ...page, questions: page.questions?.map((q) => sanitize(q, q.questionType)) })) || [];
        const branchFixedPages: formPage[] = [];

        if (!formDataState.pages || formDataState.pages.length === 0) {
            setMainError("At least one page is required.");
            return { hasErrors: true, pages: [] };
        }

        sanitizedPages.forEach((page, pIndex) => {
            if (!page.title || page.title.trim() === "") {
            currentPageErrors[pIndex] = {
                ...(currentPageErrors[pIndex] || {}),
                title: "Page title is required.",
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

            const collectedBranches : formBranch[] = [];

            branchSections.filter(branch => branch.formBranch.sourcePage === pIndex).forEach(branchSection => {
                const branchInfoRef = branchSection.ref;
                const selectedQuestionNumber = branchInfoRef.current?.fetchQuestionNumber();
                let branchData = null;

                const questionAnswers = selectedQuestionNumber ? page.questions.filter(q => q.questionNumber == selectedQuestionNumber).map(q => {
                    if(q.questionType === "MCQ" && q.choices) {
                        return q.choices.map(c => c.text);
                    } else {
                        return q.questionText ? [q.questionText] : [];
                    }
                }) : [];

                branchData = branchInfoRef.current?.collect(questionAnswers.flat());

                if (branchData?.questionNumber === undefined || isNaN(branchData.questionNumber) || branchData.questionNumber <= 0) {
                    currentBranchErrors[branchSection.formBranch.id] = {
                        ...(currentBranchErrors[branchSection.formBranch.id] || {}),
                        questionNumber: "Has a branch with an invalid question number.",
                    };
                }

                if (branchData?.targetPage === undefined || isNaN(branchData.targetPage) || branchData.targetPage <= 0 || branchData.targetPage > sanitizedPages.length + 1) {
                    currentBranchErrors[branchSection.formBranch.id] = {
                        ...(currentBranchErrors[branchSection.formBranch.id] || {}),
                        targetPage: "Has a branch with an invalid target page.",
                    };
                }

                if (!branchData?.assertOn || branchData.assertOn.trim() === "") {
                    currentBranchErrors[branchSection.formBranch.id] = {
                        ...(currentBranchErrors[branchSection.formBranch.id] || {}),
                        assertOn: "Has a branch with empty assert-on value.",
                    };
                }

                if (branchData?.questionNumber !== undefined && (branchData?.questionNumber > page.questions.length || branchData.questionNumber <= 0)) {
                    currentBranchErrors[branchSection.formBranch.id] = {
                        ...(currentBranchErrors[branchSection.formBranch.id] || {}),
                        questionNumber: "Question Number for branching is out of the page's bounds.",
                    };
                }

                collectedBranches.push(branchData || { questionNumber: 0, assertOn: "", targetPage: 0, sourcePage: pIndex, id: branchSection.formBranch.id });
            });

            const fixedPage = { ...page, toBranch: collectedBranches.length > 0 ? collectedBranches : undefined };
            branchFixedPages.push(fixedPage);
        });

        setPageErrors(currentPageErrors);
        setBranchSectionErrors(currentBranchErrors);
        setFormDataState((prev) => ({ ...prev, pages: branchFixedPages }));
        return { hasErrors: currentPageErrors.length !== 0 || Object.keys(currentBranchErrors).length > 0, pages: branchFixedPages };
    };

    const handleAddBranch = (pageIndex: number) => {
        setBranchSections((prev) => {
            const newBranch: {formBranch: formBranch, ref: React.RefObject<FormBranchHandle | null>} = {formBranch: { questionNumber: 0, assertOn: "", targetPage: 0, sourcePage: pageIndex, id: crypto.randomUUID() }, ref: React.createRef<FormBranchHandle | null>()};
            return [...prev, newBranch];
        });
    }

    const handleDragEnd = (result : DropResult) => {
        const { source, destination } = result;

        // dropped outside any droppable area
        if (!destination) return;

        const sourcePageIndex = parseInt(source.droppableId.split("-")[1], 10);
        const destPageIndex = parseInt(destination.droppableId.split("-")[1], 10);

        // nothing changed
        if (
            sourcePageIndex === destPageIndex &&
            source.index === destination.index
        ) {
            return;
        }

        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;

            const updatedPages = prev.pages.map((p) => ({ ...p, questions: [...(p.questions || [])] }));

            const [movedQuestion] = updatedPages[sourcePageIndex].questions.splice(source.index, 1);

            updatedPages[destPageIndex].questions.splice(destination.index, 0, movedQuestion);

            let globalCounter = 1;
            const pagesWithReindexedQuestions = updatedPages.map((page) => {
            const reindexed = page.questions.map((q) => {
                return { ...q, questionNumber: globalCounter++ };
            });
            return { ...page, questions: reindexed };
            });

            return {
            ...prev,
            pages: pagesWithReindexedQuestions,
            };
        });
    };

    const handleAdjustNextPages = (pageIndex: number, value: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;

            const updatedPages = prev.pages.map((page, index) => {
                if (index === pageIndex) {
                    return { ...page, nextPage: value };
                }
                return page;
            });

            return {
                ...prev,
                pages: updatedPages,
            };
        });
    };

    useImperativeHandle(ref, () => ({
        collect: validatePages
    }));

    return (
        <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background relative">
            <div className="absolute md:right-4 md:top-4 top-3 right-3 flex items-center gap-2 cursor-pointer px-3 py-1 rounded-full bg-secondary text-background" onClick={() => setAllowModifiers(!allowModifiers)}>
                {allowModifiers ? <IoLockOpen className="size-3.5 md:size-4" /> : <IoLockClosed className="size-3.5 md:size-4" />}
                <p className="lg:text-[15px] md:text-[14px] text-[13px]">{allowModifiers ? "Disable Modifiers" : "Enable Modifiers"}</p>
            </div>
            <p className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-primary">
                Form Pages
            </p>
            <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                Add and manage the pages of your form. Each page can contain multiple questions.
            </p>
            <DragDropContext onDragEnd={handleDragEnd}>
            {formDataState?.pages && formDataState.pages.length > 0 ? (
                formDataState.pages.map((page, index) => (
                    <div key={index} className="p-3 md:p-4 border border-gray-300 rounded-md space-y-3 relative border-t-primary border-t-8 md:border-t-10">
                        <div className="absolute right-4 top-4 flex gap-2 items-center">
                            {index > 0 && <div className="bg-secondary rounded-full p-1"><IoCaretUp className="text-background cursor-pointer size-3.5 md:size-4" onClick={() => handleMovePage(index, "up")} /></div>}
                            {index < (formDataState.pages?.length || 0) - 1 && <div className="bg-secondary rounded-full p-1"><IoCaretDown className="text-background cursor-pointer size-3.5 md:size-4" onClick={() => handleMovePage(index, "down")} /></div>}
                            <div className="bg-contrast rounded-full p-1">{!showHidePages[index] ? 
                                <BiSolidShow className="text-background cursor-pointer size-3.5 md:size-4" onClick={() => setShowHidePages((prev) => ({ ...prev, [index]: !prev[index] }))} />
                                 : 
                                <BiSolidHide className="text-background cursor-pointer size-3.5 md:size-4" onClick={() => setShowHidePages((prev) => ({ ...prev, [index]: !prev[index] }))} />
                                }
                            </div>
                            <div className="bg-primary rounded-full p-1"><IoTrashSharp className="text-background cursor-pointer size-3.5 md:size-4" onClick={() => handleDeletePage(index)} /></div>
                        </div>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-primary">Page {index + 1} ({page.questions ? page.questions.length : 0} question{page.questions && page.questions.length !== 1 ? "s" : ""})</p>
                        <p className="text-[16px] md:text-[18px] lg:text-[20px] font-semibold text-primary flex gap-2">
                            Guides to Page    
                            <input
                            placeholder="0"
                            type="number"
                            style={{ width: `${Math.max(12 * (page.nextPage.toString().length) + 14, 26)}px`, MozAppearance: "textfield" }}
                            className="shadow-md bg-white rounded-lg text-center focus:border-primary border-gray-300 border transition-colors duration-200 outline-none text-contrast"
                            value={page.nextPage + 1}
                            onChange={(e) => handleAdjustNextPages(index, Number(e.target.value) - 1)}
                            />
                        </p>  
                      {showHidePages[index] ? (
                            <>
                                <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text">Primary information</p>
                                <InputField label="Page Title" id={`page-title-${index}`} value={page.title} placeholder="Enter page title" onChange={(e) => handleInputChange(e, "pages", index, "title")} error={pageErrors[index]?.title} />
                                {pageErrors[index]?.title && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.title}</p>}

                                <TextAreaField label="Page Description" id={`page-description-${index}`} value={page.description || ""} placeholder="Enter page description" onChange={(e) => handleInputChange(e, "pages", index, "description")} error={pageErrors[index]?.description} />
                                {pageErrors[index]?.description && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.description}</p>}

                                <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text mt-4">Questions</p>
                                <Droppable droppableId={`page-${index}`} key={index}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                                            {page.questions && page.questions.length > 0 ? (
                                            page.questions.map((question, qIndex) => (
                                                <Draggable key={qIndex} draggableId={`page-${index}-question-${qIndex}`} index={qIndex} isDragDisabled={!allowModifiers}>
                                                    {(provided) => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`${allowModifiers ? "p-1.5 md:p-3 border-gray-200" : "border-transparent"} border rounded-md bg-gray-100 space-y-3 flex flex-wrap lg:gap-[2%] relative ease-in-out transition-all duration-200`}>
                                                            <div key={qIndex} className="p-3 border border-gray-200 rounded-md bg-white space-y-3 flex flex-wrap lg:gap-[2%] relative w-full">
                                                            <div className="absolute right-4 top-4 flex gap-2 items-center">
                                                                {allowModifiers ? (selectedQuestions.includes(question.id || "") ?
                                                                    <div className="bg-secondary rounded-full p-1">
                                                                        <TiTick className="text-background cursor-pointer size-4 md:size-5" onClick={() => setSelectedQuestions((prev) => prev.filter((id) => id !== question.id || ""))} />
                                                                    </div> : 
                                                                    <div className="bg-secondary py-0.5 md:py-1 rounded-full px-3">
                                                                        <p className="text-background text-[12px] md:text-[14px] cursor-pointer" onClick={() => setSelectedQuestions((prev) => [...prev, question.id || ""])} >Select</p>
                                                                    </div>):
                                                                null}
                                                                <div className="bg-primary rounded-full p-1"><IoTrashSharp className="text-background cursor-pointer size-3.5 md:size-4" onClick={() => handleRemoveQuestion(index, qIndex)} /></div>
                                                            </div>
                                                                <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text">Question {question.questionNumber} ({qIndex + 1} in page)</p>
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
                                                                                <div className="flex gap-2 items-center">
                                                                                    {choice.choiceNumber > 1 && <IoCaretUp className="text-primary cursor-pointer size-4 md:size-4.5" onClick={() => handleMoveChoice(qIndex, index, cIndex, "up")} />}
                                                                                    {choice.choiceNumber < (question.choices ? question.choices.length : 0) && <IoCaretDown className="text-primary cursor-pointer size-4 md:size-4.5" onClick={() => handleMoveChoice(qIndex, index, cIndex, "down")} />}
                                                                                    <IoTrashSharp className="text-primary cursor-pointer size-4 md:size-4.5" onClick={() => handleRemoveChoice(qIndex, index, cIndex)} />
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                        </div>) : (
                                                                            <p className="text-sm text-gray-600">No choices added yet.</p>
                                                                    )}
                                                                    <div className="flex gap-2 items-end w-full justify-between">
                                                                        <div className="max-w-3/4 md:max-w-none w-full">
                                                                            <InputField label="Add Choice" id={`question-add-choice-${index}-${qIndex}`} value={choiceTextBuffer} placeholder="Enter choice text" onChange={(e) => setChoiceTextBuffer(e.target.value)} />
                                                                        </div>
                                                                        <Button type={ButtonTypes.SECONDARY} width="fit" onClick={() => handleAddChoice(qIndex, index)} buttonIcon={<TiPlus className="size-3 md:size-4.5"/>} />
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
                                                                        <InputField label="Allowed File Types (comma separated, e.g. .pdf, .docx)" id={`question-allowedfiletypes-${index}-${qIndex}`} value={question.allowedFileTypes ? question.allowedFileTypes.join(", ") : ""} placeholder="e.g. .pdf, .docx" onChange={(e) => handleQuestionChange(qIndex, index, "allowedFileTypes", e.target.value ? e.target.value.split(/\s*,\s*/).filter(Boolean) : [])} />
                                                                    </div>
                                                                    </>
                                                                )}
                                                                <div className="space-y-2">
                                                                    <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questions?.[qIndex]?.questionText ?? ""}</p>
                                                                    <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questions?.[qIndex]?.questionType ?? ""}</p>
                                                                    <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questions?.[qIndex]?.choices ?? ""}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                            ) : (
                                                <p className="text-sm text-gray-600">No questions added yet. Click "Add Question" to create your first question.</p>
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                {branchSections.filter((branch) => branch.formBranch.sourcePage === index).length > 0 && (
                                    <>
                                        {branchSections.filter((branch) => branch.formBranch.sourcePage === index).map((branch) => (
                                            <div className="space-y-2" key={branch.formBranch.id}>
                                                <BranchInfo setBranchSections={setBranchSections} ref={branch.ref} initialValue={branch.formBranch} />
                                                {branchSectionErrors[branch.formBranch.id] && (
                                                    <div className="space-y-2 text-primary text-[12px] md:text-[13px] lg:text-[14px]">
                                                        {branchSectionErrors[branch.formBranch.id].questionNumber && <p>{branchSectionErrors[branch.formBranch.id].questionNumber}</p>}
                                                        {branchSectionErrors[branch.formBranch.id].assertOn && <p>{branchSectionErrors[branch.formBranch.id].assertOn}</p>}
                                                        {branchSectionErrors[branch.formBranch.id].targetPage && <p>{branchSectionErrors[branch.formBranch.id].targetPage}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                                <div className="flex gap-2 md:gap-3 md:justify-start justify-center items-center">
                                    <Button type={ButtonTypes.PRIMARY} width="small" onClick={() => handleAddQuestion(index)} buttonText="Add Question"/>
                                    <Button type={ButtonTypes.SECONDARY} width="small" onClick={() => handleAddBranch(index)} buttonText="Add Branch" />
                                    {clipboard.length > 0 && allowModifiers && <Button type={ButtonTypes.TERTIARY} width="fit" onClick={() => handlePasteQuestions(index)} buttonText={`Paste`} />}
                                </div>
                                <p className="text-primary text-[12px] md:text-[13px] lg:text-[14px]">{pageErrors[index]?.questionCount}</p>
                            </> ) : (
                            <p className="text-sm text-gray-600">Page is hidden. Click the eye icon to show.</p>
                        )}
                        </div>
                ))
            ) : (
                <>
                    <p className="text-sm text-gray-600">No pages added yet. Click "Add Page" to create your first page.</p>
                    {mainError && <p className="text-primary -mt-2 text-[12px] md:text-[13px] lg:text-[14px]">{mainError}</p>}
                </>
            )}
            </DragDropContext>
            <Button type={ButtonTypes.PRIMARY} onClick={() => handleAddPage()} buttonText="Add Page"/>
        </div>
    )
});

export default PagesInfo;