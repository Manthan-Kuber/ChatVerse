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
      <ChatsHeader setIsOpen={setIsOpen} />
      <div className="mx-auto max-w-7xl  sm:grid sm:grid-cols-[1fr_2fr]">
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
        <main className=" sm:pt-0">Main section</main>
      </div>
    </>
  );
};
export default chats;

chats.getLayout = function getLayout(page: ReactElement) {
  return <div className="min-h-screen">{page}</div>;
};
chats.auth = true; // Protect the page using Auth Parent Component
