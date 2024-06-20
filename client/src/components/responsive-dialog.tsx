import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

type PropsType = {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  body: React.ReactNode;
  className?: string;
};
export default function ResponsiveTableRow(props: PropsType) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={cn("w-full", props.className)}>
            {props.trigger}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{props.title}</DialogTitle>
              <DialogDescription>{props.description}</DialogDescription>
            </DialogHeader>
            {props.body}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer>
          <DrawerTrigger asChild className={cn("w-full", props.className)}>
            {props.trigger}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{props.title}</DrawerTitle>
              <DrawerDescription>{props.description}</DrawerDescription>
            </DrawerHeader>
            {props.body}
            <DrawerFooter>
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
