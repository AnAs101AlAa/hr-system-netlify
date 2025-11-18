import { SearchField, DropdownMenu } from "tccd-ui";
import { useState, useEffect } from "react";
import EventTable from "./EventTable";
import EventCardView from "./EventCardView";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useAllEvents } from "@/shared/queries/events";
import EVENT_TYPES from "@/constants/eventTypes";

const EventList = ({setModalOpen, fetchedEventStatuses} : {setModalOpen?: React.Dispatch<React.SetStateAction<number>>, fetchedEventStatuses: string[]}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKey, setSearchKey] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchKey);
    
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearchTerm(searchKey), 300);
        return () => clearTimeout(t);
    }, [searchKey]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const [selectedEventType, setSelectedEventType] = useState<string>("");
    const { data, isLoading, isError } = useAllEvents(currentPage, 20, selectedEventType, debouncedSearchTerm, fetchedEventStatuses);
    const events = data?.items ?? [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-dashboard-card-border overflow-hidden">
      <div className="p-4 border-b border-dashboard-border space-y-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-md md:text-lg lg:text-xl font-bold text-[#72747A]">
            Events {events ? `(${events.length})` : ""}
          </p>
          <div className="flex gap-2 items-center justify-center">
            <FaChevronLeft
              className={`cursor-pointer size-4 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
            />
            <span className="text-[14px] md:text-[15px] lg:text-[16px] font-medium text-contrast">
              Page {currentPage}
            </span>
            <FaChevronRight
              className={`cursor-pointer size-4 ${events && events.length < 20 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`}
              onClick={() => {
                if (events && events.length === 20) {
                  setCurrentPage(currentPage + 1);
                }
              }}
            />
          </div>
        </div>
        <hr className="border-gray-200" />
        <p className="text-[14px] md:text-[15px] lg:text-[16px] font-semibold text-contrast">Filters</p>
        <div className="flex gap-2 md:flex-row flex-col justify-between">
          <SearchField
            placeholder="Search Event Name..."
            value={searchKey}
            onChange={(value) => setSearchKey(value)}
          />
          <div className="flex-col flex flex-1 justify-end md:flex-row gap-2">
            <div className="flex-grow md:max-w-64">
              <DropdownMenu
                options={EVENT_TYPES}
                value={selectedEventType}
                onChange={(val) => setSelectedEventType(val)}
                placeholder="Event Type"
              />
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-contrast">Loading events...</p>
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-contrast">Error loading events. Please try again.</p>
        </div>
      ) : (
      <>
        {/* Desktop Table View */}
        <EventTable
          events={events || []}
          setOpenModal={setModalOpen? setModalOpen : () => {}}
        />

        {/* Mobile Card View */}
        <EventCardView
          events={events || []}
          setOpenModal={setModalOpen? setModalOpen : () => {}}
        />
      </>
      )}
    </div>
  );
};

export default EventList;
