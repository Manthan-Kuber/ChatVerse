import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import { resetScroll } from "../utils/functions";
import { ChangeEvent, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import SearchResults from "./SearchResults";
import ProfileImage from "./ProfileImage";
import Skeleton from "react-loading-skeleton";

const Sidebar = () => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

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

  async function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return (
    <div className=" flex min-h-[calc(100vh-72px)] flex-col justify-between px-2 py-8 sm:min-h-screen">
      <div>
        <div className="grid grid-cols-[auto_1fr] content-center items-center gap-4 rounded-lg bg-neutral-500 bg-opacity-10 p-4 backdrop-blur-lg">
          <ProfileImage image={session?.user?.image} />
          <div className="w-full overflow-hidden ">
            <span
              onMouseLeave={resetScroll}
              className="block scroll-smooth truncate font-mono tracking-wider hover:overflow-x-scroll sm:text-lg"
            >
              {session?.user?.name || <Skeleton />}
            </span>
            <span
              onMouseLeave={resetScroll}
              className="block scroll-smooth truncate font-mono text-sm hover:overflow-x-scroll sm:text-base"
            >
              {session?.user?.email || <Skeleton />}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <input
            className="w-full rounded-md bg-neutral-500/10 px-4 py-2 truncate outline-none transition-transform duration-200"
            placeholder="Search or start a new chat"
            value={value}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearch}
          />
        </div>
        <div className="mt-4  max-h-80 space-y-4 overflow-scroll">
          <SearchResults
            searchQuery={debouncedValue}
            userId={session?.user?.id}
          />
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
