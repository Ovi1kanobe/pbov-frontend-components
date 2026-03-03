import { RecordModel, RecordSubscription } from 'pocketbase';

declare function useDebounce<T>(value: T, delay?: number): T;

declare function useIsMobile(): boolean;

interface UseDebouncedRealtimeSubscriptionOptions<T = RecordModel> {
    pb: {
        collection: (name: string) => {
            subscribe: (id: string, cb: (event: RecordSubscription<T>) => void) => Promise<() => void> | (() => void);
        };
    } | null;
    collections: string | string[];
    id?: string;
    onUpdate: (event?: RecordSubscription<T>, collection?: string) => void;
    filter?: (event: RecordSubscription<T>, collection: string) => boolean;
    enabled?: boolean;
    debounceMs?: number;
    maxFloodMs?: number;
}
declare function useDebouncedRealtimeSubscription<T = RecordModel>({ pb, collections, id, onUpdate, filter, enabled, debounceMs, maxFloodMs, }: UseDebouncedRealtimeSubscriptionOptions<T>): () => void;

export { type UseDebouncedRealtimeSubscriptionOptions, useDebounce, useDebouncedRealtimeSubscription, useIsMobile };
