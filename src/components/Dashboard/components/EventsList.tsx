import type { Event } from "../../../types/event";

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {

  return (
    <div className="flex flex-wrap gap-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="w-full lg:w-[calc(50%-6px)] bg-white border border-dashboard-card-border shadow-md rounded-[16px] p-4"
        >
          <div className="flex items-center gap-3">
            {event.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
