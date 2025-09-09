import { useState, useRef } from "react";

export default function TextAreaField({
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
  onChange: (newValue: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}) {
  const [lengthError, setLengthError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const inputValue = e.target.value;
    if (maxLength && inputValue.length > maxLength) {
      setLengthError(`Maximum length of ${maxLength} characters exceeded.`);
      return;
    }
    lengthError && setLengthError(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
    onChange(e);
  }
  return (
    <div className="flex flex-col w-full">
      <label className="text-label text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        id={id}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
        rows={4}
        className={`border-contrast rounded-xl px-3 py-2 md:px-4 md:py-3 border outline-none ${
          error || lengthError
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
            : "focus:border-primary"
        } transition-all duration-300 ease-in-out text-sm`}
      />
      {maxLength && (
        <p className="text-[12px] md:text-[13px] lg:text-[14px] p-1">
          Character Limit: {value.length}/{maxLength}
        </p>
      )}
    </div>
  );
}
