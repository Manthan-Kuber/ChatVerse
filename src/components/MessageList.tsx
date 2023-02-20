import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import useSwr from "swr";
import { env } from "../env/client.mjs";
import { GetMessages } from "../pages/api/chats/get-messages";
import { fetcher } from "../utils/functions";
import Message from "./Message";

type MessageListProps = {
  conversationId: string;
  receiverId: string;
};

const MessageList = ({ conversationId, receiverId }: MessageListProps) => {
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

  if (isLoading) return <p>Wait kro</p>; //TODO custom skeleton to be added

  if (!MessagesArray || MessagesArray.length === 0) return <></>;

  const MessageList = MessagesArray.flatMap((m) => m.messages);

  return (
    <>
      {MessageList.map((message) => (
        <Message message={message} currentUserId={currentUserId!} />
      ))}
    </>
  );
};
export default MessageList;
