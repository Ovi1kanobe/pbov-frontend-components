import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Download, Loader2, RefreshCw, Save, Sparkles, } from "lucide-react";
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
 * Self-update settings: which private GitHub repo to check for releases,
 * and manual "check" / "update now" actions. Never automatic — an admin has
 * to click both buttons. Purely presentational, same shape as
 * ParentLinkSection: fetch/save/check/apply are supplied by the app, this
 * just renders the form and results.
 */
export function UpdatesSection({ fetchConfig, saveConfig, checkForUpdate, applyUpdate, }) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [repoOwner, setRepoOwner] = useState("");
    const [repoName, setRepoName] = useState("");
    const [githubToken, setGithubToken] = useState("");
    const [enabled, setEnabled] = useState(false);
    const [saving, setSaving] = useState(false);
    const [checking, setChecking] = useState(false);
    const [checkResult, setCheckResult] = useState(null);
    const [applying, setApplying] = useState(false);
    const fetchConfigRef = useRef(fetchConfig);
    useEffect(() => {
        fetchConfigRef.current = fetchConfig;
    });
    const loadConfig = useCallback(async () => {
        try {
            const res = await fetchConfigRef.current();
            setConfig(res);
            setRepoOwner(res.repo_owner);
            setRepoName(res.repo_name);
            setEnabled(res.enabled);
            setError(null);
        }
        catch (e) {
            const err = e;
            if (err?.isAbort)
                return;
            setError(err?.message ?? "Failed to load update settings");
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadConfig();
    }, [loadConfig]);
    const dirty = config === null
        ? repoOwner !== "" || repoName !== "" || githubToken !== "" || enabled
        : repoOwner.trim() !== config.repo_owner ||
            repoName.trim() !== config.repo_name ||
            githubToken !== "" ||
            enabled !== config.enabled;
    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await saveConfig({
                repo_owner: repoOwner.trim(),
                repo_name: repoName.trim(),
                github_token: githubToken.trim(),
                enabled,
            });
            setConfig(res);
            setGithubToken("");
            toast.success(res.enabled ? "Saved — update checks enabled" : "Saved — update checks disabled");
        }
        catch (e) {
            const err = e;
            toast.error(err?.message ?? "Failed to save update settings");
        }
        finally {
            setSaving(false);
        }
    };
    const handleCheck = async () => {
        setChecking(true);
        try {
            const res = await checkForUpdate();
            setCheckResult(res);
            if (res.update_available) {
                toast.success(`Update available: ${res.latest_version}`);
            }
            else {
                toast.success("You're on the latest version");
            }
            await loadConfig();
        }
        catch (e) {
            const err = e;
            toast.error(err?.message ?? "Failed to check for updates");
        }
        finally {
            setChecking(false);
        }
    };
    const handleApply = async () => {
        setApplying(true);
        try {
            const res = await applyUpdate();
            toast.success(`Updating ${res.from_version} → ${res.to_version} — the app will restart in a few seconds`);
        }
        catch (e) {
            const err = e;
            toast.error(err?.message ?? "Failed to apply update");
        }
        finally {
            setApplying(false);
        }
    };
    if (loading && !config) {
        return _jsx("p", { className: "py-12 text-center text-sm text-muted-foreground", children: "Loading update settings\u2026" });
    }
    if (error) {
        return (_jsx(SettingsWidget, { title: "Updates", icon: _jsx(Sparkles, { size: 18 }), children: _jsxs("div", { className: "flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm", children: [_jsx(AlertCircle, { size: 14, className: "text-destructive" }), _jsx("span", { children: error })] }) }));
    }
    if (!config)
        return null;
    return (_jsx("div", { className: "space-y-6", children: _jsx(SettingsWidget, { title: "Updates", description: "Check GitHub for new releases of this app and apply them manually. Nothing updates automatically.", icon: _jsx(Sparkles, { size: 18 }), children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "outline", className: "gap-1 font-mono", children: ["Running ", config.current_version] }), dirty && (_jsx(Badge, { variant: "outline", className: "border-amber-500/40 text-amber-700 dark:text-amber-400", children: "Unsaved changes" }))] }), _jsx(Separator, {}), _jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "upd-owner", className: "text-xs", children: "Repo owner" }), _jsx(Input, { id: "upd-owner", placeholder: "19th-Judicial-Circuit-Court", value: repoOwner, onChange: (e) => setRepoOwner(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx(Label, { htmlFor: "upd-name", className: "text-xs", children: "Repo name" }), _jsx(Input, { id: "upd-name", placeholder: "ccfw", value: repoName, onChange: (e) => setRepoName(e.target.value) })] }), _jsxs("div", { className: "space-y-1.5 md:col-span-2", children: [_jsx(Label, { htmlFor: "upd-token", className: "text-xs", children: "GitHub token" }), _jsx(Input, { id: "upd-token", type: "password", className: "font-mono", placeholder: config.token_set ? "token is set — leave blank to keep it" : "personal access token with contents:read", value: githubToken, onChange: (e) => setGithubToken(e.target.value) })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Switch, { id: "upd-enabled", checked: enabled, onCheckedChange: setEnabled }), _jsx(Label, { htmlFor: "upd-enabled", className: "text-xs", children: "Enable update checks" })] }), _jsxs(Button, { size: "sm", className: "h-7 gap-1", onClick: handleSave, disabled: saving || !dirty, children: [saving ? _jsx(Loader2, { size: 11, className: "animate-spin" }) : _jsx(Save, { size: 11 }), "Save"] })] }), _jsx(Separator, {}), _jsxs("dl", { className: "grid grid-cols-1 gap-3 text-xs md:grid-cols-2", children: [_jsx(Detail, { label: "Last checked", children: fmtTime(config.last_checked_at) }), _jsx(Detail, { label: "Last check result", children: config.last_check_status ? (_jsx("span", { className: "font-mono text-[11px]", children: config.last_check_status })) : (_jsx(Muted, { children: "never checked" })) }), _jsx(Detail, { label: "Latest version seen", full: true, children: config.latest_version_seen || _jsx(Muted, { children: "\u2014" }) })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", className: "h-7 gap-1", onClick: handleCheck, disabled: !config.enabled || checking, children: [checking ? _jsx(Loader2, { size: 11, className: "animate-spin" }) : _jsx(RefreshCw, { size: 11 }), "Check for updates"] }), checkResult?.update_available && (_jsxs(Button, { size: "sm", className: "h-7 gap-1", onClick: handleApply, disabled: applying, children: [applying ? _jsx(Loader2, { size: 11, className: "animate-spin" }) : _jsx(Download, { size: 11 }), "Update to ", checkResult.latest_version] }))] }), !config.enabled && (_jsx(Hint, { children: "Set a repo owner, repo name, and token, then enable update checks before checking for a new release." })), checkResult && (_jsxs("div", { className: "rounded border p-3 text-xs", children: [checkResult.update_available ? (_jsxs("div", { className: "flex items-center gap-2 text-amber-700 dark:text-amber-400", children: [_jsx(AlertCircle, { size: 12 }), _jsxs("span", { children: [checkResult.current_version, " \u2192 ", checkResult.latest_version, " available"] })] })) : (_jsxs("div", { className: "flex items-center gap-2 text-green-600", children: [_jsx(CheckCircle2, { size: 12 }), _jsxs("span", { children: ["Up to date (", checkResult.current_version, ")"] })] })), checkResult.release_url && (_jsx("a", { href: checkResult.release_url, target: "_blank", rel: "noreferrer", className: "mt-1 inline-block text-primary underline", children: "View release notes" }))] }))] }) }) }));
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
