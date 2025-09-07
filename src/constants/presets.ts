export const ButtonTypes = {
    PRIMARY: "primary",
    SECONDARY: "secondary",
    TERTIARY: "tertiary",
    DANGER: "danger",
    GHOST: "ghost",
    BASIC: "basic"
} as const;

export type ButtonTypes = typeof ButtonTypes[keyof typeof ButtonTypes];

export const ButtonWidths = {
    AUTO: "auto",
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
    XL: "xl",
    FULL: "full"
} as const;

export type ButtonWidths = typeof ButtonWidths[keyof typeof ButtonWidths];

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}
