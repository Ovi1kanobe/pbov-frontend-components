import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Camera } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { useRef } from "react";
import { cn } from "../../lib/utils";
import Pocketbase from "pocketbase";
export function UserAvatarForm({ avatarClassName, user, pb, updateUser }) {
    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current?.click(); // programmatically open file dialog
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            updateUser({ avatar: file });
        }
    };
    if (!user)
        return null;
    return (_jsxs(UserAvatar, { user: user, className: cn("group", avatarClassName, "overflow-hidden"), onClick: handleClick, pb: pb, children: [_jsx("div", { className: "w-full h-full bg-black absolute cursor-pointer opacity-0 group-hover:opacity-50 transition-all duration-300" }), _jsx(Camera, { size: 18, className: "absolute text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-500" }), _jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleFileChange, ref: fileInputRef })] }));
}
