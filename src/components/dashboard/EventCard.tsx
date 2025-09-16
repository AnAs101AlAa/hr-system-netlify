import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import Button from "@/components/generics/Button";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import type { Event } from "@/types/event";
import QRScannerModal from "@/components/scan_qr/QRScannerModal";
import format from "@/utils/Formater";
import { IoIosPin } from "react-icons/io";

const EventCard: React.FC<{ event: Omit<Event, "attendees"> }> = ({
  event,
}) => {
  const { id, title, startDate, endDate, location } = event;
  const navigate = useNavigate();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const isPastEvent = new Date(endDate) <= new Date();
  // Check if event is happening today and start time has come or passed, and hasn't ended yet
  const now = new Date();
  const eventStart = new Date(startDate);
  const eventEnd = new Date(endDate);
  const isEventTodayAndStarted =
    eventStart.toDateString() === now.toDateString() &&
    now >= eventStart &&
    now < eventEnd;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4 h-full relative">
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

      <div className="flex justify-end items-center gap-3 mt-1 absolute bottom-4 right-5 w-auto">
        {/* you can later adjust the onClick for the detail and scanQR however you want */}
        {(isPastEvent || isEventTodayAndStarted) && (
          <Button
            buttonText="Details"
            onClick={() => navigate(`/events/${id}`)}
            type={ButtonTypes.SECONDARY}
            width={ButtonWidths.AUTO}
          />
        )}

        {isEventTodayAndStarted && (
          <Button
            buttonText="Scan QR"
            onClick={() => setIsQRModalOpen(true)}
            type={ButtonTypes.PRIMARY}
            width={ButtonWidths.AUTO}
          />
        )}
        {/* fallback */}
        {!isPastEvent && !isEventTodayAndStarted && (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-md text-xs">
            see you soon
          </span>
        )}
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
