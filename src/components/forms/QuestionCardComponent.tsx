import type { Question, Answer } from '@/types/question';
import EssayQuestionCard from './EssayQuestionCard';
import MCQQuestionCard from './MCQQuestionCard';
import DateQuestionCard from './DateQuestionCard';
import NumberQuestionCard from './NumberQuestionCard';
import { forwardRef } from 'react';
import type { QuestionCardHandle } from '@/types/form';

interface QuestionCardComponentProps {
  question: Question;
  initialValue?: Answer;
}

const QuestionCardComponent = forwardRef<QuestionCardHandle, QuestionCardComponentProps>(({
  question,
  initialValue,
}, ref) => {


  if (question.type === 'Essay') {
    const essayInitialValue = initialValue && typeof initialValue === 'string'
      ? initialValue
      : undefined;

    return (
      <EssayQuestionCard
        ref={ref}
        question={question}
        initialValue={essayInitialValue}
      />
    );
  }

  if (question.type === 'MCQ') {
    const mcqInitialValue = initialValue && typeof initialValue === 'string'
      ? initialValue
      : undefined;

    return (
      <MCQQuestionCard
        ref={ref}
        question={question}
        initialValue={mcqInitialValue}
      />
    );
  }

  if (question.type === 'Date') {
    const dateInitialValue = initialValue && typeof initialValue === 'string'
      ? initialValue
      : undefined;

    return (
      <DateQuestionCard
        ref={ref}
        question={question}
        initialValue={dateInitialValue}
      />
    );
  }

  if (question.type === 'Number') {
    const numberInitialValue = initialValue && typeof initialValue === 'number'
      ? initialValue
      : undefined;

    return (
      <NumberQuestionCard
        ref={ref}
        question={question}
        initialValue={numberInitialValue}
      />
    );
  }

  return <div>Unsupported question type</div>;
});

export default QuestionCardComponent;