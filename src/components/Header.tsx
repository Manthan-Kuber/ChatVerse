import Link from "next/link";
import ChatVerseText from "./ChatVerseText";
import ThemeChanger from "./ThemeChanger";

const Header = () => {
  return (
    <header className=" mx-auto flex w-full max-w-7xl items-center justify-between p-4">
      <Link href="/">
        <ChatVerseText textSize="text-2xl" mdTextSize="md:text-3xl" />
      </Link>
      <ThemeChanger variant="small" />
    </header>
  );
};
export default Header;
