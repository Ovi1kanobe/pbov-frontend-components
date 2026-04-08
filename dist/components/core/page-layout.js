import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppHeader, Skeleton } from "@ovi1kanobe/pbov";
import { Separator } from "@ovi1kanobe/pbov";
import { motion } from "framer-motion";
import React from "react";
import { getFilteredRoutes } from "../../lib/routes";
import { cn } from "../../lib/utils";
import Pocketbase from 'pocketbase';
export const PageLayout = ({ title, children, fitContent = false, pb, user, version, routes }) => {
    async function onSubmitFeedback(data) {
        await pb.collection("developer_feedback_submissions").create(data);
    }
    if (!user) {
        return (_jsx("div", { className: "w-screen h-screen flex items-center justify-center", children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "flex flex-col items-center gap-4", children: [_jsx(Skeleton, { className: "h-8 w-full text-primary animate-spin" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." })] }) }));
    }
    return (_jsxs("div", { className: "flex flex-col w-full h-full max-h-screen p-8 pb-0 px-16 justify-start", children: [_jsx(AppHeader, { title: title, onLogout: () => { }, routes: getFilteredRoutes(user.role, routes, true), version: version, onSubmitFeedback: onSubmitFeedback }), _jsx(Separator, {}), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" }, className: cn("flex relative w-full flex-1 min-h-0", fitContent ? "overflow-hidden" : "overflow-y-scroll"), children: children })] }));
};
