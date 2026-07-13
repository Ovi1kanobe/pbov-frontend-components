import Pocketbase from "pocketbase";
export interface ParentLinkSectionProps {
    pb: Pocketbase;
}
/**
 * Parent-connection settings and sync status for a child app linked to the
 * central ccfw instance. Admins paste the application id + secret issued by
 * ccfw's Applications page here; the section then shows live heartbeat and
 * per-module sync status, with a force-pull per module. Child apps only —
 * ccfw itself is the parent.
 */
export declare function ParentLinkSection({ pb }: ParentLinkSectionProps): import("react").JSX.Element | null;
