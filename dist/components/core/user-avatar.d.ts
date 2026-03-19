import Pocketbase from "pocketbase";
import type { AvatarUser } from "./user-avatar-form";
type UserAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
    user?: AvatarUser;
    pb: Pocketbase;
    children?: React.ReactNode;
};
export declare function UserAvatar({ user, children, onClick, className, pb }: UserAvatarProps): import("react/jsx-runtime").JSX.Element;
export {};
