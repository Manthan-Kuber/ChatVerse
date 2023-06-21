import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import ThemeChanger from "./ThemeChanger";

const Menu = ({
  children,
  shouldAnimate,
  screenWidth = 200,
  setShouldAnimate,
  setIsOpen,
}: {
  children: React.ReactNode;
  shouldAnimate: boolean;
  screenWidth: number | undefined;
  setShouldAnimate: (value: boolean | ((val: boolean) => boolean)) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const slideInProps = {
    initial: { x: -screenWidth },
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
      exit={{
        x: slideInProps.initial.x,
        transition: slideInProps.animate.transition,
      }}
      className="fixed inset-y--0 z-10 min-h-0 w-full overflow-y-scroll  bg-black/10 shadow-md backdrop-blur-sm dark:bg-white/10"
    >
      <motion.section
        {...(shouldAnimate ? slideInProps : {})}
        onAnimationComplete={() => {
          setShouldAnimate(false);
        }}
        className="w-full overflow-y-scroll bg-white py-4 dark:bg-[#1c1b22] "
      >
        <IoMdClose
          className="btn-with-hover ml-2"
          onClick={() => {
            setIsOpen(false);
          }}
        />
        {children}
      </motion.section>
    </motion.div>
  );
};
export default Menu;
