import { useState, useCallback, forwardRef, useImperativeHandle  } from 'react';
import { FaQuestionCircle, FaAsterisk } from 'react-icons/fa';
import DatePicker from '@/components/generics/DatePicker';
import type { DateQuestion } from '@/types/question';
import { createDateValidationSchema } from '@/schemas/questionSchemas';
import type { QuestionCardHandle } from '@/types/form';

interface DateQuestionCardProps {
    question: DateQuestion;
    initialValue?: string;
}

const DateQuestionCard = forwardRef<QuestionCardHandle, DateQuestionCardProps>(({
    question,
    initialValue
}, ref) => {
    const [answer, setAnswer] = useState<string>(initialValue || '');
    const [errors, setErrors] = useState<string[]>([]);

    const validateQuestion = useCallback(() => {
        try {
            const schema = createDateValidationSchema(question);
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
    }, [answer, JSON.stringify(question)]);


    useImperativeHandle(ref, () => ({
      validate: validateQuestion,
      collect: () => { return { qid: question.id, answer: answer } },
      clear: () => setAnswer(''),
      reassign: (ans) => { if (typeof ans.answer === 'string') setAnswer(ans.answer); }
    }));
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
                <DatePicker
                    label=""
                    id={`question-${question.id}`}
                    value={answer}
                    onChange={(date) => setAnswer(date)}
                    minDate={question.minDate}
                    maxDate={question.maxDate}
                />

                {errors.length > 0 && (
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

export default DateQuestionCard;
