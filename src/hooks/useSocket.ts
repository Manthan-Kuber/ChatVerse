import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { env } from "../env/client.mjs";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    //Do not use port number while making the  request
    //Url should be wss://<domain>
    const socketInstance = io(env.NEXT_PUBLIC_SOCKET_SERVER_URL);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}

export default useSocket;
