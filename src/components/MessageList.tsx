import type { Message as MessageType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import useSwr from "swr";
import { env } from "../env/client.mjs";
import { GetMessages } from "../pages/api/chats/get-messages";
import { fetcher } from "../utils/functions";
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
  conversationId: string;
  receiverId: string;
  messageList: MessageType[] | undefined;
  setMessageList: Dispatch<SetStateAction<MessageType[] | undefined>>;
};

const MessageList = ({
  conversationId,
  receiverId,
  messageList,
  setMessageList,
}: MessageListProps) => {
  const currentUserId = useSession().data?.user?.id;
  const {
    data: MessagesArray,
    error,
    isLoading,
  } = useSwr<GetMessages, { message: string }>(
    `${env.NEXT_PUBLIC_CLIENT_URL}/api/chats/get-messages?conversationId=${conversationId}&receiverId=${receiverId}`,
    fetcher
  );

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    return () => {
      toast.remove();
    };
  }, [error]);

  useEffect(() => {
    if (MessagesArray) setMessageList(MessagesArray.flatMap((m) => m.messages));
  }, [MessagesArray]);

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
