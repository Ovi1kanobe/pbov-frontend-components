export type DiagnosticsResponse = {
    go_version: string;
    go_os: string;
    go_arch: string;
    process_started_at: string;
    uptime_seconds: number;
    num_goroutines: number;
    pocketbase_version: string;
    nginx_version: string;
    bun_version: string;
    hostname: string;
    pid: number;
    mem_alloc_mib: number;
    mem_total_alloc_mib: number;
    mem_sys_mib: number;
    mem_heap_alloc_mib: number;
    system_ram_bytes: number;
    frontend_size_bytes: number;
};
export interface DiagnosticsSectionProps {
    /**
     * Fetch one diagnostics snapshot. Called on mount and every pollMs. The
     * consuming app owns the endpoint and auth — e.g. the local
     * /api/diagnostics, or ccfw's /api/apps/{id}/diagnostics proxy (unwrap its
     * { diagnostics } envelope in the fn).
     */
    fetchDiagnostics: () => Promise<DiagnosticsResponse>;
    /** Poll interval in ms. Default 2000 — use a longer one against ccfw's proxy, it caches for 30s. */
    pollMs?: number;
    /** Card title. Default "Server diagnostics". */
    title?: string;
}
export declare function DiagnosticsSection({ fetchDiagnostics, pollMs, title, }: DiagnosticsSectionProps): import("react").JSX.Element | null;
