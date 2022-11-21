import { ReactElement, useState } from "react";
import Footer from "../components/Footer";
import { GiHamburgerMenu } from "react-icons/gi";
import useWindowSize from "../hooks/useWindowSize";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { fadeInOut } from "../animations/animations";


//TODO Add theme switcher somewhere
const chats = () => {
  const { width: screenWidth } = useWindowSize();
  const [isOpen, setIsOpen] = useState(false);
  const MenuIcon = motion(isOpen ? IoMdClose : GiHamburgerMenu);
  const wByN = (n: number) => screenWidth && screenWidth * n;
  return (
    <div>
      {screenWidth && screenWidth < 640 && (
        <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 p-4 ">
          <div>
            <MenuIcon onClick={() => setIsOpen((prev) => !prev)} />
          </div>
          <h2>Channel Name</h2>
        </div>
      )}
      <div className="sm:grid sm:grid-cols-[1fr_2fr]">
        {screenWidth && screenWidth >= 640 ? (
          <section className="px-4">Chat Channels</section>
        ) : (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="sidebar"
                variants={fadeInOut}
                initial="initial"
                animate="animate" //TODO Stagger children
                exit="exit"
                className="fixed z-10 min-h-screen w-full bg-white/10   backdrop-blur-sm"
              >
                <motion.section
                  initial={{ x: -wByN(2 / 3)! }}
                  animate={{
                    x: 0,
                    transition: {
                      duration: 0.2,
                      ease: "linear",
                    },
                  }}
                  exit={{ x: -wByN(2 / 3)! }}
                  className="min-h-screen w-2/3 bg-black px-4 "
                >
                  Chat Channels
                </motion.section>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <main className="px-4">Main section</main>
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
