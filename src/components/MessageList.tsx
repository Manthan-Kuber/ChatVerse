import { type Message as MessageType } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import MessageComponent from "./Message";

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
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
};

const MessageList = ({
  messageList,
  isLoading,
  messagesEndRef,
  currentUserId,
}: MessageListProps) => {
  if (isLoading) return <MessageListSkeleton count={12} />;

  if (!messageList || messageList.length === 0) return <></>;

  return (
    <>
      {messageList.map((message) => (
        <MessageComponent
          key={message.id}
          message={message}
          currentUserId={currentUserId!}
        />
      ))}
      <div ref={messagesEndRef} />
    </>
  );
};
export default MessageList;
