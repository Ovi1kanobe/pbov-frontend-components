import Pocketbase from "pocketbase";
export interface AvatarUser {
    id: string;
    avatar?: File | string;
    name?: string;
    collectionName?: string;
    collectionId?: string;
}
interface UserAvatarFormProps {
    avatarClassName?: string;
    user: AvatarUser | null;
    pb: Pocketbase;
    updateUser: (data: {
        avatar: File;
    }) => void;
}
export declare function UserAvatarForm({ avatarClassName, user, pb, updateUser }: UserAvatarFormProps): import("react/jsx-runtime").JSX.Element | null;
export {};
