import { GiHamburgerMenu } from "react-icons/gi";
import useWindowSize from "../hooks/useWindowSize";
import ThemeChanger from "./ThemeChanger";

const ChatsHeader = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { width: screenWidth } = useWindowSize();

  return (
    <header className="p-4 shadow-md dark:shadow-neutral-500">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-x-4">
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
    </header>
  );
};
export default ChatsHeader;
