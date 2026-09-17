export type UpdateConfig = {
    repo_owner: string;
    repo_name: string;
    token_set: boolean;
    enabled: boolean;
    last_checked_at: string;
    last_check_status: string;
    latest_version_seen: string;
    current_version: string;
};
export type UpdateConfigUpdate = {
    repo_owner: string;
    repo_name: string;
    /** Empty string keeps the stored token. */
    github_token: string;
    enabled: boolean;
};
export type UpdateCheckResult = {
    current_version: string;
    latest_version: string;
    update_available: boolean;
    release_url: string;
    release_notes: string;
};
export type UpdateApplyResult = {
    from_version: string;
    to_version: string;
    restarting: boolean;
};
export interface UpdatesSectionProps {
    /** GET the current update-checker config (token redacted). */
    fetchConfig: () => Promise<UpdateConfig>;
    /** POST new update-checker settings; resolves with the saved config. */
    saveConfig: (config: UpdateConfigUpdate) => Promise<UpdateConfig>;
    /** GET the latest GitHub release and compare it against the running version. */
    checkForUpdate: () => Promise<UpdateCheckResult>;
    /** POST to download and apply the latest release. The app restarts on success. */
    applyUpdate: () => Promise<UpdateApplyResult>;
}
/**
 * Self-update settings: which private GitHub repo to check for releases,
 * and manual "check" / "update now" actions. Never automatic — an admin has
 * to click both buttons. Purely presentational, same shape as
 * ParentLinkSection: fetch/save/check/apply are supplied by the app, this
 * just renders the form and results.
 */
export declare function UpdatesSection({ fetchConfig, saveConfig, checkForUpdate, applyUpdate, }: UpdatesSectionProps): import("react").JSX.Element | null;
