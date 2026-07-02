import { useEffect, useRef, useCallback } from 'react';
import type { RecordModel, RecordSubscription } from 'pocketbase';
import Pocketbase from 'pocketbase';
interface UseDebouncedRealtimeSubscriptionOptions<T = RecordModel> {
  pb: Pocketbase;
  collections: string | string[]; // single collection or array of collections
  id?: string; // defaults to '*' if not provided
  onUpdate: (event?: RecordSubscription<T>) => void;
  filter?: (event: RecordSubscription<T>, collection: string) => boolean; // optional filter function
  enabled?: boolean; // allows conditional subscription
  debounceMs?: number;
  maxFloodMs?: number; // force refresh after continuous updates
}

export function useDebouncedRealtimeSubscription<T = RecordModel>({
  pb,
  collections,
  id = '*',
  onUpdate,
  filter,
  enabled = true,
  debounceMs = 500,
  maxFloodMs = 5000,
}: UseDebouncedRealtimeSubscriptionOptions<T>) {
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const floodStartTime = useRef<number | null>(null);
  const lastEvent = useRef<RecordSubscription<T> | undefined>(undefined);

  // NEW: hold unsubscribe fns across async timing/renders
  const unsubscribersRef = useRef<Array<() => void>>([]);
  // NEW: track the current effect "run" to guard late promises
  const setupRunId = useRef(0);

  // Hold the latest callbacks in refs so the subscribe effect never depends on
  // their identity. Callers almost always pass inline `onUpdate`/`filter` arrows,
  // which are new on every render. If those were effect deps, the effect would
  // tear down and re-subscribe on every render — and teardown clears the pending
  // debounce timer, silently dropping the queued realtime event. Reading through a
  // ref keeps the subscription stable while still calling the freshest closure.
  const onUpdateRef = useRef(onUpdate);
  const filterRef = useRef(filter);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    filterRef.current = filter;
  }, [onUpdate, filter]);

  const debouncedUpdate = useCallback((event?: RecordSubscription<T>) => {
    lastEvent.current = event;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const now = Date.now();
    if (!floodStartTime.current) {
      floodStartTime.current = now;
    }

    // Force refresh if updates keep coming for too long
    if (now - floodStartTime.current >= maxFloodMs) {
      floodStartTime.current = now;
      onUpdateRef.current(event);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      onUpdateRef.current(lastEvent.current);
      floodStartTime.current = null;
    }, debounceMs);
  }, [debounceMs, maxFloodMs]);

  // Normalize to a stable primitive so an inline array literal for `collections`
  // doesn't re-trigger the effect every render the way a new array reference would.
  const collectionArray = Array.isArray(collections) ? collections : [collections];
  const collectionKey = collectionArray.join(",");

  useEffect(() => {
    if (!pb || !enabled) return;

    const cols = collectionKey.split(",");

    // identify this setup run and reset our unsub list
    const thisRun = ++setupRunId.current;
    unsubscribersRef.current = [];
    let isCancelled = false;

    const setupSubscriptions = async () => {
      try {
        for (const collection of cols) {
          if (isCancelled) break;

          const unsubscribe = await pb.collection(collection).subscribe<T>(id, (event) => {
            // Apply filter if provided (read the latest via ref)
            const currentFilter = filterRef.current;
            if (currentFilter && !currentFilter(event, collection)) {
              return; // Skip this update
            }
            debouncedUpdate(event);
          });

          // POST-AWAIT GUARD: if cleanup already ran for this run, immediately unsubscribe
          if (thisRun !== setupRunId.current || isCancelled) {
            try { unsubscribe(); } catch {
              console.error('Error during immediate unsubscribe');
            }
            continue;
          }

          // store for later cleanup
          unsubscribersRef.current.push(unsubscribe);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to setup realtime subscriptions:', error);
        }
      }
    };

    setupSubscriptions();

    return () => {
      isCancelled = true;

      // Clear debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = null;
      }

      // Unsubscribe from all collections captured for this run
      const fns = unsubscribersRef.current;
      unsubscribersRef.current = []; // clear immediately to avoid double-calls
      for (const unsubscribe of fns) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error during unsubscribe:', error);
        }
      }
    };
  }, [pb, collectionKey, id, debouncedUpdate, enabled]);

  // Cleanup function for manual use
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
        console.error('Error during manual unsubscribe:', error);
      }
    }
  }, []);

  return cleanup;
}
