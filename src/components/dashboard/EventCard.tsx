import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import type { Event } from "@/types/event";
import QRScannerModal from "@/components/scan_qr/QRScannerModal";
import format from "@/utils/Formater";
import { IoIosPin } from "react-icons/io";
import { Button } from "tccd-ui";

interface EventCardProps {
  event: Omit<Event, "attendees">;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const { id, title, startDate, endDate, location } = event;
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const now = new Date();
  const eventStart = new Date(startDate);
  const eventEnd = new Date(endDate);
  // Compare both date and time for event status
  const isPastEvent = now >= eventEnd;
  const scanButtonStart = new Date(eventStart.getTime() - 30 * 60 * 1000); // 15 minutes before start
  const isScanAvailable = now >= scanButtonStart && now < eventEnd;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col h-full relative justify-between gap-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-gray-800 text-[20px] md:text-[22px] lg:text-[24px]">
            {title}
          </h3>
        </div>

        <div className="flex flex-col text-sm text-gray-500 gap-1 text-[13px] md:text-[14px] lg:text-[15px]">
          <span className="flex gap-1 items-center">
            <FaCalendarAlt className="text-primary text-md mr-1" />
            <span className="font-semibold">Start Date:</span>{" "}
            {format(startDate, "full")}
          </span>
          <span className="flex gap-1 aitems-center">
            <FaCalendarAlt className="text-primary text-md mr-1" />
            <span className="font-semibold">End Date:</span>{" "}
            {format(endDate, "full")}
          </span>
          <span className="flex gap-1">
            <IoIosPin className="text-primary size-5 -ml-0.5" />
            <span className="font-semibold">Location:</span> {location}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1">
        {/* Left side - Admin buttons */}
        <div className="flex gap-2">
          {onEdit && (
            <Button
              buttonText="Edit"
              onClick={() => onEdit(id)}
              type={ButtonTypes.TERTIARY}
              width={ButtonWidths.AUTO}
            />
          )}
          {onDelete && (
            <Button
              buttonText="Delete"
              onClick={() => onDelete(id)}
              type={ButtonTypes.DANGER}
              width={ButtonWidths.AUTO}
            />
          )}
        </div>

        {/* Right side - Action buttons */}
        <div className="flex gap-3">
          {(isPastEvent || isScanAvailable) && (
            <Button
              buttonText="Details"
              onClick={() => navigate(`/events/${id}`)}
              type={ButtonTypes.SECONDARY}
              width={ButtonWidths.AUTO}
            />
          )}

          {isScanAvailable && (
            <Button
              buttonText="Scan QR"
              onClick={() => setIsQRModalOpen(true)}
              type={ButtonTypes.PRIMARY}
              width={ButtonWidths.AUTO}
            />
          )}
          {/* fallback */}
          {!isPastEvent && !isScanAvailable && (
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-xs">
              see you soon
            </span>
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        event={event}
      />
    </div>
  );
};

export default EventCard;
