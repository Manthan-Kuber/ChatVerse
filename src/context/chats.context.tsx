import { createContext, Dispatch, SetStateAction } from "react";
import { ChatsReducerAction } from "../pages/chats";
import { GetChats } from "../server/common/getChats";

type CurrentChatElement = GetChats[0] | undefined;

type GlobalState = {
  setCurrentChat: Dispatch<SetStateAction<CurrentChatElement>>;
  currentChat: CurrentChatElement;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  chats: Chats;
} | null;

type Chats = GetChats | null;

type ChatsContext = {
  chats: Chats;
  dispatch: Dispatch<ChatsReducerAction>;
} | null;

const ChatsContext = createContext<ChatsContext>(null);
const { Provider: ChatsProvider } = ChatsContext;

const GlobalStateContext = createContext<GlobalState>(null);
const { Provider: GlobalStateProvider } = GlobalStateContext;

export {
  ChatsContext,
  ChatsProvider,
  GlobalStateContext,
  GlobalStateProvider,
  type GlobalState,
};
