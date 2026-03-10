import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { useForwardedRef } from '@/lib/use-forwarded-ref';
import { Input } from "./input";
import { Button, buttonVariants } from "./button";
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
const ColorPicker = forwardRef(({ disabled, value, onChange, onBlur, name, className, size, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);
    const parsedValue = useMemo(() => {
        return value || '#FFFFFF';
    }, [value]);
    return (_jsxs(Popover, { onOpenChange: setOpen, open: open, children: [_jsx(PopoverTrigger, { asChild: true, disabled: disabled, onBlur: onBlur, children: _jsx(Button, { ...props, className: cn('block', className), name: name, onClick: () => {
                        setOpen(true);
                    }, size: size, style: {
                        backgroundColor: parsedValue,
                    }, variant: 'outline', children: _jsx("div", {}) }) }), _jsxs(PopoverContent, { className: 'w-full', children: [_jsx(HexColorPicker, { color: parsedValue, onChange: onChange }), _jsx(Input, { maxLength: 7, onChange: (e) => {
                            onChange(e?.currentTarget?.value);
                        }, ref: ref, value: parsedValue })] })] }));
});
ColorPicker.displayName = 'ColorPicker';
export { ColorPicker };
