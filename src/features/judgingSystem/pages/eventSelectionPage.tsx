import WithNavbar from "@/shared/components/hoc/WithNavbar";
import { useAllEvents } from "@/shared/queries/events";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SearchField, Button } from "tccd-ui";
import type { Event } from "@/shared/types/event";
import { format } from "@/shared/utils";
import ConditionalWrapper from "@/shared/utils/conditionalWrapper";
import { useSelector } from "react-redux";
import logo from "@/assets/TCCD_logo.svg";

export default function EventSelectionPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
    const isJudge = userRoles.includes("Judge") && userRoles.length === 1;

    const [eventSearchTerm, setEventSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(eventSearchTerm);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearchTerm(eventSearchTerm), 300);
        return () => clearTimeout(t);
    }, [eventSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const { data, isLoading } = useAllEvents(currentPage, 10, "ResearchDay", debouncedSearchTerm, ["Upcoming","Running"]);
    const events = data?.items ?? [];
    const [selectedEvent, setSelectedEvent] = useState<string>("");

    const children = (
        <div className="p-4 w-[94%] md:w-[90%] lg:w-[80%] xl:w-[70%] mx-auto">
        <p className="lg:text-[26px] md:text-[24px] text-[22px] font-bold text-center mb-2">Welcome to our Judging System</p>
        <p className="mb-6 lg:text-[18px] md:text-[15px] text-[14px] font-semibold text-center">Please select the event you wish to evaluate or manage the teams of</p>
        <div className="w-full rounded-lg shadow-lg md:p-4 p-2">
            <SearchField className="lg:w-48" placeholder="Search event name..." value={eventSearchTerm} onChange={(value) => setEventSearchTerm(value)} />
            <div className="max-h-[60vh] mt-4 overflow-x-auto">
                {(isLoading) ? (
                    <p className="text-center text-inactive-tab-text mt-10">Loading events...</p>
                ) : (events?.length === 0) ? (
                    <p className="text-center text-inactive-tab-text mt-10">No events found.</p>
                ) : (
                    <>
                    <table className="w-full text-left border-gray-100 rounded-xl border">
                        <thead className="bg-gray-100 border-b border-dashboard-border rounded-t-xl">
                            <tr>
                                <th className="px-3 py-2 text-sm font-semibold text-inactive-tab-text">Name</th>
                                <th className="px-3 py-2 text-sm font-semibold text-inactive-tab-text">Start Date</th>
                                <th className="px-3 py-2 text-sm font-semibold text-inactive-tab-text">End Date</th>
                                <th className="px-3 py-2 text-sm font-semibold text-inactive-tab-text">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {events?.map((event: Event) => (
                                <tr key={event.id} className={`h-12 md:h-16 text-[13px] md:text-[14px] lg:text-[16px] whitespace-nowrap rounded-lg cursor-pointer ${selectedEvent === event.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`} onClick={() => setSelectedEvent(event.id)}>
                                    <td className="px-3 py-2">{event.title}</td>
                                    <td className="px-3 py-2">{format(event.startDate, "full")}</td>
                                    <td className="px-3 py-2">{format(event.endDate, "full")}</td>
                                    <td className="px-3 py-2">{event.location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </>
                )}
            </div>
            <div className="flex justify-center items-center gap-3 mt-4">
                <FaChevronLeft className={`cursor-pointer size-4 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`} onClick={() => {
                    if (currentPage > 1 && !isLoading) {
                        setCurrentPage(currentPage - 1);
                    }
                }} />
                <span className="text-[14px] md:text-[15px] lg:text-[16px] font-medium text-contrast">
                    Page {currentPage}
                </span>
                <FaChevronRight className={`cursor-pointer size-4 ${events && events.length < 10 ? "text-gray-300 cursor-not-allowed" : "text-contrast hover:text-primary"}`} onClick={() => {
                    if (events && events.length === 10 && !isLoading) {
                        setCurrentPage(currentPage + 1);
                    }
                }} />
            </div>
            <div className="mt-3 md:mt-5 mb-2 flex justify-center items-center gap-3">
                <Button type="primary" onClick={() => { if (selectedEvent) window.location.href = `/judging-system/teams/${selectedEvent}` }} buttonText="Confirm" disabled={!selectedEvent} />
            </div>
        </div>
      </div>
    )


  return (
    <ConditionalWrapper condition={!isJudge} wrapper={(children) => <WithNavbar>{children}</WithNavbar>}>
        <>
        <img src={logo} alt="TCCD Logo" className="w-24 md:w-28 h-auto mx-auto mt-6" />
        {children}
        </>
    </ConditionalWrapper>
  )
}