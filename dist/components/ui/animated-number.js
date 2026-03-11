import { jsx as _jsx } from "react/jsx-runtime";
// components/ui/AnimatedNumber.tsx
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
export function AnimatedNumber({ value }) {
    const prevValueRef = useRef(value);
    const spring = useSpring(value, { stiffness: 100, damping: 30 });
    const rounded = useTransform(spring, (v) => Math.round(v));
    useEffect(() => {
        // Only animate if the value actually changed
        if (prevValueRef.current !== value) {
            spring.set(value);
            prevValueRef.current = value;
        }
    }, [value, spring]);
    return _jsx(motion.span, { children: rounded });
}
