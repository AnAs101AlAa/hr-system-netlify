import { QuestionCardComponent } from "@/components/forms";
import WithNavbar from "@/components/hoc/WithNavbar";
import {
  useForm,
  useSubmitForm,
} from "@/queries/forms/formQueries";
import type { Answer } from "@/types/question";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/generics/Button";
import FormLoadingComponent from "@/components/forms/Loading";
import ErrorComponent from "@/components/generics/Error";
import type { formPage, QuestionCardHandle } from "@/types/form";

export default function FormView() {
  const { formId } = useParams();
  const ID = formId ? parseInt(formId, 10) : 0;
  const { data: formData, isFetching, isError } = useForm(ID);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const questionRefs = useRef<(QuestionCardHandle | null)[]>([]);

  const submitFormMutation = useSubmitForm(ID, answers);

  const handleClear = () => {
    if (!formData) return;
    const questionsOnPage = formData.pages[currentPage].questions;
    questionsOnPage.forEach((_, qIndex) => {
      questionRefs.current[qIndex]?.clear();
    });
  };

  const handlePageAdvance = () => {
    let hasErrors = false;
    questionRefs.current.forEach((ref) => {
      if(ref?.validate()) {
        hasErrors = true;
      }
      setAnswers((prev) => {
        const existingIndex = prev.findIndex((a) => a.qid === ref?.collect().qid);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = ref?.collect() as Answer;
          return updated;
        } else {
          return [...prev, ref?.collect() as Answer];
        }
    });
    });

    if (hasErrors) {
      return;
    } else if (formData && currentPage < formData.pages.length - 1) {

      setCurrentPage((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  }

  const handleSubmit = () => {
    console.log(answers);
    toast.promise(submitFormMutation.mutateAsync(), {
      loading: "Submitting...",
      success: "Your response has been submitted, Thank You!",
      error: (e) =>
        `Error submitting response: ${e.data?.message || e.message}`,
    });
  };

  useEffect(() => {
    if (!formData) return;
    const questionsOnPage = formData.pages[currentPage].questions;

    questionsOnPage.forEach((question, qIndex) => {
      const answer = answers.find((a) => a.qid === question.id);
      if (answer) {
        questionRefs.current[qIndex]?.reassign(answer);
      }
    });
  }, [currentPage, formData, answers]);


  return (
    <WithNavbar>
      <div className="min-h-screen pb-4 md:pb-10 md:pt-4">
        {isFetching && <FormLoadingComponent />}
        {isError && <ErrorComponent title="Error Loading Form" message="We encountered an error while loading this form, Please try again later."/>}
        {formData && (
          <div className="w-full md:w-2/3 lg:w-1/2 m-auto md:rounded-xl shadow-md p-5 flex flex-col gap-4 bg-background-primary">
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
            {[formData.pages[currentPage]].map((page: formPage, pageIndex: number) => (
              <div className="flex flex-col gap-4" key={pageIndex}>
                {/* Page Header */}
                <div key={pageIndex} className="rounded-lg shadow-md bg-background">
                  <div className="py-2 bg-primary mb-4 rounded-t-lg px-4">
                    <p className="text-[14px] md:text-[15px] lg:text-[16px] font-bold text-text">
                      {page.title}
                    </p>
                  </div>
                  {formData.description && (
                    <p className="text-[13px] md:text-[14px] lg:text-[15px] mb-6 text-inactive-tab-text px-4">
                      {formData.description}
                    </p>
                  )}
                </div>

                {/* Questions */}
                {page.questions.map((question, qIndex) => (
                  <div key={qIndex} className="w-full">
                    <QuestionCardComponent
                      ref={(el) => { questionRefs.current[question.id] = el; }}
                      question={question}
                    />
                  </div>
                ))}
              </div>
              ))}
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
                    onClick={() => {
                      setCurrentPage((prev) => prev - 1);
                    }}
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
                  onClick={handleSubmit}
                />)}
            </div>
          </div>
        )}
      </div>
    </WithNavbar>
  );
}
