export default function Checkbox({label, checked, onChange}: {label: string, checked: boolean, onChange: () => void}) {
    return (
        <label className="inline-flex items-center cursor-pointer relative pl-7 select-none">
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange()}
                className="peer absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 cursor-pointer"
            />
            <span className="
                absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md
                border-2 border-gray-300 bg-white
                peer-checked:bg-primary peer-checked:border-primary
                flex items-center justify-center
                transition-colors
                pointer-events-none
            ">
                <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </span>
            <span className="text-sm">{label}</span>
        </label>
    );
}