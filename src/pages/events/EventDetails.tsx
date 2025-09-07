import { useNavigate } from "react-router-dom";
import {
  EventDetailsHeader,
  EventInformation,
  AttendeesList,
  EventNotFound,
} from "../../components/events";
import WithNavbar from "@/components/hoc/WithNavbar";

const EventDetails = () => {
  //   const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  //   const eventId = id ? parseInt(id, 10) : 0;

  //   const { data: event, isLoading, error } = useEvent(eventId);

  //dummy data for events
  const event = {
    id: 1,
    title: "Annual Company Meeting",
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
        notes: "On time",
      },
      {
        id: 2,
        name: "Jane Smith",
        phone: "01552851443", 
        team: "Sales",
        role: "Representative",
        email: "jane.smith@company.com",
        status: "absent" as const,
        notes: "Sick leave",
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
        notes: "Left early for personal reasons",
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

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <WithNavbar>
        <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
            <EventDetailsHeader onBack={handleBack} />
            <EventInformation event={event} />
            <AttendeesList attendees={event.attendees || []} />
        </div>
        </div>
    </WithNavbar>
  );
};

export default EventDetails;
