import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../types/socket-types";
import { Server as ServerIO,Socket } from "socket.io";
import { Server as NetServer } from "http";
import EVENTS from "../../utils/events";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    // adapt Next's net Server to http Server
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
    });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;

    let onlineUsers: { userId: string; socketId: string }[] = [];

    io.on(EVENTS.connection, (socket: Socket) => {
      console.log(`User Connected with id: ${socket.id}`);

      socket.on(EVENTS.ADD_NEW_USER, (userId: string) => {
        if (!onlineUsers.some((user) => user.userId === userId)) {
          // if user is not added before
          onlineUsers.push({ userId: userId, socketId: socket.id });
          console.log(userId);
          console.log("A new user is online:", onlineUsers);
        }
        // send all active users to new user
        io.emit(EVENTS.GET_USERS, onlineUsers);
      });

      socket.on(EVENTS.disconnect, () => {
        console.log(`User Disconnected with id: ${socket.id}`);
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id); //Mutate the online users array
        console.log(onlineUsers);
      });

      socket.on(
        EVENTS.PRIVATE_MESSAGE,
        (data: {
          message: string;
          to: string;
          from: string;
          conversationId: string;
        }) => {
          console.log(data);
          const recSocketId = onlineUsers.find(
            (obj) => obj.userId === data.to
          )?.socketId;
          console.log("data.from =>", data.from);
          if (recSocketId)
            socket.to(recSocketId).emit(EVENTS.PRIVATE_MESSAGE, {
              message: data.message,
              from: data.from,
              to: data.to,
              conversationId: data.conversationId,
            });
        }
      );
    });
  }
  res.end();
};
