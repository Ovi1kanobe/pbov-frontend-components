import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, AvatarFallback, AvatarImage } from "@ovi1kanobe/pbov";
import Pocketbase from "pocketbase";
import { cn } from "../../lib/utils";
function UserAvatar({ user, children, onClick, className, pb }) {
    return (_jsxs(Avatar, { className: cn("relative flex items-center justify-center shadow-xl", className), onClick: onClick, children: [user?.avatar && _jsx(AvatarImage, { src: pb.files.getURL(user, user.avatar.toString()), alt: user.name }), _jsx(AvatarFallback, { className: "uppercase", children: user?.name?.slice(0, 2) }), children] }));
}
export default UserAvatar;
