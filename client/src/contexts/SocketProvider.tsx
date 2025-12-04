import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<any | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      auth: { id },
    });

    // debug logs
    newSocket.on("connect", () =>
      console.log("socket connected", { socketId: newSocket.id, id })
    );
    newSocket.on("connect_error", (err: any) =>
      console.error("socket connect_error", err)
    );

    setSocket(newSocket);

    return () => {
      //   // remove debug listeners
      //   newSocket.off("connect");
      //   newSocket.off("connect_error");

      //   // close or disconnect the socket when the component unmounts or id changes
      //   if (newSocket && typeof newSocket.close === "function") {
      //     newSocket.close();
      //   } else if (newSocket && typeof newSocket.disconnect === "function") {
      //     newSocket.disconnect();
      //   }

      newSocket.close();
    };
  }, [id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
