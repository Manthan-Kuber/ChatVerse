import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import ThemeButton from "./ThemeButton";

const ThemeChanger = ({
  variant = "large",
}: {
  variant?: "small" | "medium" | "large";
}) => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; //Render button only if component has mounted

  const currTheme = theme === "system" ? systemTheme : theme;

  const CurrIcon =
    currTheme === "dark" ? MdOutlineLightMode : MdOutlineDarkMode;

  if (variant === "small") {
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
  }

  return (
    <div className="flex gap-1 rounded-md border border-neutral-600 p-1">
      <ThemeButton
        onClick={() => {
          setTheme("light");
        }}
        ThemeIcon={MdOutlineLightMode}
        ThemeLabel="Light"
        isCurrentTheme={currTheme === "light"}
        paddingClassName={variant === "medium" ? "py-1 px-2" : "py-2 px-4"}
      />
      <ThemeButton
        onClick={() => {
          setTheme("dark");
        }}
        ThemeIcon={MdOutlineDarkMode}
        ThemeLabel="Dark"
        isCurrentTheme={currTheme === "dark"}
        paddingClassName={variant === "medium" ? "py-1 px-2" : "py-2 px-4"}
      />
    </div>
  );
};

export default ThemeChanger;
