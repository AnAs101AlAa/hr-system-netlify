import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function PasswordField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (newValue: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <label className="text-label text-[14px] md:text-[15px] lg:text-[16px] mb-2 font-semibold">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          value={value}
          placeholder="Enter your Password"
          onChange={(e) => onChange(e)}
          type={show ? "text" : "password"}
          className={`border-contrast rounded-xl px-3 py-2 md:px-4 md:py-3 border outline-none ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/30"
              : "focus:border-primary"
          } transition-all duration-300 ease-in-out text-sm w-full pr-10 `}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 contrast-50 cursor-pointer transition duration-300 ease-in-out hover:contrast-100"
          onClick={() => setShow(!show)}
          tabIndex={-1}
        >
          {show ? <LuEyeOff size={20} /> : <LuEye size={20} />}
        </button>
      </div>
    </div>
  );
}
