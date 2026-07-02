import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type Pocketbase from "pocketbase";
import { useDebouncedRealtimeSubscription } from "../hooks/useRealtimeSubscription";
import type { PocketBaseError } from "../lib/pberror";

/** The value every realtime-collection context exposes. */
export interface RealtimeCollectionValue<RecT> {
  items: RecT[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getById: (id: string) => RecT | undefined;
}

export interface CreateRealtimeCollectionConfig<
  PbT extends Pocketbase,
  RecT extends { id: string },
  Scope = void,
> {
  /** Client hook returning the PocketBase instance. */
  useClient: () => { pb: PbT };
  /** Reactive inputs (e.g. current user id) fed to the callbacks below. */
  useScope?: () => Scope;
  /** Collection name — used for BOTH the initial fetch and the realtime subscription. */
  collection: string;
  /** Sort passed to getFullList (e.g. "-created"). */
  sort?: string;
  /** Server-side filter for the initial fetch: a fixed string or a fn of the scope. */
  filter?: string | ((scope: Scope) => string | undefined);
  /** Gate the fetch + subscription (e.g. wait until a user is logged in). */
  enabled?: (scope: Scope) => boolean;
  /** Realtime guard: keep only records that belong to the current scope. */
  belongs?: (record: RecT, scope: Scope) => boolean;
  /** Insert new records at the front instead of the back (newest-first lists). */
  prepend?: boolean;
  /** Name used in the "must be used within…" error and as the default sort key label. */
  contextName?: string;
}

/**
 * createRealtimeCollectionContext builds a provider + hook for the common pattern
 * of "fetch a full list from one collection, then keep it live over realtime."
 * It replaces the hand-written provider/context/hook trio each such collection
 * would otherwise need — declare the collection and its rules as config instead.
 */
export function createRealtimeCollectionContext<
  PbT extends Pocketbase,
  RecT extends { id: string },
  Scope = void,
>(config: CreateRealtimeCollectionConfig<PbT, RecT, Scope>) {
  const {
    useClient,
    useScope,
    collection,
    sort,
    prepend = false,
    contextName = collection,
  } = config;

  const Context = createContext<RealtimeCollectionValue<RecT> | undefined>(undefined);

  function Provider({ children }: { children: ReactNode }) {
    const { pb } = useClient();
    const scope = (useScope ? useScope() : undefined) as Scope;
    const [items, setItems] = useState<RecT[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const enabled = config.enabled ? config.enabled(scope) : true;
    const filterStr =
      typeof config.filter === "function" ? config.filter(scope) : config.filter;

    const fetchData = useCallback(async () => {
      if (!enabled) return;
      setLoading(true);
      setError(null);
      try {
        const data = await pb.collection<RecT>(collection).getFullList({
          sort,
          filter: filterStr,
          requestKey: null,
        });
        setItems(data);
      } catch (e) {
        const err = e as PocketBaseError;
        if (err?.isAbort) return;
        setError(err.message || `Failed to fetch ${collection}`);
      } finally {
        setLoading(false);
      }
    }, [pb, enabled, filterStr]);

    const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
    const getById = useCallback((id: string) => byId.get(id), [byId]);

    useDebouncedRealtimeSubscription<RecT>({
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
        if (config.belongs && !config.belongs(e.record, scope)) return;
        switch (e.action) {
          case "create":
            setItems((prev) =>
              prev.some((i) => i.id === e.record.id)
                ? prev
                : prepend
                  ? [e.record, ...prev]
                  : [...prev, e.record],
            );
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

    const value = useMemo<RealtimeCollectionValue<RecT>>(
      () => ({ items, loading, error, refetch: fetchData, getById }),
      [items, loading, error, fetchData, getById],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useCollection(): RealtimeCollectionValue<RecT> {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error(`use${contextName} must be used within its Provider`);
    }
    return ctx;
  }

  return { Provider, useCollection, Context };
}
