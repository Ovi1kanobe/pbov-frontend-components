export type ParentLinkLinkStatus = {
    configured: boolean;
    enabled: boolean;
    parent_url: string;
    parent_app_id: string;
    last_heartbeat_at: string;
    last_heartbeat_status: string;
    last_inbound_push_at: string;
};
export type ParentLinkModuleStatus = {
    name: string;
    last_push_at: string;
    last_pull_at: string;
    last_status: string;
    last_error: string;
    /** Parent's word on whether this module is enabled for this app; null until the first heartbeat. */
    synced_on_parent?: boolean | null;
    extra?: Record<string, unknown>;
};
export type ParentLinkStatusResponse = {
    link: ParentLinkLinkStatus;
    modules: ParentLinkModuleStatus[];
};
export type ParentLinkConfig = {
    parent_url: string;
    parent_app_id: string;
    secret_set: boolean;
    enabled: boolean;
};
export type ParentLinkConfigUpdate = {
    parent_url: string;
    parent_app_id: string;
    /** Empty string keeps the stored secret. */
    parent_secret: string;
    enabled: boolean;
};
export type ParentLinkPullResult = {
    ok: boolean;
    pulled?: number;
    created?: number;
    updated?: number;
    noop?: number;
    errors?: string[];
};
export interface ParentLinkSectionProps {
    /** GET the link + module status. Called on mount and every pollMs. */
    fetchStatus: () => Promise<ParentLinkStatusResponse>;
    /** GET the current connection config (secret redacted). Called on mount and after save. */
    fetchConfig: () => Promise<ParentLinkConfig>;
    /** POST new connection settings; resolves with the saved config. */
    saveConfig: (config: ParentLinkConfigUpdate) => Promise<ParentLinkConfig>;
    /** POST a force pull for one module; resolves with counts. */
    forcePull: (module: string) => Promise<ParentLinkPullResult>;
    /** Status poll interval in ms. Default 5000. */
    pollMs?: number;
}
/**
 * Parent-connection settings and sync status for a child app linked to the
 * central ccfw instance. Purely presentational — all network calls come in
 * through the fetch/save/pull props, so the consuming app decides endpoints
 * and auth. Admins paste the application id + secret issued by ccfw's
 * Applications page here; the section then shows live heartbeat and
 * per-module sync status, with a force-pull per module.
 */
export declare function ParentLinkSection({ fetchStatus, fetchConfig, saveConfig, forcePull, pollMs, }: ParentLinkSectionProps): import("react").JSX.Element | null;
