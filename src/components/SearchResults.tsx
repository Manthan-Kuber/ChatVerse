import useSwr from "swr";
import type { UserSearch } from "../pages/api/search";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { fetcher } from "../utils/functions";
import { ProfileImageSkeleton } from "./ProfileImage";
import { env } from "../env/client.mjs";
import {
  type Dispatch,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
  Suspense,
} from "react";
import { GlobalStateContext } from "../context/chats.context";
import ChatOrUserInfo from "./ChatOrUserInfo";
import type { Conversation } from "@prisma/client";
import type { GetChats } from "../server/common/getChats";
import { useSession } from "next-auth/react";
import { RotatingLines } from "react-loader-spinner";

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

type CreateChatResponse = {
  message: string;
  chat: Conversation;
};

//type UserSearch[0] => User
const sortData = (a: UserSearch[0], b: UserSearch[0]) => {
  if (a.name && b.name) return a.name.localeCompare(b.name);
  return Number(a.id) - Number(b.id); //Wont reach here, outputs NaN
};

const clientUrl = env.NEXT_PUBLIC_CLIENT_URL;

const SearchResults = ({
  searchQuery,
  setValue,
}: {
  searchQuery: string;
  setValue: Dispatch<SetStateAction<string>>;
}) => {
  const GlobalState = useContext(GlobalStateContext);
  const { data: session } = useSession();
  const [newChatId, setNewChatId] = useState("");
  const {
    data: SearchedUsersArray,
    error,
    isLoading,
  } = useSwr<UserSearch, { message: string }>(
    searchQuery ? `${clientUrl}/api/search?searchQuery=${searchQuery}` : null,
    fetcher,
    {
      onSuccess: (data) => data.sort((a, b) => sortData(a, b)),
    }
  );
  const {
    data: ChatsList,
    mutate: mutateChats,
    isValidating: chatsValidating,
  } = useSwr<GetChats | undefined>( //No undefined data is shown when data is logged as fallback data is set to ssr fetched data
    `${clientUrl}/api/chats`,
    fetcher,
    {
      fallbackData: GlobalState?.chats ?? undefined, //Initial data for the cache
      revalidateOnMount: false, //show correct latest message to disabling revalidation
    }
  );

  const handleChatCreation = (userId: string) => {
    //Conv id is combination of either
    const comb_1 = checkChatExists(session?.user?.id + userId);
    const comb_2 = checkChatExists(userId + session?.user?.id);
    if (comb_1 || comb_2) {
      const searchedChat = comb_1 || comb_2; //Set new chat as one of the combinations
      if (searchedChat) setAsCurrentChat(searchedChat);
      GlobalState?.setIsOpen(false);
      return;
    }
    const url = `${clientUrl}/api/chats/create`;
    const createChatPromise: Promise<CreateChatResponse> = fetcher(url, {
      method: "POST",
      body: JSON.stringify({ userId }),
    });
    toast.promise(createChatPromise, {
      loading: "Creating Chat...",
      success: (data) => {
        mutateChats();
        setValue("");
        setNewChatId(data.chat.id);
        return "Created chat successfully";
      },
      error: (err) => `${(err as { message: string }).message}`,
    });
  };

  const checkChatExists = (chatId: string) => {
    const newChat = ChatsList?.find((c) => c.id === chatId);
    if (newChat) return newChat;
  };

  const setAsCurrentChat = (chat: GetChats[0]) => {
    GlobalState && GlobalState.setCurrentChat(chat);
  };

  const isUserOnline = (userId: string | undefined) => {
    if (GlobalState?.onlineUsers && Array.isArray(GlobalState.onlineUsers)) {
      const onlineUser = GlobalState.onlineUsers.find(
        (u) => u.userId === userId
      );
      if (onlineUser) return true;
    }
    return false;
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    return () => {
      toast.remove();
    };
  }, [error]);

  useEffect(() => {
    if (!chatsValidating) {
      const newChat = checkChatExists(newChatId);
      if (newChat) setAsCurrentChat(newChat);
    }
  }, [ChatsList, chatsValidating, newChatId, setAsCurrentChat]);

  if (isLoading) return <SearchResultSkeleton count={4} />;

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
            const user = chat.participants.map((c) => c.user)[0];
            return (
              <Suspense
                fallback={
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="24"
                  />
                }
              >
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
                    GlobalState?.currentChat?.id === chatId
                      ? "dark:bg-neutral-100/10 bg-neutral-300/10 border-lime-300"
                      : "border-transparent"
                  }`}
                  isOnline={isUserOnline(user?.id)}
                  onClick={() => {
                    setAsCurrentChat(chat);
                    GlobalState?.setIsOpen(false);
                  }}
                />
              </Suspense>
            );
          })
        )}
      </>
    );
  }

  if (SearchedUsersArray?.length === 0)
    return <p className="text-center">No results found.</p>;

  return (
    <>
      {SearchedUsersArray.map((user) => (
        <ChatOrUserInfo
          image={user.image}
          field1={user.name}
          field2={`~ ${user.email}`}
          key={user.id}
          divClassName="hover:cursor-pointer hover:bg-neutral-400/10 transition-colors duration-200 border-transparent"
          isOnline={isUserOnline(user.id)}
          onClick={() => {
            handleChatCreation(user.id);
          }}
        />
      ))}
    </>
  );
};

export default SearchResults;
