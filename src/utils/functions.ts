import { type RefObject } from "react";
import { GetChats } from "../server/common/getChats";

const resetScroll = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
  (e.currentTarget.scrollLeft = 0);

const fetcher = async (input: RequestInfo, init: RequestInit) => {
  const res = await fetch(input, init);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    const data = (await res.json()) as { message: string };
    error.message = data.message;
    throw error;
  }

  const data = await res.json();

  return data;
};

const scrollIntoView = (ref: RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};

const getChatName = (
  currentChat: GetChats[0] | undefined,
  currentUserId: string
) =>
  currentChat?.participants
    .filter((x) => x.user.id !== currentUserId)
    .map((x) => x.user.name)[0];

export { resetScroll, fetcher, scrollIntoView,getChatName };
