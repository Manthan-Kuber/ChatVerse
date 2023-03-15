import { createContext, Dispatch, SetStateAction } from "react";
import { ChatsReducerAction } from "../pages/chats";
import { GetChats } from "../server/common/getChats";

type CurrentChatElement = GetChats[0] | undefined;

type CurrentChat = {
  setCurrentChat: Dispatch<SetStateAction<CurrentChatElement>>;
  currentChat: CurrentChatElement;
  setIsOpen: Dispatch<SetStateAction<boolean>>
} | null;

type Chats = GetChats | null;

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
