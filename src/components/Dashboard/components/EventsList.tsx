
import type { Event } from "../../../types/event";

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-dashboard-heading font-bold text-[16px] mb-3">
        Recent Events
      </h3>

      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white border border-dashboard-card-border shadow-md rounded-[16px] p-4"
        >
          card
        </div>
      ))}
    </div>
  );
};

export default EventsList;
