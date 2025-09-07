import type { Event } from "@/types/event";
import EventCard from "./EventCard";

interface EventsListProps {
  events: Omit<Event, "attendees">[];
}

const EventsList = ({ events }: EventsListProps) => {

  return (
    <div className="flex flex-wrap gap-[1%] gap-y-4">
      {events.map((event) => (
        <div className="w-full md:w-[49.5%]" key={event.id}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default EventsList;
