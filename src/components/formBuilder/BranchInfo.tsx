import { FaXmark } from "react-icons/fa6";
import { InputField, NumberField } from "tccd-ui";
import type { form, formBranch, formPage, FormBranchHandle } from "@/types/form";
import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { branchAssertionFormatter } from "@/utils/formViewerUtils";
interface BranchInfoProps {
  setFormDataState: React.Dispatch<React.SetStateAction<form>>;
  index: number;
  page: formPage;
  initialValue?: formBranch;
}

const BranchInfo = forwardRef<FormBranchHandle, BranchInfoProps>(({ setFormDataState, index, page, initialValue }: BranchInfoProps, ref) => {
  const [branchData, setBranchData] = useState<{questionNumber: string, assertOn: string; targetPage: string }>(initialValue ? {
    questionNumber: initialValue.questionNumber.toString(),
    assertOn: initialValue.assertOn,
    targetPage: initialValue.targetPage.toString(),
  } : { questionNumber: "", assertOn: "", targetPage: "" });
  const [branchingMode, setBranchingMode] = useState<boolean>(false);

  const handleRemoveBranch = (pageIndex: number) => {
    setFormDataState((prev) => {
      if (!prev || !prev.pages) return prev;
      const updatedPages = [...prev.pages];
      const currentPage = { ...updatedPages[pageIndex] };

      delete currentPage.toBranch;

      updatedPages[pageIndex] = currentPage;
      return { ...prev, pages: updatedPages };
    });
  };

  const collectBranchData = (questionAnswers: string[]) => {
    const assertionAnswers = branchAssertionFormatter(branchData.assertOn);
    const selectedAnswers = questionAnswers.filter(ans => !assertionAnswers.includes(ans));
    return {
      questionNumber: parseInt(branchData.questionNumber),
      assertOn: branchingMode ? "[" + selectedAnswers.join(", ") + "]" : branchData.assertOn,
      targetPage: parseInt(branchData.targetPage),
    };
  }

  useImperativeHandle(ref, () => ({
    collect: collectBranchData,
    fetchQuestionNumber: () => parseInt(branchData.questionNumber),
  }));

  if (!page.toBranch) {
    return <></>;
  }

  return (
    <div className="p-3 border border-gray-200 rounded-md bg-white space-y-3 relative">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <div className="bg-secondary py-0.5 md:py-1 rounded-full px-3">
          <p className="text-background text-[12px] md:text-[14px] cursor-pointer" onClick={() => setBranchingMode((prev) => !prev)} >{branchingMode ? "Excluding" : "Including"}</p>
        </div>
        <FaXmark
          className="text-primary cursor-pointer size-4 md:size-5"
          onClick={() => handleRemoveBranch(index)}
        />
      </div>
      <p className="text-[15px] md:text-[17px] lg:text-[19px] font-semibold text-inactive-tab-text mb-5">
        Page Branching
      </p>
      <p className="text-[13px] md:text-[14px] lg:text-[15px] text-inactive-tab-text">
        Select the in page question number to base the branching on, the answer to trigger or exclude from triggering the branch based on the selected mode, and the page to skip to.
      </p>
      <div className="flex flex-wrap lg:gap-[2%] gap-4 mb-2">
        <div className="lg:w-[32%] w-full">
          <NumberField
            label="Branching Question Number"
            id={`branching-question-${index}`}
            placeholder="e.g. 1"
            value={branchData?.questionNumber || ""}
            onChange={(e) => { setBranchData({ ...branchData, questionNumber: e.target.value }) }}
          />
        </div>
        <div className="lg:w-[32%] w-full">
          <InputField
            label={`Answer to ${branchingMode ? "not" : ""} Trigger Branch`}
            id={`branching-answer-${index}`}
            placeholder="e.g. Yes"
            value={branchData?.assertOn || ""}
            onChange={(e) =>
              setBranchData({ ...branchData, assertOn: e.target.value })
            }
          />
        </div>
        <div className="lg:w-[32%] w-full">
          <NumberField
            label="Page to skip to"
            id={`branching-targetpage-${index}`}
            placeholder="e.g. 2"
            value={String(parseInt(branchData?.targetPage) + 1)  || ""}
            onChange={(e) => setBranchData({ ...branchData, targetPage: String(parseInt(e.target.value) - 1) }) }
          />
        </div>
      </div>
    </div>
  );
});

export default BranchInfo;
