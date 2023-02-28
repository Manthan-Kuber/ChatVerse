import type { Message as MessageType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";

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
  error:
    | {
        message: string;
      }
    | undefined;
  isLoading: boolean;
};

const MessageList = ({ messageList, error, isLoading }: MessageListProps) => {
  const currentUserId = useSession().data?.user?.id;

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    return () => {
      toast.remove();
    };
  }, [error]);

  if (isLoading) return <MessageListSkeleton count={12} />;

  if (!messageList || messageList.length === 0) return <></>;

  return (
    <>
      {messageList.map((message) => (
        <Message message={message} currentUserId={currentUserId!} />
      ))}
    </>
  );
};
export default MessageList;
