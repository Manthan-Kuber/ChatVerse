import { createContext, Dispatch, SetStateAction } from "react";
import { ChatSearch } from "../pages/chats";

type CurrentChat = {
  setCurrentChat: Dispatch<SetStateAction<ChatSearch[0] | undefined>>;
  currentChat: ChatSearch[0] | undefined;
} | null;
type ChatsContext = ChatSearch | null;

const ChatsContext = createContext<ChatsContext>(null);
const { Provider: ChatsProvider } = ChatsContext;
const CurrentChatContext = createContext<CurrentChat>(null);
const { Provider: CurrentChatProvider } = CurrentChatContext;

export {
  ChatsContext,
  ChatsProvider,
  CurrentChatContext,
  CurrentChatProvider,
  type CurrentChat,
};
