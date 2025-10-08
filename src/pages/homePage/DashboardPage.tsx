import { useEffect, useMemo, useState } from "react";
import {
  WelcomeCard,
  ActionCards,
  Pagination,
  EventsList,
} from "@/components/dashboard";
import WithNavbar from "@/components/hoc/WithNavbar";
import { useUpcomingEvents } from "@/queries/events/eventQueries";
import { BiLoaderAlt } from "react-icons/bi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store/store";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.roles || [];
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const now = useMemo(() => new Date().toISOString(), []);

  const { data, isLoading, error, isError } = useUpcomingEvents(
    currentPage,
    eventsPerPage,
    now
  );
  const upcomingEvents = data?.items ?? [];
  const totalCount = data?.total ?? 0;

  const totalPages = Math.ceil(totalCount / eventsPerPage);

  useEffect(() => {
    if (isError && error) {
      toast.error(`Failed to fetch upcoming events, please try again`);
    }
  }, [isError, error]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <WithNavbar>
      <div className="mx-4 md:mx-6 lg:mx-8 flex flex-col md:items-center">
        <div className="md:w-[90%] lg:w-[80%] xl:w-3/4 space-y-4 md:space-y-5 lg:space-y-6">
          <WelcomeCard />
          <ActionCards />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center w-full flex-col mt-10">
            <BiLoaderAlt className="animate-spin inline-block text-[26px] text-secondary" />
            <p className="text-inactive-tab-text text-center w-full text-[16px] md:text-[18px] lg:text-[20px]">
              Loading events...
            </p>
          </div>
        ) : (
          <div className="md:w-[90%] lg:w-[80%] xl:w-3/4 space-y-4 md:space-y-5 lg:space-y-6 md:block">
            <div className="mt-3 md:mt-4 lg:mt-5">
              {upcomingEvents.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                  title="Upcoming Events"
                />
              )}
              <EventsList events={upcomingEvents} 
                userRole={userRole}
              />
            </div>
          </div>
        )}
      </div>
    </WithNavbar>
  );
};

export default Dashboard;
