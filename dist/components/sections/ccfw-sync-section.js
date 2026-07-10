import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import Pocketbase from "pocketbase";
import { AlertCircle, CheckCircle2, Loader2, Network, RefreshCw, Users as UsersIcon, } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SettingsWidget } from "../core/settings-widget";
import { PocketBaseError } from "../../lib/pberror";
/**
 * Parent-connection and module-sync status for a child app linked to the
 * central ccfw instance. Polls /api/parentlink/status and lets an admin force
 * a per-module pull. Intended for child apps only — ccfw itself is the parent
 * and has nothing to sync from.
 */
export function CCFWSyncSection({ pb }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pulling, setPulling] = useState(null);
    const load = useCallback(async () => {
        try {
            const res = await pb.send("/api/parentlink/status", { method: "GET" });
            setStatus(res);
            setError(null);
        }
        catch (e) {
            const err = e;
            if (err?.isAbort)
                return;
            setError(err?.message ?? "Failed to load status");
        }
        finally {
            setLoading(false);
        }
    }, [pb]);
    useEffect(() => {
        load();
        const t = window.setInterval(load, 5000);
        return () => window.clearInterval(t);
    }, [load]);
    const forcePull = async (moduleName) => {
        setPulling(moduleName);
        try {
            const res = await pb.send(`/api/sync/${moduleName}/pull`, { method: "POST" });
            const parts = [];
            if (typeof res.pulled === "number")
                parts.push(`pulled ${res.pulled}`);
            if (typeof res.applied === "number")
                parts.push(`applied ${res.applied}`);
            if (typeof res.conflicts === "number" && res.conflicts > 0)
                parts.push(`${res.conflicts} conflicts`);
            const msg = `${moduleName}: ${parts.length > 0 ? parts.join(", ") : "pull complete"}`;
            if (res.pulled === 0) {
                toast.warning(`${moduleName}: parent returned 0 users — check ccfw has users with ms_profile set`);
            }
            else {
                toast.success(msg);
            }
            await load();
        }
        catch (e) {
            const err = e;
            toast.error(err?.message ?? `${moduleName}: pull failed`);
        }
        finally {
            setPulling(null);
        }
    };
    if (loading && !status) {
        return _jsx("p", { className: "py-12 text-center text-sm text-muted-foreground", children: "Loading status\u2026" });
    }
    if (error) {
        return (_jsx(SettingsWidget, { title: "CCFW Sync", icon: _jsx(Network, { size: 18 }), children: _jsxs("div", { className: "flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm", children: [_jsx(AlertCircle, { size: 14, className: "text-destructive" }), _jsx("span", { children: error })] }) }));
    }
    if (!status)
        return null;
    const link = status.link;
    const connOk = link.configured && link.enabled && link.handshake_complete && link.last_heartbeat_status === "ok";
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(SettingsWidget, { title: "Parent Connection", description: "Connection to the central ccfw instance that drives user sync.", icon: _jsx(Network, { size: 18 }), children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ConnBadge, { ok: connOk, link: link }), _jsxs(Button, { size: "sm", variant: "outline", className: "ml-auto h-7 gap-1", onClick: load, disabled: loading, children: [_jsx(RefreshCw, { size: 11, className: loading ? "animate-spin" : "" }), "Refresh"] })] }), _jsx(Separator, {}), _jsxs("dl", { className: "grid grid-cols-1 gap-3 text-xs md:grid-cols-2", children: [_jsx(Detail, { label: "Parent URL", children: link.parent_url || _jsx(Muted, { children: "not set" }) }), _jsx(Detail, { label: "Parent App ID", children: link.parent_app_id ? (_jsx("span", { className: "font-mono", children: link.parent_app_id })) : (_jsx(Muted, { children: "not set" })) }), _jsx(Detail, { label: "Configured", children: _jsx(BoolPill, { ok: link.configured }) }), _jsx(Detail, { label: "Enabled", children: _jsx(BoolPill, { ok: link.enabled }) }), _jsx(Detail, { label: "Handshake complete", children: _jsx(BoolPill, { ok: link.handshake_complete }) }), _jsx(Detail, { label: "Last heartbeat status", children: link.last_heartbeat_status ? (_jsx("span", { className: link.last_heartbeat_status === "ok" ? "text-green-600" : "text-destructive", children: link.last_heartbeat_status })) : (_jsx(Muted, { children: "never" })) }), _jsx(Detail, { label: "Last heartbeat at", children: fmtTime(link.last_heartbeat_at) }), _jsx(Detail, { label: "Last inbound push at", children: fmtTime(link.last_inbound_push_at) })] }), !link.configured && (_jsxs(Hint, { children: ["Fill in ", _jsx("code", { children: "parent_url" }), ", ", _jsx("code", { children: "parent_app_id" }), ", and", " ", _jsx("code", { children: "parent_secret" }), " on the singleton ", _jsx("code", { children: "_parent_link" }), " ", "row (PocketBase admin UI) to start syncing."] })), link.configured && !link.handshake_complete && (_jsxs(Hint, { children: ["Config is in place but the child hasn't completed the handshake yet. Wait ~30s for the next heartbeat tick. If status stays in error, check that ", _jsx("code", { children: "parent_url" }), " is reachable and the parent app's ", _jsx("code", { children: "secret" }), " matches what's pasted here."] }))] }) }), status.modules.map((m) => (_jsx(SettingsWidget, { title: `Module: ${m.name}`, icon: moduleIcon(m.name), children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ModuleStatusBadge, { status: m.last_status }), _jsxs(Button, { size: "sm", variant: "outline", className: "ml-auto h-7 gap-1", onClick: () => forcePull(m.name), disabled: !connOk || pulling === m.name, children: [pulling === m.name ? (_jsx(Loader2, { size: 11, className: "animate-spin" })) : (_jsx(RefreshCw, { size: 11 })), "Force pull"] })] }), _jsx(Separator, {}), _jsxs("dl", { className: "grid grid-cols-1 gap-3 text-xs md:grid-cols-2", children: [_jsx(Detail, { label: "Last push received", children: fmtTime(m.last_push_at) }), _jsx(Detail, { label: "Last pull at", children: fmtTime(m.last_pull_at) }), m.last_error && (_jsx(Detail, { label: "Last error", full: true, children: _jsx("span", { className: "text-destructive font-mono text-[11px]", children: m.last_error }) })), m.extra &&
                                    Object.entries(m.extra).map(([k, v]) => (_jsx(Detail, { label: k.replace(/_/g, " "), children: _jsx("span", { className: "font-mono", children: String(v) }) }, k)))] })] }) }, m.name))), status.modules.length === 0 && (_jsx(SettingsWidget, { title: "No modules", icon: _jsx(UsersIcon, { size: 18 }), children: _jsxs("p", { className: "text-xs text-muted-foreground", children: ["No modules are registered on this app. Check", " ", _jsx("code", { children: "parentlink.ChildOptions.Modules" }), " in ", _jsx("code", { children: "main.go" }), "."] }) }))] }));
}
function moduleIcon(name) {
    if (name === "users")
        return _jsx(UsersIcon, { size: 18 });
    return _jsx(Network, { size: 18 });
}
function ConnBadge({ ok, link }) {
    if (ok) {
        return (_jsxs(Badge, { variant: "outline", className: "gap-1 border-green-600/40 text-green-700 dark:text-green-400", children: [_jsx(CheckCircle2, { size: 11 }), "Connected"] }));
    }
    let label = "Disconnected";
    if (!link.configured)
        label = "Not configured";
    else if (!link.enabled)
        label = "Disabled";
    else if (!link.handshake_complete)
        label = "Handshake pending";
    else if (link.last_heartbeat_status && link.last_heartbeat_status !== "ok")
        label = "Heartbeat error";
    return (_jsxs(Badge, { variant: "outline", className: "gap-1 border-destructive/40 text-destructive", children: [_jsx(AlertCircle, { size: 11 }), label] }));
}
function ModuleStatusBadge({ status }) {
    if (status === "ok") {
        return (_jsxs(Badge, { variant: "outline", className: "gap-1 border-green-600/40 text-green-700 dark:text-green-400", children: [_jsx(CheckCircle2, { size: 11 }), "OK"] }));
    }
    if (status === "" || !status) {
        return (_jsx(Badge, { variant: "outline", className: "gap-1", children: "Never pulled" }));
    }
    return (_jsxs(Badge, { variant: "outline", className: "gap-1 border-destructive/40 text-destructive", children: [_jsx(AlertCircle, { size: 11 }), status] }));
}
function BoolPill({ ok }) {
    return (_jsx(Badge, { variant: "outline", className: ok ? "border-green-600/40 text-green-700 dark:text-green-400" : "border-muted-foreground/40 text-muted-foreground", children: ok ? "yes" : "no" }));
}
function Detail({ label, full, children, }) {
    return (_jsxs("div", { className: full ? "md:col-span-2" : undefined, children: [_jsx("dt", { className: "mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }), _jsx("dd", { children: children })] }));
}
function Muted({ children }) {
    return _jsx("span", { className: "italic text-muted-foreground", children: children });
}
function Hint({ children }) {
    return (_jsx("div", { className: "rounded border border-amber-500/40 bg-amber-500/5 p-2 text-[11px]", children: children }));
}
function fmtTime(s) {
    if (!s)
        return _jsx(Muted, { children: "never" });
    try {
        return _jsx("span", { className: "font-mono", children: new Date(s).toLocaleString() });
    }
    catch {
        return _jsx("span", { className: "font-mono", children: s });
    }
}
