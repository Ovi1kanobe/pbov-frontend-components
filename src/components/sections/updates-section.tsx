import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  RefreshCw,
  Save,
  Sparkles,
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
export function UpdatesSection({
  fetchConfig,
  saveConfig,
  checkForUpdate,
  applyUpdate,
}: UpdatesSectionProps) {
  const [config, setConfig] = useState<UpdateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  const [checking, setChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<UpdateCheckResult | null>(null);
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
    } catch (e) {
      const err = e as PocketBaseError;
      if (err?.isAbort) return;
      setError(err?.message ?? "Failed to load update settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const dirty =
    config === null
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
    } catch (e) {
      const err = e as PocketBaseError;
      toast.error(err?.message ?? "Failed to save update settings");
    } finally {
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
      } else {
        toast.success("You're on the latest version");
      }
      await loadConfig();
    } catch (e) {
      const err = e as PocketBaseError;
      toast.error(err?.message ?? "Failed to check for updates");
    } finally {
      setChecking(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      const res = await applyUpdate();
      toast.success(
        `Updating ${res.from_version} → ${res.to_version} — the app will restart in a few seconds`,
      );
    } catch (e) {
      const err = e as PocketBaseError;
      toast.error(err?.message ?? "Failed to apply update");
    } finally {
      setApplying(false);
    }
  };

  if (loading && !config) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading update settings…</p>;
  }

  if (error) {
    return (
      <SettingsWidget title="Updates" icon={<Sparkles size={18} />}>
        <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm">
          <AlertCircle size={14} className="text-destructive" />
          <span>{error}</span>
        </div>
      </SettingsWidget>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-6">
      <SettingsWidget
        title="Updates"
        description="Check GitHub for new releases of this app and apply them manually. Nothing updates automatically."
        icon={<Sparkles size={18} />}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 font-mono">
              Running {config.current_version}
            </Badge>
            {dirty && (
              <Badge variant="outline" className="border-amber-500/40 text-amber-700 dark:text-amber-400">
                Unsaved changes
              </Badge>
            )}
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="upd-owner" className="text-xs">Repo owner</Label>
              <Input
                id="upd-owner"
                placeholder="19th-Judicial-Circuit-Court"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="upd-name" className="text-xs">Repo name</Label>
              <Input
                id="upd-name"
                placeholder="ccfw"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="upd-token" className="text-xs">GitHub token</Label>
              <Input
                id="upd-token"
                type="password"
                className="font-mono"
                placeholder={config.token_set ? "token is set — leave blank to keep it" : "personal access token with contents:read"}
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch id="upd-enabled" checked={enabled} onCheckedChange={setEnabled} />
              <Label htmlFor="upd-enabled" className="text-xs">Enable update checks</Label>
            </div>
            <Button size="sm" className="h-7 gap-1" onClick={handleSave} disabled={saving || !dirty}>
              {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
              Save
            </Button>
          </div>

          <Separator />

          <dl className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
            <Detail label="Last checked">{fmtTime(config.last_checked_at)}</Detail>
            <Detail label="Last check result">
              {config.last_check_status ? (
                <span className="font-mono text-[11px]">{config.last_check_status}</span>
              ) : (
                <Muted>never checked</Muted>
              )}
            </Detail>
            <Detail label="Latest version seen" full>
              {config.latest_version_seen || <Muted>—</Muted>}
            </Detail>
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1"
              onClick={handleCheck}
              disabled={!config.enabled || checking}
            >
              {checking ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
              Check for updates
            </Button>

            {checkResult?.update_available && (
              <Button size="sm" className="h-7 gap-1" onClick={handleApply} disabled={applying}>
                {applying ? <Loader2 size={11} className="animate-spin" /> : <Download size={11} />}
                Update to {checkResult.latest_version}
              </Button>
            )}
          </div>

          {!config.enabled && (
            <Hint>
              Set a repo owner, repo name, and token, then enable update checks
              before checking for a new release.
            </Hint>
          )}

          {checkResult && (
            <div className="rounded border p-3 text-xs">
              {checkResult.update_available ? (
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle size={12} />
                  <span>
                    {checkResult.current_version} → {checkResult.latest_version} available
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 size={12} />
                  <span>Up to date ({checkResult.current_version})</span>
                </div>
              )}
              {checkResult.release_url && (
                <a
                  href={checkResult.release_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-primary underline"
                >
                  View release notes
                </a>
              )}
            </div>
          )}
        </div>
      </SettingsWidget>
    </div>
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
