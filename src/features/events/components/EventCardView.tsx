import { Button } from "tccd-ui";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoTrashSharp } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { useSelector } from "react-redux";
import type { Event } from "@/shared/types/event";
import { format } from "@/shared/utils";
import EventDeleteModal from "./EventDeleteModal";

interface EventCardViewProps {
  events: Event[];
  setOpenModal: React.Dispatch<React.SetStateAction<number>>;
}

const TeamCardView = ({
  events,
  setOpenModal
}: EventCardViewProps) => {
  const navigate = useNavigate();
  const userRoles = useSelector((state: any) => state.auth.user?.roles || []);
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>(events);
  
  useEffect(() => {
    setDisplayedEvents(events);
  }, [events]);

  return (
    <div className="lg:hidden divide-y divide-gray-100">
      <EventDeleteModal eventId={showDeleteModal} isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal("")} />
        
      {displayedEvents && displayedEvents.length > 0 ? (
        displayedEvents.map((event, index) => (
          <div key={event.id || index} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-contrast text-[18px] md:text-[20px]">
                  {event.title || "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <span className="font-medium text-dashboard-heading">
                  Start Date:
                </span>
                <p className="text-dashboard-card-text">
                  {format(event.startDate, "full") || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-dashboard-heading">
                  End Date:
                </span>
                <p className="text-dashboard-card-text">
                  {format(event.endDate, "full") || "N/A"}
                </p>
              </div>
            </div>

            {userRoles.includes("Admin") &&
                <div className="mt-4 flex justify-center items-center gap-3">
                    <Button
                        type="tertiary"
                        onClick={() => setOpenModal(2)}
                        buttonIcon={<FaEdit size={16} />}
                        width="fit"
                    />
                    <Button
                        type="danger"
                        onClick={() => setShowDeleteModal(event.id || "")}
                        buttonIcon={<IoTrashSharp size={17} />}
                        width="fit"
                    />
                    <Button
                    type="secondary"
                    buttonIcon={<TbListDetails size={16} />}
                    onClick={() => { navigate(`/events/${event.id}`); }}
                    width="fit"
                    />
                </div>
            }
          </div>
        ))
      ) : (
        <div className="p-8 text-center">
          <div className="text-dashboard-description">
            <p className="text-lg font-medium">No events found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCardView;
