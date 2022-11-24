import { ReactElement, useState } from "react";
import Footer from "../components/Footer";
import { GiHamburgerMenu } from "react-icons/gi";
import useWindowSize from "../hooks/useWindowSize";
import { AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Menu from "../components/Menu";
import ThemeChanger from "../components/ThemeChanger";

//TODO Add theme switcher somewhere
const chats = () => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const wByN = (n: number) => screenWidth && screenWidth * n;
  return (
    <div>
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 p-4 shadow-md dark:shadow-neutral-500">
        {screenWidth && screenWidth < 640 && (
          <div>
            <GiHamburgerMenu
              className="btn-with-hover"
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
        )}
        <h2>Channel Name</h2>
        {screenWidth && screenWidth >= 640 && (
          <div className="flex justify-end">
            <ThemeChanger />
          </div>
        )}
      </div>

      <div className="sm:mt-4 sm:grid sm:grid-cols-[1fr_2fr]">
        {screenWidth && screenWidth >= 640 ? (
          <section className="px-4">
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
        <main className="mt-4 px-4 sm:mt-0">Main section</main>
      </div>
    </div>
  );
};
export default chats;

chats.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <div className="grid min-h-screen grid-rows-[1fr_auto] ">
        {page}
        <Footer />
      </div>
    </>
  );
};
chats.auth = true; // Protect the page using Auth Parent Component
