import type { Dispatch, SetStateAction } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import useWindowSize from "../hooks/useWindowSize";
import type { GetChats } from "../server/common/getChats";
import ThemeChanger from "./ThemeChanger";

const ChatsHeader = ({
  setIsOpen,
  currentChat,
  currentUserId,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentChat: GetChats[0] | undefined;
  currentUserId: string;
}) => {
  const { width: screenWidth } = useWindowSize();
  const chatName = currentChat?.participants
    .filter((x) => x.user.id !== currentUserId)
    .map((x) => x.user.name)[0];
  return (
    <header className="border-x border-t border-neutral-600 bg-neutral-500 bg-opacity-10 p-4 sm:rounded-t-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-x-4">
        {screenWidth && screenWidth < 640 && (
          <div>
            <GiHamburgerMenu
              className="btn-with-hover"
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
        )}
        <h2>{chatName}</h2>
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
