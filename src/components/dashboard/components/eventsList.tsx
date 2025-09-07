import type { Event } from "@/types/event";
import EventCard from "./EventCard";

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {

  return (
    <div className="flex flex-wrap gap-3">
      {events.map((event) => (
        <div className="w-full md:w-[48%]" key={event.id}>
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
};

export default EventsList;
