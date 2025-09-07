import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import Button from "./Button";
import { ButtonTypes, ButtonWidths } from "@/constants/presets";
import type { DropdownOption } from "@/constants/presets";

interface DropdownMenuProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function DropdownMenu({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
  id,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    if (!disabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-(--label) text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold"
        >
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <Button
            buttonText={selectedOption ? selectedOption.label : placeholder}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            type={ButtonTypes.BASIC}
            disabled={disabled}
            width={ButtonWidths.FULL}
          />
          <IoChevronDown
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--secondary)] transition-transform duration-200 pointer-events-none ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--secondary)]/30 rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-[var(--muted-secondary)]">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  disabled={option.disabled}
                  className={`
                    w-full px-3 py-2 text-left text-sm transition-colors duration-150
                    ${
                      option.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-900 hover:bg-[var(--secondary)]/10 hover:text-[var(--secondary)] cursor-pointer"
                    }
                    ${
                      value === option.value
                        ? "bg-[var(--secondary)]/20 text-[var(--secondary)] font-medium"
                        : ""
                    }
                    first:rounded-t-xl last:rounded-b-xl
                  `}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
