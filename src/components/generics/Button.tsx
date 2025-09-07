import { ButtonTypes, ButtonWidths } from "@/constants/presets";
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
        primary: "bg-primary text-text border-primary",
        secondary: "bg-secondary text-text border-secondary",
        tertiary: "bg-contrast text-text border-contrast",
        danger: "border-primary text-primary",
        ghost: "text-secondary border-secondary",
        basic: "border-contrast"
    }

    const hoverStyles : Record<ButtonTypes, string> = {
        primary: "hover:bg-background hover:border-primary hover:text-primary",
        secondary: "hover:bg-background hover:border-secondary hover:text-secondary",
        tertiary: "hover:bg-background hover:border-tertiary hover:text-tertiary",
        danger: "hover:bg-primary hover:text-text",
        ghost: "hover:bg-secondary/30",
        basic: "hover:bg-contrast/30",
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