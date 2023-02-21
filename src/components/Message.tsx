import { Message } from "@prisma/client";
import Skeleton from "react-loading-skeleton";

type MessageProps = {
  message: Message;
  currentUserId: string;
};

const Message = ({ message, currentUserId }: MessageProps) => {
  const isSender = currentUserId === message.senderId;
  const messageCreationDate = new Date(message.createdAt)
    .toLocaleString(navigator.language, {
      timeStyle: "short",
      dateStyle: "short",
    })
    .replace(",", " ");
  return (
    <div
      className={`m-2 flex flex-col ${isSender ? "items-end" : "items-start"} `}
    >
      <span
        className={`${
          isSender
            ? " rounded-br-none bg-lime-400 dark:bg-lime-500"
            : " rounded-bl-none bg-gray-400 dark:bg-gray-500 "
        } w-fit rounded-md p-4`}
      >
        {message.body}
      </span>
      <div
        className={`h-0 w-0 border-t-8 ${
          isSender
            ? "border-l-8 border-l-transparent border-t-lime-400 dark:border-t-lime-500"
            : "border-r-8 border-r-transparent border-t-gray-400 dark:border-t-gray-500"
        }`}
      />
      <small>{messageCreationDate}</small>
    </div>
  );
};
export default Message;
