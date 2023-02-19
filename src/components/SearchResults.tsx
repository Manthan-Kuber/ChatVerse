import useSwr from "swr";
import type { UserSearch } from "../pages/api/search";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { fetcher } from "../utils/functions";
import { ProfileImageSkeleton } from "./ProfileImage";
import { env } from "../env/client.mjs";
import { useContext, useEffect } from "react";
import { ChatsContext, SetCurrentChatContext } from "../context/chats.context";
import ChatOrUserInfo from "./ChatOrUserInfo";
import { ChatSearch } from "../pages/chats";

const SearchResultSkeleton = ({ count }: { count?: number }) => {
  return (
    <>
      {Array(count || 1)
        .fill(0)
        .map((_, index) => (
          <div
            className="flex w-full items-center gap-4 overflow-hidden rounded-md bg-neutral-500/10 px-4 py-2 outline-none transition-transform duration-200"
            key={index}
          >
            <ProfileImageSkeleton />
            <div className="w-full">
              <Skeleton className="block truncate" />
              <Skeleton className="block truncate" />
            </div>
          </div>
        ))}
    </>
  );
};

const SearchResults = ({ searchQuery }: { searchQuery: string }) => {
  const {
    data: SearchedUsersArray,
    error,
    isLoading,
  } = useSwr<UserSearch, { message: string }>(
    searchQuery
      ? `${env.NEXT_PUBLIC_CLIENT_URL}/api/search?searchQuery=${searchQuery}`
      : null,
    fetcher
  );
  const chats = useContext(ChatsContext);
  const setCurrentChat = useContext(SetCurrentChatContext);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    return () => {
      toast.remove();
    };
  }, [error]);

  if (isLoading) return <SearchResultSkeleton count={4} />;

  const handleClick = (chat: ChatSearch[0]) =>
    setCurrentChat && setCurrentChat(chat);

  if (!SearchedUsersArray) {
    return (
      <>
        {chats?.map((chat) => {
          const { id: chatId, latestMessage } = chat;
          const user = chat.participants.map((c) => c.user)[0]; //TODO display skeleton when any var is undefined
          return (
            <>
              <ChatOrUserInfo
                key={chatId}
                image={user?.image}
                field1={user?.name || <Skeleton />}
                field2={
                  latestMessage?.body || (
                    <span className="invisible">Placeholder</span>
                  )
                }
                divClassName="hover:cursor-pointer hover:bg-neutral-400/10 transition-colors duration-200"
                onClick={() => handleClick(chat)}
              />
            </>
          );
        })}
      </>
    );
  }

  if (SearchedUsersArray.length === 0)
    return <p className="text-center">No results found</p>;

  return (
    <>
    {/* TODO create chat on click */}
      {SearchedUsersArray.map((user) => (
        <ChatOrUserInfo
          image={user.image}
          field1={user.name}
          field2={`~ ${user.email}`}
          key={user.id}
          divClassName="hover:cursor-pointer hover:bg-neutral-400/10 transition-colors duration-200"
        />
      ))}
    </>
  );
};

export default SearchResults;
