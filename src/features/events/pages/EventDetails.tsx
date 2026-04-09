import { useNavigate } from "react-router-dom";
import {
  EventDetailsHeader,
  EventInformation,
  AttendeesList,
  EventNotFound,
  VestEventDetailsView,
  EventModal,
  VestAttendeesList,
} from "@/features/events/components";
import WithNavbar from "@/shared/components/hoc/WithNavbar";
import {
  useEvent,
  useEventAttendees,
  useDeleteEvent,
  useVestEventAttendees,
} from "@/shared/queries/events/eventQueries";
import { useParams } from "react-router-dom";
import { LoadingPage } from "tccd-ui";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { Event } from "@/shared/types/event";
import type { RootState } from "@/shared/redux/store/store";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.roles;
  const isAdmin = userRole?.includes("Admin") || false;

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
  } = useEventAttendees(id ? id : "");

  const {
    data: vestAttendees,
    error: vestAttendeesError,
    isError: isVestAttendeesError,
  } = useVestEventAttendees(id ? id : "");

  const deleteEventMutation = useDeleteEvent();

  const [activeTab, setActiveTab] = useState<"attendance" | "vest">("attendance");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (isEventError && eventError) {
      toast.error("Failed to fetch event details, please try again");
    }
    if (isAttendeesError && attendeesError) {
      toast.error("Failed to fetch event attendees, please try again");
    }
    if (isVestAttendeesError && vestAttendeesError) {
      toast.error("Failed to fetch vest attendees, please try again");
    }
  }, [isEventError, eventError, isAttendeesError, attendeesError, isVestAttendeesError, vestAttendeesError]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = (eventId: string) => {
    if (event && event.id === eventId) {
      setEditingEvent(event);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await deleteEventMutation.mutateAsync(eventId);
        navigate(-1);
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
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

  if (userRole && userRole.length === 1 && userRole[0] === "Vest") {
    return (
      <VestEventDetailsView
        event={event}
        attendees={vestAttendees || []}
        onBack={handleBack}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        setAttendees={() => {}}
      />
    );
  }

  return (
    <WithNavbar>
      <div className="min-h-screen bg-background p-4 text-text-body-main">
        <div className="max-w-6xl mx-auto">
          <EventDetailsHeader 
            onBack={handleBack} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <EventInformation
            event={event}
            attendees={attendees || []}
            vestAttendees={vestAttendees || []}
            onEdit={isAdmin ? handleEdit : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
            activeTab={activeTab}
          />
          
          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <AttendeesList
              attendees={attendees || []}
              eventEndTime={event.endDate}
            />
          )}

          {/* Vest Management Tab */}
          {activeTab === "vest" && (
            <VestAttendeesList
              attendees={vestAttendees || []}
              eventId={event.id}
              setAttendees={() => {}}
            />
          )}
        </div>
      </div>
      <EventModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        event={editingEvent}
        mode="edit"
      />
    </WithNavbar>
  );
};

export default EventDetails;
