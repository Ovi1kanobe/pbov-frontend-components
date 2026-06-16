import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { ReactNode } from "react";
import PocketBase, { LocalAuthStore } from "pocketbase";
import type Pocketbase from "pocketbase";

export interface CreateClientContextConfig {
  pburl: string;
  impersonateStoreKey?: string;
  impersonateActiveFlag?: string;
}

export interface ClientContextValue<PbT extends Pocketbase> {
  pb: PbT;
  isImpersonating: boolean;
  impersonate: (email: string) => Promise<void>;
  stopImpersonating: () => void;
}

export function createClientContext<PbT extends Pocketbase = Pocketbase>(
  config: CreateClientContextConfig,
) {
  const { pburl } = config;
  const impersonateStoreKey = config.impersonateStoreKey ?? "pb_impersonate";
  const impersonateActiveFlag = config.impersonateActiveFlag ?? "pb_impersonate_active";

  type Ctx = ClientContextValue<PbT>;
  const ClientContext = createContext<Ctx | undefined>(undefined);

  function ClientContextProvider({ children }: { children: ReactNode }) {
    const [mainPb] = useState<PbT>(() => new PocketBase(pburl) as PbT);

    const [impersonatedPb, setImpersonatedPb] = useState<PbT | null>(() => {
      if (localStorage.getItem(impersonateActiveFlag) === "true") {
        const client = new PocketBase(
          pburl,
          new LocalAuthStore(impersonateStoreKey),
        ) as PbT;
        if (client.authStore.isValid) return client;
        localStorage.removeItem(impersonateActiveFlag);
      }
      return null;
    });

    const [isImpersonating, setIsImpersonating] = useState(() => {
      return (
        localStorage.getItem(impersonateActiveFlag) === "true" &&
        impersonatedPb?.authStore.isValid === true
      );
    });

    const pb = (isImpersonating && impersonatedPb ? impersonatedPb : mainPb) as PbT;

    const impersonate = useCallback(
      async (email: string) => {
        if (isImpersonating) throw new Error("Already impersonating a user");
        const result = await mainPb.send("/api/impersonate", {
          method: "POST",
          body: { email },
        });

        const userClient = new PocketBase(
          mainPb.baseURL,
          new LocalAuthStore(impersonateStoreKey),
        ) as PbT;
        userClient.authStore.save(result.token, result.record);

        setImpersonatedPb(userClient);
        setIsImpersonating(true);
        localStorage.setItem(impersonateActiveFlag, "true");
      },
      [mainPb, isImpersonating],
    );

    const stopImpersonating = useCallback(() => {
      impersonatedPb?.authStore.clear();
      setIsImpersonating(false);
      setImpersonatedPb(null);
      localStorage.removeItem(impersonateActiveFlag);
    }, [impersonatedPb]);

    return (
      <ClientContext.Provider
        value={{ pb, isImpersonating, impersonate, stopImpersonating }}
      >
        {children}
      </ClientContext.Provider>
    );
  }

  function useClient(): Ctx {
    const ctx = useContext(ClientContext);
    if (!ctx) {
      throw new Error("useClient must be used within a ClientContextProvider.");
    }
    return ctx;
  }

  return { ClientContextProvider, useClient, ClientContext };
}
