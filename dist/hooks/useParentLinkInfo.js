import { useEffect, useState } from "react";
import Pocketbase from "pocketbase";
import { PocketBaseError } from "../lib/pberror";
/**
 * Fetches GET /api/parentlink/info — available to any authenticated user on a
 * child app. Use it to build "edit your profile on CCFW" links; it exposes no
 * secrets. On the parent app (or a child with no link) it reports
 * connected=false and components should fall back to local behavior.
 */
export function useParentLinkInfo(pb) {
    const [info, setInfo] = useState({
        loading: true,
        connected: false,
        parentUrl: "",
    });
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await pb.send("/api/parentlink/info", { method: "GET" });
                if (!cancelled) {
                    setInfo({ loading: false, connected: res.connected, parentUrl: res.parent_url ?? "" });
                }
            }
            catch (e) {
                const err = e;
                if (err?.isAbort)
                    return;
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
