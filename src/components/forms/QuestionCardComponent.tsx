import React from 'react';
import type { Question, Answer } from '@/types/question';
import EssayQuestionCard from './EssayQuestionCard';
import MCQQuestionCard from './MCQQuestionCard';
import DateQuestionCard from './DateQuestionCard';
import NumberQuestionCard from './NumberQuestionCard';

interface QuestionCardComponentProps {
  question: Question;
  onAnswerChange: (answer: Answer) => void;
  onErrorChange?: (questionId: string, hasError: boolean) => void;
  initialValue?: Answer;
  showErrors?: boolean;
}

const QuestionCardComponent: React.FC<QuestionCardComponentProps> = ({
  question,
  onAnswerChange,
  onErrorChange,
  initialValue,
  showErrors = false
}) => {
  if (question.type === 'Essay') {
    const essayInitialValue = initialValue && typeof initialValue === 'string'
      ? initialValue
      : undefined;

    return (
      <EssayQuestionCard
        question={question}
        onAnswerChange={onAnswerChange}
        onErrorChange={onErrorChange}
        initialValue={essayInitialValue}
        showErrors={showErrors}
      />
    );
  }

  if (question.type === 'MCQ') {
    const mcqInitialValue = initialValue && typeof initialValue === 'string'
      ? initialValue
      : undefined;

    return (
      <MCQQuestionCard
        question={question}
        onAnswerChange={onAnswerChange}
        onErrorChange={onErrorChange}
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
        question={question}
        onAnswerChange={onAnswerChange}
        onErrorChange={onErrorChange}
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
        question={question}
        onAnswerChange={onAnswerChange}
        onErrorChange={onErrorChange}
        initialValue={numberInitialValue}
      />
    );
  }

  return <div>Unsupported question type</div>;
};

export default QuestionCardComponent;