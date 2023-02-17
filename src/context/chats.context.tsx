import { createContext, Dispatch, SetStateAction } from "react";
import { ChatSearch } from "../pages/chats";

type SetCurrentChat = Dispatch<
  SetStateAction<ChatSearch[0] | undefined>
> | null;
type ChatsContext = ChatSearch | null;

const ChatsContext = createContext<ChatsContext>(null);
const { Provider: ChatsProvider } = ChatsContext;
const SetCurrentChatContext = createContext<SetCurrentChat>(null);
const { Provider: SetCurrentChatProvider } = SetCurrentChatContext;

export {
  ChatsContext,
  ChatsProvider,
  SetCurrentChatContext,
  SetCurrentChatProvider,
  type SetCurrentChat,
};
