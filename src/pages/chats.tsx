import React, { FormEvent, KeyboardEvent, ReactElement, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Menu from "../components/Menu";
import ChatsHeader from "../components/ChatsHeader";
import { IoMdSend } from "react-icons/io";
import { appearIntoView } from "../animations/animations";
import { io } from "socket.io-client";
import { env } from "../env/client.mjs";

const socket = io(env.NEXT_PUBLIC_SOCKET_SERVER_URL);

const chats = () => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
    <div className="mx-auto max-w-7xl sm:grid sm:grid-cols-[1fr_2fr]">
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
            <form
              className="relative flex items-center gap-4 "
              onSubmit={handleSubmit}
            >
              <input
                className="w-full rounded-md bg-neutral-500/10 px-4 py-2 outline-none transition-transform duration-200 pr-10"
                placeholder={`Message channel name`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <AnimatePresence>
                {(isFocused || message.length > 0) && (
                  <motion.button
                    className="absolute rounded-md bg-lime-400 p-2 transition-colors duration-200 hover:cursor-pointer hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-600 right-1"
                    type="submit"
                    disabled={!(message.length > 0)}
                    variants={appearIntoView}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <IoMdSend className="h-4 w-4 text-white" />
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
export default chats;

chats.getLayout = function getLayout(page: ReactElement) {
  return <div className="min-h-screen">{page}</div>;
};
chats.auth = true; // Protect the page using Auth Parent Component
