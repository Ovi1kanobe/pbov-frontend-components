import { AppHeader, Skeleton } from "@ovi1kanobe/pbov";
import { Separator } from "@ovi1kanobe/pbov";
import { motion } from "framer-motion";
import React from "react";
import { getFilteredRoutes, type RouteConfig } from "../../lib/routes";
import { cn } from "../../lib/utils";
import Pocketbase from 'pocketbase';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  /** When true, content fits parent without page scroll (child components handle their own scrolling) */
  fitContent?: boolean;
  pb: Pocketbase;
  userRole?: string;
  version: string;
  routes: RouteConfig[];
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children, fitContent = false, pb, userRole, version, routes }) => {

    async function onSubmitFeedback(data: {
    subject?: string;
    description?: string;
    images?: File[];
  }) {
    await pb.collection("developer_feedback_submissions").create(data);
  }

  return (
    <div className="flex flex-col w-full h-full max-h-screen p-8 pb-0 px-16 justify-start">
      {/* Header Section */}
      <AppHeader 
        title={title} 
        onLogout={() => {}} 
        routes={getFilteredRoutes(userRole, routes, true)} 
        version={version}
        onSubmitFeedback={onSubmitFeedback}
      />
      <Separator />
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "flex relative w-full flex-1 min-h-0",
          fitContent ? "overflow-hidden" : "overflow-y-scroll"
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};