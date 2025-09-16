import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import type { MCQQuestion } from '@/types/question';
import { createMCQValidationSchema } from '@/schemas/questionSchemas';
import Checkbox from '../generics/Checkbox';
import Radiobutton from '../generics/Radiobutton';
import type { QuestionCardHandle } from '@/types/form';
import InputField from '../generics/InputField';

interface MCQQuestionCardProps {
    question: MCQQuestion;
    initialValue?: string;
}

const MCQQuestionCard = forwardRef<QuestionCardHandle, MCQQuestionCardProps>(({
    question,
    initialValue
}, ref) => {
    const [answer, setAnswer] = useState<string | string[]>(initialValue || (question.isMultiSelect ? [] : ''));
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
        try {
            const schema = createMCQValidationSchema(question.isMandatory, question.isMultiSelect);
            schema.parse(answer);
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
    }, [answer, question.isMandatory]);

    const handleAnswerChange = (value: string) => {
        if(question.isMultiSelect) {
            let updated: string[];
            if(answer.includes(value)) {
                updated = (answer as string[]).filter(item => item !== value);
            } else {
                updated = [...(answer as string[]), value];
            }
            setAnswer(updated);
        } else {
            setAnswer(value);
        }
    };

    const clearSelection = () => {
        setAnswer(question.isMultiSelect ? [] : '');
        setErrors([]);
    }

    useImperativeHandle(ref, () => ({
        validate: validateQuestion,
        collect: () => { return { qid: question.id, answer: answer } },
        clear: clearSelection,
        reassign: (ans) => { if (typeof ans.answer === 'string' || Array.isArray(ans.answer)) setAnswer(ans.answer); }
    }));
    
    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
            <div className="flex items-start gap-1.5 md:gap-3">
                <FaQuestionCircle className="text-secondary text-md md:text-lg mt-1 flex-shrink-0" />
                <div className="flex-1 flex items-center gap-1">
                    <h3 className="font-bold text-gray-800 text-[14px] md:text-[16px] lg:text-[18px] flex items-center gap-2">
                        {question.question}
                    </h3>
                    {question.isMandatory && (
                        <FaAsterisk className="text-primary size-2" />
                    )}
                </div>
            </div>
            <div>
                {question.isMultiSelect ? (
                    <div className="flex flex-col gap-3 md:gap-4">
                    {question.choices.map((choice) =>
                        choice.content.toLowerCase() === 'other' ? (
                            <InputField
                                key={choice.id}
                                id={`other-${choice.id}`}
                                label="Other"
                                value={Array.isArray(answer) ? answer.find(ans => ans.startsWith('Other: '))?.replace('Other: ', '') || '' : ''}
                                onChange={(e) => {
                                    const otherValue = e.target.value;
                                    const updatedAnswers = (answer as string[]).filter(ans => !ans.startsWith('Other: '));
                                    if (otherValue) {
                                        updatedAnswers.push(`Other: ${otherValue}`);
                                    }
                                    setAnswer(updatedAnswers);
                                }}
                                placeholder="Please specify"
                            />
                        ) : (
                            <Checkbox
                                key={choice.id}
                                label={choice.content}
                                checked={answer.includes(choice.content)}
                                onChange={() => handleAnswerChange(choice.content)}
                            />
                        )
                    )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 md:gap-4">
                        {question.choices.map((choice) => (
                            choice.content.toLowerCase() === 'other' ? (
                                <InputField
                                    key={choice.id}
                                    id={`other-${choice.id}`}
                                    label="Other"
                                    value={typeof answer === 'string' && answer.startsWith('Other: ') ? answer.replace('Other: ', '') : ''}
                                    onChange={(e) => {
                                        const otherValue = e.target.value;
                                        setAnswer(otherValue ? `Other: ${otherValue}` : '');
                                    }}
                                    placeholder="Please specify"
                                />
                            ) : (
                            <Radiobutton
                                key={choice.id}
                                label={choice.content}
                                checked={answer === choice.content}
                                onChange={() => handleAnswerChange(choice.content)}
                            />
                        )))}
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
});

export default MCQQuestionCard;
