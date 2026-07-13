import Pocketbase from "pocketbase";
export interface DiagnosticsSectionProps {
    pb: Pocketbase;
    /**
     * Endpoint to poll. Defaults to the local app's /api/diagnostics. Point it
     * at /api/apps/{id}/diagnostics on ccfw to view a child app's diagnostics
     * through the parent's proxy.
     */
    endpoint?: string;
    /** Poll interval in ms. Default 2000 — use a longer one against the proxy, it caches for 30s. */
    pollMs?: number;
    /** Card title. Default "Server diagnostics". */
    title?: string;
}
export declare function DiagnosticsSection({ pb, endpoint, pollMs, title, }: DiagnosticsSectionProps): import("react").JSX.Element | null;
