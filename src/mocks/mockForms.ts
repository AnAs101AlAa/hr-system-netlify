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
    title: "CUFE'30 Registration || TCCD",
    description: "Evaluate the recent training session.",
    pages: [
      {
        title: "Personal Information",
        description: "Fill out your personal information below.",
        toBranch: { 6: { assertOn: "No", targetPage: 2 } },
        questions: [
          {
            id: 0,
            type: "Essay",
            question: "Full Name [In English]",
            isMandatory: true,
          },
          {
            id: 1,
            type: "Number",
            question: "Phone Number (Available for calls and Whatsapp)",
            isInteger: true,
            isMandatory: true,
          },
          {
            id: 2,
            type: "MCQ",
            question: "Expected Graduation Year",
            choices: [
              { id: 1, content: "2026" },
              { id: 2, content: "2027" },
              { id: 3, content: "2028" },
              { id: 4, content: "2029" },
              { id: 5, content: "2030" },
            ],
            isMandatory: true,
            isMultiSelect: false,
          },
          {
            id: 3,
            type: "MCQ",
            question: "Education System",
            choices: [
              { id: 1, content: "Mainstream System" },
              { id: 2, content: "Credit-Hours System" },
            ],
            isMandatory: true,
            isMultiSelect: false,
          },
          {
            id: 4,
            type: "Essay",
            question: "LinkedIn Profile",
            isMandatory: false,
          },
          {
            id: 5,
            type: "MCQ",
            question: "Which TCCD services are you interested in?",
            choices: [
              { id: 1, content: "Events" },
              { id: 2, content: "Courses & Workshops" },
              { id: 3, content: "Talks & Sessions" },
              { id: 4, content: "Site Visits & Field trips" },
              { id: 5, content: "Internships" },
              { id: 6, content: "Job Opportunities" },
              { id: 7, content: "Graduation Project Sponsorships" },
            ],
            isMandatory: true,
            isMultiSelect: true,
          },
          {
            id: 6,
            type: "MCQ",
            question: "Looking to joing TCCD?",
            choices: [
              { id: 1, content: "Yes" },
              { id: 2, content: "No" },
            ],
            isMandatory: true,
            isMultiSelect: false,
          }
        ],
      },
      {
        title: "TCCD Membership",
        description: "Answer the following questions if you are looking to join TCCD.",
        questions: []
      }
    ],
  },
];

export default mockForms;
