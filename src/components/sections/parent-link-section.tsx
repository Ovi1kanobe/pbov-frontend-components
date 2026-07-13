import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Network,
  RefreshCw,
  Save,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { SettingsWidget } from "../core/settings-widget";
import { PocketBaseError } from "../../lib/pberror";

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
export function ParentLinkSection({
  fetchStatus,
  fetchConfig,
  saveConfig,
  forcePull,
  pollMs = 5000,
}: ParentLinkSectionProps) {
  const [status, setStatus] = useState<ParentLinkStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pulling, setPulling] = useState<string | null>(null);

  // connection form
  const [config, setConfig] = useState<ParentLinkConfig | null>(null);
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
    } catch (e) {
      const err = e as PocketBaseError;
      if (err?.isAbort) return;
      setError(err?.message ?? "Failed to load status");
    } finally {
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
    } catch (e) {
      const err = e as PocketBaseError;
      if (err?.isAbort) return;
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
  const dirty =
    config === null
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
      toast.success(
        res.enabled
          ? "Saved — connecting on the next heartbeat (~30s)"
          : "Saved — connection disabled",
      );
      await loadStatus();
    } catch (e) {
      const err = e as PocketBaseError;
      toast.error(err?.message ?? "Failed to save connection settings");
    } finally {
      setSaving(false);
    }
  };

  const handleForcePull = async (moduleName: string) => {
    setPulling(moduleName);
    try {
      const res = await forcePull(moduleName);
      if (res.pulled === 0) {
        toast.warning(`${moduleName}: parent returned 0 records — check sync is enabled for this app on ccfw`);
      } else {
        const parts: string[] = [];
        if (typeof res.pulled === "number") parts.push(`pulled ${res.pulled}`);
        if (typeof res.created === "number" && res.created > 0) parts.push(`created ${res.created}`);
        if (typeof res.updated === "number" && res.updated > 0) parts.push(`updated ${res.updated}`);
        if (res.errors && res.errors.length > 0) parts.push(`${res.errors.length} errors`);
        toast.success(`${moduleName}: ${parts.join(", ") || "pull complete"}`);
      }
      await loadStatus();
    } catch (e) {
      const err = e as PocketBaseError;
      toast.error(err?.message ?? `${moduleName}: pull failed`);
    } finally {
      setPulling(null);
    }
  };

  if (loading && !status) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading status…</p>;
  }

  if (error) {
    return (
      <SettingsWidget title="Parent Link" icon={<Network size={18} />}>
        <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle size={14} className="text-destructive" />
          <span>{error}</span>
        </div>
      </SettingsWidget>
    );
  }

  if (!status) return null;

  const link = status.link;
  const connOk = link.configured && link.enabled && link.last_heartbeat_status === "ok";

  return (
    <div className="space-y-6">
      <SettingsWidget
        title="Parent Connection"
        description="Connect this app to the central ccfw instance. Create the application on ccfw's Applications page and paste its id and secret here."
        icon={<Network size={18} />}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ConnBadge ok={connOk} link={link} />
            {dirty && (
              <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">
                Unsaved changes
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              className="ml-auto h-7 gap-1"
              onClick={loadStatus}
              disabled={loading}
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

          <Separator />

          {/* connection form */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pl-url" className="text-xs">Parent URL</Label>
              <Input
                id="pl-url"
                placeholder="https://ccfw.example.org"
                value={parentUrl}
                onChange={(e) => setParentUrl(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pl-appid" className="text-xs">Application ID</Label>
              <Input
                id="pl-appid"
                placeholder="issued by ccfw"
                className="font-mono"
                value={parentAppId}
                onChange={(e) => setParentAppId(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="pl-secret" className="text-xs">Application Secret</Label>
              <Input
                id="pl-secret"
                type="password"
                className="font-mono"
                placeholder={config?.secret_set ? "secret is set — leave blank to keep it" : "paste the secret from ccfw"}
                value={parentSecret}
                onChange={(e) => setParentSecret(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="pl-enabled" checked={enabled} onCheckedChange={setEnabled} />
              <Label htmlFor="pl-enabled" className="text-xs">Enable connection</Label>
            </div>
            <Button size="sm" className="h-7 gap-1" onClick={handleSave} disabled={saving || !dirty}>
              {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
              Save
            </Button>
          </div>

          <Separator />

          <dl className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
            <Detail label="Last heartbeat status">
              {link.last_heartbeat_status ? (
                <span className={link.last_heartbeat_status === "ok" ? "text-green-600" : "text-destructive"}>
                  {link.last_heartbeat_status}
                </span>
              ) : (
                <Muted>never</Muted>
              )}
            </Detail>
            <Detail label="Last heartbeat at">
              {fmtTime(link.last_heartbeat_at)}
            </Detail>
            <Detail label="Last inbound push at" full>
              {fmtTime(link.last_inbound_push_at)}
            </Detail>
          </dl>

          {link.configured && link.enabled && link.last_heartbeat_status && link.last_heartbeat_status !== "ok" && (
            <Hint>
              The heartbeat is failing. Check that the parent URL is reachable
              and that the application id + secret match what ccfw issued —
              rotating the secret on ccfw requires pasting the new one here.
            </Hint>
          )}
          {link.configured && link.enabled && !link.last_heartbeat_status && (
            <Hint>
              Waiting for the first heartbeat — the connection is checked
              roughly every 30 seconds.
            </Hint>
          )}
        </div>
      </SettingsWidget>

      {status.modules.map((m) => (
        <SettingsWidget
          key={m.name}
          title={`Module: ${m.name}`}
          icon={moduleIcon(m.name)}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ModuleStatusBadge status={m.last_status} />
              <Button
                size="sm"
                variant="outline"
                className="ml-auto h-7 gap-1"
                onClick={() => handleForcePull(m.name)}
                disabled={!connOk || pulling === m.name}
              >
                {pulling === m.name ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : (
                  <RefreshCw size={11} />
                )}
                Force pull
              </Button>
            </div>

            <Separator />

            <dl className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
              <Detail label="Last push received">
                {fmtTime(m.last_push_at)}
              </Detail>
              <Detail label="Last pull at">
                {fmtTime(m.last_pull_at)}
              </Detail>
              {m.last_error && (
                <Detail label="Last error" full>
                  <span className="text-destructive font-mono text-[11px]">
                    {m.last_error}
                  </span>
                </Detail>
              )}
              {m.extra &&
                Object.entries(m.extra).map(([k, v]) => (
                  <Detail key={k} label={k.replace(/_/g, " ")}>
                    <span className="font-mono">{String(v)}</span>
                  </Detail>
                ))}
            </dl>
          </div>
        </SettingsWidget>
      ))}

      {status.modules.length === 0 && (
        <SettingsWidget title="No modules" icon={<UsersIcon size={18} />}>
          <p className="text-xs text-muted-foreground">
            No modules are registered on this app. Check{" "}
            <code>parentlink.ChildOptions.Modules</code> in <code>main.go</code>.
          </p>
        </SettingsWidget>
      )}
    </div>
  );
}

function moduleIcon(name: string) {
  if (name === "users") return <UsersIcon size={18} />;
  return <Network size={18} />;
}

function ConnBadge({ ok, link }: { ok: boolean; link: ParentLinkLinkStatus }) {
  if (ok) {
    return (
      <Badge variant="outline" className="gap-1 border-green-600/40 text-green-700 dark:text-green-400">
        <CheckCircle2 size={11} />
        Connected
      </Badge>
    );
  }
  let label = "Disconnected";
  if (!link.configured) label = "Not configured";
  else if (!link.enabled) label = "Disabled";
  else if (link.last_heartbeat_status && link.last_heartbeat_status !== "ok") label = "Heartbeat error";
  else if (!link.last_heartbeat_status) label = "Waiting for first heartbeat";
  return (
    <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
      <AlertCircle size={11} />
      {label}
    </Badge>
  );
}

function ModuleStatusBadge({ status }: { status: string }) {
  if (status === "ok") {
    return (
      <Badge variant="outline" className="gap-1 border-green-600/40 text-green-700 dark:text-green-400">
        <CheckCircle2 size={11} />
        OK
      </Badge>
    );
  }
  if (status === "" || !status) {
    return (
      <Badge variant="outline" className="gap-1">
        Never pulled
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 border-destructive/40 text-destructive">
      <AlertCircle size={11} />
      {status}
    </Badge>
  );
}

function Detail({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "md:col-span-2" : undefined}>
      <dt className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className="italic text-muted-foreground">{children}</span>;
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded border border-amber-500/40 bg-amber-500/5 p-2 text-[11px]">
      {children}
    </div>
  );
}

function fmtTime(s: string) {
  if (!s) return <Muted>never</Muted>;
  try {
    return <span className="font-mono">{new Date(s).toLocaleString()}</span>;
  } catch {
    return <span className="font-mono">{s}</span>;
  }
}
