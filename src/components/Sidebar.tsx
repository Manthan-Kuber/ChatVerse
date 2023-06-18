import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BiLogOut } from "react-icons/bi";
import toast from "react-hot-toast";
import { type ChangeEvent, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import SearchResults from "./SearchResults";
import ChatOrUserInfo from "./ChatOrUserInfo";
import Skeleton from "react-loading-skeleton";
import { Tooltip } from "react-tooltip";

const spanClassName = "truncate font-mono text-sm";

const Sidebar = () => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  async function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  const showDialogBox = () => {
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
    toast.custom(
      ({ id }) => (
        <div className="flex min-h-screen min-w-full items-center justify-center backdrop-blur-md ">
          <div className="w-fit rounded-lg bg-white p-8 text-black">
            <span className="block">Are you sure you want to signout ?</span>
            <div className="mt-8 flex justify-around">
              <button
                onClick={() => toast.dismiss(id)}
                className="rounded-md border border-neutral-500 px-4 py-2 text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.dismiss(id);
                  handleSignOut();
                }}
                className="rounded-md border border-transparent bg-red-500 px-4 py-2 text-white"
              >
                Signout
              </button>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        id: "signoutDialogBox",
      }
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col justify-between overflow-y-scroll px-2 py-8 sm:min-h-screen">
      <div>
        <a data-tooltip-id="userInfo-tooltip">
          <ChatOrUserInfo
            image={session?.user?.image}
            field1={session?.user?.name || <Skeleton />}
            field2={session?.user?.email || <Skeleton />}
            divClassName="border-transparent"
            spanClassName1={`${spanClassName} sm:text-lg`}
            spanClassName2={`${spanClassName} sm:text-base`}
          />
        </a>
        <Tooltip id="userInfo-tooltip" place="bottom">
          <span>
            {session?.user?.name || <Skeleton />} <br />{" "}
            {session?.user?.email || <Skeleton />}{" "}
          </span>
        </Tooltip>
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
          <SearchResults setValue={setValue} searchQuery={debouncedValue} />
        </div>
      </div>
      <button
        className="mx-auto flex w-full max-w-xs items-center justify-center gap-4 rounded-md border border-red-500 p-2 font-medium tracking-wider text-red-500 transition-colors duration-200 hover:bg-red-500 hover:text-white sm:mb-8 sm:text-lg"
        onClick={showDialogBox}
      >
        <span>SignOut</span>
        <BiLogOut size={24} />
      </button>
    </div>
  );
};
export default Sidebar;
