import { useCallback, useEffect, useState } from "react";
import Pocketbase from "pocketbase";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../ui/chart";
import { PocketBaseError } from "../../lib/pberror";

type DiagnosticsResponse = {
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

// One memory reading captured from a poll. We accumulate these client-side
// into a rolling window since the endpoint is point-in-time only — no history
// is stored server-side, so the series resets on refresh/navigation.
type MemSample = {
  time: string;
  heap: number;
  sys: number;
};

// 10s poll × 30 ≈ the last 5 minutes of memory.
const MAX_SAMPLES = 30;

const memChartConfig = {
  heap: { label: "Heap", color: "var(--chart-1)" },
  sys: { label: "Sys", color: "var(--chart-2)" },
} satisfies ChartConfig;

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

export function DiagnosticsSection({
  pb,
  endpoint = "/api/diagnostics",
  pollMs = 2_000,
  title = "Server diagnostics",
}: DiagnosticsSectionProps) {
  const [data, setData] = useState<DiagnosticsResponse | null>(null);
  const [samples, setSamples] = useState<MemSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const raw = await pb.send<DiagnosticsResponse | { diagnostics: DiagnosticsResponse }>(
        endpoint,
        { method: "GET" },
      );
      // ccfw's per-app proxy wraps the child's payload in { diagnostics, cached, ... }
      const res = "diagnostics" in raw ? raw.diagnostics : raw;
      setData(res);
      setError(null);
      // push this reading into the rolling window, dropping the oldest
      setSamples((prev) => {
        const next = [
          ...prev,
          {
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            heap: Number(res.mem_heap_alloc_mib.toFixed(1)),
            sys: Number(res.mem_sys_mib.toFixed(1)),
          },
        ];
        return next.length > MAX_SAMPLES ? next.slice(next.length - MAX_SAMPLES) : next;
      });
    } catch (e) {
      const err = e as PocketBaseError;
      if (err?.isAbort) return;
      setError(err?.message ?? "Failed to load diagnostics");
    } finally {
      setLoading(false);
    }
  }, [pb, endpoint]);

  useEffect(() => {
    // reset the rolling memory window when the target changes
    setSamples([]);
    setData(null);
    setLoading(true);
    load();
    const t = window.setInterval(load, pollMs);
    return () => window.clearInterval(t);
  }, [load, pollMs]);

  if (loading && !data) {
    return <p className="py-12 text-center text-sm text-muted-foreground">Loading diagnostics…</p>;
  }
  if (error) {
    return (
      <Card className="border-border/60 shadow-none">
        <CardContent className="py-3">
          <div className="flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <AlertCircle size={14} className="text-destructive" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!data) return null;

  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity size={14} className="text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px]">{data.hostname || "no hostname"}</Badge>
          <Badge variant="outline" className="text-[10px]">pid {data.pid}</Badge>
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

        {/* live memory: heap vs sys over the rolling poll window */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Memory (live)
            </span>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full" style={{ background: "var(--chart-1)" }} />
                {data.mem_heap_alloc_mib.toFixed(1)} MiB heap
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full" style={{ background: "var(--chart-2)" }} />
                {data.mem_sys_mib.toFixed(1)} MiB sys
              </span>
            </div>
          </div>
          {samples.length < 2 ? (
            <p className="flex h-35 items-center justify-center text-xs text-muted-foreground">
              Collecting samples…
            </p>
          ) : (
            <ChartContainer config={memChartConfig} className="h-35 w-full">
              <AreaChart data={samples} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillHeap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-heap)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-heap)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fillSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-sys)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-sys)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  fontSize={10}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  fontSize={10}
                  tickFormatter={(v) => `${v}`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                <Area
                  dataKey="sys"
                  type="monotone"
                  stroke="var(--color-sys)"
                  fill="url(#fillSys)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Area
                  dataKey="heap"
                  type="monotone"
                  stroke="var(--color-heap)"
                  fill="url(#fillHeap)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>

        <Separator />

        <dl className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
          <Detail label="Go version"><span className="font-mono">{data.go_version}</span></Detail>
          <Detail label="GOOS / GOARCH">
            <span className="font-mono">{data.go_os} / {data.go_arch}</span>
          </Detail>
          <Detail label="PocketBase version">
            {data.pocketbase_version ? (
              <span className="font-mono">{data.pocketbase_version}</span>
            ) : (
              <Muted>unknown</Muted>
            )}
          </Detail>
          <Detail label="nginx version">
            {data.nginx_version ? (
              <span className="font-mono">{data.nginx_version}</span>
            ) : (
              <Muted>not installed</Muted>
            )}
          </Detail>
          <Detail label="bun version">
            {data.bun_version ? (
              <span className="font-mono">{data.bun_version}</span>
            ) : (
              <Muted>unknown</Muted>
            )}
          </Detail>
          <Detail label="System RAM">
            <span className="font-mono">{formatBytes(data.system_ram_bytes)}</span>
          </Detail>
          <Detail label="Frontend bundle size">
            {data.frontend_size_bytes ? (
              <span className="font-mono">{formatBytes(data.frontend_size_bytes)}</span>
            ) : (
              <Muted>unknown</Muted>
            )}
          </Detail>
          <Detail label="Process started at">
            <span className="font-mono">{new Date(data.process_started_at).toLocaleString()}</span>
          </Detail>
          <Detail label="Uptime"><span className="font-mono">{formatUptime(data.uptime_seconds)}</span></Detail>
          <Detail label="Goroutines"><span className="font-mono">{data.num_goroutines.toLocaleString()}</span></Detail>
          <Detail label="Memory (alloc)"><span className="font-mono">{data.mem_alloc_mib.toFixed(1)} MiB</span></Detail>
          <Detail label="Memory (heap alloc)"><span className="font-mono">{data.mem_heap_alloc_mib.toFixed(1)} MiB</span></Detail>
          <Detail label="Memory (sys)"><span className="font-mono">{data.mem_sys_mib.toFixed(1)} MiB</span></Detail>
          <Detail label="Memory (total alloc, lifetime)" full>
            <span className="font-mono">{data.mem_total_alloc_mib.toFixed(1)} MiB</span>
          </Detail>
        </dl>
      </CardContent>
    </Card>
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

function formatBytes(bytes: number): string {
  if (!bytes) return "—";
  const units = ["B", "KiB", "MiB", "GiB", "TiB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i > 0 && v < 100 ? 1 : 0)} ${units[i]}`;
}

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(0)}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ${(seconds % 60).toFixed(0)}s`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ${m % 60}m`;
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h ${m % 60}m`;
}
