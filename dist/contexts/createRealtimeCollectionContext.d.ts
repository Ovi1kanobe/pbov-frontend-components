import type { ReactNode } from "react";
import type Pocketbase from "pocketbase";
/** The value every realtime-collection context exposes. */
export interface RealtimeCollectionValue<RecT> {
    items: RecT[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    getById: (id: string) => RecT | undefined;
}
export interface CreateRealtimeCollectionConfig<PbT extends Pocketbase, RecT extends {
    id: string;
}, Scope = void> {
    /** Client hook returning the PocketBase instance. */
    useClient: () => {
        pb: PbT;
    };
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
export declare function createRealtimeCollectionContext<PbT extends Pocketbase, RecT extends {
    id: string;
}, Scope = void>(config: CreateRealtimeCollectionConfig<PbT, RecT, Scope>): {
    Provider: ({ children }: {
        children: ReactNode;
    }) => import("react").JSX.Element;
    useCollection: () => RealtimeCollectionValue<RecT>;
    Context: import("react").Context<RealtimeCollectionValue<RecT> | undefined>;
};
