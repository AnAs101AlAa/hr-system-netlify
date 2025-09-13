

export default function Radiobutton({label, checked, onChange}: {label: string, checked: boolean, onChange: (newValue: boolean) => void}) {
    return (
        <label className="inline-flex items-center cursor-pointer relative pl-7 select-none">
            <input
                type="radio"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="peer absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-0 cursor-pointer"
            />
            <span className="
                absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full
                border-2 border-gray-300 bg-background
                flex items-center justify-center
                transition-colors
                pointer-events-none
            ">
                <span className={`w-3 h-3 ${checked ? 'bg-primary' : 'bg-transparent'} rounded-full transition-all`} />
            </span>
            <span className="text-sm">{label}</span>
        </label>
    );
}