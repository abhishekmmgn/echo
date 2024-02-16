import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";

export default function TableRow({
  icon,
  text,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  text: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = window.innerWidth > 1080;
  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-full">
            <div className="flex items-center gap-4 h-12 px-5 hover:bg-muted/60 border-b text-secondary-foreground cursor-pointer">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-primary">{icon}</span>
              <p>{text}</p>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer>
          <DrawerTrigger className="w-full"></DrawerTrigger>
          <DrawerContent className="h-full">
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
            <DrawerFooter>
              <Button>Next</Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
