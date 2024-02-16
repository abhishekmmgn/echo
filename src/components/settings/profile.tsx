import { useAuth0 } from "@auth0/auth0-react";
import { MdEdit } from "react-icons/md";

export default function Profile() {
  const { user } = useAuth0();
  // const profile = user?.profile;

  return (
    <div className="flex items-center gap-4 px-5 h-20 border-b">
      <img
        src={user?.profile || ""}
        alt="Your Profile Photo"
        className="w-[60px] h-[60px] rounded-full bg-secondary"
      />
      <div className="w-[calc(100%-120px)]">
        <p className="text-lg">{user?.name || "Name"}</p>
        <p className="text-sm+ text-muted-foreground">Bio</p>
      </div>
      <MdEdit className="cursor-pointer w-6 h-6 text-muted-foreground" />
    </div>
  );
}
