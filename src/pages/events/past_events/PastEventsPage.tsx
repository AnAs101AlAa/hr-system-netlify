import { EventsList, Pagination } from "@/components/dashboard";
import WithNavbar from "@/components/hoc/WithNavbar";
import SearchField from "@/components/generics/SearchField";
import DropdownMenu from "@/components/generics/dropDownMenu";
import { EventModal } from "@/components/events";
import { useState, useEffect } from "react";
import { usePastEvents } from "@/queries/events/eventQueries";
import EVENT_TYPES from "@/constants/eventTypes";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

const PastEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.roles || [];
  const isAdmin = userRole.includes("Admin");

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
  const {
    data,
    error: eventsError,
    isLoading,
    isError: isEventsError,
  } = usePastEvents(selectedEventType, searchTerm, currentPage, eventsPerPage);
  const pastEvents = data?.items ?? [];
  const totalCount = data?.total ?? 0;
  const totalFilteredPages = Math.max(1, Math.ceil(totalCount / eventsPerPage));

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

  useEffect(() => {
    if (isEventsError && eventsError) {
      toast.error(`Failed to fetch past events, please try again`);
    }
  }, [isEventsError, eventsError]);

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

  const onAdd = () => {
    setIsAddModalOpen(true);
  };

  return (
    <WithNavbar>
      <section className="flex flex-col min-h-screen mb-3">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8 md:space-y-10">
            <div>
              <div className="-mt-2 sm:-mt-5 md:-mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalFilteredPages}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  onAdd={isAdmin ? onAdd : undefined}
                  title="Past Events"
                />
              </div>
              <div className="flex lg:flex-row flex-col lg:justify-between items-center lg:gap-4 lg:mb-0 mb-4 w-full">
                <SearchField
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search past events..."
                />
                <div className="w-full lg:w-64 lg:-mt-6">
                  <DropdownMenu
                    placeholder="Filter by event type"
                    options={[{ value: "", label: "All" }, ...EVENT_TYPES]}
                    value={selectedEventType}
                    onChange={setSelectedEventType}
                  />
                </div>
              </div>

              {/* Error state */}
              {eventsError && (
                <div className="text-center py-8">
                  <p className="text-primary text-lg">
                    Failed to load events. Please try again later.
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!eventsError &&
                pastEvents.length === 0 &&
                pastEvents.length === 0 &&
                !isLoading && (
                  <div className="text-center py-8">
                    <p className="text-muted-secondary text-lg">
                      No past events available.
                    </p>
                  </div>
                )}

              {/* No filtered results */}
              {!eventsError &&
                pastEvents.length === 0 &&
                pastEvents.length > 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-secondary text-lg">
                      No events found matching your search criteria.
                    </p>
                  </div>
                )}

              {isLoading && (
                <div className="flex justify-center items-center w-full flex-col mt-10">
                  <div className="animate-spin inline-block text-[26px] text-secondary">
                    <AiOutlineLoading3Quarters />
                  </div>
                  <p className="text-inactive-tab-text text-center w-full text-[16px] md:text-[18px] lg:text-[20px]">
                    Loading events...
                  </p>
                </div>
              )}
              {/* Events list */}
              {!eventsError && pastEvents.length > 0 && (
                <EventsList events={pastEvents} userRole={userRole} />
              )}
            </div>
          </div>
        </div>

        {/* Add Event Modal */}
        <EventModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          event={null}
          mode="create"
        />
      </section>
    </WithNavbar>
  );
};

export default PastEventsPage;
