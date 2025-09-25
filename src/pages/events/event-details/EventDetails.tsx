import { useNavigate } from "react-router-dom";
import {
  EventDetailsHeader,
  EventInformation,
  AttendeesList,
  EventNotFound,
  VestEventDetailsView,
} from "@/components/events";
import WithNavbar from "@/components/hoc/WithNavbar";
import { useEvent } from "@/queries/events/eventQueries";
import { useParams } from "react-router-dom";
import LoadingPage from "@/components/generics/LoadingPage";
import { useEventAttendees } from "@/queries/events/eventQueries";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { Attendee, VestAttendee } from "@/types/event";
import type { RootState } from "@/redux/store/store";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.roles;

  const {
    data: event,
    isLoading,
    error: eventError,
    isError: isEventError,
  } = useEvent(id ? id : "");

  const {
    data: attendees,
    error: attendeesError,
    isError: isAttendeesError,
  } = useEventAttendees(id ? id : "", userRole ? userRole : []);

  const [displayedAttendees, setDisplayedAttendees] = useState<Attendee[] | VestAttendee[]>([]);

  useEffect(() => {
    if (isEventError && eventError) {
      toast.error(`Failed to fetch event details, please try again`);
    }
    if (isAttendeesError && attendeesError) {
      toast.error(`Failed to fetch event attendees, please try again`);
    }

    if (attendees) {
      setDisplayedAttendees(attendees);
    }
  }, [isEventError, eventError, isAttendeesError, attendeesError, attendees]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isEventError) {
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

  if (userRole && userRole.includes("Vest")) {
    return (
      <VestEventDetailsView
        event={event}
        attendees={displayedAttendees as VestAttendee[]}
        onBack={handleBack}
        setAttendees={setDisplayedAttendees}
      />
    );
  }

  return (
    <WithNavbar>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto">
          <EventDetailsHeader onBack={handleBack} />
          <EventInformation event={event} attendees={displayedAttendees as Attendee[]} />
          <AttendeesList
            attendees={(displayedAttendees as Attendee[]) || []}
            eventEndTime={event.endDate}
          />
        </div>
      </div>
    </WithNavbar>
  );
};

export default EventDetails;
