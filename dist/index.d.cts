import * as react_jsx_runtime from 'react/jsx-runtime';
import * as class_variance_authority_types from 'class-variance-authority/types';
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { Checkbox as Checkbox$1 } from 'radix-ui';
import Pocketbase, { RecordModel, RecordSubscription } from 'pocketbase';
import { ClassValue } from 'clsx';

declare const buttonVariants: (props?: ({
    variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link" | null | undefined;
    size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

declare function Card({ className, size, ...props }: React.ComponentProps<"div"> & {
    size?: "default" | "sm";
}): react_jsx_runtime.JSX.Element;
declare function CardHeader({ className, ...props }: React.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardAction({ className, ...props }: React.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardContent({ className, ...props }: React.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardFooter({ className, ...props }: React.ComponentProps<"div">): react_jsx_runtime.JSX.Element;

declare function Checkbox({ className, ...props }: React.ComponentProps<typeof Checkbox$1.Root>): react_jsx_runtime.JSX.Element;

declare function useDebounce<T>(value: T, delay?: number): T;

declare function useIsMobile(): boolean;

interface UseDebouncedRealtimeSubscriptionOptions<T = RecordModel> {
    pb: Pocketbase;
    collections: string | string[];
    id?: string;
    onUpdate: (event?: RecordSubscription<T>) => void;
    filter?: (event: RecordSubscription<T>, collection: string) => boolean;
    enabled?: boolean;
    debounceMs?: number;
    maxFloodMs?: number;
}
declare function useDebouncedRealtimeSubscription<T = RecordModel>({ pb, collections, id, onUpdate, filter, enabled, debounceMs, maxFloodMs, }: UseDebouncedRealtimeSubscriptionOptions<T>): () => void;

declare function cn(...inputs: ClassValue[]): string;

export { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, buttonVariants, cn, useDebounce, useDebouncedRealtimeSubscription, useIsMobile };
