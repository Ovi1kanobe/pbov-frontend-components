import type { ReactNode } from "react";
import type Pocketbase from "pocketbase";
export interface CreateUsersContextConfig<PbT extends Pocketbase, UserT extends {
    id: string;
}> {
    useClient: () => {
        pb: PbT;
    };
    useUser: () => {
        user: UserT | null;
        refetch: () => void;
    };
    usersCollection?: string;
}
export interface UsersContextValue<UserT extends {
    id: string;
}> {
    users: UserT[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    getUserById: (id: string) => UserT | undefined;
    updateUser: (id: string, data: Partial<UserT>) => Promise<void>;
}
export declare function createUsersContext<PbT extends Pocketbase, UserT extends {
    id: string;
}>(config: CreateUsersContextConfig<PbT, UserT>): {
    UsersContextProvider: ({ children }: {
        children: ReactNode;
    }) => import("react").JSX.Element;
    useUsers: () => UsersContextValue<UserT>;
    UsersContext: import("react").Context<UsersContextValue<UserT> | undefined>;
};
