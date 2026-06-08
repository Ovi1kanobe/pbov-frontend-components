import { type AvatarUser } from "../core/user-avatar-form";
import Pocketbase from "pocketbase";
type UserAvatarUploadWidgetProps = {
    user: AvatarUser;
    pb: Pocketbase;
    updateUser: (data: {
        avatar: File;
    }) => void;
};
export declare function UserAvatarUploadWidget({ user, pb, updateUser }: UserAvatarUploadWidgetProps): import("react").JSX.Element;
export {};
