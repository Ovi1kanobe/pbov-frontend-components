import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Network, RefreshCw, Save, Users as UsersIcon, } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { SettingsWidget } from "../core/settings-widget";
import { PocketBaseError } from "../../lib/pberror";
/**
 * Parent-connection settings and sync status for a child app linked to the
 * central ccfw instance. Purely presentational — all network calls come in
 * through the fetch/save/pull props, so the consuming app decides endpoints
 * and auth. Admins paste the application id + secret issued by ccfw's
 * Applications page here; the section then shows live heartbeat and
 * per-module sync status, with a force-pull per module.
 */
export function ParentLinkSection({ fetchStatus, fetchConfig, saveConfig, forcePull, pollMs = 5000, }) {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pulling, setPulling] = useState(null);
    // connection form
    const [config, setConfig] = useState(null);
    const [parentUrl, setParentUrl] = useState("");
    const [parentAppId, setParentAppId] = useState("");
    const [parentSecret, setParentSecret] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [saving, setSaving] = useState(false);
    // keep the latest fns in refs so callers can pass inline arrows without
    // retriggering the poll effect (a new fn identity every render would
    // otherwise reset the interval and refire the load each render)
    const fetchStatusRef = useRef(fetchStatus);
    const fetchConfigRef = useRef(fetchConfig);
    useEffect(() => {
        fetchStatusRef.current = fetchStatus;
        fetchConfigRef.current = fetchConfig;
    });
    const loadStatus = useCallback(async () => {
        try {
            const res = await fetchStatusRef.current();
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
    }, []);
    const loadConfig = useCallback(async () => {
        try {
            const res = await fetchConfigRef.current();
            setConfig(res);
            setParentUrl(res.parent_url);
            setParentAppId(res.parent_app_id);
            setEnabled(res.enabled);
        }
        catch (e) {
            const err = e;
            if (err?.isAbort)
                return;
            // the status card already surfaces connectivity problems; a config
            // load failure just leaves the form blank
        }
    }, []);
    useEffect(() => {
        loadStatus();
        loadConfig();
        const t = window.setInterval(loadStatus, pollMs);
        return () => window.clearInterval(t);
    }, [loadStatus, loadConfig, pollMs]);
    // dirty when the form differs from the last loaded config
    const dirty = config === null
        ? parentUrl !== "" || parentAppId !== "" || parentSecret !== "" || enabled
        : parentUrl.trim() !== config.parent_url ||
            parentAppId.trim() !== config.parent_app_id ||
            parentSecret !== "" ||
            enabled !== config.enabled;
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await saveConfig({
                parent_url: parentUrl.trim(),
                parent_app_id: parentAppId.trim(),
                parent_secret: parentSecret.trim(),
                enabled,
            });
            setConfig(res);
            setParentSecret("");
            toast.success(res.enabled
                ? "Saved — connecting on the next heartbeat (~30s)"
                : "Saved — connection disabled");
            await loadStatus();
        }
        catch (e) {
            const err = e;
            toast.error(err?.message ?? "Failed to save connection settings");
        }
        finally {
            setSaving(false);
        }
    };
    const handleForcePull = async (moduleName) => {
        setPulling(moduleName);
        try {
            const res = await forcePull(moduleName);
            if (res.pulled === 0) {
                toast.warning(`${moduleName}: parent returned 0 records — check sync is enabled for this app on ccfw`);
            }
            else {
                const parts = [];
                if (typeof res.pulled === "number")
                    parts.push(`pulled ${res.pulled}`);
                if (typeof res.created === "number" && res.created > 0)
                    parts.push(`created ${res.created}`);
                if (typeof res.updated === "number" && res.updated > 0)
                    parts.push(`updated ${res.updated}`);
                if (res.errors && res.errors.length > 0)
                    parts.push(`${res.errors.length} errors`);
                toast.success(`${moduleName}: ${parts.join(", ") || "pull complete"}`);
            }
            await loadStatus();
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
        return (_jsx(SettingsWidget, { title: "Parent Link", icon: _jsx(Network, { size: 18 }), children: _jsxs("div", { className: "flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm", children: [_jsx(AlertCircle, { size: 14, className: "text-destructive" }), _jsx("span", { children: error })] }) }));
    }
    if (!status)
        return null;
    const link = status.link;
    const connOk = link.configured && link.enabled && link.last_heartbeat_status === "ok";
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(SettingsWidget, { title: "Parent Connection", description: "Connect this app to the central ccfw instance. Create the application on ccfw's Applications page and paste its id and secret here.", icon: _jsx(Network, { size: 18 }), children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ConnBadge, { ok: connOk, link: link }), dirty && (_jsx(Badge, { variant: "outline", className: "border-amber-500/40 text-amber-700 dark:text-amber-400", children: "Unsaved changes" })), _jsxs(Button, { size: "sm", variant: "outline", className: "ml-auto h-7 gap-1", onClick: loadStatus, disabled: loading, children: [_jsx(RefreshCw, { size: 11, className: loading ? "animate-spin" : "" }), "Refresh"] })] }), _jsx(Separator, {}), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "pl-url", className: "text-xs", children: "Parent URL" }), _jsx(Input, { id: "pl-url", placeholder: "https://ccfw.example.org", value: parentUrl, onChange: (e) => setParentUrl(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "pl-appid", className: "text-xs", children: "Application ID" }), _jsx(Input, { id: "pl-appid", placeholder: "issued by ccfw", className: "font-mono", value: parentAppId, onChange: (e) => setParentAppId(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [_jsx(Label, { htmlFor: "pl-secret", className: "text-xs", children: "Application Secret" }), _jsx(Input, { id: "pl-secret", type: "password", className: "font-mono", placeholder: config?.secret_set ? "secret is set — leave blank to keep it" : "paste the secret from ccfw", value: parentSecret, onChange: (e) => setParentSecret(e.target.value) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Switch, { id: "pl-enabled", checked: enabled, onCheckedChange: setEnabled }), _jsx(Label, { htmlFor: "pl-enabled", className: "text-xs", children: "Enable connection" })] }), _jsxs(Button, { size: "sm", className: "h-7 gap-1", onClick: handleSave, disabled: saving || !dirty, children: [saving ? _jsx(Loader2, { size: 11, className: "animate-spin" }) : _jsx(Save, { size: 11 }), "Save"] })] }), _jsx(Separator, {}), _jsxs("dl", { className: "grid grid-cols-1 gap-3 text-xs md:grid-cols-2", children: [_jsx(Detail, { label: "Last heartbeat status", children: link.last_heartbeat_status ? (_jsx("span", { className: link.last_heartbeat_status === "ok" ? "text-green-600" : "text-destructive", children: link.last_heartbeat_status })) : (_jsx(Muted, { children: "never" })) }), _jsx(Detail, { label: "Last heartbeat at", children: fmtTime(link.last_heartbeat_at) }), _jsx(Detail, { label: "Last inbound push at", full: true, children: fmtTime(link.last_inbound_push_at) })] }), link.configured && link.enabled && link.last_heartbeat_status && link.last_heartbeat_status !== "ok" && (_jsx(Hint, { children: "The heartbeat is failing. Check that the parent URL is reachable and that the application id + secret match what ccfw issued \u2014 rotating the secret on ccfw requires pasting the new one here." })), link.configured && link.enabled && !link.last_heartbeat_status && (_jsx(Hint, { children: "Waiting for the first heartbeat \u2014 the connection is checked roughly every 30 seconds." }))] }) }), status.modules.map((m) => (_jsx(SettingsWidget, { title: `Module: ${m.name}`, icon: moduleIcon(m.name), children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ModuleStatusBadge, { status: m.last_status }), _jsx(SyncedOnParentBadge, { synced: m.synced_on_parent }), _jsxs(Button, { size: "sm", variant: "outline", className: "ml-auto h-7 gap-1", onClick: () => handleForcePull(m.name), disabled: !connOk || pulling === m.name, children: [pulling === m.name ? (_jsx(Loader2, { size: 11, className: "animate-spin" })) : (_jsx(RefreshCw, { size: 11 })), "Force pull"] })] }), _jsx(Separator, {}), _jsxs("dl", { className: "grid grid-cols-1 gap-3 text-xs md:grid-cols-2", children: [_jsx(Detail, { label: "Last push received", children: fmtTime(m.last_push_at) }), _jsx(Detail, { label: "Last pull at", children: fmtTime(m.last_pull_at) }), m.last_error && (_jsx(Detail, { label: "Last error", full: true, children: _jsx("span", { className: "text-destructive font-mono text-[11px]", children: m.last_error }) })), m.extra &&
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
    else if (link.last_heartbeat_status && link.last_heartbeat_status !== "ok")
        label = "Heartbeat error";
    else if (!link.last_heartbeat_status)
        label = "Waiting for first heartbeat";
    return (_jsxs(Badge, { variant: "outline", className: "gap-1 border-destructive/40 text-destructive", children: [_jsx(AlertCircle, { size: 11 }), label] }));
}
// SyncedOnParentBadge reports whether the parent admin has this module's sync
// turned on — the answer comes back on every heartbeat, so null means the
// first heartbeat hasn't landed yet.
function SyncedOnParentBadge({ synced }) {
    if (synced === null || synced === undefined) {
        return (_jsx(Badge, { variant: "outline", className: "gap-1 text-muted-foreground", children: "Parent status unknown" }));
    }
    if (synced) {
        return (_jsxs(Badge, { variant: "outline", className: "gap-1 border-green-600/40 text-green-700 dark:text-green-400", children: [_jsx(CheckCircle2, { size: 11 }), "Enabled on CCFW"] }));
    }
    return (_jsxs(Badge, { variant: "outline", className: "gap-1 border-amber-500/40 text-amber-700 dark:text-amber-400", children: [_jsx(AlertCircle, { size: 11 }), "Not enabled on CCFW"] }));
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
