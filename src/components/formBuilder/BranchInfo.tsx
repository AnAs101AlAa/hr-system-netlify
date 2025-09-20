import { FaXmark } from "react-icons/fa6";
import NumberField from "@/components/generics/NumberField";
import InputField from "@/components/generics/InputField";
import type { form, formPage } from "@/types/form";

export default function BranchInfo({setFormDataState, index, page, branchCarrier, setBranchCarrier}: {setFormDataState: React.Dispatch<React.SetStateAction<form>>; index: number; page: formPage; branchCarrier: {[pageIndex: number]: {questionNumber: number}}; setBranchCarrier: React.Dispatch<React.SetStateAction<{[pageIndex: number]: {questionNumber: number}}>>}) {

    const handleRemoveBranch = (pageIndex: number) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const currentPage = updatedPages[pageIndex];
            if (currentPage.toBranch) {
                delete currentPage.toBranch;
            }
            setBranchCarrier((prev) => {
                const updated = { ...prev };
                delete updated[pageIndex];
                return updated;
            });
            return { ...prev, pages: updatedPages };
        });
    }

    const handleBranchData = ({
        pageIndex,
        answer,
        targetPage,
        questionNumber,
    }: {
        pageIndex: number;
        answer?: string;
        targetPage?: number;
        questionNumber?: number;
    }) => {
        setFormDataState((prev) => {
            if (!prev || !prev.pages) return prev;
            const updatedPages = [...prev.pages];
            const currentPage = updatedPages[pageIndex];
            if (!currentPage.toBranch) {
                currentPage.toBranch = {};
            }

            let qNum = questionNumber;
            if (qNum === undefined) {
                const keys = Object.keys(currentPage.toBranch);
                qNum = keys.length > 0 ? Number(keys[0]) : 0;
            }

            if(qNum > 0) {
                qNum = qNum - 1;
            }

            if(targetPage !== undefined && targetPage > 0) {
                targetPage = targetPage - 1;
            }

            const existingBranch = currentPage.toBranch[qNum] || {};

            if (JSON.stringify(existingBranch) === JSON.stringify({})) {
                const newBranch = { [qNum]: {
                    assertOn: existingBranch.assertOn !== undefined ? existingBranch.assertOn : "example answer",
                    targetPage: existingBranch.targetPage !== undefined ? existingBranch.targetPage : pageIndex,
                }};

                delete currentPage.toBranch;
                currentPage.toBranch = { ...newBranch };
                setBranchCarrier((prev) => ({ ...prev, [pageIndex]: { questionNumber: qNum! } }));
                return { ...prev, pages: updatedPages };
            }

            currentPage.toBranch[qNum] = {
                assertOn: answer !== undefined ? answer : existingBranch.assertOn,
                targetPage: targetPage !== undefined ? targetPage : existingBranch.targetPage,
            };
            setBranchCarrier((prev) => ({ ...prev, [pageIndex]: { questionNumber: qNum! } }));
            return { ...prev, pages: updatedPages };
        });
    }

    if(!page.toBranch) {
        return <></>;
    }

    return (
        <div className="p-3 border border-gray-200 rounded-md bg-white space-y-3 relative">
            <FaXmark className="text-primary cursor-pointer size-4 md:size-5 absolute right-4 top-4" onClick={() => handleRemoveBranch(index)} />
            <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text">Page Branching</p>
            <div className="flex flex-wrap lg:gap-[2%] gap-4 mb-2">
                <div className="lg:w-[32%] w-full">
                    <NumberField
                        label="Branching Question Number"
                        id={`branching-question-${index}`}
                        placeholder="e.g. 1"
                        value={branchCarrier[index]?.questionNumber !== undefined ? String(branchCarrier[index]?.questionNumber + 1) : ""}
                        onChange={(e) => {
                            const num = e.target.value !== "" ? parseInt(e.target.value) : 0;
                            handleBranchData({ pageIndex: index, questionNumber: num });
                        }}
                    />
                </div>
                <div className="lg:w-[32%] w-full">
                    <InputField
                        label="Answer to Trigger Branch"
                        id={`branching-answer-${index}`}
                        placeholder="e.g. Yes"
                        value={page.toBranch[branchCarrier[index]?.questionNumber]?.assertOn || ""}
                        onChange={(e) => handleBranchData({ pageIndex: index, answer: e.target.value })}
                    />
                </div>
                <div className="lg:w-[32%] w-full">
                    <NumberField
                        label="Page to skip to"
                        id={`branching-targetpage-${index}`}
                        placeholder="e.g. 2"
                        value={page.toBranch[branchCarrier[index]?.questionNumber]?.targetPage !== undefined ? String(page.toBranch[branchCarrier[index]?.questionNumber]?.targetPage + 1) : ""}
                        onChange={(e) => {
                            const num = e.target.value !== "" ? parseInt(e.target.value) : 0;
                            handleBranchData({ pageIndex: index, targetPage: num });
                        }}
                    />
                </div>
            </div>
        </div>
    )
}