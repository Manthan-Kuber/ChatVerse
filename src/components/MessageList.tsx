import { type Message as MessageType } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import MessageComponent from "./Message";
import { GetChats } from "../server/common/getChats";
import { getChatName } from "../utils/functions";

const MessageListSkeleton = ({ count }: { count?: number }) => {
  return (
    <>
      {Array(count || 1)
        .fill(0)
        .map((_, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              className={`m-4 flex flex-col ${
                isEven ? "items-end" : "items-start"
              }`}
              key={index}
            >
              <Skeleton className="px-20 py-3" />
              <Skeleton className="px-12" />
            </div>
          );
        })}
    </>
  );
};

type MessageListProps = {
  messageList: MessageType[] | undefined;
  isLoading: boolean;
  currentUserId: string | null;
  currentChat: GetChats[0] | undefined,
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
};

const MessageList = ({
  messageList,
  isLoading,
  messagesEndRef,
  currentUserId,
  currentChat
}: MessageListProps) => {

  const chatName = getChatName(currentChat,currentUserId)

  if (isLoading) return <MessageListSkeleton count={12} />;

  if (!messageList || messageList.length === 0) return <></>;

  return (
    <>
      {messageList.map((message) => (
        <MessageComponent
          key={message.id}
          chatName={chatName}
          message={message}
          currentUserId={currentUserId!}
        />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};
export default MessageList;
