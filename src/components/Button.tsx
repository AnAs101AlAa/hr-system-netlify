import { ButtonTypes, ButtonWidths } from "../constants/presets";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ButtonProps {
    buttonText: string;
    onClick: () => void;
    type: ButtonTypes;
    disabled?: boolean;
    loading?: boolean;
    width?: ButtonWidths;
}

export default function Button({buttonText, onClick, type, disabled = false, loading = false, width = ButtonWidths.AUTO}: ButtonProps) {
    const isDisabled = disabled || loading;
    
    const stylePresets : Record<ButtonTypes, string> = {
        primary: "bg-[var(--primary)] text-[var(--text)] border-[var(--primary)]",
        secondary: "bg-[var(--secondary)] text-[var(--text)] border-[var(--secondary)]",
        tertiary: "bg-[var(--contrast)] text-[var(--text)] border-[var(--contrast)]",
        danger: "bg-red-600 text-white border-red-600",
        ghost: "bg-transparent text-[var(--contrast)] border-[var(--contrast)]"
    }

    const hoverStyles : Record<ButtonTypes, string> = {
        primary: "hover:bg-[var(--contrast)] hover:border-[var(--contrast)]",
        secondary: "hover:bg-[var(--contrast)] hover:border-[var(--contrast)]",
        tertiary: "hover:bg-[var(--primary)] hover:border-[var(--primary)]",
        danger: "hover:bg-red-700 hover:border-red-700",
        ghost: "hover:bg-[var(--contrast)] hover:text-[var(--text)]"
    }

    const disabledStyles = "opacity-50";
    
    const widthStyles : Record<ButtonWidths, string> = {
        auto: "w-auto",
        small: "w-24",
        medium: "w-32", 
        large: "w-48",
        xl: "w-64",
        full: "w-full"
    }

    const handleClick = () => {
        if (!isDisabled) {
            onClick();
        }
    };

    return (
        <button 
            onClick={handleClick} 
            disabled={isDisabled}
            className={`
                ${stylePresets[type]} 
                ${!isDisabled ? hoverStyles[type] : ''} 
                ${isDisabled ? disabledStyles : ''} 
                ${widthStyles[width]}
                mt-5 lg:mt-7 rounded-xl px-6 py-2 border font-bold text-[12px] md:text-[13px] lg:text-[14px] 
                transition-all duration-200 ease-in-out flex items-center justify-center
                ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {loading && <AiOutlineLoading3Quarters className="animate-spin -ml-1 mr-2 h-4 w-4" />}
            {loading ? 'Loading...' : buttonText}
        </button>
    )
}