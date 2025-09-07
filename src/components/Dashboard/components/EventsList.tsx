import type { Event } from "../../../types/event";

interface EventsListProps {
  events: Event[];
}

const EventsList = ({ events }: EventsListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
      {events.map((event) => (
        <div
          key={event.id}
          className="w-full bg-white border border-dashboard-card-border shadow-md rounded-[16px] sm:rounded-[18px] md:rounded-[20px] p-4 sm:p-5 md:p-6 min-h-[80px] sm:min-h-[90px] md:min-h-[100px] lg:min-h-[110px] hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center gap-3">
            <span className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] font-medium">
              {event.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
