import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";

const ThemeButton = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const themeChanger = () => {
    if (!mounted) return null; //Render button only if component has mounted
    const currTheme = theme === "system" ? systemTheme : theme;

    if (currTheme === "dark")
      return (
        <button>
          <BsFillSunFill
            className="h-7 w-7"
            onClick={() => setTheme("light")}
          />
        </button>
      );
    else
      return (
        <button>
          <BsMoonFill className="h-7 w-7" onClick={() => setTheme("dark")} />
        </button>
      );
  };
  return <div className="absolute top-4 right-4">{themeChanger()}</div>;
};
export default ThemeButton;
