import { FaXmark } from "react-icons/fa6";
import { InputField, NumberField } from "tccd-ui";
import type { form, formPage } from "@/types/form";

export default function BranchInfo({
  setFormDataState,
  index,
  page,
}: {
  setFormDataState: React.Dispatch<React.SetStateAction<form>>;
  index: number;
  page: formPage;
}) {
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
      const currentPage = { ...updatedPages[pageIndex] };
      const toBranch = { ...(currentPage.toBranch ?? {}) };

      // Get the current active question number from toBranch (first key if exists)
      const existingQNum =
        Object.keys(toBranch).length > 0
          ? parseInt(Object.keys(toBranch)[0])
          : undefined;

      const qNum = questionNumber ?? existingQNum ?? 1;

      // If question number changed → move old entry
      if (existingQNum !== undefined && questionNumber !== undefined && qNum !== existingQNum) {
        const existingBranch = toBranch[existingQNum];
        if (existingBranch) {
          delete toBranch[existingQNum];
          toBranch[qNum] = existingBranch;
        }
      }

      const existingBranch = toBranch[qNum] || {};

      // Normalize target page index (store 0-based)
      const normalizedTarget =
        targetPage !== undefined
          ? Math.max(targetPage - 1, 0)
          : existingBranch.targetPage ?? pageIndex;

      toBranch[qNum] = {
        assertOn: answer ?? existingBranch.assertOn ?? "",
        targetPage: normalizedTarget,
      };

      currentPage.toBranch = toBranch;
      updatedPages[pageIndex] = currentPage;

      return { ...prev, pages: updatedPages };
    });
  };

  if (!page.toBranch) {
    return <></>;
  }

  // Pick the active question number from page.toBranch
  const activeQNum =
    Object.keys(page.toBranch).length > 0
      ? parseInt(Object.keys(page.toBranch)[0])
      : undefined;

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
            value={activeQNum !== undefined ? String(activeQNum) : ""}
            onChange={(e) => {
              const num = e.target.value !== "" ? parseInt(e.target.value) : 1;
              handleBranchData({ pageIndex: index, questionNumber: num });
            }}
          />
        </div>
        <div className="lg:w-[32%] w-full">
          <InputField
            label="Answer to Trigger Branch"
            id={`branching-answer-${index}`}
            placeholder="e.g. Yes"
            value={page.toBranch[activeQNum ?? 1]?.assertOn || ""}
            onChange={(e) =>
              handleBranchData({ pageIndex: index, answer: e.target.value })
            }
          />
        </div>
        <div className="lg:w-[32%] w-full">
          <NumberField
            label="Page to skip to"
            id={`branching-targetpage-${index}`}
            placeholder="e.g. 2"
            value={
              page.toBranch[activeQNum ?? 1]?.targetPage !== undefined
                ? String(page.toBranch[activeQNum ?? 1]!.targetPage + 1)
                : ""
            }
            onChange={(e) => {
              const num = e.target.value !== "" ? parseInt(e.target.value) : 1;
              handleBranchData({ pageIndex: index, targetPage: num });
            }}
          />
        </div>
      </div>
    </div>
  );
}
