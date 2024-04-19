import {
  type FormEvent,
  type KeyboardEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Sidebar from "../components/Sidebar";
import ChatsHeader from "../components/ChatsHeader";
import { IoMdSend } from "react-icons/io";
import ChatInputForm from "../components/ChatInputForm";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import useSocket from "../hooks/useSocket";
import events from "../utils/events";
import { type Message } from "@prisma/client";
import { type GetServerSideProps } from "next";
import { getServerAuthSession } from "../server/common/get-server-auth-session";
import { GlobalStateProvider } from "../context/chats.context";
import Image from "next/image";
import MessageList from "../components/MessageList";
import { fetcher, shimmer, toBase64 } from "../utils/functions";
import { env } from "../env/client.mjs";
import useSwr from "swr";
import { type GetMessages } from "./api/chats/get-messages";
import { type SendMessage } from "./api/chats/send-message";
import { type GetChats, getChats } from "../server/common/getChats";
import SidebarWrapper from "../components/SidebarWrapper";
import { BsChevronDoubleDown } from "react-icons/bs";
import { type VariableSizeList as List } from "react-window";
import ChatVerseLoader from "../components/ChatVerseLoader";
import useLocalStorage from "../hooks/useLocalStorage";
import { type UpdatePublicKey } from "./api/publickey/set";

type ChatProps = {
  chats: GetChats | null;
  fetchError: boolean;
  currentUserId: string | null;
};

export const getServerSideProps: GetServerSideProps<ChatProps> = async (
  context
) => {
  const { req, res } = context;
  const session = await getServerAuthSession({ req, res });

  if (session && session.user) {
    const res = await getChats(session.user.id);
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
      redirect: {
        source: "/chats",
        destination: "/auth/signin",
        permanent: true,
      },
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

const updatePublicKey = async ({
  url,
  publicKey,
  userId,
}: {
  url: string;
  publicKey: string;
  userId: string;
}) => {
  const options: RequestInit = {
    method: "POST",
    body: JSON.stringify({
      publicKey,
      userId,
    }),
  };
  const { message, publicKey: newPublicKey }: UpdatePublicKey = await fetcher(
    url,
    options
  );
  console.table({ message, newPublicKey }); //TODO Remove later
};

const clientUrl = env.NEXT_PUBLIC_CLIENT_URL;

const chats = ({ chats, fetchError, currentUserId }: ChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const socket = useSocket();
  const [currentChat, setCurrentChat] = useState<GetChats[0]>();
  const [onlineUsers, setOnlineUsers] = useState<
    { userId: string; socketId: string }[]
  >([]);
  const [isVisible, setIsVisible] = useState(true);
  const receiverId = currentChat?.participants.map((p) => p.user.id)[0];
  const conversationId = currentChat?.id;
  const listRef = useRef<List>(null); //Ref for react window's variable size list
  const [publicKey, setPublicKey] = useLocalStorage(
    `publicKey_${currentUserId!}`,
    ""
  );
  const [privateKey, setPrivateKey] = useLocalStorage(
    `privateKey_${currentUserId!}`,
    ""
  );
  const [symmetricKey, setSymmetricKey] = useLocalStorage(
    `symmetricKey_${conversationId!}`,
    ""
  );

  const {
    data: MessagesArray,
    error,
    isLoading,
    mutate,
  } = useSwr<GetMessages, { message: string }>(
    currentChat
      ? `${clientUrl}/api/chats/get-messages?conversationId=${conversationId}&receiverId=${receiverId}`
      : null
  );
  const { mutate: mutateChats } = useSwr<GetChats | undefined>(
    `${clientUrl}/api/chats`
  );

  const updateLatestMessage = ({
    conversationId,
    latestMessage,
  }: {
    conversationId: string;
    latestMessage: string;
  }) => {
    mutateChats(
      (prev) => {
        if (prev) {
          return prev.map((chat) => {
            if (chat.id === conversationId) {
              return {
                ...chat,
                latestMessage: {
                  body: latestMessage,
                },
              };
            } else {
              return chat;
            }
          });
        }
      },
      {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }
    );
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    try {
      if (socket && currentChat) {
        socket.emit(events.PRIVATE_MESSAGE, {
          message,
          from: currentUserId,
          to: receiverId,
          conversationId: conversationId!,
        });
        setMessage("");
        const sendMessageUrl = `${clientUrl}/api/chats/send-message`;
        const messageParams = {
          conversationId: conversationId!,
          messageBody: message,
          receiverId: receiverId!,
          MessagesArray: MessagesArray,
        };
        const newMessage: Message = {
          id: crypto.randomUUID(),
          conversationId: conversationId!,
          senderId: currentUserId!,
          body: message,
          createdAt: new Date(), //Make new message date as current time
          updatedAt: new Date(),
        };
        updateLatestMessage({
          conversationId: currentChat.id,
          latestMessage: message,
        });
        await mutate(sendMessage(sendMessageUrl, { ...messageParams }), {
          optimisticData: (currentMessages) => [
            ...(currentMessages || []),
            newMessage,
          ], //Optimistic data can also have access to current data via a callback function
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        });
      }
    } catch (err) {
      toast.error("Error in sending the message");
    }
  };

  const privateMessage = useCallback(
    (data: {
      message: string;
      to: string;
      from: string;
      conversationId: string;
    }) => {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        conversationId: data.conversationId,
        senderId: data.from,
        body: data.message,
        createdAt: new Date(), //Make new message date as current time
        updatedAt: new Date(),
      };
      mutate((currentMessages) => [...(currentMessages || []), newMessage], {
        populateCache: true,
        revalidate: false,
        rollbackOnError: true,
      }); //Pass a function to obtain current data in the cache as param
      updateLatestMessage({
        conversationId: data.conversationId,
        latestMessage: data.message,
      });
    },
    [MessagesArray]
  );

  const getOnlineUsers = useCallback(
    (users: { userId: string; socketId: string }[]) => {
      setOnlineUsers(users);
    },
    [onlineUsers, setOnlineUsers]
  );

  useEffect(() => {
    if (currentUserId) socket?.emit(events.ADD_NEW_USER, currentUserId);
    socket?.on(events.GET_USERS, (users) => getOnlineUsers(users));
    socket?.on(events.PRIVATE_MESSAGE, (data) => privateMessage(data));
    socket?.on(events.disconnect, (users) => getOnlineUsers(users));
    return () => {
      socket?.off(events.GET_USERS);
      socket?.off(events.PRIVATE_MESSAGE);
    };
  }, [socket]);

  useEffect(() => {
    if (fetchError) toast.error("Error in fetching chats");
    if (error) toast.error(error.message);
    return () => {
      toast.remove();
    };
  }, [fetchError, error]);

  const initializeKeyPair = async () => {
    try {
      if (!publicKey || !privateKey) {
        const JSEncrypt = (await import("jsencrypt")).default; // Dynamic import to avoid window object undefined error
        const crypt = new JSEncrypt({ default_key_size: "2048" }); // Encryption object
        // Use crypt.setPublicKey() and set value from localstorage while encryption / decryption
        const publicKey = crypt.getPublicKey();
        setPublicKey(publicKey);
        setPrivateKey(crypt.getPrivateKey());
        const url = `${clientUrl}/api/publickey/set`;
        updatePublicKey({ publicKey, userId: currentUserId!, url });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSymmetricKey = async () => {
    try {
      //add if
      if(conversationId && !symmetricKey){
        const url = `${clientUrl}/api/symmetrickey/?conversationId=${conversationId}&userId=${currentUserId}`;
        const { symmetricKey: symmKey }: { symmetricKey: string } =
          await fetcher(url, {});
        const JSEncrypt = (await import("jsencrypt")).default;
        const crypt = new JSEncrypt({ default_key_size: "2048" });
        crypt.setPrivateKey(privateKey);
        crypt.setPublicKey(publicKey)
        const dec = crypt.decrypt(symmKey);
        console.log(dec);
        setSymmetricKey(symmKey);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSymmetricKey();
  }, [symmetricKey,conversationId]);

  useEffect(() => {
    initializeKeyPair();
  }, [publicKey, privateKey]);

  if (!publicKey) return <ChatVerseLoader fullScreen />;

  return (
    <motion.div
      className="mx-auto max-w-7xl sm:grid sm:grid-cols-[1fr_minmax(0,2fr)]" //For grid 1fr -> minmax(auto,1fr) meaning min is auto i.e based on width of content and max is 1fr that's 1 fraction of space. minmax(0,1fr) -> overrides this making the max width 1fr and not making min width, content based
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <GlobalStateProvider
        value={{
          chats,
          currentChat,
          setCurrentChat,
          setIsOpen,
          isOpen,
          onlineUsers,
        }}
      >
        <SidebarWrapper>
          <Sidebar />
        </SidebarWrapper>
      </GlobalStateProvider>
      <div className="sm:px-2 sm:pt-8">
        <ChatsHeader
          setIsOpen={setIsOpen}
          CurrentChat={currentChat}
          currentUserId={currentUserId!}
        />
        <main
          className={`flex h-[calc(100vh-4.6rem)] flex-col border-neutral-600 bg-neutral-300/10 sm:h-[calc(100vh-10.6rem)] sm:rounded-b-md ${
            currentChat ? "border-t sm:border" : "sm:border-x sm:border-b"
          }`}
        >
          <div
            className={`relative flex-1 overflow-y-hidden  ${
              !currentChat ? "flex items-center justify-center " : ""
            }`}
          >
            {currentChat ? (
              <>
                <MessageList
                  currentChat={currentChat}
                  currentUserId={currentUserId}
                  messageList={MessagesArray}
                  isLoading={isLoading}
                  setIsVisible={setIsVisible}
                  listRef={listRef}
                />
                <button
                  className={`rounded-full border border-neutral-600 bg-neutral-200 text-neutral-600 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-400 ${
                    isVisible ? "opacity-1" : "pointer-events-none opacity-0"
                  } absolute bottom-2 right-4 p-2 transition-opacity duration-200 `}
                  onClick={() => {
                    listRef.current?.scrollToItem(
                      (MessagesArray || []).length - 1,
                      "smart"
                    );
                  }}
                >
                  <BsChevronDoubleDown className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="grid place-items-center p-4">
                <Image
                  src="/undraw_quick_chat_re_bit5.svg"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(240, 240)
                  )}`}
                  width={240}
                  height={240}
                  alt="logo"
                  className="md:mb-4 md:w-[320px]"
                  priority
                />
                <span className="block text-center font-mono text-lg">
                  Click on a chat to start chatting
                </span>
              </div>
            )}
          </div>
          <div
            className={`py-4 px-2 sm:my-0 ${
              currentChat && "border-t border-neutral-600"
            }`}
          >
            {currentChat && (
              <ChatInputForm
                handleSubmit={handleSubmit}
                value={message}
                setValue={setMessage}
                Icon={IoMdSend}
                placeholder="Message"
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
