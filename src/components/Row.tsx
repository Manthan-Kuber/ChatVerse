import { Message } from "@prisma/client";
import { useEffect, useRef } from "react";
import MessageComponent from "./Message";

type RowProps = {
  index: number;
  messageList: Message[];
  chatName: string | null | undefined;
  windowWidth: number | undefined;
  setSize: (index: any, size: any) => void;
  currentUserId: string | null
};

const Row = ({
  messageList,
  index,
  setSize,
  windowWidth,
  chatName,
  currentUserId
}: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSize(index, rowRef.current?.getBoundingClientRect().height);
  }, [setSize, index, windowWidth]);

  return (
    <div ref={rowRef}>
      <MessageComponent
        key={messageList[index]!.id}
        chatName={chatName}
        message={messageList[index]!}
        currentUserId={currentUserId!}
      />
    </div>
  );
};

export default Row;
