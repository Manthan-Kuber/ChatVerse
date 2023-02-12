import { createContext } from "react";
import { ChatSearch } from "../pages/chats";

const ChatsContext = createContext<ChatSearch | null>(null);
const { Provider: ChatsProvider } = ChatsContext;

export { ChatsContext, ChatsProvider };
