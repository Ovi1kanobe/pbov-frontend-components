import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

/* ------------------------------------------------------------
 * Generic props
 * ---------------------------------------------------------- */
type SelectorProps<T> = {
  /** list of records to pick from */
  data: T[];
  /** currently-selected record (or null) */
  value: T | null;
  /** state setter supplied by the parent */
  setValue: (v: T | null) => void;
  /**
   * returns the string that should be shown for an item
   * (e.g. item.name, item.email, `${item.first} ${item.last}`, …)
   */
  label: (item: T) => string;
  /** function to get a unique identifier for the item */
  identifier: (item: T) => string;
  /** optional placeholder text */
  placeholder?: string;
  /** optional extra class(es) for the trigger button */
  className?: string;
  /** whether the component is in a loading state */
  loading?: boolean;
  /** whether the component should be disabled */
  disabled?: boolean;
  /** custom message when no results found */
  emptyMessage?: string;
};

/* ------------------------------------------------------------
 * Generic record selector
 * ---------------------------------------------------------- */
export function RecordSelector<T>({
  data,
  value,
  setValue,
  label,
  identifier,
  placeholder = "Select…",
  className,
  loading = false,
  disabled = false,
  emptyMessage = "No results.",
}: SelectorProps<T>) {
  const [open, setOpen] = React.useState(false);

  // Determine the display text for the button
  const getDisplayText = () => {
    if (loading) return "Loading...";
    if (value) return label(value);
    return placeholder;
  };

  // Determine if the component should be disabled
  const isDisabled = disabled || loading || data.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ---------- trigger ---------- */}
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          disabled={isDisabled}
          className={cn("w-full justify-between bg-input hover:bg-input cursor-pointer text-secondary ", className)}
          aria-label="Select record"
        >
          {getDisplayText()}
          <ChevronsUpDown className="ml-2 size-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      {/* ---------- content ---------- */}
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder="Search…" className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {data.map((item) => {
                const text = label(item);
                const selected = value ? identifier(value) === identifier(item) : false;

                return (
                  <CommandItem
                    key={identifier(item)}
                    value={text} // searched text
                    onSelect={() => {
                      setValue(selected ? null : item);
                      setOpen(false);
                    }}
                  >
                    {text}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}