import { Camera } from "lucide-react";
import UserAvatar from "./user-avatar";
import { useRef } from "react";
import { cn } from "../../lib/utils";
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
  updateUser: (data: { avatar: File }) => void;
}

function UserAvatarForm({ avatarClassName, user, pb, updateUser }: UserAvatarFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click(); // programmatically open file dialog
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateUser({ avatar: file });
    }
  };

  if (!user) return null;

  return (
    <UserAvatar user={user} className={cn("group", avatarClassName, "overflow-hidden")} onClick={handleClick} pb={pb}>
      <div className="w-full h-full bg-black absolute cursor-pointer opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
      <Camera
        size={18}
        className="absolute text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-500"
      />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
    </UserAvatar>
  );
}

export default UserAvatarForm;