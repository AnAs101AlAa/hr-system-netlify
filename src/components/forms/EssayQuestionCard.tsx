import React, { useState, useEffect, useCallback } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import InputField from '@/components/generics/InputField';
import TextAreaField from '@/components/generics/TextAreaField';
import type { EssayQuestion, Answer } from '@/types/question';
import { createEssayValidationSchema } from '@/schemas/questionSchemas';

interface EssayQuestionCardProps {
    question: EssayQuestion;
    onAnswerChange: (answer: Answer) => void;
    onErrorChange?: (questionId: number, hasError: boolean) => void;
    initialValue?: string;
}

const EssayQuestionCard: React.FC<EssayQuestionCardProps> = ({
    question,
    onAnswerChange,
    onErrorChange,
    initialValue
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
        validateQuestion();
    }, [validateQuestion]);

    useEffect(() => {
        if (onErrorChange) {
            onErrorChange(question.id, errors.length > 0);
        }
    }, [errors.length, question.id, onErrorChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setAnswer(value);

        onAnswerChange({
            qid: question.id,
            answer: value.trim(),
        });

        try {
            const schema = createEssayValidationSchema(question);
            schema.parse(value.trim());
            setErrors([]);
        } catch (error: any) {
            console.log('Essay validation error in handler:', error);
            if (error.issues) {
                setErrors(error.issues.map((issue: any) => issue.message));
            } else if (error.message) {
                setErrors([error.message]);
            }
        }
    };

    const renderAnswerField = () => {
        const isTextArea = (question.maxLength && question.maxLength > 100) ||
            (!question.maxLength && !question.isEmail);

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
                    placeholder={question.isEmail ? "Enter your email address..." : "Enter your answer..."}
                    onChange={handleChange}
                    error={errors.length > 0 ? errors[0] : undefined}
                />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
            <div className="flex items-start gap-3">
                <FaQuestionCircle className="text-primary text-lg mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        {question.question}
                        {question.isMandatory && (
                            <FaAsterisk className="text-red-500 text-xs" />
                        )}
                    </h3>

                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                        {question.minLength && question.maxLength && (
                            <div>Length: {question.minLength}-{question.maxLength} characters</div>
                        )}
                        {question.minLength && !question.maxLength && (
                            <div>Minimum: {question.minLength} characters</div>
                        )}
                        {!question.minLength && question.maxLength && (
                            <div>Maximum: {question.maxLength} characters</div>
                        )}
                        {question.isEmail && <div>Must be a valid email address</div>}
                        {(question.preventSmallLetters || question.preventCapitalLetters ||
                            question.preventSpecialChars || question.preventNumbers) && (
                                <div className="flex flex-wrap gap-1">
                                    Restrictions:
                                    {question.preventSmallLetters && <span className="bg-red-100 text-red-700 px-1 rounded">No lowercase</span>}
                                    {question.preventCapitalLetters && <span className="bg-red-100 text-red-700 px-1 rounded">No uppercase</span>}
                                    {question.preventSpecialChars && <span className="bg-red-100 text-red-700 px-1 rounded">No special chars</span>}
                                    {question.preventNumbers && <span className="bg-red-100 text-red-700 px-1 rounded">No numbers</span>}
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <div className="ml-8">
                {renderAnswerField()}

                {errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                        {errors.map((error, index) => (
                            <div key={index} className="text-red-500 text-sm font-medium">
                                {error}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-2 text-xs text-gray-400">
                    Debug: Errors count: {errors.length}, Answer length: {answer.length}, Is mandatory: {question.isMandatory.toString()}
                </div>
            </div>
        </div>
    );
};

export default EssayQuestionCard;
