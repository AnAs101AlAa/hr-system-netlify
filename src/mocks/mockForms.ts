import type { form } from "@/types/form";

const mockForms: form[] = [
  {
    id: 1,
    title: "Employee Feedback Form",
    description: "Gather feedback from employees about the workplace.",
    pages: [
      {
        title: "Page 1",
        description: "This is the first page.",
            questions: [
      {
        id: 0,
        type: "Essay",
        question: "Describe your experience working here.",
        maxLength: 500,
        isMandatory: true,
      },
     {
        id: 1,
        type: "MCQ",
        question: "Which benefits do you value most?",
        choices: [
          { id: 1, content: "Health Insurance" },
          { id: 2, content: "Flexible Hours" },
          { id: 3, content: "Remote Work" },
        ],
        isMandatory: true,
        isMultiSelect: true,
      },
      {
        id: 2,
        type: "Date",
        question: "When did you join the company?",
        minDate: "2010-01-01",
        maxDate: "2026-12-31",
        isMandatory: true,
      },
      {
        id: 3,
        type: "Number",
        question: "How many years have you worked here?",
        isInteger: true,
        isMandatory: true,
      },
    ], 
      },
      {
        title: "Page 2",
        description: "This is the second page.",
        questions: [],
      },
    ],
  },
  {
    id: 2,
    title: "Training Evaluation",
    description: "Evaluate the recent training session.",
    questions: [
      {
        id: 201,
        type: "Essay",
        question: "What did you like about the training?",
        isMandatory: false,
      },
      {
        id: 202,
        type: "MCQ",
        question: "Rate the trainer's effectiveness.",
        choices: [
          { id: 1, content: "Excellent" },
          { id: 2, content: "Good" },
          { id: 3, content: "Average" },
          { id: 4, content: "Poor" },
        ],
        isMandatory: true,
        isMultipleChoice: false,
      },
    ],
  },
];

export default mockForms;
