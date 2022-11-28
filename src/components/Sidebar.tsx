import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import Image from "next/image";
import { resetScroll } from "../utils/functions";

const Sidebar = () => {
  const { data: session } = useSession();
  const { push } = useRouter();

  function handleSignOut() {
    const signOutPromise = signOut({
      redirect: false,
      callbackUrl: "/auth/signin",
    });
    toast.promise(signOutPromise, {
      loading: "Signing Out...",
      success: (data) => {
        push(data.url);
        return "Signed Out Successfully";
      },
      error: (err) =>
        `Encountered an error while Signing Out: ${err.toString()}`,
    });
  }

  return (
    <div className=" flex min-h-[calc(100vh-72px)] flex-col justify-between px-2 py-8 dark:bg-[#1c1b22] sm:min-h-screen ">
      <div className="flex items-center gap-4 rounded-lg bg-neutral-500 bg-opacity-10 p-4 backdrop-blur-lg">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            width={36}
            height={36}
            className="rounded-lg sm:h-12 sm:w-12"
            alt="profile photo"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-9 w-9 animate-pulse rounded-lg bg-neutral-500 sm:h-12 sm:w-12 " />
        )}
        <div className="w-full overflow-hidden ">
          {session?.user?.name ? (
            <span
              onMouseLeave={resetScroll}
              className="block scroll-smooth truncate font-mono tracking-wider hover:overflow-x-scroll sm:text-lg"
            >
              {session.user.name}
            </span>
          ) : (
            <div className="h-4 animate-pulse rounded-sm bg-neutral-500 " />
          )}
          {session?.user?.email ? (
            <span
              onMouseLeave={resetScroll}
              className="block scroll-smooth truncate font-mono text-sm hover:overflow-x-scroll sm:text-base"
            >
              {session.user.email}
            </span>
          ) : (
            <div className="mt-1 h-4 animate-pulse rounded-sm bg-neutral-500" />
          )}
        </div>
      </div>
      <button
        className="mx-auto flex w-full max-w-xs items-center justify-center gap-4 rounded-md border border-red-500 p-2 font-medium tracking-wider text-red-500 transition-colors duration-200 hover:bg-red-500 hover:text-white sm:mb-8 sm:text-lg"
        onClick={handleSignOut}
      >
        <span>SignOut</span>
        <BiLogOut size={24} />
      </button>
    </div>
  );
};
export default Sidebar;
