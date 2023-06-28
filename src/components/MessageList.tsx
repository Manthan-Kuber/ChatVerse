import { type Message as MessageType } from "@prisma/client";
import Skeleton from "react-loading-skeleton";
import MessageComponent from "./Message";
import { GetChats } from "../server/common/getChats";
import { getChatName } from "../utils/functions";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

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
  messagesEndRef: React.MutableRefObject<HTMLDivElement | null>;
};

const MessageList = ({
  messageList,
  isLoading,
  messagesEndRef,
  currentUserId,
  currentChat,
}: MessageListProps) => {
  const chatName = getChatName(currentChat, currentUserId);

  if (isLoading) return <MessageListSkeleton count={12} />;

  if (!messageList || messageList.length === 0) return <></>;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="List"
          height={height}
          itemCount={messageList.length}
          itemSize={100} //Height of a single message
          width={width}
          outerElementType="ul"
        >
          {({ index, style }) => (
            <li style={style}>
              <MessageComponent
                key={messageList[index]!.id}
                chatName={chatName}
                message={messageList[index]!}
                currentUserId={currentUserId!}
              />
            </li>
          )}
        </List>
      )}
    </AutoSizer>
    // TODO: Scroll to end of div
  );
};
export default MessageList;
