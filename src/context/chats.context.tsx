import { createContext, Dispatch, SetStateAction } from "react";
import { ChatSearch, ChatsReducerAction } from "../pages/chats";

type CurrentChatElement = ChatSearch[0] | undefined;

type CurrentChat = {
  setCurrentChat: Dispatch<SetStateAction<CurrentChatElement>>;
  currentChat: CurrentChatElement;
} | null;

type Chats = ChatSearch | null;

type ChatsContext = {
  chats: Chats;
  dispatch: Dispatch<ChatsReducerAction>;
} | null;

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
