import { useState } from "react";
import { WelcomeCard, ActionCards, Pagination, EventsList } from "./components";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4; 

  const upcomingEvents = [
    {
      id: 1,
      title: "Team Meeting",
      startTime: "2024-10-01T14:00:00",
      endTime: "2024-10-01T15:00:00",
    },
    {
      id: 2,
      title: "Project Review",
      startTime: "2024-10-01T14:00:00",
      endTime: "2024-10-01T15:00:00",
    },
    {
      id: 3,
      title: "Training Session",
      startTime: "2024-10-01T14:00:00",
      endTime: "2024-10-01T15:00:00",
    },
    {
      id: 4,
      title: "Client Presentation",
      startTime: "2024-10-01T14:00:00",
      endTime: "2024-10-01T15:00:00",
    },
    {
      id: 5,
      title: "Code Review",
      startTime: "2024-10-01T14:00:00",
      endTime: "2024-10-01T15:00:00",
    },
    {
      id: 6,
      title: "Design Review",
      startTime: "2024-10-02T10:00:00",
      endTime: "2024-10-02T11:00:00",
    },
    {
      id: 7,
      title: "Sprint Planning",
      startTime: "2024-10-02T14:00:00",
      endTime: "2024-10-02T16:00:00",
    },
    {
      id: 8,
      title: "Stakeholder Meeting",
      startTime: "2024-10-03T09:00:00",
      endTime: "2024-10-03T10:30:00",
    },
  ];

  const totalPages = Math.ceil(upcomingEvents.length / eventsPerPage);

  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = upcomingEvents.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="mx-4 md:gap-6 flex flex-col md:items-center">
      <div className="md:w-3/5 space-y-4">
        <WelcomeCard />
        <ActionCards />
      </div>

      <div className="md:w-3/5 space-y-4 md:block">
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          <EventsList events={currentEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
