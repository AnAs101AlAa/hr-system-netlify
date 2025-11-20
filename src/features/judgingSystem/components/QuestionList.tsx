import type { JudgeQuestion } from "@/shared/types/judgingSystem";
import type { Event } from "@/shared/types/event";
import QuestionDeleteModal from "./QuestionDeleteModal";
import { FaPlus, FaCheck  } from "react-icons/fa";
import { IoCaretUp, IoCaretDown } from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiOutlineTrash } from "react-icons/hi2";
import { MdOutlineEdit } from "react-icons/md";
import { Button, TextDisplayEdit } from "tccd-ui";
import useManageQuestionUtils from "../utils/QuestionManageUtils";

export default function QuestionList ({event}: {event: Event | undefined}) {
    const { questionsState, handleAddQuestion, handleMoveQuestion, handleDeleteQuestion, handleUpdateQuestion, isLoadingQuestions, isLoadingUpdate, isErrorQuestions, newQuestionState, setNewQuestionState, handleOpenQuestionAdd, newQuestionErrors, editQuestionErrors, deleteModalOpen, setDeleteModalOpen, editQuestionState, setEditQuestionState } = useManageQuestionUtils({eventId: event?.id});

    return (
        <div className="rounded-md shadow-md p-4 bg-slate-50">
            <QuestionDeleteModal isLoading={isLoadingUpdate} isOpen={deleteModalOpen !== ""} onClose={() => setDeleteModalOpen("")} handleDelete={() => handleDeleteQuestion(deleteModalOpen)} />
            <div className="bg-white w-full p-4">
                {isLoadingQuestions ? (
                    <p className="text-center p-4 text-inactive-tab-text">Loading questions...</p>
                ) : isErrorQuestions ? (
                    <p className="text-center p-4 text-red-500">Failed to load questions. Please try again later.</p>
                ) : questionsState.length === 0 ? (
                    <div className={`flex justify-center items-center flex-col gap-3 ${newQuestionState ? "mb-4" : "mb-0"}`}>
                        <p className="text-center text-inactive-tab-text">No evaluation has been made for this event yet.</p>
                        <Button buttonText="Add a question" type="primary" width="auto" onClick={() => handleOpenQuestionAdd()} />
                    </div>
                ) : (
                    <div className="relative">
                        <p className="text-center font-semibold text-[20px] md:text-[22px] lg:text-[24px] mb-3 md:mb-4">{event?.title}'s Evaluation Paper</p>
                        <div className="absolute hidden md:block top-0 right-0 rounded-full bg-primary/80 p-2 hover:bg-primary cursor-pointer transition-colors duration-200 ease-in-out">
                            <FaPlus className="text-white size-4" onClick={() => {if(isLoadingUpdate) return; handleOpenQuestionAdd()}} />
                        </div>
                        {questionsState.map((question: JudgeQuestion, index) => (
                        <div key={index} className="p-3 border-b-2 last:border-b-0 border-slate-200 relative">
                            <div className="absolute top-3 right-3 flex gap-1">
                                {question.itemNumber !== 1 && (
                                    <IoCaretUp className="text-contrast/90 size-4.5 md:size-5 cursor-pointer hover:text-contrast transition-colors duration-200 ease-in-out" onClick={() => {if(isLoadingUpdate) return; handleMoveQuestion(question.id, "up")}} />
                                )}
                                {question.itemNumber !== questionsState.length && (
                                    <IoCaretDown className="text-contrast/90 size-4.5 md:size-5 cursor-pointer hover:text-contrast transition-colors duration-200 ease-in-out" onClick={() => {if(isLoadingUpdate) return; handleMoveQuestion(question.id, "down")}} />
                                )}
                                {editQuestionState?.id !== question.id ? (

                                    <MdOutlineEdit className="text-secondary/90 size-4.5 md:size-5 cursor-pointer hover:text-secondary transition-colors duration-200 ease-in-out" onClick={() => {if(isLoadingUpdate) return; setEditQuestionState(question)}} />
                                ) : (
                                    isLoadingUpdate ? (
                                        <AiOutlineLoading3Quarters className="text-secondary/90 size-4.5 md:size-5 animate-spin" />
                                    ) : (
                                    <FaCheck className="text-secondary/90 size-4.5 md:size-5 cursor-pointer hover:text-secondary transition-colors duration-200 ease-in-out" onClick={() => {if(isLoadingUpdate) return; handleUpdateQuestion()}} />
                                    )
                                )}
                                <HiOutlineTrash className="text-red-500 size-4.5 md:size-5 cursor-pointer hover:text-red-700 transition-colors duration-200 ease-in-out" onClick={() => {if(isLoadingUpdate) return; setDeleteModalOpen(question.id)}} />
                            </div>
                            <p className="text-primary font-bold lg:text-[18px] md:text-[17px] text-[16px]">Question {question.itemNumber}</p>
                            {editQuestionState?.id === question.id ? (
                                <>
                                    <TextDisplayEdit label="" placeholder="evaluation criteria description." value={editQuestionState.name} onChange={(val) => setEditQuestionState(prev =>{ if(!prev) return null; return ({...prev, name: val})})} />
                                    {editQuestionErrors && <p className="text-red-500 text-sm mt-2 lg:text-[14px] md:text[13px] text-[12px]">{editQuestionErrors}</p>}
                                </>
                            ) : (
                                <p className="mt-2 lg:text-[16px] md:text-[15px] text-[14px] text-contrast">{question.name}</p>
                            )}
                        </div>
                        ))}
                        {!newQuestionState && (
                            <div className="mt-4 justify-center md:hidden flex">
                                <Button buttonText="Add New Question" type="primary" width="auto" onClick={() => {if(isLoadingUpdate) return; handleOpenQuestionAdd()}} />
                            </div>
                        )}
                    </div>
                )}
                {newQuestionState && (
                    <div className="p-3 border-t-2 border-slate-200">
                        <div className="flex gap-2 justify-center">
                            <p className="font-semibold lg:text-[20px] md:text[18px] text-[16px] text-center mb-3">New Question #</p>
                            <input placeholder="0" type="number" style={{ width: `${Math.max(13 * ((newQuestionState?.itemNumber + 1).toString().length) + 14, 27)}px`, MozAppearance: "textfield", height: "27px" }} className="shadow-md bg-white rounded-lg text-center focus:border-primary border-gray-300 border transition-colors duration-200 outline-none text-contrast" value={newQuestionState.itemNumber === -1 ? "" : newQuestionState.itemNumber} onChange={(e) => setNewQuestionState(prev => { if (!prev) return null; return ({ ...prev, itemNumber: Number(e.target.value) }) })} />
                        </div>
                        <TextDisplayEdit label="Question text" placeholder="evaluation criteria description." value={newQuestionState.name} onChange={(val) => setNewQuestionState(prev =>{ if(!prev) return null; return ({...prev, name: val})})} />
                        {newQuestionErrors.name && <p className="text-red-500 text-sm mt-2 lg:text-[14px] md:text[13px] text-[12px]">{newQuestionErrors.name}</p>}
                        {newQuestionErrors.itemNumber && <p className="text-red-500 text-sm lg:text-[14px] md:text[13px] text-[12px]">{newQuestionErrors.itemNumber}</p>}
                        <div className="flex gap-2 justify-center items-center mt-3">
                            <Button disabled={isLoadingUpdate} buttonText="Cancel" type="secondary" width="small" onClick={() => setNewQuestionState(null)} />
                            <Button buttonText="Save" type="primary" width="small" onClick={() => handleAddQuestion()} loading={isLoadingUpdate} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}