interface DateInputProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    showNavigation?: boolean;
    onPreviousDate?: () => void;
    onNextDate?: () => void;
    previousLabel?: string;
    nextLabel?: string;
    calendarTooltip?: string;
    showCalendarIcon?: boolean;
}
export declare function DateInput({ value, onChange, label, placeholder, disabled, className, showNavigation, onPreviousDate, onNextDate, previousLabel, nextLabel, calendarTooltip, showCalendarIcon, }: DateInputProps): import("react/jsx-runtime").JSX.Element;
export {};
