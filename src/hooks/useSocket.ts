import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { env } from "../env/client.mjs";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  const socketInitializer = async () => {
    await fetch("/api/socket");
    setSocket(io());
  };

  useEffect(() => {
    socketInitializer();
    //Disconnect if socket already exists
    if (socket)
      return () => {
        socket.disconnect();
      };
  }, []);

  return socket;
}

export default useSocket;
