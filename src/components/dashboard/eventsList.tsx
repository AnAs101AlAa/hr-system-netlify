import type { Event } from "@/types/event";
import EventCard from "./EventCard";
interface EventsListProps {
  events: Omit<Event, "attendees">[];
}

const EventsList = ({ events }: EventsListProps) => {
  // Ensure events is always an array
  const eventsArray = Array.isArray(events) ? events : [];

  return (
    <div className="flex flex-wrap gap-[1%] gap-y-4">
      {eventsArray.length === 0 ? (
        <p className="text-inactive-tab-text text-center w-full font-semibold text-[20px] md:text-[22px] lg:text-[24px] mt-10">Sorry, no upcoming events to display.</p>
      ) : (
        eventsArray.map((event: Omit<Event, "attendees">) => (
          <div className="w-full md:w-[49.5%] min-h-[270px]" key={event.id}>
            <EventCard event={event} />
          </div>
        ))
      )}
    </div>
  );
};

export default EventsList;
