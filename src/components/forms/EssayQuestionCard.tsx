import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import InputField from '@/components/generics/InputField';
import TextAreaField from '@/components/generics/TextAreaField';
import type { EssayQuestion } from '@/types/question';
import { createEssayValidationSchema } from '@/schemas/questionSchemas';
import type { QuestionCardHandle } from '@/types/form';

interface EssayQuestionCardProps {
    question: EssayQuestion;
    initialValue?: string;
}

const EssayQuestionCard = forwardRef<QuestionCardHandle, EssayQuestionCardProps>(({
    question,
    initialValue,
}, ref) => {
    const [answer, setAnswer] = useState<string>(initialValue || '');
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
        try {
            const schema = createEssayValidationSchema(question);
            schema.parse(answer.trim());
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
    }, [answer, JSON.stringify(question)]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setAnswer(value);
    };

    useImperativeHandle(ref, () => ({
      validate: validateQuestion,
      collect: () => { return { qid: question.id, answer: answer } },
      clear: () => setAnswer(''),
      reassign: (ans) => { if (typeof ans.answer === 'string') setAnswer(ans.answer); }
    }));

    const renderAnswerField = () => {
        const isTextArea = (question.maxLength && question.maxLength > 100) || !question.maxLength;

        if (isTextArea) {
            return (
                <div>
                    <TextAreaField
                        label=""
                        id={`question-${question.id}`}
                        value={answer}
                        placeholder="Enter your answer..."
                        onChange={handleChange}
                        maxLength={question.maxLength}
                    />
                </div>
            );
        }

        return (
            <div>
                <InputField
                    label=""
                    id={`question-${question.id}`}
                    value={answer}
                    placeholder="Enter your answer..."
                    onChange={handleChange}
                    error={errors.length > 0 ? errors[0] : undefined}
                />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
            <div className="flex items-start gap-1.5 md:gap-3">
                <FaQuestionCircle className="text-secondary text-md md:text-lg mt-1 flex-shrink-0" />
                <div className="flex-1 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-[14px] md:text-[16px] lg:text-[18px] flex items-center gap-2">
                        {question.question}
                    </h3>
                    {question.isMandatory && (
                        <FaAsterisk className="text-primary text-xs" />
                    )}
                </div>
            </div>

            <div>
                {renderAnswerField()}

                { errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {errors.map((error, index) => (
                            <div key={index} className="text-primary text-[12px] md:text-[14px] lg:text-[16px] font-medium">
                                {error}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
});

export default EssayQuestionCard;
