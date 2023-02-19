type MessageProps = {
  message: string;
  isSender: boolean;
};

const Message = ({ message, isSender }: MessageProps) => {
  return (
    <div className={`m-2 flex flex-col ${isSender && "items-end"} `}>
      <span
        className={`${
          isSender
            ? "justify-self-end rounded-br-md bg-lime-400 dark:bg-lime-500"
            : "float-left rounded-bl-md bg-gray-400 dark:bg-gray-500 "
        } w-fit rounded-full p-4`}
      >
        {message}
      </span>
      <small>11:47 pm</small>
    </div>
  );
};
export default Message;
