import React, { useState, useEffect, useCallback } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import NumberField from '@/components/generics/NumberField';
import type { NumberQuestion, Answer } from '@/types/question';
import { createNumberValidationSchema } from '@/schemas/questionSchemas';

interface NumberQuestionCardProps {
    question: NumberQuestion;
    onAnswerChange: (answer: Answer) => void;
    onErrorChange?: (questionId: number, hasError: boolean) => void;
    initialValue?: number;
}

const NumberQuestionCard: React.FC<NumberQuestionCardProps> = ({
    question,
    onAnswerChange,
    onErrorChange,
    initialValue
}) => {
    const [answer, setAnswer] = useState<string>(initialValue?.toString() || '');
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
        try {
            const schema = createNumberValidationSchema(question);
            const numValue = answer === '' ? undefined : Number(answer);

            if (question.isMandatory && (answer === '' || isNaN(Number(answer)))) {
                setErrors(['This field is required']);
                return;
            }

            if (answer !== '' && !isNaN(Number(answer))) {
                schema.parse(numValue);
            }

            setErrors([]);
        } catch (error: any) {
            console.log('Number validation error:', error);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAnswer(value);

        const numValue = value === '' ? 0 : Number(value);
        if (!isNaN(numValue)) {
            onAnswerChange({
                qid: question.id,
                answer: numValue,
            });
        }

        try {
            const schema = createNumberValidationSchema(question);
            const validateValue = value === '' ? undefined : Number(value);

            if (question.isMandatory && (value === '' || isNaN(Number(value)))) {
                setErrors(['This field is required']);
                return;
            }

            if (value !== '' && !isNaN(Number(value))) {
                schema.parse(validateValue);
            }

            setErrors([]);
        } catch (error: any) {
            console.log('Number validation error in handler:', error);
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

            <div>
                <NumberField
                    label=""
                    id={`question-${question.id}`}
                    value={answer}
                    placeholder="Enter a number..."
                    onChange={handleChange}
                />

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

export default NumberQuestionCard;