import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import useWindowSize from "../hooks/useWindowSize";
import { ChatSearch } from "../pages/chats";
import ThemeChanger from "./ThemeChanger";

const ChatsHeader = ({
  setIsOpen,
  currentChat,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  currentChat: ChatSearch[0] | undefined ;
}) => {
  const { width: screenWidth } = useWindowSize();
  const { data: session } = useSession();
  const chatName = currentChat?.participants
    .filter((x) => x.user.id !== session?.user?.id)
    .map((x) => x.user.name)[0];
  return (
    <header className="bg-neutral-500 bg-opacity-10 p-4 sm:rounded-t-xl ">
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
