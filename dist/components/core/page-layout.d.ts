import React from "react";
import { type RouteConfig } from "../../lib/routes";
import Pocketbase from 'pocketbase';
interface PageLayoutProps {
    title: string;
    children: React.ReactNode;
    /** When true, content fits parent without page scroll (child components handle their own scrolling) */
    fitContent?: boolean;
    pb: Pocketbase;
    user: {
        id: string;
        name: string | undefined;
        email: string;
        role: string | undefined;
    };
    version: string;
    routes: RouteConfig[];
}
export declare const PageLayout: React.FC<PageLayoutProps>;
export {};
