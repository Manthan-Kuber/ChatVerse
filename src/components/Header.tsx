import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ChatVerseText from "./ChatVerseText";
import ThemeChanger from "./ThemeChanger";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className=" flex w-full items-center justify-between p-4">
      <Link href="/">
        <ChatVerseText textSize="text-2xl" mdTextSize="md:text-3xl" />
      </Link>
      <div className="flex items-center ">
        {/* If you need to redirect to another page but you want to avoid a page reload, you can try: const data = await signOut({redirect: false, callbackUrl: "/foo"}) where data.url is the validated URL you can redirect the user to without any flicker by using Next.js's useRouter().push(data.url) */}
        {/* TODO Remove later */}
        {session && session.user?.name}
        {/* TODO Move to sidebar */}
        {session && (
          <button onClick={() => signOut({ redirect: false })}>Logout</button>
        )}
        <div>
          <ThemeChanger />
        </div>
      </div>
    </header>
  );
};
export default Header;
