import { type ReactNode } from "react";
import Pocketbase from "pocketbase";
export interface TeamMember {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    inactive?: boolean;
    avatar?: string;
    collectionId?: string;
    collectionName?: string;
}
export interface MyTeamSectionProps {
    users: TeamMember[];
    pb: Pocketbase;
    loading?: boolean;
    /** Per-row actions menu. App supplies its own (roles, impersonation, etc.). */
    renderActions?: (user: TeamMember) => ReactNode;
    title?: string;
    description?: string;
    onRequestUsers?: (users: TeamMember[]) => void;
}
export declare function MyTeamSection({ users, pb, loading, renderActions, title, description, onRequestUsers, }: MyTeamSectionProps): import("react").JSX.Element;
