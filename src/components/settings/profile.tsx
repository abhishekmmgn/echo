import { useAuth0 } from "@auth0/auth0-react";
import { MdEdit } from "react-icons/md";
import { ResponsiveDrawer } from "../responsive-drawer";
import { Label } from "@radix-ui/react-context-menu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// function ProfileForm({ className }: React.ComponentProps<"form">) {
//   return (
//     <form className={cn("grid items-start gap-4", className)}>
//       <div className="grid gap-2">
//         <Label htmlFor="email">Email</Label>
//         <Input type="email" id="email" defaultValue="shadcn@example.com" />
//       </div>
//       <div className="grid gap-2">
//         <Label htmlFor="username">Username</Label>
//         <Input id="username" defaultValue="@shadcn" />
//       </div>
//       <Button type="submit">Save changes</Button>
//     </form>
//   );
// }

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

      {/* <ResponsiveDrawer
      title = ""
      description = ""
        trigger={
          <MdEdit className="cursor-pointer w-6 h-6 text-muted-foreground" />
        }
      >
        <ProfileForm />
      </ResponsiveDrawer> */}
    </div>
  );
}
