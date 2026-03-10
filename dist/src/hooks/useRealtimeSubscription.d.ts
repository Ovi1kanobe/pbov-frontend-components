import type { RecordModel, RecordSubscription } from 'pocketbase';
import Pocketbase from 'pocketbase';
interface UseDebouncedRealtimeSubscriptionOptions<T = RecordModel> {
    pb: Pocketbase;
    collections: string | string[];
    id?: string;
    onUpdate: (event?: RecordSubscription<T>) => void;
    filter?: (event: RecordSubscription<T>, collection: string) => boolean;
    enabled?: boolean;
    debounceMs?: number;
    maxFloodMs?: number;
}
export declare function useDebouncedRealtimeSubscription<T = RecordModel>({ pb, collections, id, onUpdate, filter, enabled, debounceMs, maxFloodMs, }: UseDebouncedRealtimeSubscriptionOptions<T>): () => void;
export {};
