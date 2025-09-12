import { QuestionCardComponent } from "@/components/forms";
import WithNavbar from "@/components/hoc/WithNavbar";
import {
  useForm,
  useSubmitForm,
} from "@/queries/forms/formQueries";
import type { Answer } from "@/types/question";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import Button from "@/components/generics/Button";
import FormLoadingComponent from "@/components/forms/Loading";
import ErrorComponent from "@/components/generics/Error";

export default function FormView() {
  const { formId } = useParams();
  const ID = formId ? parseInt(formId, 10) : 0;
  const { data: formData, isFetching, isError } = useForm(ID);

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionErrors, setQuestionErrors] = useState<{
    [questionId: string]: boolean;
  }>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);

  const submitFormMutation = useSubmitForm(ID, answers);

  const handleAnswerChange = useCallback((newAnswer: Answer) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.qid === newAnswer.qid);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      } else {
        return [...prev, newAnswer];
      }
    });
  }, []);

  const handleErrorChange = useCallback(
    (questionId: number, hasError: boolean) => {
      setQuestionErrors((prev) => ({
        ...prev,
        [questionId]: hasError,
      }));
    },
    []
  );

  const handleSubmit = () => {
    const hasErrors = Object.values(questionErrors).some(
      (hasError) => hasError
    );
    setShowErrors(true);
    if (hasErrors) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    console.log(answers);

    toast.promise(submitFormMutation.mutateAsync(), {
      loading: "Submitting...",
      success: "Your response has been submitted, Thank You!",
      error: (e) =>
        `Error submitting response: ${e.data?.message || e.message}`,
    });
  };

  return (
    <WithNavbar>
      <div className="min-h-screen bg-background pt-4 pb-4 md:pb-10">
        {isFetching && <FormLoadingComponent />}
        {isError && <ErrorComponent title="Error Loading Form" message="We encountered an error while loading this form, Please try again later."/>}
        {formData && (
          <div className="w-[92%] md:w-3/4 lg:w-2/3 m-auto rounded-xl shadow-md p-5 flex flex-col gap-4 bg-slate-50">
            <h1 className="text-3xl md:text-4xl font-bold text-primary pb-1 p-4">
              {formData.title}
            </h1>
            {formData.description && (
              <p className="text-sm md:text-md lg:text-lg px-4 mb-6 text-inactive-tab-text">
                {formData.description}
              </p>
            )}
            {formData.questions.map((question) => (
              <div className="mb-6" key={question.id}>
                <QuestionCardComponent
                  question={question}
                  onAnswerChange={handleAnswerChange}
                  onErrorChange={handleErrorChange}
                  showErrors={showErrors}
                />
              </div>
            ))}
            <div className="flex justify-center md:justify-end -mt-6 md:mt-8">
              <Button
                buttonText="Submit"
                type="primary"
                onClick={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </WithNavbar>
  );
}
