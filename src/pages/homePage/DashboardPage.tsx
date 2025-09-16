import { useState } from "react";
import {
  WelcomeCard,
  ActionCards,
  Pagination,
  EventsList,
} from "@/components/dashboard";
import WithNavbar from "@/components/hoc/WithNavbar";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const upcomingEvents = [
    {
      id: 1,
      title: "Team Meeting",
      type: "meeting",
      startTime: new Date("2024-10-01T14:00:00"),
      endTime: new Date("2024-10-01T15:00:00"),
    },
    {
      id: 2,
      title: "Project Review",
      type: "review",

      startTime: new Date("2024-10-01T14:00:00"),
      endTime: new Date("2024-10-01T15:00:00"),
    },
    {
      id: 3,
      title: "Training Session",
      type: "session",

      startTime: new Date("2024-10-01T14:00:00"),
      endTime: new Date("2024-10-01T15:00:00"),
    },
    {
      id: 4,
      title: "Client Presentation",
      type: "presentation",

      startTime: new Date("2024-10-01T14:00:00"),
      endTime: new Date("2024-10-01T15:00:00"),
    },
    {
      id: 5,
      title: "Code Review",
      type: "review",

      startTime: new Date("2024-10-01T14:00:00"),
      endTime: new Date("2024-10-01T15:00:00"),
    },
    {
      id: 6,
      title: "Design Review",
      type: "review",

      startTime: new Date("2024-10-02T10:00:00"),
      endTime: new Date("2024-10-02T11:00:00"),
    },
    {
      id: 7,
      title: "Sprint Planning",
      type: "planning",

      startTime: new Date("2024-10-02T14:00:00"),
      endTime: new Date("2024-10-02T16:00:00"),
    },
    {
      id: 8,
      title: "Stakeholder Meeting",
      type: "meeting",

      startTime: new Date("2024-10-03T09:00:00"),
      endTime: new Date("2024-10-03T10:30:00"),
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
    <WithNavbar>
      <div className="mx-4 md:mx-6 lg:mx-8 flex flex-col md:items-center">
        <div className="md:w-[80%] lg:w-2/3 xl:w-3/5 space-y-4 md:space-y-5 lg:space-y-6">
          <WelcomeCard />
          <ActionCards />
        </div>

        <div className="md:w-[80%] lg:w-2/3 xl:w-3/5 space-y-4 md:space-y-5 lg:space-y-6 md:block">
          <div className="mt-3 md:mt-4 lg:mt-5">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevious}
              onNext={handleNext}
              title="Upcoming Events"
            />
            <EventsList events={currentEvents} />
          </div>
        </div>
      </div>
    </WithNavbar>
  );
};

export default Dashboard;
