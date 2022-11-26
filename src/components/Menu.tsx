import { motion } from "framer-motion";
import { fadeInOut } from "../animations/animations";
import { IoMdClose } from "react-icons/io";
import ThemeChanger from "./ThemeChanger";

const Menu = ({
  children,
  menuWidth,
  setIsOpen,
}: {
  children: React.ReactNode;
  menuWidth: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <motion.div
      key="sidebar"
      variants={fadeInOut}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed top-0 left-0 z-10 min-h-screen w-full bg-black/10 shadow-md backdrop-blur-sm dark:bg-white/10"
    >
      <motion.section
        initial={{ x: menuWidth }}
        animate={{
          x: 0,
          transition: {
            duration: 0.2,
            ease: "linear",
          },
        }}
        exit={{ x: menuWidth }}
        className="min-h-screen w-8/12 bg-white py-4 dark:bg-[#1c1b22]"
      >
        <div className="flex items-center justify-between px-2">
          <ThemeChanger />
          <IoMdClose
            className="btn-with-hover"
            onClick={() => setIsOpen(false)}
          />
        </div>
        {children}
      </motion.section>
    </motion.div>
  );
};
export default Menu;
