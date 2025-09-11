import React, { useState, useEffect, useCallback } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import DatePicker from '@/components/generics/DatePicker';
import type { DateQuestion, Answer } from '@/types/question';
import { createDateValidationSchema } from '@/schemas/questionSchemas';

interface DateQuestionCardProps {
    question: DateQuestion;
    onAnswerChange: (questionId: string, answer: Answer) => void;
    onErrorChange?: (questionId: string, hasError: boolean) => void;
    initialValue?: string;
}

const DateQuestionCard: React.FC<DateQuestionCardProps> = ({
    question,
    onAnswerChange,
    onErrorChange,
    initialValue
}) => {
    const [answer, setAnswer] = useState<string>(initialValue || '');
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
        try {
            const schema = createDateValidationSchema(question);
            schema.parse(answer);
            setErrors([]);
        } catch (error: any) {
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

    const handleChange = (value: string) => {
        setAnswer(value);

        onAnswerChange(question.id, {
            answer: value,
        });

        try {
            const schema = createDateValidationSchema(question);
            schema.parse(value);
            setErrors([]);
        } catch (error: any) {
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
                <div>
                    <DatePicker
                        label=""
                        id={`question-${question.id}`}
                        value={answer}
                        onChange={handleChange}
                        error={errors.length > 0 ? errors[0] : undefined}
                        minDate={question.minDate}
                        maxDate={question.maxDate}
                    />
                </div>

            </div>
        </div>
    );
};

export default DateQuestionCard;
