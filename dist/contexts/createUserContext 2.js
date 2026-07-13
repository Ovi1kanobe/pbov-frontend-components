import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { useDebouncedRealtimeSubscription } from "../hooks/useRealtimeSubscription";
export function createUserContext(config) {
    const { useClient } = config;
    const usersCol = config.usersCollection ?? "users";
    const prefsCol = config.preferencesCollection ?? "_user_preferences";
    const msProfileCol = config.msProfileCollection ?? "_user_microsoft_profiles";
    const UserContext = createContext(undefined);
    function UserProvider({ children }) {
        const { pb } = useClient();
        const [user, setUser] = useState(null);
        const [fetched, setFetched] = useState(false);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
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
                    .collection(usersCol)
                    .getOne(id, {
                    expand: "preferences,ms_profile",
                    requestKey: null,
                });
                setUser(userData);
                setFetched(true);
            }
            catch (e) {
                const err = e;
                if (err?.isAbort)
                    return;
                if (err.status === 404) {
                    setUser(null);
                    setFetched(true);
                    return;
                }
                setError(err.message || "Failed to fetch current user");
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        }, [pb]);
        const updateUser = useCallback(async (data) => {
            if (!user)
                return;
            const res = await pb
                .collection(usersCol)
                .update(user.id, data, { expand: "preferences,ms_profile" });
            setUser(res);
        }, [pb, user]);
        const updatePreferences = useCallback(async (data) => {
            if (!user)
                return;
            if (!user.expand?.preferences)
                return;
            const res = await pb
                .collection(prefsCol)
                .update(user.expand.preferences.id, data);
            setUser((prev) => prev ? { ...prev, expand: { ...prev.expand, preferences: res } } : null);
        }, [pb, user]);
        useDebouncedRealtimeSubscription({
            pb,
            collections: [prefsCol, msProfileCol],
            id: "*",
            onUpdate: (e) => {
                if (!e || !user)
                    return;
                const updatedId = e.record?.id;
                if (!updatedId)
                    return;
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
        const value = useMemo(() => ({
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
        }), [user, fetched, loading, error, fetchCurrentUser, updateUser, updatePreferences]);
        return _jsx(UserContext.Provider, { value: value, children: children });
    }
    function useUser() {
        const ctx = useContext(UserContext);
        if (!ctx) {
            throw new Error("useUser must be used within a UserProvider");
        }
        return ctx;
    }
    return { UserProvider, useUser, UserContext };
}
