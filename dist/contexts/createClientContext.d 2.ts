import type { ReactNode } from "react";
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
export declare function createClientContext<PbT extends Pocketbase = Pocketbase>(config: CreateClientContextConfig): {
    ClientContextProvider: ({ children }: {
        children: ReactNode;
    }) => import("react").JSX.Element;
    useClient: () => ClientContextValue<PbT>;
    ClientContext: import("react").Context<ClientContextValue<PbT> | undefined>;
};
