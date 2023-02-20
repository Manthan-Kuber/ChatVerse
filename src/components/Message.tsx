import { Message } from "@prisma/client";

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
    <div className={`m-2 flex flex-col ${isSender && "items-end"} `}>
      <span
        className={`${
          isSender
            ? " rounded-br-md bg-lime-400 dark:bg-lime-500"
            : " rounded-bl-md bg-gray-400 dark:bg-gray-500 "
        } w-fit rounded-full p-4`}
      >
        {message.body}
      </span>
      <small>{messageCreationDate}</small>
    </div>
  );
};
export default Message;
