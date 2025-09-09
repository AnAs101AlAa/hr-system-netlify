import React, { useState, useEffect, useCallback } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import type { MCQQuestion, Answer } from '@/types/question';
import { createMCQValidationSchema } from '@/schemas/questionSchemas';

interface MCQQuestionCardProps {
    question: MCQQuestion;
    onAnswerChange: (answer: Answer) => void;
    onErrorChange?: (questionId: number, hasError: boolean) => void;
    initialValue?: number[];
}

const MCQQuestionCard: React.FC<MCQQuestionCardProps> = ({
    question,
    onAnswerChange,
    onErrorChange,
    initialValue
}) => {
    const [answer, setAnswer] = useState<number[]>(initialValue || []);
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
        try {
            const schema = createMCQValidationSchema(question.isMandatory, question.isMultipleChoice);
            schema.parse(answer);
            setErrors([]);
        } catch (error: any) {
            console.log('MCQ validation error:', error);
            if (error.issues) {
                setErrors(error.issues.map((issue: any) => issue.message));
            } else if (error.message) {
                setErrors([error.message]);
            }
        }
    }, [answer, question.isMandatory, question.isMultipleChoice]);

    useEffect(() => {
        validateQuestion();
    }, [validateQuestion]);

    useEffect(() => {
        if (onErrorChange) {
            onErrorChange(question.id, errors.length > 0);
        }
    }, [errors.length, question.id, onErrorChange]);

    const handleChange = (choiceId: number) => {
        let newAnswer: number[];

        if (question.isMultipleChoice) {
            newAnswer = answer.includes(choiceId)
                ? answer.filter(id => id !== choiceId)
                : [...answer, choiceId];
        } else {
            newAnswer = [choiceId];
        }

        setAnswer(newAnswer);

        onAnswerChange({
            qid: question.id,
            answer: newAnswer,
        });

        try {
            const schema = createMCQValidationSchema(question.isMandatory, question.isMultipleChoice);
            schema.parse(newAnswer);
            setErrors([]);
        } catch (error: any) {
            console.log('MCQ validation error in handler:', error);
            if (error.issues) {
                setErrors(error.issues.map((issue: any) => issue.message));
            } else if (error.message) {
                setErrors([error.message]);
            }
        }
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
                </div>
            </div>

            <div className="ml-8">
                <div className="space-y-3">
                    {question.choices.map((choice) => (
                        <label
                            key={choice.id}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type={question.isMultipleChoice ? "checkbox" : "radio"}
                                name={`question-${question.id}`}
                                value={choice.id}
                                checked={answer.includes(choice.id)}
                                onChange={() => handleChange(choice.id)}
                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                            />
                            <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                                {choice.content}
                            </span>
                        </label>
                    ))}
                </div>

                {errors.length > 0 && (
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

export default MCQQuestionCard;
