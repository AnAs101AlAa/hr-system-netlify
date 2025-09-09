import React from 'react';
import type { Question, Answer } from '@/types/question';
import EssayQuestionCard from './EssayQuestionCard';
import MCQQuestionCard from './MCQQuestionCard';
import DateQuestionCard from './DateQuestionCard';
import NumberQuestionCard from './NumberQuestionCard';

interface QuestionCardComponentProps {
  question: Question;
  onAnswerChange: (answer: Answer) => void;
  onErrorChange?: (questionId: number, hasError: boolean) => void;
  initialValue?: Answer;
}

const QuestionCardComponent: React.FC<QuestionCardComponentProps> = ({
  question,
  onAnswerChange,
  onErrorChange,
  initialValue
}) => {
  if (question.type === 'Essay') {
    const essayInitialValue = initialValue && 'answer' in initialValue && typeof initialValue.answer === 'string'
      ? initialValue.answer
      : undefined;

    return (
      <EssayQuestionCard
        question={question}
        onAnswerChange={onAnswerChange}
        onErrorChange={onErrorChange}
        initialValue={essayInitialValue}
      />
    );
  }

  if (question.type === 'MCQ') {
    const mcqInitialValue = initialValue && 'answer' in initialValue && Array.isArray(initialValue.answer)
      ? initialValue.answer
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
    const dateInitialValue = initialValue && 'answer' in initialValue && typeof initialValue.answer === 'string'
      ? initialValue.answer
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
    const numberInitialValue = initialValue && 'answer' in initialValue && typeof initialValue.answer === 'number'
      ? initialValue.answer
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