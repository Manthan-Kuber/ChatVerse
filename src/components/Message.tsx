import type { Message as MessageType } from "@prisma/client";

type MessageProps = {
  message: MessageType;
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
      className={`m-2 flex flex-col ${isSender ? "items-end" : "items-start"}`}
    >
      <span className="dark:shadow- max-w-[75%] break-words rounded-md  p-4 shadow-lg dark:shadow-[#1c1b22]">
        {message.body}
      </span>
      <small className="max-w-full break-words">{messageCreationDate}</small>
    </div>
  );
};
export default Message;
