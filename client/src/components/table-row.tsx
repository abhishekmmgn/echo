import { cn } from "@/lib/utils";
import React from "react";

type PropsType = {
  title: string;
  value?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};
export default function TableRow(props: PropsType) {
  return (
    <div
      className={cn(
        "h-14 px-4 flex items-center justify-between hover:bg-muted/60 border-b",
        props.className,
      )}
    >
      <div className="flex gap-4 items-center">
        {props.icon && (
          <span className="grid place-items-center w-10 h-10 rounded-full bg-muted">
            {props.icon}
          </span>
        )}
        <p>{props.title}</p>
      </div>
      {props.value && (
        <p className="text-right text-muted-foreground text-sm">
          {props.value}
        </p>
      )}
      {props.children && props.children}
    </div>
  );
}
