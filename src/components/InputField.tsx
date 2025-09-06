export default function InputField({
  label,
  value,
  placeholder,
  onChange,
  error,
  id,
}: {
  label: string;
  id: string;
  value: string;
  placeholder: string;
  onChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-(--label) text-md lg:text-lg mb-2 font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        className={`border-(--contrast) rounded-xl px-4 py-3 border outline-none ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
            : "focus:border-(--primary)"
        } transition-all duration-300 ease-in-out text-sm`}
      />
    </div>
  );
}
