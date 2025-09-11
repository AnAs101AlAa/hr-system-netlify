import React, { useState, useEffect, useCallback } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import InputField from '@/components/generics/InputField';
import TextAreaField from '@/components/generics/TextAreaField';
import type { EssayQuestion, Answer } from '@/types/question';
import { createEssayValidationSchema } from '@/schemas/questionSchemas';

interface EssayQuestionCardProps {
    question: EssayQuestion;
    onAnswerChange: (questionId: string, answer: Answer) => void;
    onErrorChange?: (questionId: string, hasError: boolean) => void;
    initialValue?: string;
    showErrors?: boolean;
}

const EssayQuestionCard: React.FC<EssayQuestionCardProps> = ({
    question,
    onAnswerChange,
    onErrorChange,
    initialValue,
    showErrors = false
}) => {
    const [answer, setAnswer] = useState<string>(initialValue || '');
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
        try {
            const schema = createEssayValidationSchema(question);
            schema.parse(answer.trim());
            setErrors([]);
        } catch (error: any) {
            console.log('Essay validation error:', error);
            if (error.issues) {
                setErrors(error.issues.map((issue: any) => issue.message));
            } else if (error.message) {
                setErrors([error.message]);
            }
        }
    }, [answer, JSON.stringify(question)]);

    useEffect(() => {
        if (showErrors) {
            validateQuestion();
        } else {
            try {
                const schema = createEssayValidationSchema(question);
                schema.parse(answer.trim());
                if (onErrorChange) {
                    onErrorChange(question.id, false);
                }
            } catch (error: any) {
                if (onErrorChange) {
                    onErrorChange(question.id, true);
                }
            }
            setErrors([]);
        }
    }, [validateQuestion, showErrors]);

    useEffect(() => {
        if (onErrorChange) {
            onErrorChange(question.id, errors.length > 0);
        }
    }, [errors.length, question.id, onErrorChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setAnswer(value);

        onAnswerChange(question.id, {
            answer: value.trim(),
        });
    };

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
            <div className="flex items-start gap-3">
                <FaQuestionCircle className="text-secondary text-lg mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        {question.question}
                        {question.isMandatory && (
                            <FaAsterisk className="text-red-500 text-xs" />
                        )}
                    </h3>
                </div>
            </div>

            <div>
                {renderAnswerField()}

                {showErrors && errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {errors.map((error, index) => (
                            <div key={index} className="text-red-500 text-sm font-medium">
                                {error}
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default EssayQuestionCard;
