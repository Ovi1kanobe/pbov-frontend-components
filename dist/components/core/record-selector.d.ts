import * as React from "react";
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
export declare function RecordSelector<T>({ data, value, setValue, label, identifier, placeholder, className, loading, disabled, emptyMessage, }: SelectorProps<T>): React.JSX.Element;
export {};
