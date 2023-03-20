import { motion } from "framer-motion";
import { fadeInOut } from "../animations/animations";
import { IoMdClose } from "react-icons/io";
import ThemeChanger from "./ThemeChanger";

const Menu = ({
  children,
  menuWidth,
  shouldAnimate,
  setShouldAnimate,
  setIsOpen,
}: {
  children: React.ReactNode;
  menuWidth: number;
  shouldAnimate: boolean;
  setShouldAnimate: (value: boolean | ((val: boolean) => boolean)) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fadeInOutProps = {
    key: "sidebar",
    variants: { fadeInOut },
    initial: "initial",
    animate: "animate",
    exit: "exit",
  };
  const slideInProps = {
    initial: { x: menuWidth },
    animate: {
      x: 0,
      transition: {
        duration: 0.2,
        ease: "linear",
      },
    },
  };
  return (
    <motion.div
      {...(shouldAnimate ? fadeInOutProps : {})}
      className="z-2 min-h-fit w-full  bg-black/10 shadow-md backdrop-blur-sm dark:bg-white/10"
    >
      <motion.section
        {...(shouldAnimate ? slideInProps : {})}
        onAnimationComplete={() => {
          setShouldAnimate(false);
        }}
        className="fixed top-0 bottom-0 min-h-screen w-11/12 overflow-y-scroll bg-white py-4 dark:bg-black "
      >
        <div className="flex items-center justify-between px-2">
          <ThemeChanger />
          <IoMdClose
            className="btn-with-hover"
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </div>
        {children}
      </motion.section>
    </motion.div>
  );
};
export default Menu;
