import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useState, } from "react";
import PocketBase, { LocalAuthStore } from "pocketbase";
export function createClientContext(config) {
    const { pburl } = config;
    const impersonateStoreKey = config.impersonateStoreKey ?? "pb_impersonate";
    const impersonateActiveFlag = config.impersonateActiveFlag ?? "pb_impersonate_active";
    const ClientContext = createContext(undefined);
    function ClientContextProvider({ children }) {
        const [mainPb] = useState(() => new PocketBase(pburl));
        const [impersonatedPb, setImpersonatedPb] = useState(() => {
            if (localStorage.getItem(impersonateActiveFlag) === "true") {
                const client = new PocketBase(pburl, new LocalAuthStore(impersonateStoreKey));
                if (client.authStore.isValid)
                    return client;
                localStorage.removeItem(impersonateActiveFlag);
            }
            return null;
        });
        const [isImpersonating, setIsImpersonating] = useState(() => {
            return (localStorage.getItem(impersonateActiveFlag) === "true" &&
                impersonatedPb?.authStore.isValid === true);
        });
        const pb = (isImpersonating && impersonatedPb ? impersonatedPb : mainPb);
        const impersonate = useCallback(async (email) => {
            if (isImpersonating)
                throw new Error("Already impersonating a user");
            const result = await mainPb.send("/api/impersonate", {
                method: "POST",
                body: { email },
            });
            const userClient = new PocketBase(mainPb.baseURL, new LocalAuthStore(impersonateStoreKey));
            userClient.authStore.save(result.token, result.record);
            setImpersonatedPb(userClient);
            setIsImpersonating(true);
            localStorage.setItem(impersonateActiveFlag, "true");
        }, [mainPb, isImpersonating]);
        const stopImpersonating = useCallback(() => {
            impersonatedPb?.authStore.clear();
            setIsImpersonating(false);
            setImpersonatedPb(null);
            localStorage.removeItem(impersonateActiveFlag);
        }, [impersonatedPb]);
        return (_jsx(ClientContext.Provider, { value: { pb, isImpersonating, impersonate, stopImpersonating }, children: children }));
    }
    function useClient() {
        const ctx = useContext(ClientContext);
        if (!ctx) {
            throw new Error("useClient must be used within a ClientContextProvider.");
        }
        return ctx;
    }
    return { ClientContextProvider, useClient, ClientContext };
}
