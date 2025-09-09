import { EventsList, Pagination } from "@/components/dashboard";
import WithNavbar from "@/components/hoc/WithNavbar";
import SearchField from "@/components/generics/SearchField";
import DropdownMenu from "@/components/generics/dropDownMenu";
import { useState, useEffect, useMemo } from "react";
import { usePastEvents, useEventTypes } from "@/queries/events/eventQueries";

const PastEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");

  // Fetch past events and event types from API
  const { data: pastEvents = [], error: eventsError } = usePastEvents();
  const { data: eventTypes = [], error: typesError } = useEventTypes();

  // Handle errors - errors are already displayed via toast in the query hooks
  // but we could add additional error handling here if needed
  useEffect(() => {
    if (eventsError || typesError) {
      // Additional error handling can be added here if needed
      // The errorHandler utility already shows toast notifications
      console.error('API Error:', { eventsError, typesError });
    }
  }, [eventsError, typesError]);

  // Transform event types for dropdown options
  const eventTypeOptions = useMemo(() => {
    const allEventsOption = { value: "", label: "All Events" };
    const typeOptions = eventTypes.map(type => ({
      value: type.id,
      label: type.label
    }));
    return [allEventsOption, ...typeOptions];
  }, [eventTypes]);

  // Responsive events per page - fewer on mobile, more on desktop
  const getEventsPerPage = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 4; // Mobile: 4 events
      //   if (window.innerWidth < 1024) return 6; // Tablet: 6 events
      //   if (window.innerWidth < 1536) return 8; // Desktop: 8 events
      return 6; // Large desktop: 6 events
    }
    return 6; // Default fallback
  };

  const [eventsPerPage, setEventsPerPage] = useState(getEventsPerPage());

  // Update events per page on window resize
  useEffect(() => {
    const handleResize = () => {
      setEventsPerPage(getEventsPerPage());
      // Reset to first page when changing layout
      setCurrentPage(1);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Filter events based on search term and event type
  const filteredEvents = pastEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedEventType === "" || event.type === selectedEventType;
    return matchesSearch && matchesType;
  });

  const totalFilteredPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // Reset to first page when search term or event type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedEventType]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalFilteredPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <WithNavbar>
      <section className="flex flex-col items-center min-h-screen">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
              <Pagination
                currentPage={currentPage}
                totalPages={totalFilteredPages}
                onPrevious={handlePrevious}
                onNext={handleNext}
                title="Past Events"
              />
              <div className="flex lg:flex-row flex-col lg:justify-between items-center lg:gap-4 lg:mb-0 mb-4 w-full">
                <SearchField
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search past events..."
                />
                <div className="w-full lg:w-64">
                  <DropdownMenu
                    placeholder="Filter by event type"
                    options={eventTypeOptions}
                    value={selectedEventType}
                    onChange={setSelectedEventType}
                  />
                </div>
              </div>
              
              {/* Error state */}
              {(eventsError || typesError) && (
                <div className="text-center py-8">
                  <p className="text-red-600 text-lg">
                    Failed to load events. Please try again later.
                  </p>
                </div>
              )}
              
              {/* Empty state */}
              {!eventsError && !typesError && currentEvents.length === 0 && pastEvents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-secondary text-lg">
                    No past events available.
                  </p>
                </div>
              )}
              
              {/* No filtered results */}
              {!eventsError && !typesError && currentEvents.length === 0 && pastEvents.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-secondary text-lg">
                    No events found matching your search criteria.
                  </p>
                </div>
              )}
              
              {/* Events list */}
              {!eventsError && !typesError && currentEvents.length > 0 && (
                <EventsList events={currentEvents} />
              )}
            </div>
          </div>
        </div>
      </section>
    </WithNavbar>
  );
};

export default PastEventsPage;
