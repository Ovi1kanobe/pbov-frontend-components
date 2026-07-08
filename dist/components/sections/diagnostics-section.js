import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import Pocketbase from "pocketbase";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "../ui/chart";
import { PocketBaseError } from "../../lib/pberror";
// 10s poll × 30 ≈ the last 5 minutes of memory.
const MAX_SAMPLES = 30;
const memChartConfig = {
    heap: { label: "Heap", color: "var(--chart-1)" },
    sys: { label: "Sys", color: "var(--chart-2)" },
};
export function DiagnosticsSection({ pb }) {
    const [data, setData] = useState(null);
    const [samples, setSamples] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const load = useCallback(async () => {
        try {
            const res = await pb.send("/api/diagnostics", { method: "GET" });
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
        }
        catch (e) {
            const err = e;
            if (err?.isAbort)
                return;
            setError(err?.message ?? "Failed to load diagnostics");
        }
        finally {
            setLoading(false);
        }
    }, [pb]);
    useEffect(() => {
        load();
        const t = window.setInterval(load, 2_000);
        return () => window.clearInterval(t);
    }, [load]);
    if (loading && !data) {
        return _jsx("p", { className: "py-12 text-center text-sm text-muted-foreground", children: "Loading diagnostics\u2026" });
    }
    if (error) {
        return (_jsx(Card, { className: "border-border/60 shadow-none", children: _jsx(CardContent, { className: "py-3", children: _jsxs("div", { className: "flex items-center gap-2 rounded border border-destructive/40 bg-destructive/10 p-3 text-sm", children: [_jsx(AlertCircle, { size: 14, className: "text-destructive" }), _jsx("span", { children: error })] }) }) }));
    }
    if (!data)
        return null;
    return (_jsxs(Card, { className: "border-border/60 shadow-none", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [_jsx(Activity, { size: 14, className: "text-muted-foreground" }), "Server diagnostics"] }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "outline", className: "text-[10px]", children: data.hostname || "no hostname" }), _jsxs(Badge, { variant: "outline", className: "text-[10px]", children: ["pid ", data.pid] }), _jsxs(Button, { size: "sm", variant: "outline", className: "ml-auto h-7 gap-1", onClick: load, disabled: loading, children: [_jsx(RefreshCw, { size: 11, className: loading ? "animate-spin" : "" }), "Refresh"] })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsx("span", { className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "Memory (live)" }), _jsxs("div", { className: "flex items-center gap-3 text-[10px] text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "size-2 rounded-full", style: { background: "var(--chart-1)" } }), data.mem_heap_alloc_mib.toFixed(1), " MiB heap"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "size-2 rounded-full", style: { background: "var(--chart-2)" } }), data.mem_sys_mib.toFixed(1), " MiB sys"] })] })] }), samples.length < 2 ? (_jsx("p", { className: "flex h-35 items-center justify-center text-xs text-muted-foreground", children: "Collecting samples\u2026" })) : (_jsx(ChartContainer, { config: memChartConfig, className: "h-35 w-full", children: _jsxs(AreaChart, { data: samples, margin: { left: 0, right: 8, top: 4, bottom: 0 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "fillHeap", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "var(--color-heap)", stopOpacity: 0.4 }), _jsx("stop", { offset: "95%", stopColor: "var(--color-heap)", stopOpacity: 0.05 })] }), _jsxs("linearGradient", { id: "fillSys", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "var(--color-sys)", stopOpacity: 0.4 }), _jsx("stop", { offset: "95%", stopColor: "var(--color-sys)", stopOpacity: 0.05 })] })] }), _jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "time", tickLine: false, axisLine: false, tickMargin: 8, minTickGap: 32, fontSize: 10 }), _jsx(YAxis, { tickLine: false, axisLine: false, width: 32, fontSize: 10, tickFormatter: (v) => `${v}` }), _jsx(ChartTooltip, { cursor: false, content: _jsx(ChartTooltipContent, { indicator: "line" }) }), _jsx(Area, { dataKey: "sys", type: "monotone", stroke: "var(--color-sys)", fill: "url(#fillSys)", strokeWidth: 2, isAnimationActive: false }), _jsx(Area, { dataKey: "heap", type: "monotone", stroke: "var(--color-heap)", fill: "url(#fillHeap)", strokeWidth: 2, isAnimationActive: false })] }) }))] }), _jsx(Separator, {}), _jsxs("dl", { className: "grid grid-cols-1 gap-3 text-xs md:grid-cols-2", children: [_jsx(Detail, { label: "Go version", children: _jsx("span", { className: "font-mono", children: data.go_version }) }), _jsx(Detail, { label: "GOOS / GOARCH", children: _jsxs("span", { className: "font-mono", children: [data.go_os, " / ", data.go_arch] }) }), _jsx(Detail, { label: "PocketBase version", children: data.pocketbase_version ? (_jsx("span", { className: "font-mono", children: data.pocketbase_version })) : (_jsx(Muted, { children: "unknown" })) }), _jsx(Detail, { label: "nginx version", children: data.nginx_version ? (_jsx("span", { className: "font-mono", children: data.nginx_version })) : (_jsx(Muted, { children: "not installed" })) }), _jsx(Detail, { label: "bun version", children: data.bun_version ? (_jsx("span", { className: "font-mono", children: data.bun_version })) : (_jsx(Muted, { children: "unknown" })) }), _jsx(Detail, { label: "System RAM", children: _jsx("span", { className: "font-mono", children: formatBytes(data.system_ram_bytes) }) }), _jsx(Detail, { label: "Frontend bundle size", children: data.frontend_size_bytes ? (_jsx("span", { className: "font-mono", children: formatBytes(data.frontend_size_bytes) })) : (_jsx(Muted, { children: "unknown" })) }), _jsx(Detail, { label: "Process started at", children: _jsx("span", { className: "font-mono", children: new Date(data.process_started_at).toLocaleString() }) }), _jsx(Detail, { label: "Uptime", children: _jsx("span", { className: "font-mono", children: formatUptime(data.uptime_seconds) }) }), _jsx(Detail, { label: "Goroutines", children: _jsx("span", { className: "font-mono", children: data.num_goroutines.toLocaleString() }) }), _jsx(Detail, { label: "Memory (alloc)", children: _jsxs("span", { className: "font-mono", children: [data.mem_alloc_mib.toFixed(1), " MiB"] }) }), _jsx(Detail, { label: "Memory (heap alloc)", children: _jsxs("span", { className: "font-mono", children: [data.mem_heap_alloc_mib.toFixed(1), " MiB"] }) }), _jsx(Detail, { label: "Memory (sys)", children: _jsxs("span", { className: "font-mono", children: [data.mem_sys_mib.toFixed(1), " MiB"] }) }), _jsx(Detail, { label: "Memory (total alloc, lifetime)", full: true, children: _jsxs("span", { className: "font-mono", children: [data.mem_total_alloc_mib.toFixed(1), " MiB"] }) })] })] })] }));
}
function Detail({ label, full, children, }) {
    return (_jsxs("div", { className: full ? "md:col-span-2" : undefined, children: [_jsx("dt", { className: "mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }), _jsx("dd", { children: children })] }));
}
function Muted({ children }) {
    return _jsx("span", { className: "italic text-muted-foreground", children: children });
}
function formatBytes(bytes) {
    if (!bytes)
        return "—";
    const units = ["B", "KiB", "MiB", "GiB", "TiB"];
    let v = bytes;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    return `${v.toFixed(i > 0 && v < 100 ? 1 : 0)} ${units[i]}`;
}
function formatUptime(seconds) {
    if (seconds < 60)
        return `${seconds.toFixed(0)}s`;
    const m = Math.floor(seconds / 60);
    if (m < 60)
        return `${m}m ${(seconds % 60).toFixed(0)}s`;
    const h = Math.floor(m / 60);
    if (h < 24)
        return `${h}h ${m % 60}m`;
    const d = Math.floor(h / 24);
    return `${d}d ${h % 24}h ${m % 60}m`;
}
