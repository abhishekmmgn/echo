import { Button } from "../ui/button";
import ThemeToggle from "../theme-toggler";
import TableRow from "../table-row";
import { Separator } from "../ui/separator";
import { useAuth0 } from "@auth0/auth0-react";
import { useCurrentUser } from "@/store";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatAvatarName } from "@/lib/formatting";
import { Pencil } from "lucide-react";
import ResponsiveDialog from "../responsive-dialog";
import EditProfileForm from "../forms/edit-profile-form";

export default function Settings() {
  const { logout, isAuthenticated } = useAuth0();
  const { name, avatar, email } = useCurrentUser();

  async function deleteAccount() {
    const res = await axios.delete("/current_user");
    if(res.status === 200) {
      // delete from auth0.
    }
  }
  return (
    <div className="py-2 space-y-6 pb-4">
      {isAuthenticated && (
        <div className="w-full flex gap-4 items-center justify-center p-4 border-b">
          <Avatar className="size-20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-xl">
              {formatAvatarName(name)}
            </AvatarFallback>
          </Avatar>
          <div className="w-[calc(100%-120px)]">
            <p className="font-medium text-2xl capitalize text-secondary-foreground">
              {name}
            </p>
            <p className="text-sm+ text-muted-foreground">
              {email?.split("@")[0]}
            </p>
          </div>
          <div className="flex items-center">
            <ResponsiveDialog
              title="Edit Profile"
              trigger={
                <Pencil className="cursor-pointer text-muted-foreground hover:text-primary" />
              }
              body={<EditProfileForm />}
            />
          </div>
        </div>
      )}
      <div className="grid gap-4">
        <h3 className="px-4 font-medium text-primary -mb-4">Account Details</h3>
        <div className="rounded-[var(--radius)]">
          <TableRow title="Email" value={email} />
        </div>
      </div>
      <div className="grid gap-4">
        <h3 className="px-4 font-medium text-primary -mb-4">
          General Settings
        </h3>
        <div className=" rounded-[var(--radius)]">
          <TableRow title="Theme">
            <ThemeToggle />
          </TableRow>
        </div>
      </div>
      <div className="grid gap-4">
        <h3 className="px-4 font-medium text-primary -mb-2">
          Account Settings
        </h3>
        <div className="rounded-[var(--radius)] px-4 space-y-3">
          <div className="space-y-2">
            <p className="lg-text-base+">Sign Out</p>
            <Button
              variant="outline"
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Sign Out
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="lg-text-base+">Delete Account</p>
            <Button variant="destructive" onClick={deleteAccount}>
              Delete Account
            </Button>
          </div>
          <Separator />
        </div>
      </div>
      <div className="grid gap-4">
        <h3 className="px-4 font-medium text-primary -mb-4">Other</h3>
        <div className="rounded-[var(--radius)]">
          <TableRow title="Help" />
          <TableRow title="Feedback" />
          <TableRow title="App Version" value="1.0.12" />
        </div>
      </div>
    </div>
  );
}
