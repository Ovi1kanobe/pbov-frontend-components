import { buttonVariants } from "./button";
import type { VariantProps } from 'class-variance-authority';
interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
}
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
declare const ColorPicker: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "onBlur" | "onChange" | "value"> & ColorPickerProps & import("react").RefAttributes<HTMLInputElement>>;
export { ColorPicker };
