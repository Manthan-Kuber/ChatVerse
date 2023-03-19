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
      id="theme-changer"
      aria-label="theme-changer"
      onClick={() =>
        currTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
    >
      <CurrIcon className="btn-with-hover" />
    </button>
  );
};

export default ThemeChanger;
