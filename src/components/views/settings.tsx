import { Button } from "../ui/button";
import Profile from "../settings/profile";
import ThemeToggle from "../theme-toggler";
import TableRow from "../table-row";
import { Separator } from "../ui/separator";

export default function Settings() {
  return (
    <div className="py-2 space-y-6 pb-4">
      <Profile />
      <div className="grid gap-4">
        <h3 className="px-4 font-medium text-primary -mb-4">Account Details</h3>
        <div className="rounded-[var(--radius)]">
          <TableRow title="Phone Number" value="1234567890" />
          <TableRow title="Email" value="abc@icloud.com" />
        </div>
      </div>
      <div className="grid gap-4">
        <h3 className="px-4 font-medium text-primary -mb-4">
          General Settings
        </h3>
        <div className=" rounded-[var(--radius)]">
          <TableRow title="Theme" >
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
              onClick={
                () => console.log("")
                // logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Sign Out
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="lg-text-base+">Delete Account</p>
            <Button
              variant="destructive"
              onClick={
                () => console.log("")
                // logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
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
