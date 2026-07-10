import Pocketbase from "pocketbase";
export interface CCFWSyncSectionProps {
    pb: Pocketbase;
}
/**
 * Parent-connection and module-sync status for a child app linked to the
 * central ccfw instance. Polls /api/parentlink/status and lets an admin force
 * a per-module pull. Intended for child apps only — ccfw itself is the parent
 * and has nothing to sync from.
 */
export declare function CCFWSyncSection({ pb }: CCFWSyncSectionProps): import("react").JSX.Element | null;
