import { useEffect, useState } from "react";
import Pocketbase from "pocketbase";
import { PocketBaseError } from "../lib/pberror";

export interface ParentLinkInfo {
  /** True while the initial fetch is in flight. */
  loading: boolean;
  /** True when this app has an enabled, configured link to a ccfw parent. */
  connected: boolean;
  /** Base URL of the parent app, e.g. "https://ccfw.example.org". Empty when not connected. */
  parentUrl: string;
}

/**
 * Fetches GET /api/parentlink/info — available to any authenticated user on a
 * child app. Use it to build "edit your profile on CCFW" links; it exposes no
 * secrets. On the parent app (or a child with no link) it reports
 * connected=false and components should fall back to local behavior.
 */
export function useParentLinkInfo(pb: Pocketbase): ParentLinkInfo {
  const [info, setInfo] = useState<ParentLinkInfo>({
    loading: true,
    connected: false,
    parentUrl: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await pb.send<{ connected: boolean; parent_url: string }>(
          "/api/parentlink/info",
          { method: "GET" },
        );
        if (!cancelled) {
          setInfo({ loading: false, connected: res.connected, parentUrl: res.parent_url ?? "" });
        }
      } catch (e) {
        const err = e as PocketBaseError;
        if (err?.isAbort) return;
        // endpoint missing (parent app) or link not configured — either way,
        // callers fall back to local behavior
        if (!cancelled) {
          setInfo({ loading: false, connected: false, parentUrl: "" });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pb]);

  return info;
}
