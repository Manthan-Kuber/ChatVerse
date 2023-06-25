import type { Dispatch, SetStateAction } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import useWindowSize from "../hooks/useWindowSize";
import type { GetChats } from "../server/common/getChats";
import { getChatName } from "../utils/functions";
import GradientUnderline from "./GradientUnderline";

const ChatsHeader = ({
  setIsOpen,
  CurrentChat,
  currentUserId,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  CurrentChat: GetChats[0] | undefined;
  currentUserId: string;
}) => {
  const { width: screenWidth } = useWindowSize();
  const chatName = getChatName(CurrentChat, currentUserId);
  return (
    <header
      className={`border-neutral-600 bg-opacity-10 p-4 sm:rounded-t-md sm:border-x sm:border-t ${
        CurrentChat ? "bg-neutral-500 sm:py-6" : "bg-neutral-300 sm:py-9"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-x-4">
        {screenWidth && screenWidth < 640 && (
          <div>
            <GiHamburgerMenu
              className="btn-with-hover"
              onClick={() => setIsOpen((prev) => !prev)}
            />
          </div>
        )}
        {CurrentChat && (
          <div className="w-fit">
            <h2>{chatName}</h2>
            <GradientUnderline />
          </div>
        )}
      </div>
    </header>
  );
};
export default ChatsHeader;
