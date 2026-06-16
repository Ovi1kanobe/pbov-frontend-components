import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type Pocketbase from "pocketbase";
import type { RecordModel, RecordSubscription } from "pocketbase";
import { useDebouncedRealtimeSubscription } from "../hooks/useRealtimeSubscription";
import type { PocketBaseError } from "../lib/pberror";

export interface CreateUserContextConfig<PbT extends Pocketbase> {
  useClient: () => { pb: PbT };
  usersCollection?: string;
  preferencesCollection?: string;
  msProfileCollection?: string;
}

export type ExpandedUserRecord<
  UserT extends RecordModel,
  PrefsT extends RecordModel,
  MsT extends RecordModel,
> = UserT & {
  expand?: {
    preferences?: PrefsT | null;
    ms_profile?: MsT | null;
  };
};

export interface UserContextValue<
  UserT extends RecordModel,
  PrefsT extends RecordModel,
  MsT extends RecordModel,
> {
  user: ExpandedUserRecord<UserT, PrefsT, MsT> | null;
  msProfile: MsT | null;
  preferences: PrefsT | null;
  fetched: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateUser: (
    data: Partial<Omit<UserT, "avatar">> & { avatar?: File | string },
  ) => Promise<void>;
  setUser: Dispatch<SetStateAction<ExpandedUserRecord<UserT, PrefsT, MsT> | null>>;
  updatePreferences: (data: Partial<PrefsT>) => Promise<void>;
}

export function createUserContext<
  PbT extends Pocketbase,
  UserT extends RecordModel,
  PrefsT extends RecordModel,
  MsT extends RecordModel,
>(config: CreateUserContextConfig<PbT>) {
  const { useClient } = config;
  const usersCol = config.usersCollection ?? "users";
  const prefsCol = config.preferencesCollection ?? "_user_preferences";
  const msProfileCol = config.msProfileCollection ?? "_user_microsoft_profiles";

  type Expanded = ExpandedUserRecord<UserT, PrefsT, MsT>;
  type Ctx = UserContextValue<UserT, PrefsT, MsT>;

  const UserContext = createContext<Ctx | undefined>(undefined);

  function UserProvider({ children }: { children: ReactNode }) {
    const { pb } = useClient();
    const [user, setUser] = useState<Expanded | null>(null);
    const [fetched, setFetched] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentUser = useCallback(async () => {
      if (!pb.authStore.isValid || !pb.authStore.record) {
        setUser(null);
        setFetched(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const id = pb.authStore.record.id;
        const userData = await pb
          .collection<Expanded>(usersCol)
          .getOne(id, {
            expand: "preferences,ms_profile",
            requestKey: null,
          });
        setUser(userData);
        setFetched(true);
      } catch (e) {
        const err = e as PocketBaseError;
        if (err?.isAbort) return;
        if (err.status === 404) {
          setUser(null);
          setFetched(true);
          return;
        }
        setError(err.message || "Failed to fetch current user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }, [pb]);

    const updateUser = useCallback<Ctx["updateUser"]>(
      async (data) => {
        if (!user) return;
        const res = await pb
          .collection<Expanded>(usersCol)
          .update(user.id, data, { expand: "preferences,ms_profile" });
        setUser(res);
      },
      [pb, user],
    );

    const updatePreferences = useCallback<Ctx["updatePreferences"]>(
      async (data) => {
        if (!user) return;
        if (!user.expand?.preferences) return;
        const res = await pb
          .collection<PrefsT>(prefsCol)
          .update(user.expand.preferences.id, data);
        setUser((prev) =>
          prev ? { ...prev, expand: { ...prev.expand, preferences: res } } : null,
        );
      },
      [pb, user],
    );

    useDebouncedRealtimeSubscription<PrefsT | MsT>({
      pb,
      collections: [prefsCol, msProfileCol],
      id: "*",
      onUpdate: (e?: RecordSubscription<PrefsT | MsT>) => {
        if (!e || !user) return;
        const updatedId = e.record?.id;
        if (!updatedId) return;
        const preferencesId = user.expand?.preferences?.id;
        const msProfileId = user.expand?.ms_profile?.id;
        if (updatedId === preferencesId || updatedId === msProfileId) {
          fetchCurrentUser();
        }
      },
      debounceMs: 300,
      enabled: !!user?.id,
    });

    useEffect(() => {
      fetchCurrentUser();
    }, [fetchCurrentUser]);

    const value = useMemo<Ctx>(
      () => ({
        user,
        msProfile: user?.expand?.ms_profile ?? null,
        preferences: user?.expand?.preferences ?? null,
        fetched,
        loading,
        error,
        refetch: fetchCurrentUser,
        updateUser,
        setUser,
        updatePreferences,
      }),
      [user, fetched, loading, error, fetchCurrentUser, updateUser, updatePreferences],
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
  }

  function useUser(): Ctx {
    const ctx = useContext(UserContext);
    if (!ctx) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return ctx;
  }

  return { UserProvider, useUser, UserContext };
}
