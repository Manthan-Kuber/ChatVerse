import { ReactElement, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Menu from "../components/Menu";
import ChatsHeader from "../components/ChatsHeader";
import { IoMdSend } from "react-icons/io";

const chats = () => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const [hasTyped, setHasTyped] = useState(false);
  const wByN = (n: number) => screenWidth && screenWidth * n;
  // TODO Add page transition animation
  return (
    <>
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
          <main className="flex min-h-[calc(100vh-4.5rem)] flex-col  bg-neutral-300 bg-opacity-10 sm:min-h-[calc(100vh-6.5rem)] sm:pb-16">
            <div className="flex-1 ">Main section</div>
            <div className="flex items-center gap-4 px-4 pt-2">
              <input
                className="container rounded-full bg-neutral-500/10 px-4 py-2 focus:outline-none "
                placeholder={`Message channel name`}
              />
              {!hasTyped && (
                <button className="rounded-full bg-lime-300 p-2">
                  <IoMdSend className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
export default chats;

chats.getLayout = function getLayout(page: ReactElement) {
  return <div className="min-h-screen">{page}</div>;
};
chats.auth = true; // Protect the page using Auth Parent Component
