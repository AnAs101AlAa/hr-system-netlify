import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import Button from '@/components/generics/Button';
import { ButtonTypes, ButtonWidths } from '@/constants/presets';
import type { Event } from '@/types/event';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const { id, title, startTime, endTime } = event;
    const navigate = useNavigate();
    
    // Format date helper function
    const formatDateTime = (date: Date) => {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };
    
    // if event in the past, only show "Details" button, else show both "Details" and "Scan QR" buttons
    const isPastEvent = new Date(endTime) < new Date();
    
    return (
        <div className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-primary text-lg" />
                <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
            </div>
            
            <div className="flex flex-col text-sm text-gray-500 ">
                <span>Start: {formatDateTime(startTime)}</span>
                <span>End: {formatDateTime(endTime)}</span>
            </div>

            <div className="flex justify-end items-center gap-3 mt-1">
                        {/* you can later adjust the onClick for the detail and scanQR however you want */}
                        <Button
                            buttonText="Details"
                            onClick={() => navigate(`/details/${id}`)}
                            type={ButtonTypes.SECONDARY}
                            width={ButtonWidths.AUTO}
                        />
                        {!isPastEvent && <Button 
                            buttonText="Scan QR"
                            onClick={() => navigate(`/scan/${id}`)}
                            type={ButtonTypes.PRIMARY}
                            width={ButtonWidths.AUTO}
                        />}
            </div>
        </div>
    );
};

export default EventCard;
