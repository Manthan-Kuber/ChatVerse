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

const scrollIntoView = (
  ref: RefObject<HTMLDivElement>,
  behavior: ScrollBehavior
) => {
  ref.current?.scrollIntoView({ behavior });
};

const getChatName = (
  currentChat: GetChats[0] | undefined,
  currentUserId: string | null
) =>
  currentChat?.participants
    .filter((x) => x.user.id !== currentUserId)
    .map((x) => x.user.name)[0];

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export { resetScroll, fetcher, scrollIntoView, getChatName, shimmer, toBase64 };
