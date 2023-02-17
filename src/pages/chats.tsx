import React, {
  FormEvent,
  KeyboardEvent,
  ReactElement,
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
import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { ChatsProvider } from "../context/chats.context";

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
      messages: true,
      participants: {
        where: {
          NOT: {
            userId,
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
      },
    };
  } else {
    return {
      props: {
        chats: null,
        fetchError: true,
      },
    };
  }
};

const chats = ({
  chats,
  fetchError,
}: {
  chats: ChatSearch;
  fetchError: boolean;
}) => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const wByN = (n: number) => screenWidth && screenWidth * n;
  const socket = useSocket();
  const [messageList, setMessageList] = useState<string[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSearch[0] | undefined>();

  const handleSubmit = (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    try {
      if (socket) {
        socket.emit(events.SEND_MESSAGE, message);
        setMessageList([...messageList, message]);
        setMessage("");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error in sending the message");
    }
  };

  function receiveMessage() {
    if (socket) {
      socket.on(events.RECEIVE_MESSAGE, (data) => {
        setMessageList((prev) => [...prev, data]);
      });
    }
  }

  useEffect(() => {
    receiveMessage();
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
      <ChatsProvider value={chats}>
        {screenWidth && screenWidth >= 640 ? (
          <section>
            <Sidebar />
          </section>
        ) : (
          <AnimatePresence>
            {isOpen && (
              <Menu setIsOpen={setIsOpen} menuWidth={-wByN(2 / 3)!}>
                <Sidebar />
              </Menu>
            )}
          </AnimatePresence>
        )}
      </ChatsProvider>
      <div className="sm:px-2 sm:pt-8">
        <ChatsHeader setIsOpen={setIsOpen} currentChat={currentChat} />
        <main className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-neutral-300 bg-opacity-10 sm:min-h-[calc(100vh-6.5rem)] sm:pb-16">
          <div className="flex-1">
            {messageList.map((message) => (
              <p>{message}</p>
            ))}
          </div>
          <div className="px-4 pt-2 pb-2 sm:pb-0">
            <ChatInputForm
              handleSubmit={handleSubmit}
              value={message}
              setValue={setMessage}
              Icon={IoMdSend}
              placeholder="Message channel name"
            />
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
