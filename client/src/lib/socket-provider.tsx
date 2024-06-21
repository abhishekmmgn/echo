import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { SocketStateType } from "@/types";
import { server } from "./utils";

const SocketContext = createContext<SocketStateType>({} as SocketStateType);

export const SocketProvider = (props: { children: React.ReactNode }) => {
  const socket = useMemo(() => io(server), []);
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export function useSocket() {
  return useContext(SocketContext);
}
