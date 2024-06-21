import { createContext, useMemo } from "react";

export const PeerContext = createContext({} as RTCPeerConnection);

export const PeerProvider = ({ children }: { children: React.ReactNode }) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:global.stun.twilio.com:3478" },
          { urls: "stun:stun.stunprotocol.org" },
        ],
      }),
    []
  );
  return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
};
