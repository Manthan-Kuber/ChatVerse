import { AnimatePresence } from "framer-motion";
import { ReactNode, useContext, useEffect } from "react";
import { GlobalStateContext } from "../context/chats.context";
import useLocalStorage from "../hooks/useLocalStorage";
import useWindowSize from "../hooks/useWindowSize";
import Menu from "./Menu";

const SidebarWrapper = ({ children }: { children: ReactNode }) => {
  const { width: screenWidth } = useWindowSize();
  const [shouldAnimate, setShouldAnimate] = useLocalStorage(
    "shouldAnimate",
    true
  );
  const GlobalState = useContext(GlobalStateContext);

  useEffect(() => {
    if (!GlobalState?.isOpen) setShouldAnimate(true);
  }, [GlobalState?.isOpen]);

  return screenWidth && screenWidth >= 640 ? (
    <section>{children}</section>
  ) : (
    // Menu component is conditionally rendered. It needs to be surrounded by animate presence and needs to have an exit property to be defined on it. The parent element of Menu component needs to be a motion div.
    <AnimatePresence>
      {GlobalState?.isOpen && (
        <Menu
          shouldAnimate={shouldAnimate}
          setShouldAnimate={setShouldAnimate}
          setIsOpen={GlobalState.setIsOpen}
          screenWidth={screenWidth}
        >
          {children}
        </Menu>
      )}
    </AnimatePresence>
  );
};

export default SidebarWrapper;
