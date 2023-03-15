import useSwr from "swr";
import type { UserSearch } from "../pages/api/search";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { fetcher } from "../utils/functions";
import { ProfileImageSkeleton } from "./ProfileImage";
import { env } from "../env/client.mjs";
import { useContext, useEffect } from "react";
import { GlobalStateContext } from "../context/chats.context";
import ChatOrUserInfo from "./ChatOrUserInfo";
import { Conversation } from "@prisma/client";
import { GetChats } from "../server/common/getChats";

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

type CreateChatResponse =
  | { message: string }
  | { message: string; chat: Conversation | Conversation[] };

const SearchResults = ({ searchQuery }: { searchQuery: string }) => {
  const GlobalState = useContext(GlobalStateContext);
  const {
    data: SearchedUsersArray,
    error,
    isLoading,
  } = useSwr<UserSearch, { message: string }>(
    searchQuery
      ? `${env.NEXT_PUBLIC_CLIENT_URL}/api/search?searchQuery=${searchQuery}`
      : null
  );
  const { data: ChatsList } = useSwr<GetChats | undefined>( //No undefined data is shown when data is logged as fallback data is set to ssr fetched data
    `${env.NEXT_PUBLIC_CLIENT_URL}/api/chats`,
    fetcher,
    {
      fallbackData: GlobalState?.chats!,
      revalidateOnMount: false, //show correct latest message to disabling revalidation
    }
  );

  const handleChatCreation = (userId: string) => {
    const url = `${env.NEXT_PUBLIC_CLIENT_URL}/api/chats/create`;
    const createChatPromise: Promise<CreateChatResponse> = fetcher(url, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    toast.promise(createChatPromise, {
      loading: "Creating Chat...",
      success: (data) => {
        console.log(data);
        return "Created chat successfully";
      },
      error: (err) => `${(err as { message: string }).message}`, //TODO when chat already exists, set with current state
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    return () => {
      toast.remove();
    };
  }, [error]);

  if (isLoading) return <SearchResultSkeleton count={4} />;

  const setAsCurrentChat = (chat: GetChats[0]) => {
    GlobalState && GlobalState.setCurrentChat(chat);
  };

  if (!SearchedUsersArray) {
    return (
      <>
        {ChatsList?.length === 0 ? (
          <p className="text-center">
            No active chats found.
            <br />
            Search for an user and click on it to create a chat{" "}
          </p>
        ) : (
          ChatsList?.map((chat: GetChats[0]) => {
            const { id: chatId, latestMessage } = chat;
            const user = chat.participants.map((c) => c.user)[0]; //TODO display skeleton when any var is undefined
            return (
              <ChatOrUserInfo
                key={chatId}
                image={user?.image}
                field1={user?.name || <Skeleton />}
                field2={
                  (
                    <small className="text-gray-400">
                      {latestMessage?.body}
                    </small>
                  ) || <span className="invisible">Placeholder</span>
                }
                divClassName={`hover:cursor-pointer hover:bg-neutral-400/10 transition-colors duration-200 ${
                  GlobalState?.currentChat?.id === chatId && "bg-neutral-400/10"
                }`}
                onClick={() => {
                  setAsCurrentChat(chat);
                  GlobalState?.setIsOpen(false);
                }}
              />
            );
          })
        )}
      </>
    );
  }

  if (SearchedUsersArray?.length === 0)
    return <p className="text-center">No results found</p>;

  return (
    <>
      {/* TODO create chat on click and close menu */}
      {SearchedUsersArray.map((user) => (
        <ChatOrUserInfo
          image={user.image}
          field1={user.name}
          field2={`~ ${user.email}`}
          key={user.id}
          divClassName="hover:cursor-pointer hover:bg-neutral-400/10 transition-colors duration-200"
          onClick={() => {
            handleChatCreation(user.id);
          }}
        />
      ))}
    </>
  );
};

export default SearchResults;
