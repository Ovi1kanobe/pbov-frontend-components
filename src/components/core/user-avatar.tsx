import { Avatar, AvatarFallback, AvatarImage } from "@ovi1kanobe/pbov";
import Pocketbase from "pocketbase";
import { cn } from "../../lib/utils";
import type { AvatarUser } from "./user-avatar-form";


type UserAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  user?: AvatarUser;
  pb: Pocketbase;
  children?: React.ReactNode;
};

function UserAvatar({ user, children, onClick, className, pb }: UserAvatarProps) {

  return (
    <Avatar
      className={cn("relative flex items-center justify-center shadow-xl", className)}
      onClick={onClick}
    >
      {user?.avatar && <AvatarImage src={pb.files.getURL(user, user.avatar.toString())} alt={user.name} />}
      <AvatarFallback className="uppercase">{user?.name?.slice(0, 2)}</AvatarFallback>
      {children}
    </Avatar>
  );
}

export default UserAvatar;