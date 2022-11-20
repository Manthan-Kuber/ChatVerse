import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsMoonFill, BsFillSunFill } from "react-icons/bs";
import ChatVerseText from "./ChatVerseText";

const Header = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeChanger = () => {
    if (!mounted) return null; //Render button only if component has mounted
    const currTheme = theme === "system" ? systemTheme : theme;

    const currIcon =
      currTheme === "dark" ? (
        <BsFillSunFill className="h-10 w-10 rounded-full p-2 transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-500 " />
      ) : (
        <BsMoonFill className="h-10 w-10 rounded-full p-2 transition-colors duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-500 " />
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
      <Link href="/">
        <ChatVerseText textSize="text-2xl" mdTextSize="md:text-3xl" />
      </Link>
      <div className="flex items-center ">
        {/* Logout button to be added here */}
        {/* If you need to redirect to another page but you want to avoid a page reload, you can try: const data = await signOut({redirect: false, callbackUrl: "/foo"}) where data.url is the validated URL you can redirect the user to without any flicker by using Next.js's useRouter().push(data.url) */}
        {/* TODO Styling for name */}
        {session && session.user?.name}
        {/* TODO Change Logout Button Styles */}
        {session && (
          <button onClick={() => signOut({ redirect: false })}>Logout</button>
        )}
        <div>{themeChanger()}</div>
      </div>
    </header>
  );
};
export default Header;
