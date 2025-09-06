import { useState } from "react";
import { WelcomeCard, ActionCards, Pagination, EventsList } from "./components";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  // Mock data for upcoming events
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
  ];

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
    <div className="mx-4 md:flex md:gap-6">
      {/* Left Column - Main Content */}
      <div className="md:w-1/2 space-y-4">
        <WelcomeCard />
        <ActionCards />
      </div>

      {/* Right Column - Pagination and Events (Desktop Only) */}
      <div className="md:w-1/2 space-y-4 md:block">
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          <EventsList events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
