import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TbLogout } from "react-icons/tb";
import toast from "react-hot-toast";
import { type ChangeEvent, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import SearchResults from "./SearchResults";
import ChatOrUserInfo from "./ChatOrUserInfo";
import Skeleton from "react-loading-skeleton";
import { Tooltip } from "react-tooltip";
import ThemeChanger from "./ThemeChanger";
import useWindowSize from "../hooks/useWindowSize";
import GradientUnderline from "./GradientUnderline";

const spanClassName = "truncate font-mono text-sm";

const Sidebar = () => {
  const { data: session } = useSession();
  const { push } = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);
  const { width: screenWidth } = useWindowSize();
  const isScreenMedium = screenWidth && screenWidth < 768;

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
      ({ id, visible }) => (
        <div
          className={`-m-4 flex min-h-screen w-screen items-center justify-center opacity-0 backdrop-blur-md duration-200 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-fit rounded-lg border border-neutral-600 bg-white p-8 text-black duration-200 dark:bg-[#1c1b22] dark:text-white ${
              visible ? "scale-100 delay-200" : "scale-0 "
            } `}
          >
            <span className="block">Are you sure you want to signout ?</span>
            <div className="mt-8 flex justify-around">
              <button
                onClick={() => {
                  toast.dismiss(id);
                }}
                className="rounded-md border border-neutral-500 px-4 py-2 transition-colors duration-200 hover:bg-neutral-100  dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.remove(id);
                  handleSignOut();
                }}
                className="rounded-md border border-transparent bg-red-500 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-600"
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
    <div className="flex min-h-[calc(100vh-72px)] flex-col justify-between overflow-y-scroll p-2 sm:min-h-screen sm:py-8">
      <div>
        <a data-tooltip-id="userInfo-tooltip">
          <ChatOrUserInfo
            image={session?.user?.image}
            field1={session?.user?.name || <Skeleton />}
            field2={session?.user?.email || <Skeleton />}
            divClassName="border-neutral-600"
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
        <input
          className="mt-4 w-full truncate rounded-md border-2 border-neutral-600 bg-neutral-500/10 px-4 py-2 outline-none transition-all duration-200 focus:border-lime-300"
          placeholder="Search or start a new chat"
          value={value}
          onChange={handleSearch}
          onKeyDown={(e) => e.key === "Enter" && handleSearch}
        />
        <div className="mt-4 rounded-md border border-neutral-600 ">
          <div className=" border-b border-neutral-600 py-4 pl-2 text-lg sm:text-xl">
            <div className="w-fit">
              <h3>{value ? "Search Results" : "Chats"}</h3>
              <GradientUnderline />
            </div>
          </div>
          <div className="max-h-80 space-y-2 overflow-scroll p-2">
            <SearchResults setValue={setValue} searchQuery={debouncedValue} />
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-2 sm:mb-8">
        <button
          className="flex items-center gap-2 rounded-md border border-neutral-600 py-2 px-4 font-medium tracking-wider transition-colors duration-200 hover:border-red-500 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800 sm:text-lg"
          onClick={showDialogBox}
        >
          <span>SignOut</span>
          <TbLogout size={24} className="text-red-500" />
        </button>
        <ThemeChanger variant={isScreenMedium ? "medium" : "large"} />
      </div>
    </div>
  );
};
export default Sidebar;
