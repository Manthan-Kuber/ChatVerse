import { MouseEventHandler } from "react";
import { IconType } from "react-icons";

interface Props {
  onClick: MouseEventHandler<HTMLButtonElement>;
  ThemeIcon: IconType;
  ThemeLabel: string;
  isCurrentTheme: boolean;
}
const ThemeButton = ({ onClick, ThemeIcon, ThemeLabel, ...props }: Props) => {
  return (
    <button
      id="theme-changer"
      aria-label="theme-changer"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-md py-2 px-4 transition-colors duration-200 hover:bg-neutral-300 dark:hover:bg-neutral-300/10 ${props.isCurrentTheme ? "dark:bg-neutral-400/10 bg-neutral-700/10 " : "text-neutral-500"} `}
    >
      <ThemeIcon className="h-6 w-6" />
      <span>{ThemeLabel}</span>
    </button>
  );
};
export default ThemeButton;
