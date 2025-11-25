import { useNavigate } from "react-router-dom";
import { Button } from "tccd-ui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Event } from "@/shared/types/event";
import { format } from "@/shared/utils";
import EventDeleteModal from "./EventDeleteModal";

interface EventsTableProps {
    events: Event[];
    setOpenModal: React.Dispatch<React.SetStateAction<number>>;
}

const EventsTable = ({ events, setOpenModal }: EventsTableProps) => {
     const navigate = useNavigate();
    const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
    const [displayedEvents, setDisplayedEvents] = useState<Event[]>(events);
    const [showDeleteModal, setShowDeleteModal] = useState("");

    useEffect(() => {
        setDisplayedEvents(events);
    }, [events]);
  
  return (
    <div className="hidden lg:block overflow-x-auto">
      <EventDeleteModal eventId={showDeleteModal} isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal("")} />
        
      <table className="w-full">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Start Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              End Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C]">
              Location
            </th>
            {userRoles.includes("Admin") && (
              <th className="px-4 py-3 text-left text-sm font-medium text-[#555C6C] whitespace-nowrap">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-gray-100">
          {displayedEvents && displayedEvents.length > 0 ? (
            displayedEvents.map((event, index) => (
              <tr
                key={event.id || index}
                className="hover:bg-gray-50 transition-colors"
              >
              <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {event.title || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {format(event.startDate, "full") || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                    {format(event.endDate, "full") || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-4">
                    <div className="font-medium text-dashboard-card-text whitespace-nowrap">
                      {event.location || "N/A"}
                    </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                      {userRoles.includes("Admin") && (
                        <>
                        <Button
                        type="tertiary"
                        onClick={() => setOpenModal(2)}
                        buttonText="Edit"
                        width="fit"
                        />
                        <Button
                        type="danger"
                        onClick={() => setShowDeleteModal(event.id)}
                        buttonText="Delete"
                        width="fit"
                        />
                        </>
                      )}
                      <Button
                          type="secondary"
                          buttonText="Details"
                          onClick={() => { navigate(`/events/${event.id}`); }}
                          width="fit"
                      />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center">
                <div className="text-dashboard-description">
                  <p className="text-lg font-medium">No events found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
