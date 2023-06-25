import type { Message as MessageType } from "@prisma/client";

type MessageProps = {
  message: MessageType;
  currentUserId: string;
  chatName: string | null | undefined;
};

const Message = ({ message, currentUserId, chatName }: MessageProps) => {
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
      <div className="max-w-[75%] break-words rounded-md  p-4 shadow-lg dark:shadow-neutral-500/30">
        <div className="">
          <span className={`block ${isSender ? "text-lime-500" : "text-sky-500"}`}>
            {isSender ? "You" : chatName}
          </span>
        </div>
        <span>{message.body}</span>
      </div>
      <small className="max-w-full break-words">{messageCreationDate}</small>
    </div>
  );
};
export default Message;
