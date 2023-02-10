import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { env } from "../env/client.mjs";

function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(env.NEXT_PUBLIC_SOCKET_SERVER_URL);

    setSocket(socket);

    function cleanup() {
      socket.disconnect();
    }
    return cleanup;
  }, []);

  return socket;
}

export default useSocket;
