import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface TimePickerProps {
  label?: string;
  id?: string;
  value: string;
  onChange: (time: string) => void;
  error?: string;
  disabled?: boolean;
  use24Hour?: boolean;
}

export default function TimePicker({
  label,
  id,
  value,
  onChange,
  error,
  disabled = false,
  use24Hour = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempHours, setTempHours] = useState(12);
  const [tempMinutes, setTempMinutes] = useState(0);
  const [tempPeriod, setTempPeriod] = useState("AM");
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const updateDropdownPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropdownHeight = 400; // approximate height

      // Position above if not enough space below
      const top =
        spaceBelow < dropdownHeight && rect.top > dropdownHeight
          ? rect.top - dropdownHeight + window.scrollY
          : rect.bottom + window.scrollY + 8;

      setDropdownPosition({
        top,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 280),
      });
    }
  }, []);

  // Parse current value on open
  useEffect(() => {
    if (isOpen && value) {
      const [h, m] = value.split(":").map(Number);
      if (use24Hour) {
        setTempHours(h);
        setTempMinutes(m);
      } else {
        setTempPeriod(h >= 12 ? "PM" : "AM");
        setTempHours(h === 0 ? 12 : h > 12 ? h - 12 : h);
        setTempMinutes(m);
      }
    }
    if (isOpen) {
      updateDropdownPosition();
    }
  }, [isOpen, value, use24Hour, updateDropdownPosition]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handlePositionUpdate = () => updateDropdownPosition();
    window.addEventListener("scroll", handlePositionUpdate, true);
    window.addEventListener("resize", handlePositionUpdate);

    return () => {
      window.removeEventListener("scroll", handlePositionUpdate, true);
      window.removeEventListener("resize", handlePositionUpdate);
    };
  }, [isOpen, updateDropdownPosition]);

  const formatTime = (h: number, m: number, p: string) => {
    let hour24 = h;
    if (!use24Hour) {
      if (p === "AM") {
        hour24 = h === 12 ? 0 : h;
      } else {
        hour24 = h === 12 ? 12 : h + 12;
      }
    }
    return `${String(hour24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const handleDone = () => {
    onChange(formatTime(tempHours, tempMinutes, tempPeriod));
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Display value
  const getDisplayTime = () => {
    if (!value) return "Select time";
    const [h, m] = value.split(":").map(Number);
    if (use24Hour) return value;
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
  };

  const hourOptions = use24Hour
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1);

  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  // Dropdown content
  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className="timepicker-dropdown-portal"
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 99999,
      }}
    >
      {/* Header */}
      <div className="timepicker-header">
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm sm:text-base">Select Time</span>
      </div>

      {/* Time Display */}
      <div className="timepicker-display">
        <span className="time-value">{String(tempHours).padStart(2, "0")}</span>
        <span className="time-separator">:</span>
        <span className="time-value">
          {String(tempMinutes).padStart(2, "0")}
        </span>
        {!use24Hour && <span className="time-period">{tempPeriod}</span>}
      </div>

      {/* Scrollable Columns */}
      <div className="timepicker-columns">
        {/* Hours */}
        <div className="time-column">
          <div className="column-label">Hour</div>
          <div className="column-scroll">
            {hourOptions.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setTempHours(h)}
                className={`time-option ${tempHours === h ? "selected" : ""}`}
              >
                {String(h).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes */}
        <div className="time-column">
          <div className="column-label">Min</div>
          <div className="column-scroll">
            {minuteOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTempMinutes(m)}
                className={`time-option ${tempMinutes === m ? "selected" : ""}`}
              >
                {String(m).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        {/* AM/PM */}
        {!use24Hour && (
          <div className="time-column period-column">
            <div className="column-label">Period</div>
            <div className="column-scroll period-scroll">
              <button
                type="button"
                onClick={() => setTempPeriod("AM")}
                className={`time-option period-option ${tempPeriod === "AM" ? "selected" : ""}`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => setTempPeriod("PM")}
                className={`time-option period-option ${tempPeriod === "PM" ? "selected" : ""}`}
              >
                PM
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Done Button */}
      <button type="button" onClick={handleDone} className="done-button">
        Done
      </button>
    </div>
  );

  return (
    <div className="flex flex-col w-full timepicker-wrapper" ref={wrapperRef}>
      {label && (
        <label className="text-label dark:text-gray-200 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] xl:text-[16px] mb-1 sm:mb-2 font-semibold">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          id={id}
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full border-contrast rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 border outline-none text-left text-xs sm:text-sm ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/30 dark:border-red-700 dark:focus:border-red-600"
              : "focus:border-primary dark:focus:border-primary"
          } ${
            disabled
              ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
              : "bg-white dark:bg-gray-900 cursor-pointer"
          } transition-all duration-300 ease-in-out pr-8 sm:pr-10 dark:text-white dark:border-gray-700`}
        >
          {getDisplayTime()}
        </button>

        <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 ${disabled ? "text-gray-400 dark:text-gray-600" : "text-secondary dark:text-blue-400"}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Portal for dropdown */}
        {isOpen && createPortal(dropdownContent, document.body)}
      </div>

      {error && (
        <span className="text-red-500 dark:text-red-400 text-xs sm:text-sm font-medium mt-1">
          {error}
        </span>
      )}

      <style>{`
        /* Modern Professional TimePicker - Blue Theme */
        .timepicker-wrapper {
          position: relative;
        }
        
        .timepicker-dropdown,
        .timepicker-dropdown-portal {
          min-width: 280px;
          background: white;
          border-radius: 1.25rem;
          border: 1px solid #e5e7eb;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.15),
            0 10px 20px -5px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          animation: slideDown 0.2s ease-out;
        }
        
        .timepicker-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          z-index: 50;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .timepicker-dropdown .timepicker-header,
        .timepicker-dropdown-portal .timepicker-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          color: #295e7e;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .timepicker-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 1rem;
          background: linear-gradient(135deg, #3a7ca5 0%, #295e7e 100%);
        }
        
        .time-value {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          min-width: 3rem;
          text-align: center;
        }
        
        .time-separator {
          font-size: 2rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .time-period {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          margin-left: 0.5rem;
        }
        
        .timepicker-columns {
          display: flex;
          padding: 0.75rem;
          gap: 0.5rem;
        }
        
        .time-column {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .period-column {
          flex: 0.8;
        }
        
        .column-label {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: 0.5rem;
        }
        
        .column-scroll {
          max-height: 180px;
          overflow-y: auto;
          border-radius: 0.75rem;
          background: #f3f4f6;
          padding: 0.25rem;
        }
        
        .column-scroll::-webkit-scrollbar {
          width: 4px;
        }
        
        .column-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .column-scroll::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 2px;
        }
        
        .period-scroll {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          max-height: none;
          overflow: visible;
        }
        
        .time-option {
          display: block;
          width: 100%;
          padding: 0.5rem;
          text-align: center;
          font-size: 0.9rem;
          font-weight: 500;
          color: #374151;
          background: transparent;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .time-option:hover {
          background: #b8d4e8;
          color: #1e4a63;
        }
        
        .time-option.selected {
          background: linear-gradient(135deg, #295e7e 0%, #1e4a63 100%);
          color: white;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(41, 94, 126, 0.3);
        }
        
        .period-option {
          padding: 0.75rem;
          font-weight: 600;
        }
        
        .done-button {
          display: block;
          width: calc(100% - 1.5rem);
          margin: 0 0.75rem 0.75rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #295e7e 0%, #1e4a63 100%);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .done-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(41, 94, 126, 0.4);
        }
        
        /* ==================== DARK MODE ==================== */
        .dark .timepicker-dropdown,
        .dark .timepicker-dropdown-portal {
          background: #1f2937;
          border-color: #374151;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 10px 20px -5px rgba(0, 0, 0, 0.3);
        }
        
        .dark .timepicker-dropdown .timepicker-header,
        .dark .timepicker-dropdown-portal .timepicker-header {
          background: #111827;
          border-bottom-color: #374151;
          color: #60a5fa;
        }
        
        .dark .timepicker-dropdown .timepicker-display,
        .dark .timepicker-dropdown-portal .timepicker-display {
          background: linear-gradient(135deg, #3a7ca5 0%, #295e7e 100%);
        }
        
        .dark .timepicker-dropdown .column-label,
        .dark .timepicker-dropdown-portal .column-label {
          color: #9ca3af;
        }
        
        .dark .timepicker-dropdown .column-scroll,
        .dark .timepicker-dropdown-portal .column-scroll {
          background: #374151;
        }
        
        .dark .timepicker-dropdown .column-scroll::-webkit-scrollbar-thumb,
        .dark .timepicker-dropdown-portal .column-scroll::-webkit-scrollbar-thumb {
          background: #6b7280;
        }
        
        .dark .timepicker-dropdown .time-option,
        .dark .timepicker-dropdown-portal .time-option {
          color: #e5e7eb;
        }
        
        .dark .timepicker-dropdown .time-option:hover,
        .dark .timepicker-dropdown-portal .time-option:hover {
          background: #4b5563;
          color: white;
        }
        
        .dark .timepicker-dropdown .time-option.selected,
        .dark .timepicker-dropdown-portal .time-option.selected {
          background: linear-gradient(135deg, #3a7ca5 0%, #295e7e 100%);
        }
      `}</style>
    </div>
  );
}
