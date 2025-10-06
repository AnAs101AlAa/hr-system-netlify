import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchField({
  value,
  onChange,
  placeholder = "Search...",
  className = ""
}: SearchFieldProps) {
  return (
    <div className={`relative w-full lg:w-96 ${className}`}>
      <div className="relative">
        <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-secondary/60 text-lg" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-background/50 rounded-3xl border-contrast pl-12 pr-4 py-2 text-[14px] md:text-[15px] lg:text-[16px] border focus:border-primary focus:outline-none transition-all duration-300 ease-in-out placeholder:text-muted-secondary"
        />
      </div>
    </div>
  );
}
