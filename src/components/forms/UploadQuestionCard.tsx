import { useState, useCallback } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import type { UploadQuestion } from '@/types/question';
import { createUploadValidationSchema } from '@/schemas/questionSchemas';
import { forwardRef, useImperativeHandle } from "react";
import type { QuestionCardHandle } from '@/types/form';

interface UploadQuestionCardProps {
  question: UploadQuestion;
} 

const UploadQuestionCard = forwardRef<QuestionCardHandle, UploadQuestionCardProps>(
  ({ question }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
      try {
        const schema = createUploadValidationSchema(question);
        const hasFiles = files.length > 0 || fileNames.length > 0;

        if (question.isMandatory && !hasFiles) {
          setErrors(["This field is required"]);
          return true;
        }

        if (files.length > 0) {
          const valueToValidate = question.allowMultiple ? files : files[0];
          schema.parse(valueToValidate);
        }

        setErrors([]);
        return false;
      } catch (error: any) {
        if (error.issues) {
          setErrors(error.issues.map((issue: any) => issue.message));
        } else if (error.message) {
          setErrors([error.message]);
        }
        return true;
      }
    }, [files, fileNames, question]);

    useImperativeHandle(ref, () => ({
      validate: validateQuestion,
      collect: () => {
        if (question.allowMultiple) {
          const names = files.length > 0 ? files.map(f => f.name) : fileNames;
          return { qid: question.questionNumber, answer: names };
        } else {
          const name = files[0]?.name ?? fileNames[0] ?? "";
          return { qid: question.questionNumber, answer: name };
        }
      },
      clear: () => {
        setFiles([]);
        setFileNames([]);
      },
      reassign: (ans) => {
        if (Array.isArray(ans.answer)) {
          setFileNames(ans.answer.map(String));
        } else if (ans.answer !== undefined && ans.answer !== null) {
          setFileNames([String(ans.answer)]);
        } else {
          setFileNames([]);
        }
      }
    }));

    return (
      <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
        <div className="flex items-start gap-1.5 md:gap-3">
          <FaQuestionCircle className="text-secondary text-md md:text-lg mt-1 flex-shrink-0" />
          <div className="flex-1 flex items-center gap-1">
            <h3 className="font-bold text-gray-800 text-[14px] md:text-[16px] lg:text-[18px] flex items-center gap-2">
              {question.questionText}
            </h3>
            {question.isMandatory && (
              <FaAsterisk className="text-primary size-2" />
            )}
          </div>
        </div>

        <div>
          <label htmlFor={`question-${question.questionNumber}`} className="block font-medium mb-2">
            Upload file{question.isMandatory ? " *" : ""}
          </label>
          <input
            type="file"
            id={`question-${question.questionNumber}`}
            accept={question.allowedFileTypes?.join(",")}
            multiple={!!question.allowMultiple}
            onChange={(e) => {
              const selected = e.target.files ? Array.from(e.target.files) : [];
              setFiles(selected);
              setFileNames(selected.map(f => f.name));
            }}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
          />

          {/* display selected or reassigned filenames */}
          {fileNames.length > 0 && (
            <div className="mt-2 space-y-1">
              {fileNames.map((name, index) => (
                <div key={index} className="text-gray-700 text-[13px]">
                  {name}
                </div>
              ))}
            </div>
          )}

          {errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="text-primary text-[12px] md:text-[13px] lg:text-[14px] font-medium">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default UploadQuestionCard;