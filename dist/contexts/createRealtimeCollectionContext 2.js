import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { useDebouncedRealtimeSubscription } from "../hooks/useRealtimeSubscription";
/**
 * createRealtimeCollectionContext builds a provider + hook for the common pattern
 * of "fetch a full list from one collection, then keep it live over realtime."
 * It replaces the hand-written provider/context/hook trio each such collection
 * would otherwise need — declare the collection and its rules as config instead.
 */
export function createRealtimeCollectionContext(config) {
    const { useClient, useScope, collection, sort, prepend = false, contextName = collection, } = config;
    const Context = createContext(undefined);
    function Provider({ children }) {
        const { pb } = useClient();
        const scope = (useScope ? useScope() : undefined);
        const [items, setItems] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const enabled = config.enabled ? config.enabled(scope) : true;
        const filterStr = typeof config.filter === "function" ? config.filter(scope) : config.filter;
        const fetchData = useCallback(async () => {
            if (!enabled)
                return;
            setLoading(true);
            setError(null);
            try {
                const data = await pb.collection(collection).getFullList({
                    sort,
                    filter: filterStr,
                    requestKey: null,
                });
                setItems(data);
            }
            catch (e) {
                const err = e;
                if (err?.isAbort)
                    return;
                setError(err.message || `Failed to fetch ${collection}`);
            }
            finally {
                setLoading(false);
            }
        }, [pb, enabled, filterStr]);
        const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
        const getById = useCallback((id) => byId.get(id), [byId]);
        useDebouncedRealtimeSubscription({
            pb,
            collections: collection,
            enabled: !!pb && enabled,
            debounceMs: 300,
            onUpdate: (e) => {
                // null event = the hook's flood fallback; re-pull the authoritative list
                if (!e) {
                    fetchData();
                    return;
                }
                if (config.belongs && !config.belongs(e.record, scope))
                    return;
                switch (e.action) {
                    case "create":
                        setItems((prev) => prev.some((i) => i.id === e.record.id)
                            ? prev
                            : prepend
                                ? [e.record, ...prev]
                                : [...prev, e.record]);
                        break;
                    case "update":
                        setItems((prev) => prev.map((i) => (i.id === e.record.id ? e.record : i)));
                        break;
                    case "delete":
                        setItems((prev) => prev.filter((i) => i.id !== e.record.id));
                        break;
                    default:
                        break;
                }
            },
        });
        useEffect(() => {
            fetchData();
        }, [fetchData]);
        const value = useMemo(() => ({ items, loading, error, refetch: fetchData, getById }), [items, loading, error, fetchData, getById]);
        return _jsx(Context.Provider, { value: value, children: children });
    }
    function useCollection() {
        const ctx = useContext(Context);
        if (!ctx) {
            throw new Error(`use${contextName} must be used within its Provider`);
        }
        return ctx;
    }
    return { Provider, useCollection, Context };
}
