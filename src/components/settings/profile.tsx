import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAvatarName } from "@/lib/formatting";
import { Pencil } from "lucide-react";
import ResponsiveDialog from "@/components/looks/responsive-dialog";
import EditProfileForm from "./edit-profile-form";

export default function Profile() {
  const { name, avatar, username } = {
    name: "Shad Mirza",
    username: "@shadcn",
    avatar: "",
  };
  return (
    <div className="flex items-center justify-between gap-4 pt-4 px-4">
      <div className="w-full flex gap-4 items-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-xl">{formatAvatarName(name)}</AvatarFallback>
        </Avatar>
        <div className="w-[calc(100%-120px)]">
          <p className="font-medium text-2xl capitalize text-secondary-foreground">
            {name}
          </p>
          <p className="text-sm+ text-muted-foreground">{username}</p>
        </div>
      </div>
      <div>
      <ResponsiveDialog
        title="Edit Profile"
        trigger={
          <Pencil className="cursor-pointer text-muted-foreground hover:text-primary" />
        }
        body={<EditProfileForm />}
      />
      </div>
    </div>
  );
}
