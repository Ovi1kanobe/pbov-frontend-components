import type { Dispatch, ReactNode, SetStateAction } from "react";
import type Pocketbase from "pocketbase";
export interface CreateUserContextConfig<PbT extends Pocketbase> {
    useClient: () => {
        pb: PbT;
    };
    usersCollection?: string;
    preferencesCollection?: string;
    msProfileCollection?: string;
}
export type ExpandedUserRecord<UserT extends {
    id: string;
}, PrefsT extends {
    id: string;
}, MsT extends {
    id: string;
}> = UserT & {
    expand?: {
        preferences?: PrefsT | null;
        ms_profile?: MsT | null;
    };
};
export interface UserContextValue<UserT extends {
    id: string;
}, PrefsT extends {
    id: string;
}, MsT extends {
    id: string;
}> {
    user: ExpandedUserRecord<UserT, PrefsT, MsT> | null;
    msProfile: MsT | null;
    preferences: PrefsT | null;
    fetched: boolean;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    updateUser: (data: Partial<Omit<UserT, "avatar">> & {
        avatar?: File | string;
    }) => Promise<void>;
    setUser: Dispatch<SetStateAction<ExpandedUserRecord<UserT, PrefsT, MsT> | null>>;
    updatePreferences: (data: Partial<PrefsT>) => Promise<void>;
}
export declare function createUserContext<PbT extends Pocketbase, UserT extends {
    id: string;
}, PrefsT extends {
    id: string;
}, MsT extends {
    id: string;
}>(config: CreateUserContextConfig<PbT>): {
    UserProvider: ({ children }: {
        children: ReactNode;
    }) => import("react").JSX.Element;
    useUser: () => UserContextValue<UserT, PrefsT, MsT>;
    UserContext: import("react").Context<UserContextValue<UserT, PrefsT, MsT> | undefined>;
};
