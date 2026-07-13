import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { toast } from "sonner";
import { useDebouncedRealtimeSubscription } from "../hooks/useRealtimeSubscription";
export function createUsersContext(config) {
    const { useClient, useUser } = config;
    const usersCol = config.usersCollection ?? "users";
    const UsersContext = createContext(undefined);
    function UsersContextProvider({ children }) {
        const { pb } = useClient();
        const { user, refetch: refetchUser } = useUser();
        const [users, setUsers] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const fetchData = useCallback(async () => {
            if (!user?.id)
                return;
            setLoading(true);
            setError(null);
            try {
                const usersData = await pb.collection(usersCol).getFullList({
                    sort: "name",
                    requestKey: null,
                });
                setUsers(usersData);
            }
            catch (e) {
                const err = e;
                if (err?.isAbort)
                    return;
                setError(err.message || "Failed to fetch users data");
            }
            finally {
                setLoading(false);
            }
        }, [pb, user?.id]);
        const usersById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);
        const getUserById = useCallback((id) => usersById.get(id), [usersById]);
        const updateUser = useCallback(async (id, data) => {
            if (id === user?.id) {
                toast.error("You cannot update your own user record from the users context. Please use the user context to update your own record.");
                return;
            }
            try {
                const updated = await pb.collection(usersCol).update(id, data);
                setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
            }
            catch (e) {
                const err = e;
                setError(err.message || "Failed to update user");
            }
        }, [pb, user?.id]);
        useDebouncedRealtimeSubscription({
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
        const value = useMemo(() => ({
            users,
            loading,
            error,
            refetch: fetchData,
            getUserById,
            updateUser,
        }), [users, loading, error, fetchData, getUserById, updateUser]);
        return _jsx(UsersContext.Provider, { value: value, children: children });
    }
    function useUsers() {
        const ctx = useContext(UsersContext);
        if (!ctx) {
            throw new Error("useUsers must be used within a UsersContextProvider");
        }
        return ctx;
    }
    return { UsersContextProvider, useUsers, UsersContext };
}
