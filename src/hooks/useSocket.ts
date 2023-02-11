import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { env } from "../env/client.mjs";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(env.NEXT_PUBLIC_SOCKET_SERVER_URL);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}

export default useSocket;