// src/components/ui/button.tsx
import "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/button.tsx
import { jsx } from "react/jsx-runtime";
var buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      "data-variant": variant,
      "data-size": size,
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}

// src/components/ui/card.tsx
import "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function Card({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "card",
      "data-size": size,
      className: cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "card-title",
      className: cn(
        "text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      ),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-sm text-muted-foreground", className),
      ...props
    }
  );
}
function CardAction({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "card-action",
      className: cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-4 group-data-[size=sm]/card:px-3", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx2(
    "div",
    {
      "data-slot": "card-footer",
      className: cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      ),
      ...props
    }
  );
}

// src/components/ui/checkbox.tsx
import "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { CheckIcon } from "lucide-react";
import { jsx as jsx3 } from "react/jsx-runtime";
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx3(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx3(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
          children: /* @__PURE__ */ jsx3(
            CheckIcon,
            {}
          )
        }
      )
    }
  );
}

// src/hooks/useDebounce.tsx
import { useEffect, useState } from "react";
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  return debouncedValue;
}

// src/hooks/useMobile.tsx
import * as React4 from "react";
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = React4.useState(void 0);
  React4.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}

// src/hooks/useRealtimeSubscription.tsx
import { useEffect as useEffect3, useRef, useCallback } from "react";
import "pocketbase";
function useDebouncedRealtimeSubscription({
  pb,
  collections,
  id = "*",
  onUpdate,
  filter,
  enabled = true,
  debounceMs = 500,
  maxFloodMs = 5e3
}) {
  const debounceTimer = useRef(null);
  const floodStartTime = useRef(null);
  const lastEvent = useRef(void 0);
  const unsubscribersRef = useRef([]);
  const setupRunId = useRef(0);
  const debouncedUpdate = useCallback((event) => {
    lastEvent.current = event;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    const now = Date.now();
    if (!floodStartTime.current) {
      floodStartTime.current = now;
    }
    if (now - floodStartTime.current >= maxFloodMs) {
      floodStartTime.current = now;
      onUpdate(event);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      onUpdate(lastEvent.current);
      floodStartTime.current = null;
    }, debounceMs);
  }, [onUpdate, debounceMs, maxFloodMs]);
  useEffect3(() => {
    if (!pb || !enabled) return;
    const collectionArray = Array.isArray(collections) ? collections : [collections];
    const thisRun = ++setupRunId.current;
    unsubscribersRef.current = [];
    let isCancelled = false;
    const setupSubscriptions = async () => {
      try {
        for (const collection of collectionArray) {
          if (isCancelled) break;
          const unsubscribe = await pb.collection(collection).subscribe(id, (event) => {
            if (filter && !filter(event, collection)) {
              return;
            }
            debouncedUpdate(event);
          });
          if (thisRun !== setupRunId.current || isCancelled) {
            try {
              unsubscribe();
            } catch {
              console.error("Error during immediate unsubscribe");
            }
            continue;
          }
          unsubscribersRef.current.push(unsubscribe);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Failed to setup realtime subscriptions:", error);
        }
      }
    };
    setupSubscriptions();
    return () => {
      isCancelled = true;
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }
      const fns = unsubscribersRef.current;
      unsubscribersRef.current = [];
      for (const unsubscribe of fns) {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error during unsubscribe:", error);
        }
      }
    };
  }, [pb, collections, id, debouncedUpdate, enabled, filter]);
  const cleanup = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    const fns = unsubscribersRef.current;
    unsubscribersRef.current = [];
    for (const unsubscribe of fns) {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error during manual unsubscribe:", error);
      }
    }
  }, []);
  return cleanup;
}
export {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  buttonVariants,
  cn,
  useDebounce,
  useDebouncedRealtimeSubscription,
  useIsMobile
};
