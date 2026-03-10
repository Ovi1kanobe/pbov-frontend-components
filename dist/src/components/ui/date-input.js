import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef } from "react";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function DateInput({ value, onChange, label, placeholder = "Select Date", disabled = false, className, showNavigation = false, onPreviousDate, onNextDate, previousLabel = "Previous date", nextLabel = "Next date", calendarTooltip = "Select Date", showCalendarIcon = true, }) {
    const dateInputRef = useRef(null);
    // Function to open the date picker when calendar icon is clicked
    const handleCalendarClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dateInputRef.current?.showPicker?.();
    };
    return (_jsxs("div", { className: cn("flex flex-col", className), children: [label && _jsx(Label, { className: "mb-2", children: label }), _jsxs("div", { className: "flex flex-row", children: [showCalendarIcon && (_jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { type: "button", onClick: handleCalendarClick, disabled: disabled, className: "mr-2 bg-white", "aria-label": calendarTooltip, variant: "outline", children: _jsx(Calendar, { className: "h-5 w-5 hover:scale-110 transition-all duration-200" }) }) }), _jsx(TooltipContent, { side: "left", children: calendarTooltip })] })), _jsx(Input, { ref: dateInputRef, value: value, onChange: (e) => onChange(e.target.value), type: "date", placeholder: placeholder, disabled: disabled, className: cn("mb-4 dark:scheme-dark [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden", showNavigation ? "mr-3" : "") }), showNavigation && (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", onClick: onPreviousDate, variant: "outline", disabled: disabled, className: "rounded-none rounded-l-full hover:bg-primary hover:text-white", "aria-label": previousLabel, children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), _jsx(Button, { type: "button", onClick: onNextDate, variant: "outline", disabled: disabled, className: "rounded-none border-l-0 rounded-r-full hover:bg-primary hover:text-white", "aria-label": nextLabel, children: _jsx(ArrowRight, { className: "h-4 w-4" }) })] }))] })] }));
}
