import ChatVerseText from "./ChatVerseText";

const ChatVerseLoader = ({ fullScreen }: { fullScreen?: boolean }) => {
  return (
    <div
      className={`grid ${
        fullScreen ? "min-h-screen" : "min-h-[calc(100vh-9rem)]"
      } w-full  place-items-center text-2xl`}
    >
      <ChatVerseText className="animate-pulse" />
    </div>
  );
};
export default ChatVerseLoader;
