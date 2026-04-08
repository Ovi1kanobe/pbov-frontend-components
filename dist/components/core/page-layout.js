import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppHeader, Skeleton } from "@ovi1kanobe/pbov";
import { Separator } from "@ovi1kanobe/pbov";
import { motion } from "framer-motion";
import React from "react";
import { getFilteredRoutes } from "../../lib/routes";
import { cn } from "../../lib/utils";
import Pocketbase from 'pocketbase';
export const PageLayout = ({ title, children, fitContent = false, pb, userRole, version, routes }) => {
    async function onSubmitFeedback(data) {
        await pb.collection("developer_feedback_submissions").create(data);
    }
    return (_jsxs("div", { className: "flex flex-col w-full h-full max-h-screen p-8 pb-0 px-16 justify-start", children: [_jsx(AppHeader, { title: title, onLogout: () => { }, routes: getFilteredRoutes(userRole, routes, true), version: version, onSubmitFeedback: onSubmitFeedback }), _jsx(Separator, {}), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: "easeOut" }, className: cn("flex relative w-full flex-1 min-h-0", fitContent ? "overflow-hidden" : "overflow-y-scroll"), children: children })] }));
};
