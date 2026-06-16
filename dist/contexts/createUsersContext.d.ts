import type { ReactNode } from "react";
import type Pocketbase from "pocketbase";
import type { RecordModel } from "pocketbase";
export interface CreateUsersContextConfig<PbT extends Pocketbase, UserT extends RecordModel> {
    useClient: () => {
        pb: PbT;
    };
    useUser: () => {
        user: (UserT & RecordModel) | null;
        refetch: () => void;
    };
    usersCollection?: string;
}
export interface UsersContextValue<UserT extends RecordModel> {
    users: UserT[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    getUserById: (id: string) => UserT | undefined;
    updateUser: (id: string, data: Partial<UserT>) => Promise<void>;
}
export declare function createUsersContext<PbT extends Pocketbase, UserT extends RecordModel>(config: CreateUsersContextConfig<PbT, UserT>): {
    UsersContextProvider: ({ children }: {
        children: ReactNode;
    }) => import("react").JSX.Element;
    useUsers: () => UsersContextValue<UserT>;
    UsersContext: import("react").Context<UsersContextValue<UserT> | undefined>;
};
