export default function InputField({label, value, placeholder, onChange}: {label: string, value: string, placeholder:string, onChange: (newValue: string)=> void}) {
    return (
        <div className="flex flex-col w-full">
            <label className="text-(--secondary) text-xl md:text-lg lg:text-md mb-2 font-semibold">{label}</label>
            <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="border-(--contrast) rounded-xl px-4 py-2 border outline-none focus:border-(--primary) transition-all duration-300 ease-in-out text-xl md:text-lg lg:text-md" />
        </div>
    )
}