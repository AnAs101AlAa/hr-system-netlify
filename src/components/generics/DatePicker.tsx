import { MdCalendarToday } from 'react-icons/md';

interface DatePickerProps {
  label: string;
  id: string;
  value: string;
  onChange: (date: string) => void;
  error?: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}

export default function DatePicker({
  label,
  id,
  value,
  onChange,
  error,
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-label text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="date"
          value={value}
          onChange={handleDateChange}
          disabled={disabled}
          min={minDate}
          max={maxDate}
          className={`w-full border-contrast rounded-xl px-3 py-2 md:px-4 md:py-3 border outline-none ${error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
            : "focus:border-primary"
            } ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "bg-white"
            } transition-all duration-300 ease-in-out text-sm pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
        />

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <MdCalendarToday
            className={`w-5 h-5 ${disabled ? "text-gray-400" : "text-secondary"
              }`}
          />
        </div>
      </div>

      {error && (
        <span className="text-red-500 text-sm font-medium mt-1">{error}</span>
      )}
    </div>
  );
}
