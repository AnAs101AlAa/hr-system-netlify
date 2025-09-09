import { useState } from "react";

export default function NumberField({
  label,
  value,
  placeholder,
  onChange,
  error,
  maxLength,
  id,
}: {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  maxLength?: number;
  onChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  const [lengthError, setLengthError] = useState<string | null>(null);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    if (maxLength && inputValue.length > maxLength) {
      setLengthError(`Maximum length of ${maxLength} characters exceeded.`);
      return;
    }
    lengthError && setLengthError(null);
    onChange(e);
  }
  return (
    <div className="flex flex-col w-full">
      <label className="text-label text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        type="number"
        placeholder={placeholder}
        onChange={handleChange}
        className={`border-contrast rounded-xl px-3 py-2 md:px-4 md:py-3 border outline-none ${
          error || lengthError
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
            : "focus:border-primary"
        } transition-all duration-300 ease-in-out text-sm`}
      />
    </div>
  );
}
