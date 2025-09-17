import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  EventDetailsHeader,
  EventInformation,
  AttendeesList,
  EventNotFound,
  VestEventDetailsView,
  VestEventLoadingSkeleton,
} from "@/components/events";
import WithNavbar from "@/components/hoc/WithNavbar";
import type { RootState } from "@/redux/store/store";

const EventDetails = () => {
  //   const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  //   const eventId = id ? parseInt(id, 10) : 0;

  //   const { data: event, isLoading, error } = useEvent(eventId);

  // TODO: uncomment and replace with actual data fetching logic
  // Get user role from Redux
  // const userRole = useSelector((state: RootState) => state.auth.user?.role);

  // Loading state for vest view
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for 0.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  //dummy data for events
  const event = {
    id: 1,
    title: "Annual Company Meeting",
    type: "meeting",
    startTime: new Date("2023-10-15T09:00:00"),
    endTime: new Date("2023-10-15T17:00:00"),
    attendees: [
      {
        id: 1,
        name: "Ahmed Fathy",
        phone: "201552851443",
        team: "IT",
        role: "Frontend Developer",
        email: "john.doe@company.com",
        status: "arrived" as const,
        arrivalTime: new Date("2023-10-15T09:05:00"),
        departureTime: new Date("2023-10-15T16:55:00"),
        lateArrivalReason: "Traffic jam",
      },
      {
        id: 2,
        name: "Jane Smith",
        phone: "01552851443",
        team: "Sales",
        role: "Representative",
        email: "jane.smith@company.com",
        status: "absent" as const,
      },
      {
        id: 3,
        name: "Alice Johnson",
        phone: "+201012345678",
        team: "Development",
        role: "Developer",
        email: "alice.johnson@company.com",
        status: "left" as const,
        arrivalTime: new Date("2023-10-15T09:15:00"),
        departureTime: new Date("2023-10-15T12:00:00"),
        lateArrivalReason: "Doctor appointment",
        earlyLeavingReason: "Personal family emergency",
      },
    ],
  };

  // Vest-specific dummy data
  const vestEvent = {
    id: 1,
    title: "Annual Company Meeting",
    type: "meeting",
    startTime: new Date("2023-10-15T09:00:00"),
    endTime: new Date("2023-10-15T17:00:00"),
    attendees: [
      {
        id: 1,
        name: "Ahmed Fathy",
        phone: "201552851443",
        committee: "IT Committee",
        vestStatus: "assigned" as const,
      },
      {
        id: 2,
        name: "Jane Smith",
        phone: "01552851443",
        committee: "Marketing Committee",
        vestStatus: "returned" as const,
      },
      {
        id: 3,
        name: "Alice Johnson",
        phone: "+201012345678",
        committee: "Development Committee",
        vestStatus: "unassigned" as const,
      },
      {
        id: 4,
        name: "Mohamed Hassan",
        phone: "+201234567890",
        committee: "Finance Committee",
        vestStatus: "assigned" as const,
      },
      {
        id: 5,
        name: "Sarah Ahmed",
        phone: "+201098765432",
        committee: "HR Committee",
        vestStatus: "returned" as const,
      },
      {
        id: 6,
        name: "Omar Khaled",
        phone: "+201555666777",
        committee: "Operations Committee",
        vestStatus: "unassigned" as const,
      },
      {
        id: 7,
        name: "Fatima Nour",
        phone: "+201777888999",
        committee: "Quality Assurance Committee",
        vestStatus: "assigned" as const,
      },
    ],
  };

  const handleBack = () => {
    navigate(-1);
  };

  //   if (isLoading) {
  //     return <EventLoadingSkeleton />;
  //   }

  //   if (error) {
  //     return (
  //       <EventNotFound
  //         message="Error Loading Event"
  //         description="Unable to load event details. Please try again later."
  //       />
  //     );
  //   }
  // TODO: remove this hardcoded line
  let userRole = "vest"; // for testing vest role view
  if (!event) {
    return <EventNotFound />;
  }

  // Render vest-specific view if user has vest role
  if (userRole === "vest") {
    // Show loading skeleton for vest view
    if (isLoading) {
      return (
        <WithNavbar>
          <div className="min-h-screen bg-background p-4">
            <div className="max-w-6xl mx-auto">
              <EventDetailsHeader onBack={handleBack} />
              <VestEventLoadingSkeleton />
            </div>
          </div>
        </WithNavbar>
      );
    }
    return <VestEventDetailsView event={vestEvent} onBack={handleBack} />;
  }

  // Default view for other roles
  return (
    <WithNavbar>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <EventDetailsHeader onBack={handleBack} />
          <EventInformation event={event} />
          <AttendeesList attendees={event.attendees || []} />
        </div>
      </div>
    </WithNavbar>
  );
};

export default EventDetails;
