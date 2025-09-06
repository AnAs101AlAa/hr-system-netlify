import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function PasswordField({
  value,
  onChange,
}: {
  value: string;
  onChange: (newValue: string) => void;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col w-full">
      <label className="text-(--label) text-md lg:text-lg mb-2 font-semibold">
        Password
      </label>
      <div className="relative">
        <input
          value={value}
          placeholder="Enter your Password"
          onChange={(e) => onChange(e.target.value)}
          type={show ? "text" : "password"}
          className="border-(--contrast) rounded-xl px-4 py-2 border outline-none focus:border-(--primary) transition-all duration-300 ease-in-out text-md lg:text-lg w-full pr-10"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 contrast-50 cursor-pointer transition duration-300 ease-in-out hover:contrast-100"
          onClick={() => setShow(!show)}
          tabIndex={-1}
        >
          {show ? <LuEyeOff /> : <LuEye />}
        </button>
      </div>
    </div>
  );
}
