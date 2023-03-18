import { type RefObject } from "react";

export const resetScroll = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
  (e.currentTarget.scrollLeft = 0);

export const fetcher = async (input: RequestInfo, init: RequestInit) => {
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

export const scrollIntoView = (ref: RefObject<HTMLDivElement>) => {
  ref.current?.scrollIntoView({ behavior: "smooth" });
};
