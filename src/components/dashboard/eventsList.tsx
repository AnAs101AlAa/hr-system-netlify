import type { Event } from "@/types/event";
import EventCard from "./EventCard";
interface EventsListProps {
  events: Omit<Event, "attendees">[];
}

const EventsList = ({ events }: EventsListProps) => {

  return (
    <div className="flex flex-wrap gap-[1%] gap-y-4">
      {events.length === 0 ? (
        <p className="text-inactive-tab-text text-center w-full font-semibold text-[16px] md:text-[18px] lg:text-[20px]">No upcoming events.</p>
      ) : (
        events.map((event: Omit<Event, "attendees">) => (
          <div className="w-full md:w-[49.5%]" key={event.id}>
            <EventCard event={event} />
          </div>
        ))
      )}
    </div>
  );
};

export default EventsList;
