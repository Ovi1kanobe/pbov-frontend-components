import { useEffect, useRef, useCallback } from 'react';
import type { RecordModel, RecordSubscription } from 'pocketbase';
import type { TypedPocketBase } from '../lib/pocketbaseTypes';

interface UseDebouncedRealtimeSubscriptionOptions<T = RecordModel> {
  pb: TypedPocketBase;
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
      onUpdate(event);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      onUpdate(lastEvent.current);
      floodStartTime.current = null;
    }, debounceMs);
  }, [onUpdate, debounceMs, maxFloodMs]);

  useEffect(() => {
    if (!pb || !enabled) return;

    const collectionArray = Array.isArray(collections) ? collections : [collections];

    // identify this setup run and reset our unsub list
    const thisRun = ++setupRunId.current;
    unsubscribersRef.current = [];
    let isCancelled = false;

    const setupSubscriptions = async () => {
      try {
        for (const collection of collectionArray) {
          if (isCancelled) break;

          const unsubscribe = await pb.collection(collection).subscribe<T>(id, (event: RecordSubscription<T>) => {
            // Apply filter if provided
            if (filter && !filter(event, collection)) {
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
  }, [pb, collections, id, debouncedUpdate, enabled, filter]);

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
