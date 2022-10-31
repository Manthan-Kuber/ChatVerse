const ChatVerseText = ({
  textSize = "text-5xl",
  mdTextSize = "md:text-6xl",
}: ChatVerseTextProps) => {
  return (
    <h1
      className={`font-ubuntu ${textSize} font-extrabold leading-normal text-gray-700 dark:text-white ${mdTextSize}`}
    >
      Chat<span className="text-lime-300">Verse</span>
    </h1>
  );
};
export default ChatVerseText;
