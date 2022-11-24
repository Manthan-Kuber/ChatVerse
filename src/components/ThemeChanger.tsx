import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";

const ThemeChanger = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; //Render button only if component has mounted

  const currTheme = theme === "system" ? systemTheme : theme;

  const CurrIcon = currTheme === "dark" ? BsFillSunFill : BsMoonFill;

  return (
    <button
      onClick={() =>
        currTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
    >
      <CurrIcon className="h-10 w-10 rounded-full p-2 transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-500 " />
    </button>
  );
};

export default ThemeChanger;
