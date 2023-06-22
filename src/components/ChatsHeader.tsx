import type { Dispatch, SetStateAction } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import useWindowSize from "../hooks/useWindowSize";
import type { GetChats } from "../server/common/getChats";

const ChatsHeader = ({
  setIsOpen,
  isCurrentChat,
  currentUserId,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isCurrentChat: boolean;
  currentUserId: string;
}) => {
  const { width: screenWidth } = useWindowSize();
  // const chatName = currentChat?.participants
  //   .filter((x) => x.user.id !== currentUserId)
  //   .map((x) => x.user.name)[0];
  return (
    <header
      className={`border-neutral-600 bg-opacity-10 p-4 sm:rounded-t-md sm:border-x sm:border-t ${isCurrentChat ? "sm:py-6 bg-neutral-500" : "sm:py-9 bg-neutral-300"}`}
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
        {/* <h2>{chatName}</h2> */}
      </div>
    </header>
  );
};
export default ChatsHeader;
