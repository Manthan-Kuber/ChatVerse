import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import SearchResults from "./SearchResults";
import ChatOrUserInfo from "./ChatOrUserInfo";
import Skeleton from "react-loading-skeleton";

const Sidebar = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
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

  const spanClassName =
    "scroll-smooth truncate font-mono text-sm hover:overflow-x-scroll";

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col justify-between px-2 py-8 sm:min-h-screen">
      <div>
        <ChatOrUserInfo
          image={session?.user?.image}
          field1={session?.user?.name || <Skeleton />}
          field2={session?.user?.email || <Skeleton />}
          spanClassName1={`${spanClassName} sm:text-lg`}
          spanClassName2={`${spanClassName} sm:text-base`}
        />
        <div className="mt-4">
          <input
            className="w-full truncate rounded-md bg-neutral-500/10 px-4 py-2 outline-none transition-transform duration-200"
            placeholder="Search or start a new chat"
            value={value}
            onChange={handleSearch}
            onKeyDown={(e) => e.key === "Enter" && handleSearch}
          />
        </div>
        <h3 className="mt-4 text-lg sm:text-xl">
          {value ? "Search Results" : "Chats"}
        </h3>
        <div className="mt-4 max-h-80 space-y-2 overflow-scroll">
          <SearchResults setIsOpen={setIsOpen} searchQuery={debouncedValue} />
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
