import { createContext, Dispatch, SetStateAction } from "react";
import { GetChats } from "../server/common/getChats";

type CurrentChatElement = GetChats[0] | undefined;
type Chats = GetChats | null;

type GlobalState = {
  setCurrentChat: Dispatch<SetStateAction<CurrentChatElement>>;
  currentChat: CurrentChatElement;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  chats: Chats;
} | null;

const GlobalStateContext = createContext<GlobalState>(null);
const { Provider: GlobalStateProvider } = GlobalStateContext;

export { GlobalStateContext, GlobalStateProvider, type GlobalState };
