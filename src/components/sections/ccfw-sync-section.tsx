import { useCallback, useEffect, useState } from "react";
import Pocketbase from "pocketbase";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Network,
  RefreshCw,
  Users as UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SettingsWidget } from "../core/settings-widget";
import { PocketBaseError } from "../../lib/pberror";

type LinkStatus = {
  configured: boolean;
  enabled: boolean;
  handshake_complete: boolean;
  parent_url: string;
  parent_app_id: string;
  last_heartbeat_at: string;
  last_heartbeat_status: string;
  last_inbound_push_at: string;
};

type ModuleStatus = {
  name: string;
  last_push_at: string;
  last_pull_at: string;
  last_status: string;
  last_error: string;
  extra?: Record<string, unknown>;
};

type StatusResponse = {
  link: LinkStatus;
  modules: ModuleStatus[];
};

export interface CCFWSyncSectionProps {
  pb: Pocketbase;
}

/**
 * Parent-connection and module-sync status for a child app linked to the
 * central ccfw instance. Polls /api/parentlink/status and lets an admin force
 * a per-module pull. Intended for child apps only — ccfw itself is the parent
 * and has nothing to sync from.
 */
export function CCFWSyncSection({ pb }: CCFWSyncSectionProps) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pulling, setPulling] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await pb.send<StatusResponse>("/api/parentlink/status", { method: "GET" });
      setStatus(res);
      setError(null);
    } catch (e) {
      const err = e as PocketBaseError;
      if (err?.isAbort) return;
      setError(err?.message ?? "Failed to load status");
    } finally {
      setLoading(false);
    }
  }, [pb]);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 5000);
    return () => window.clearInterval(t);
  }, [load]);

  const forcePull = async (moduleName: string) => {
    setPulling(moduleName);
    try {
      const res = await pb.send<{
        ok: boolean;
        pulled?: number;
        applied?: number;
        conflicts?: number;
        errors?: string[];
      }>(`/api/sync/${moduleName}/pull`, { method: "POST" });
      const parts: string[] = [];
      if (typeof res.pulled === "number") parts.push(`pulled ${res.pulled}`);
      if (typeof res.applied === "number") parts.push(`applied ${res.applied}`);
      if (typeof res.conflicts === "number" && res.conflicts > 0) parts.push(`${res.conflicts} conflicts`);
      const msg = `${moduleName}: ${parts.length > 0 ? parts.join(", ") : "pull complete"}`;
      if (res.pulled === 0) {
        toast.warning(`${moduleName}: parent returned 0 users — check ccfw has users with ms_profile set`);
      } else {
        toast.success(msg);
      }
      await load();
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
      <SettingsWidget title="CCFW Sync" icon={<Network size={18} />}>
        <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle size={14} className="text-destructive" />
          <span>{error}</span>
        </div>
      </SettingsWidget>
    );
  }

  if (!status) return null;

  const link = status.link;
  const connOk = link.configured && link.enabled && link.handshake_complete && link.last_heartbeat_status === "ok";

  return (
    <div className="space-y-6">
      <SettingsWidget
        title="Parent Connection"
        description="Connection to the central ccfw instance that drives user sync."
        icon={<Network size={18} />}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ConnBadge ok={connOk} link={link} />
            <Button
              size="sm"
              variant="outline"
              className="ml-auto h-7 gap-1"
              onClick={load}
              disabled={loading}
            >
              <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

          <Separator />

          <dl className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
            <Detail label="Parent URL">
              {link.parent_url || <Muted>not set</Muted>}
            </Detail>
            <Detail label="Parent App ID">
              {link.parent_app_id ? (
                <span className="font-mono">{link.parent_app_id}</span>
              ) : (
                <Muted>not set</Muted>
              )}
            </Detail>
            <Detail label="Configured">
              <BoolPill ok={link.configured} />
            </Detail>
            <Detail label="Enabled">
              <BoolPill ok={link.enabled} />
            </Detail>
            <Detail label="Handshake complete">
              <BoolPill ok={link.handshake_complete} />
            </Detail>
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
            <Detail label="Last inbound push at">
              {fmtTime(link.last_inbound_push_at)}
            </Detail>
          </dl>

          {!link.configured && (
            <Hint>
              Fill in <code>parent_url</code>, <code>parent_app_id</code>, and{" "}
              <code>parent_secret</code> on the singleton <code>_parent_link</code>{" "}
              row (PocketBase admin UI) to start syncing.
            </Hint>
          )}
          {link.configured && !link.handshake_complete && (
            <Hint>
              Config is in place but the child hasn't completed the handshake
              yet. Wait ~30s for the next heartbeat tick. If status stays in
              error, check that <code>parent_url</code> is reachable and the
              parent app's <code>secret</code> matches what's pasted here.
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
                onClick={() => forcePull(m.name)}
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

function ConnBadge({ ok, link }: { ok: boolean; link: LinkStatus }) {
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
  else if (!link.handshake_complete) label = "Handshake pending";
  else if (link.last_heartbeat_status && link.last_heartbeat_status !== "ok") label = "Heartbeat error";
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

function BoolPill({ ok }: { ok: boolean }) {
  return (
    <Badge variant="outline" className={ok ? "border-green-600/40 text-green-700 dark:text-green-400" : "border-muted-foreground/40 text-muted-foreground"}>
      {ok ? "yes" : "no"}
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
