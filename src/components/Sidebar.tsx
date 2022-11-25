import { useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import Loader from "./Loader";

const Sidebar = () => {
  const { data: session } = useSession();
  return (
    <div className=" flex min-h-[calc(100vh-72px)] flex-col justify-between px-4 py-8 sm:border-x-2">
      <div className="flex items-center gap-4 rounded-lg bg-neutral-400 bg-opacity-10 p-4 backdrop-blur-lg">
        {session && session.user && session.user.image ? (
          <img
            src={session.user.image}
            className="h-8 w-8 rounded-lg sm:h-12 sm:w-12"
            alt="profile photo"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-8 w-8 animate-pulse rounded-lg bg-neutral-500 sm:h-12 sm:w-12 " />
        )}
        {/* FIXME Fix overflowing text */}
        <div className="w-full">
          {session && session.user && session.user.name ? (
            <span className="text-md block font-mono tracking-wider sm:text-lg">
              {session.user.name}
            </span>
          ) : (
            <div className="h-4 animate-pulse rounded-sm bg-neutral-500 " />
          )}
          {session && session.user && session.user.email ? (
            <span className="block font-mono text-sm sm:text-base">
              {session.user.email}
            </span>
          ) : (
            <div className="mt-1 h-4 animate-pulse rounded-sm bg-neutral-500" />
          )}
        </div>
      </div>
      {/* Logout btn  */}
      <button className="mx-auto flex w-full items-center justify-center gap-4 rounded-md border border-red-500 p-4 text-xl font-semibold tracking-wider text-red-500 transition-colors duration-200 hover:bg-red-500 hover:text-white">
        <span>Logout</span>
        <BiLogOut size={24} />
      </button>
    </div>
  );
};
export default Sidebar;
