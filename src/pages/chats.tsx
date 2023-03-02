import React, {
  FormEvent,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import useWindowSize from "../hooks/useWindowSize";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Menu from "../components/Menu";
import ChatsHeader from "../components/ChatsHeader";
import { IoMdSend } from "react-icons/io";
import ChatInputForm from "../components/ChatInputForm";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useSocket from "../hooks/useSocket";
import events from "../utils/events";
import { prisma } from "../server/db/client";
import { Message, Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { ChatsProvider, CurrentChatProvider } from "../context/chats.context";
import Image from "next/image";
import MessageList from "../components/MessageList";
import { fetcher } from "../utils/functions";
import { env } from "../env/client.mjs";
import useSwr from "swr";
import { GetMessages } from "./api/chats/get-messages";
import { SendMessage } from "./api/chats/send-message";

//Returns a promise which needs to be resolved
function findConversation(userId: string) {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      participants: {
        where: {
          NOT: {
            userId, //Return participants other than current signed in user
          },
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      latestMessage: {
        select: { body: true },
      },
    },
  });
}

export type ChatSearch = Prisma.PromiseReturnType<typeof findConversation>;

type ChatProps = {
  chats: ChatSearch | null;
  fetchError: boolean;
  currentUserId: string | null;
};

export const getServerSideProps: GetServerSideProps<ChatProps> = async (
  context
) => {
  const { req, res } = context;
  const session = await getServerAuthSession({ req, res });

  if (session && session.user) {
    const res = await findConversation(session.user.id);
    const chats = JSON.parse(JSON.stringify(res));
    return {
      props: {
        chats, //can return empty array
        fetchError: false,
        currentUserId: session.user.id,
      },
    };
  } else {
    return {
      props: {
        chats: null,
        fetchError: true,
        currentUserId: null,
      },
      //TODO Redirect from server side
    };
  }
};

async function sendMessage(
  url: string,
  {
    conversationId,
    messageBody,
    receiverId,
    MessagesArray,
  }: {
    conversationId: string;
    messageBody: string;
    receiverId: string;
    MessagesArray: Message[] | undefined;
  }
) {
  const { newMessage }: SendMessage = await fetcher(url, {
    method: "POST",
    body: JSON.stringify({
      conversationId,
      messageBody,
      receiverId,
    }),
  });
  return [...(MessagesArray || []), newMessage]; //Cache will be swapped with the returned value on successful request
}

const chats = ({ chats, fetchError, currentUserId }: ChatProps) => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const wByN = (n: number) => screenWidth && screenWidth * n;
  const socket = useSocket();
  const [currentChat, setCurrentChat] = useState<ChatSearch[0]>();
  const [onlineUsers, setOnlineUsers] = useState<
    { userId: string; socketId: string }[]
  >([]);
  const receiverId = currentChat?.participants.map((p) => p.user.id)[0];
  const conversationId = currentChat?.id;
  const {
    data: MessagesArray,
    error,
    isLoading,
    mutate,
  } = useSwr<GetMessages, { message: string }>(
    currentChat
      ? `${env.NEXT_PUBLIC_CLIENT_URL}/api/chats/get-messages?conversationId=${conversationId}&receiverId=${receiverId}`
      : null,
    fetcher
  );

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    try {
      if (socket && currentChat) {
        socket.emit(events.PRIVATE_MESSAGE, {
          message,
          from: currentUserId,
          to: receiverId,
        });
        setMessage("");
        const sendMessageUrl = `${env.NEXT_PUBLIC_CLIENT_URL}/api/chats/send-message`;
        const messageParams = {
          conversationId: currentChat.id,
          messageBody: message,
          receiverId: receiverId!,
          MessagesArray: MessagesArray,
        };
        const newMessage: Message = {
          id: crypto.randomUUID(),
          conversationId: currentChat.id,
          senderId: currentUserId!,
          body: message,
          createdAt: new Date(), //Make new message date as current time
          updatedAt: new Date(),
        };
        await mutate(sendMessage(sendMessageUrl, { ...messageParams }), {
          optimisticData: [...(MessagesArray || []), newMessage],
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Error in sending the message");
    }
  };

  const SideBarWrapper = ({ children }: { children: ReactNode }) =>
    screenWidth && screenWidth >= 640 ? (
      <section>{children}</section>
    ) : (
      <AnimatePresence>
        {isOpen && (
          <Menu setIsOpen={setIsOpen} menuWidth={-wByN(2 / 3)!}>
            {children}
          </Menu>
        )}
      </AnimatePresence>
    );

  const privateMessage = useCallback(
    (data: { message: string; to: string; from: string }) => {
      console.log(data);
      //FIXME need to fix mutation
      const currentChatId = data.from + data.to; //Not to use
      const newMessage: Message = {
        id: crypto.randomUUID(),
        conversationId: currentChatId,
        senderId: data.from,
        body: data.message,
        createdAt: new Date(), //Make new message date as current time
        updatedAt: new Date(),
      };
      mutate([...(MessagesArray || []), newMessage]);
    },
    [MessagesArray]
  );

  const getUsers = useCallback(
    (user: { userId: string; socketId: string }) => {
      console.log(user);
      setOnlineUsers([...onlineUsers, user]);
    },
    [onlineUsers, setOnlineUsers]
  );

  useEffect(() => {
    if (currentUserId) socket?.emit(events.ADD_NEW_USER, currentUserId);
    socket?.on(events.GET_USERS, (user) => getUsers(user));
    socket?.on(events.PRIVATE_MESSAGE, (data) => privateMessage(data));
    return () => {
      socket?.off(events.GET_USERS);
      socket?.off(events.PRIVATE_MESSAGE);
    };
  }, [socket]);

  useEffect(() => {
    if (fetchError) toast.error("Error in fetching chats");
    return () => {
      toast.remove();
    };
  }, [fetchError]);

  return (
    <motion.div
      className="mx-auto max-w-7xl sm:grid sm:grid-cols-[1fr_2fr]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SideBarWrapper>
        <ChatsProvider value={chats}>
          <CurrentChatProvider value={{ currentChat, setCurrentChat }}>
            <Sidebar />
          </CurrentChatProvider>
        </ChatsProvider>
      </SideBarWrapper>
      <div className="sm:px-2 sm:pt-8">
        {/* User will be signed out if no session. currentUserId will not be null */}
        <ChatsHeader
          setIsOpen={setIsOpen}
          currentChat={currentChat}
          currentUserId={currentUserId!}
        />
        <main className="flex h-[calc(100vh-4.5rem)] flex-col bg-neutral-300 bg-opacity-10 sm:h-[calc(100vh-6.5rem)] sm:pb-16">
          <div
            className={`flex-1 overflow-y-scroll  ${
              !currentChat && " flex items-center justify-center "
            }`}
          >
            {currentChat ? (
              <MessageList
                currentUserId={currentUserId}
                messageList={MessagesArray}
                error={error}
                isLoading={isLoading}
              />
            ) : (
              <div>
                <Image
                  src="/undraw_quick_chat_re_bit5.svg"
                  width={240}
                  height={240}
                  alt="logo"
                  className="md:mb-4 md:w-[320px] "
                />
                <span className="block text-center font-mono text-lg">
                  Click on a chat to start chatting
                </span>
              </div>
            )}
          </div>
          <div className="my-4 px-4 pt-2 pb-2 sm:my-0 sm:pb-0">
            {currentChat && (
              <ChatInputForm
                handleSubmit={handleSubmit}
                value={message}
                setValue={setMessage}
                Icon={IoMdSend}
                placeholder="Message channel name"
              />
            )}
          </div>
        </main>
      </div>
    </motion.div>
  );
};
export default chats;

chats.getLayout = function getLayout(page: ReactElement) {
  return <div className="min-h-screen">{page}</div>;
};
chats.auth = true; // Protect the page using Auth Parent Component
