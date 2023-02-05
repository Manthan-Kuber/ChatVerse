import React, { FormEvent, KeyboardEvent, ReactElement, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Menu from "../components/Menu";
import ChatsHeader from "../components/ChatsHeader";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";
import { env } from "../env/client.mjs";
import ChatInputForm from "../components/ChatInputForm";
import { motion } from "framer-motion";

const socket = io(env.NEXT_PUBLIC_SOCKET_SERVER_URL);

const chats = () => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const wByN = (n: number) => screenWidth && screenWidth * n;

  const handleSubmit = (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    console.log(message);
    try {
      socket.emit("send_message", message);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // TODO Add page transition animation
  return (
    <motion.div
      className="mx-auto max-w-7xl sm:grid sm:grid-cols-[1fr_2fr]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
      <div className="sm:px-2 sm:pt-8">
        <ChatsHeader setIsOpen={setIsOpen} />
        <main className="flex min-h-[calc(100vh-4.5rem)] flex-col bg-neutral-300 bg-opacity-10 sm:min-h-[calc(100vh-6.5rem)] sm:pb-16">
          <div className="flex-1">Main section</div>
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
