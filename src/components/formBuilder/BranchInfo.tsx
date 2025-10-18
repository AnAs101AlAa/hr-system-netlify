import { FaXmark } from "react-icons/fa6";
import { InputField, NumberField } from "tccd-ui";
import type { form, formPage, formBranch } from "@/types/form";
import { useState } from "react";
import { forwardRef, useImperativeHandle } from "react";

interface BranchInfoProps {
  setFormDataState: React.Dispatch<React.SetStateAction<form>>;
  index: number;
  page: formPage;
  initialValue?: formBranch;
}

const BranchInfo = forwardRef<{ collect: () => formBranch }, BranchInfoProps>(({ setFormDataState, index, page, initialValue }: BranchInfoProps, ref) => {
  const [branchData, setBranchData] = useState<{questionNumber: string, assertOn: string; targetPage: string }>(initialValue ? {
    questionNumber: initialValue.questionNumber.toString(),
    assertOn: initialValue.assertOn,
    targetPage: initialValue.targetPage.toString(),
  } : { questionNumber: "", assertOn: "", targetPage: "" });

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

  const collectBranchData = () => {
    return {
      questionNumber: parseInt(branchData.questionNumber),
      assertOn: branchData.assertOn,
      targetPage: parseInt(branchData.targetPage),
    };
  }

  useImperativeHandle(ref, () => ({
    collect: collectBranchData,
  }));

  if (!page.toBranch) {
    return <></>;
  }

  return (
    <div className="p-3 border border-gray-200 rounded-md bg-white space-y-3 relative">
      <FaXmark
        className="text-primary cursor-pointer size-4 md:size-5 absolute right-4 top-4"
        onClick={() => handleRemoveBranch(index)}
      />
      <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-inactive-tab-text">
        Page Branching
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
            label="Answer to Trigger Branch"
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
            value={branchData?.targetPage || ""}
            onChange={(e) => setBranchData({ ...branchData, targetPage: e.target.value }) }
          />
        </div>
      </div>
    </div>
  );
});

export default BranchInfo;
