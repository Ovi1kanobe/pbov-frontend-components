import React, { useRef } from "react";
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export function DateInput({
  value,
  onChange,
  label,
  placeholder = "Select Date",
  disabled = false,
  className,
  showNavigation = false,
  onPreviousDate,
  onNextDate,
  previousLabel = "Previous date",
  nextLabel = "Next date",
  calendarTooltip = "Select Date",
  showCalendarIcon = true,
}: DateInputProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Function to open the date picker when calendar icon is clicked
  const handleCalendarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dateInputRef.current?.showPicker?.();
  };

  return (
    <div className={cn("flex flex-col", className)}>
      {label && <Label className="mb-2">{label}</Label>}
      <div className="flex flex-row">
        {showCalendarIcon && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleCalendarClick}
                disabled={disabled}
                className="mr-2 bg-white"
                aria-label={calendarTooltip}
                variant={"outline"}
              >
                <Calendar className="h-5 w-5 hover:scale-110 transition-all duration-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {calendarTooltip}
            </TooltipContent>
          </Tooltip>
        )}
        
        <Input
          ref={dateInputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type="date"
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "mb-4 dark:scheme-dark [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden",
            showNavigation ? "mr-3" : ""
          )}
        />
        
        {showNavigation && (
          <>
            <Button
              type="button"
              onClick={onPreviousDate}
              variant="outline"
              disabled={disabled}
              className="rounded-none rounded-l-full hover:bg-primary hover:text-white"
              aria-label={previousLabel}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              onClick={onNextDate}
              variant="outline"
              disabled={disabled}
              className="rounded-none border-l-0 rounded-r-full hover:bg-primary hover:text-white"
              aria-label={nextLabel}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}