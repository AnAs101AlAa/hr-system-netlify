import { IoChevronBack } from "react-icons/io5";

interface EventDetailsHeaderProps {
  onBack: () => void;
}

const EventDetailsHeader = ({ onBack }: EventDetailsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="flex items-center text-dashboard-heading hover:text-primary transition-colors"
      >
        <IoChevronBack size={20} className="mr-1" />
      </button>
      <h1 className="text-lg font-bold text-[#626468]">Event Details</h1>
      <div></div> {/* Placeholder for centering the title */}
    </div>
  );
};

export default EventDetailsHeader;
