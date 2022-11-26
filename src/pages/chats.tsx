import { ReactElement, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Menu from "../components/Menu";
import ChatsHeader from "../components/ChatsHeader";

const chats = () => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const wByN = (n: number) => screenWidth && screenWidth * n;
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
        <div className="bg-neutral-50 dark:bg-[#1c1b22] sm:px-2 sm:pt-8">
          <ChatsHeader setIsOpen={setIsOpen} />
          <main className="min-h-[calc(100vh-3.5rem)] bg-neutral-200 px-4 dark:bg-zinc-900 sm:min-h-[calc(100vh-6.5rem)]">
            Main section
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
