import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";
import ChatVerseText from "./ChatVerseText";

const Header = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeChanger = () => {
    if (!mounted) return null; //Render button only if component has mounted
    const currTheme = theme === "system" ? systemTheme : theme;

    const currIcon =
      currTheme === "dark" ? (
        <BsFillSunFill className="h-7 w-7" />
      ) : (
        <BsMoonFill className="h-7 w-7" />
      );

    return (
      <button
        onClick={() =>
          currTheme === "dark" ? setTheme("light") : setTheme("dark")
        }
      >
        {currIcon}
      </button>
    );
  };

  return (
    <header className=" flex w-full items-center justify-between p-4">
      <ChatVerseText textSize="text-2xl" mdTextSize="md:text-3xl" />
      <div>{themeChanger()}</div>
    </header>
  );
};
export default Header;
