import { useEffect, useRef, useCallback } from "react";
import type { RecordModel, RecordSubscription } from "pocketbase";

export interface UseDebouncedRealtimeSubscriptionOptions<T = RecordModel> {
  pb: {
    collection: (name: string) => {
      subscribe: (
        id: string,
        cb: (event: RecordSubscription<T>) => void
      ) => Promise<() => void> | (() => void);
    };
  } | null;

  collections: string | string[];
  id?: string; // defaults to '*'
  onUpdate: (event?: RecordSubscription<T>, collection?: string) => void;

  filter?: (event: RecordSubscription<T>, collection: string) => boolean;
  enabled?: boolean;

  debounceMs?: number;
  maxFloodMs?: number;
}

export function useDebouncedRealtimeSubscription<T = RecordModel>({
  pb,
  collections,
  id = "*",
  onUpdate,
  filter,
  enabled = true,
  debounceMs = 500,
  maxFloodMs = 5000,
}: UseDebouncedRealtimeSubscriptionOptions<T>) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floodStartTime = useRef<number | null>(null);
  const lastEvent = useRef<RecordSubscription<T> | undefined>(undefined);
  const lastCollection = useRef<string | undefined>(undefined);

  const unsubscribersRef = useRef<Array<() => void>>([]);
  const setupRunId = useRef(0);

  const debouncedUpdate = useCallback(
    (event?: RecordSubscription<T>, collection?: string) => {
      lastEvent.current = event;
      lastCollection.current = collection;

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      const now = Date.now();
      if (!floodStartTime.current) floodStartTime.current = now;

      // Force refresh if updates keep coming for too long
      if (now - floodStartTime.current >= maxFloodMs) {
        floodStartTime.current = now;
        onUpdate(event, collection);
        return;
      }

      debounceTimer.current = setTimeout(() => {
        onUpdate(lastEvent.current, lastCollection.current);
        floodStartTime.current = null;
      }, debounceMs);
    },
    [onUpdate, debounceMs, maxFloodMs]
  );

  useEffect(() => {
    if (!pb || !enabled) return;

    const collectionArray = Array.isArray(collections) ? collections : [collections];

    const thisRun = ++setupRunId.current;
    unsubscribersRef.current = [];
    let isCancelled = false;

    const setupSubscriptions = async () => {
      try {
        for (const collection of collectionArray) {
          if (isCancelled) break;

          const maybePromise = pb
            .collection(collection)
            .subscribe(id, (event: RecordSubscription<T>) => {
              if (filter && !filter(event, collection)) return;
              debouncedUpdate(event, collection);
            });

          const unsubscribe = typeof (maybePromise as any)?.then === "function"
            ? await (maybePromise as Promise<() => void>)
            : (maybePromise as () => void);

          if (thisRun !== setupRunId.current || isCancelled) {
            try {
              unsubscribe();
            } catch {
              // swallow; consumer can log if they want
            }
            continue;
          }

          unsubscribersRef.current.push(unsubscribe);
        }
      } catch (error) {
        if (!isCancelled) {
          // keep logging minimal; consumers can wrap with their own reporting
          console.error("Failed to setup realtime subscriptions:", error);
        }
      }
    };

    setupSubscriptions();

    return () => {
      isCancelled = true;

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      const fns = unsubscribersRef.current;
      unsubscribersRef.current = [];
      for (const unsubscribe of fns) {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error during unsubscribe:", error);
        }
      }
    };
  }, [pb, collections, id, debouncedUpdate, enabled, filter]);

  const cleanup = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    const fns = unsubscribersRef.current;
    unsubscribersRef.current = [];
    for (const unsubscribe of fns) {
      try {
        unsubscribe();
      } catch (error) {
        console.error("Error during manual unsubscribe:", error);
      }
    }
  }, []);

  return cleanup;
}