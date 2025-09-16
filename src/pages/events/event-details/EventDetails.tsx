import { useNavigate } from "react-router-dom";
import {
  EventDetailsHeader,
  EventInformation,
  AttendeesList,
  EventNotFound,
} from "@/components/events";
import WithNavbar from "@/components/hoc/WithNavbar";
import { useEvent } from "@/queries/events/eventQueries";
import { useParams } from "react-router-dom";
import LoadingPage from "@/components/generics/LoadingPage";
import { useEventAttendees } from "@/queries/events/eventQueries";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: event, isLoading, error } = useEvent(id ? id : "");
  const { data: attendees } = useEventAttendees(id ? id : "");

  console.log(attendees);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <EventNotFound
        message="Error Loading Event"
        description="Unable to load event details. Please try again later."
      />
    );
  }

  if (!event) {
    return <EventNotFound />;
  }

  return (
    <WithNavbar>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <EventDetailsHeader onBack={handleBack} />
          <EventInformation event={event} />
          <AttendeesList attendees={attendees || []} eventEndTime={event.endTime} />
        </div>
      </div>
    </WithNavbar>
  );
};

export default EventDetails;
