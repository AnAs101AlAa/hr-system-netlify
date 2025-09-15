import { QuestionCardComponent } from "@/components/forms";
import { useForm, useSubmitForm } from "@/queries/forms/formQueries";
import type { Answer } from "@/types/question";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/generics/Button";
import FormLoadingComponent from "@/components/forms/Loading";
import ErrorComponent from "@/components/generics/Error";
import type { QuestionCardHandle } from "@/types/form";
import { SUBMISSION_CATCHER } from "@/constants/formConstants";
import { useNavigate } from "react-router-dom";

export default function FormView() {
  const navigate = useNavigate();

  const { formId } = useParams();
  const ID = formId ?? "";
  const { data: formData, isFetching, isError } = useForm(ID);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [, setPageHistory] = useState<number[]>([0]);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const questionRefs = useRef<(QuestionCardHandle | null)[]>([]);

  const submitFormMutation = useSubmitForm(
    ID,
    formData?.sheetName ?? "Guest"
  );

  const handleClear = () => {
    if (!formData) return;
    const questionsOnPage = formData.pages[currentPage].questions;
    questionsOnPage.forEach((_, qIndex) => {
      questionRefs.current[qIndex]?.clear();
    });
  };

  const handleBack = () => {
    setPageHistory((prev) => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setCurrentPage(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  };

  const handlePageAdvance = () => {
    let hasErrors = false;
    const answerArray: Answer[] = [...answers];
    questionRefs.current.forEach((ref) => {
      if (ref?.validate()) {
        hasErrors = true;
      }
      if (ref) {
        const collected = ref.collect();
        const existingIndex = answerArray.findIndex(
          (a: Answer) => a.qid === collected.qid
        );
        if (existingIndex >= 0) {
          answerArray[existingIndex] = collected;
        } else {
          answerArray.push(collected);
        }
      }
    });

    setAnswers(answerArray);

    if (hasErrors) {
      return;
    } else if (formData && currentPage < formData.pages.length - 1) {
      const branch = formData.pages[currentPage].toBranch;
      if (branch) {
        const currentAnswer = answerArray.find((a) => branch[a.qid]);
        if (currentAnswer?.answer == branch[currentAnswer!.qid].assertOn) {
          setCurrentPage(branch[currentAnswer!.qid].targetPage);
          setPageHistory((prev) => [
            ...prev,
            branch[currentAnswer!.qid].targetPage,
          ]);
          return;
        } else {
          setCurrentPage((prev) => prev + 1);
          setPageHistory((prev) => [...prev, currentPage + 1]);
          return;
        }
      } else {
        setCurrentPage((prev) => prev + 1);
        setPageHistory((prev) => [...prev, currentPage + 1]);
      }
    } else {
      handleSubmit(answerArray);
    }
  };

  const handleSubmit = (finalAnswers: Answer[]) => {
    toast.promise(
      submitFormMutation.mutateAsync(finalAnswers).then(() => {
        navigate("/form/finish");
      }),
      {
        loading: "Submitting...",
        error: () =>
          "An error has occurred while submitting your response, Please try again."
      }
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    if (!formData || currentPage >= formData.pages.length) return;
    const questionsOnPage = formData.pages[currentPage].questions;

    questionsOnPage.forEach((question, qIndex) => {
      const answer = answers.find((a) => a.qid === question.id);
      if (answer) {
        questionRefs.current[qIndex]?.reassign(answer);
      }
    });
  }, [currentPage, formData, answers]);

  return (
    <div className="min-h-screen pb-4 md:pb-10 md:pt-4">
      {isFetching && <FormLoadingComponent />}
      {isError && (
        <ErrorComponent
          title="Error Loading Form"
          message="We encountered an error while loading this form, Please try again later."
        />
      )}

      {formData && (
        <div className="w-full md:w-2/3 lg:w-1/3 m-auto md:rounded-xl shadow-md p-5 flex flex-col gap-4 bg-background-primary">
          {/* Form Header */}
          <div className="space-y-4 rounded-lg border-t-10 border-primary p-4 shadow-md bg-background">
            <h1 className="text-2xl lg:text-3xl font-bold text-primary">
              {formData.title}
            </h1>
            {formData.description && (
              <p className="text-[14px] md:text-[15px] lg:text-[16px] text-inactive-tab-text">
                {formData.description}
              </p>
            )}
            <hr className="border-contrast/30" />
            <p className="text-[12px] md:text-[13px] lg:text-[14px] mt-2 text-primary font-semibold">
              * Indicates a required question
            </p>
          </div>

          {/* Form Pages & Questions */}
          {currentPage >= formData.pages.length ? (
            <div className="rounded-lg shadow-md bg-background">
              <div className="py-2 bg-primary mb-4 rounded-t-lg px-4">
                <p className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-text">
                  {SUBMISSION_CATCHER.title}
                </p>
              </div>
              {SUBMISSION_CATCHER.description && (
                <p className="text-[13px] md:text-[14px] lg:text-[15px] mb-6 text-inactive-tab-text px-4">
                  {SUBMISSION_CATCHER.description}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Page Header */}
              <div className="rounded-lg shadow-md bg-background">
                <div className="py-2 bg-primary mb-4 rounded-t-lg px-4">
                  <p className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-text">
                    {formData.pages[currentPage].title}
                  </p>
                </div>
                {formData.pages[currentPage].description && (
                  <p
                    className="text-[13px] md:text-[14px] lg:text-[15px] mb-6 px-4"
                    dangerouslySetInnerHTML={{
                      __html: formData.pages[currentPage].description,
                    }}
                  />
                )}
              </div>

              {/* Questions */}
              {formData.pages[currentPage].questions.map(
                (question: any, qIndex: number) => (
                  <div key={qIndex} className="w-full">
                    <QuestionCardComponent
                      ref={(el) => {
                        questionRefs.current[question.id] = el;
                      }}
                      question={question}
                    />
                  </div>
                )
              )}
            </div>
          )}
          <div className="flex justify-between gap-1.5 md:gap-3 -mt-3 md:mt-8">
            <Button
              buttonText="Clear"
              type="ghost"
              onClick={() => handleClear()}
            />
            <div className="flex-grow" />
            {currentPage > 0 && (
              <Button
                buttonText="Back"
                type="secondary"
                onClick={() => handleBack()}
              />
            )}
            {currentPage < formData.pages.length - 1 ? (
              <Button
                buttonText="Next"
                type="secondary"
                onClick={() => handlePageAdvance()}
              />
            ) : (
              <Button
                buttonText="Submit"
                type="primary"
                onClick={() => handlePageAdvance()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
