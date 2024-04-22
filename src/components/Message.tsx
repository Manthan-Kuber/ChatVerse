import type { Message as MessageType } from "@prisma/client";
import useLocalStorage from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";

type MessageProps = {
  message: MessageType;
  currentUserId: string;
  conversationId: string;
  chatName: string | null | undefined;
};

const Message = ({
  message,
  currentUserId,
  conversationId,
  chatName,
}: MessageProps) => {
  const isSender = currentUserId === message.senderId;
  const [symmetricKey, setSymmetricKey] = useLocalStorage(
    `symmetricKey_${conversationId!}`,
    ""
  );
  const [plainText, setplainText] = useState("")
  const messageCreationDate = new Date(message.createdAt)
    .toLocaleString(navigator.language, {
      timeStyle: "short",
      dateStyle: "short",
    })
    .replace(",", " ");
  const decryptMessage = async (message: string) => {
    const CryptoJS = (await import("crypto-js")).default;
    const bytes = CryptoJS.AES.decrypt(message, symmetricKey);
    setplainText(bytes.toString(CryptoJS.enc.Utf8))
    console.table({message,decryptedMessage:bytes.toString(CryptoJS.enc.Utf8)});
  };

  useEffect(() => {
    decryptMessage(message.body)
  }, [])
  

  return (
    <div
      className={`m-2 flex flex-col ${isSender ? "items-end" : "items-start"}`}
    >
      <div className="max-w-[75%] break-words rounded-md  p-4 shadow-lg dark:shadow-neutral-500/30">
        <div className="">
          <span
            className={`block ${isSender ? "text-lime-500" : "text-sky-500"}`}
          >
            {isSender ? "You" : chatName}
          </span>
        </div>
        <span>{plainText || message.body }</span>
      </div>
      <small className="max-w-full break-words">{messageCreationDate}</small>
    </div>
  );
};
export default Message;
