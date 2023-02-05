export const resetScroll = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) =>
  (e.currentTarget.scrollLeft = 0);

export const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  //TODO Improve error handling
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }

  return res.json();
};
