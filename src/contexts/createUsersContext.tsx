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
import { toast } from "sonner";
import { useDebouncedRealtimeSubscription } from "../hooks/useRealtimeSubscription";
import type { PocketBaseError } from "../lib/pberror";

export interface CreateUsersContextConfig<
  PbT extends Pocketbase,
  UserT extends { id: string },
> {
  useClient: () => { pb: PbT };
  useUser: () => {
    user: UserT | null;
    refetch: () => void;
  };
  usersCollection?: string;
}

export interface UsersContextValue<UserT extends { id: string }> {
  users: UserT[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  getUserById: (id: string) => UserT | undefined;
  updateUser: (id: string, data: Partial<UserT>) => Promise<void>;
}

export function createUsersContext<
  PbT extends Pocketbase,
  UserT extends { id: string },
>(config: CreateUsersContextConfig<PbT, UserT>) {
  const { useClient, useUser } = config;
  const usersCol = config.usersCollection ?? "users";

  type Ctx = UsersContextValue<UserT>;
  const UsersContext = createContext<Ctx | undefined>(undefined);

  function UsersContextProvider({ children }: { children: ReactNode }) {
    const { pb } = useClient();
    const { user, refetch: refetchUser } = useUser();
    const [users, setUsers] = useState<UserT[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const usersData = await pb.collection<UserT>(usersCol).getFullList({
          sort: "name",
          requestKey: null,
        });
        setUsers(usersData);
      } catch (e) {
        const err = e as PocketBaseError;
        if (err?.isAbort) return;
        setError(err.message || "Failed to fetch users data");
      } finally {
        setLoading(false);
      }
    }, [pb, user?.id]);

    const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

    const getUserById = useCallback((id: string) => usersById.get(id), [usersById]);

    const updateUser = useCallback<Ctx["updateUser"]>(
      async (id, data) => {
        if (id === user?.id) {
          toast.error(
            "You cannot update your own user record from the users context. Please use the user context to update your own record.",
          );
          return;
        }
        try {
          const updated = await pb.collection<UserT>(usersCol).update(id, data);
          setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
        } catch (e) {
          const err = e as PocketBaseError;
          setError(err.message || "Failed to update user");
        }
      },
      [pb, user?.id],
    );

    useDebouncedRealtimeSubscription<UserT>({
      pb,
      collections: usersCol,
      onUpdate: (e) => {
        if (!e) {
          fetchData();
          return;
        }
        switch (e.action) {
          case "create":
            setUsers((prev) => [...prev, e.record]);
            break;
          case "update":
            setUsers((prev) => prev.map((u) => (u.id === e.record.id ? e.record : u)));
            if (user && e.record.id === user.id) {
              refetchUser();
            }
            break;
          case "delete":
            setUsers((prev) => prev.filter((u) => u.id !== e.record.id));
            break;
          default:
            break;
        }
      },
      debounceMs: 300,
      enabled: !!user?.id,
    });

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const value = useMemo<Ctx>(
      () => ({
        users,
        loading,
        error,
        refetch: fetchData,
        getUserById,
        updateUser,
      }),
      [users, loading, error, fetchData, getUserById, updateUser],
    );

    return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
  }

  function useUsers(): Ctx {
    const ctx = useContext(UsersContext);
    if (!ctx) {
      throw new Error("useUsers must be used within a UsersContextProvider");
    }
    return ctx;
  }

  return { UsersContextProvider, useUsers, UsersContext };
}
