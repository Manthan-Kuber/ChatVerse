import { motion } from "framer-motion";
import { fadeInOut } from "../animations/animations";

const Menu = ({
  children,
  menuWidth,
}: {
  children: React.ReactNode;
  menuWidth: number;
}) => {
  return (
    <motion.div
      key="sidebar"
      variants={fadeInOut}
      initial="initial"
      animate="animate" //TODO Stagger children
      exit="exit"
      className="fixed z-10 min-h-screen w-full bg-white/10   backdrop-blur-sm"
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
        className="min-h-screen w-2/3 bg-black px-4 "
      >
        {children}
      </motion.section>
    </motion.div>
  );
};
export default Menu;
