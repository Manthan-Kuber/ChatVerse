import { type Message as MessageType } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import { GetChats } from "../server/common/getChats";
import { getChatName } from "../utils/functions";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { useCallback, useEffect, useRef } from "react";
import useWindowSize from "../hooks/useWindowSize";
import Row from "./Row";
import MessageComponent from "./Message";

const MessageListSkeleton = ({ count }: { count?: number }) => {
  return (
    <>
      {Array(count || 1)
        .fill(0)
        .map((_, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              className={`m-4 flex flex-col ${
                isEven ? "items-end" : "items-start"
              }`}
              key={index}
            >
              <Skeleton className="px-20 py-3" />
              <Skeleton className="px-12" />
            </div>
          );
        })}
    </>
  );
};

type MessageListProps = {
  messageList: MessageType[] | undefined;
  isLoading: boolean;
  currentUserId: string | null;
  currentChat: GetChats[0] | undefined;
};

const MessageList = ({
  messageList,
  isLoading,
  currentUserId,
  currentChat,
}: MessageListProps) => {
  const chatName = getChatName(currentChat, currentUserId);

  if (isLoading) return <MessageListSkeleton count={12} />;

  if (!messageList || messageList.length === 0) return <></>;

  const listRef = useRef<List>(null);
  const sizeMap = useRef({});
  const setSize = useCallback((index: any, size: any) => {
    sizeMap.current = { ...sizeMap.current, [index]: size };
    listRef.current?.resetAfterIndex(index);
  }, []);
  const itemSize = (index: any) =>
    (sizeMap as { current: any }).current[index] + 8 || 110; // Added 8 to compensate for margin between 2 messages
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    listRef.current?.scrollToItem(messageList.length - 1, "smart"); //Passed index of the last item which will be len - 1
  }, [messageList]);

  return (
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => (
        <List
          className="List"
          height={height}
          itemCount={messageList.length}
          itemSize={itemSize} //Height of a single message
          width={width}
          outerElementType="ul"
          ref={listRef}
        >
          {({ index, style }) => (
            <li style={style}>
              <Row index={index} setSize={setSize} windowWidth={windowWidth}>
                <MessageComponent
                  key={messageList[index]!.id}
                  chatName={chatName}
                  message={messageList[index]!}
                  currentUserId={currentUserId!}
                />
              </Row>
            </li>
          )}
        </List>
      )}
    </AutoSizer>
  );
};
export default MessageList;
