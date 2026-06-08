import type { RouteConfig } from "../../lib/routes";
type AppHeaderProps = {
    title: string;
    onLogout: () => void;
    routes: RouteConfig[];
    version: string;
    onSubmitFeedback: (data: {
        subject?: string;
        description?: string;
        images?: File[];
    }) => Promise<void>;
};
export declare function AppHeader({ title, onLogout, routes, version, onSubmitFeedback }: AppHeaderProps): import("react").JSX.Element;
export {};
