import Pocketbase from "pocketbase";
export interface ParentLinkInfo {
    /** True while the initial fetch is in flight. */
    loading: boolean;
    /** True when this app has an enabled, configured link to a ccfw parent. */
    connected: boolean;
    /** Base URL of the parent app, e.g. "https://ccfw.example.org". Empty when not connected. */
    parentUrl: string;
}
/**
 * Fetches GET /api/parentlink/info — available to any authenticated user on a
 * child app. Use it to build "edit your profile on CCFW" links; it exposes no
 * secrets. On the parent app (or a child with no link) it reports
 * connected=false and components should fall back to local behavior.
 */
export declare function useParentLinkInfo(pb: Pocketbase): ParentLinkInfo;
