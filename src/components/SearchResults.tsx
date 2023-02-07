import useSwr from "swr";
import type { UserSearch } from "../pages/api/search";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { fetcher } from "../utils/functions";

const SearchResults = ({
  searchQuery,
  userId,
}: {
  searchQuery: string;
  userId: string | undefined;
}) => {
  const { theme } = useTheme();
  const {
    data: SearchedUsersArray,
    error,
    isLoading,
  } = useSwr<UserSearch, { message: string }>(
    searchQuery !== ""
      ? `http://localhost:3000/api/search?searchQuery=${searchQuery}&userId=${userId}`
      : null,
    fetcher
  );

  if (error) {
    toast.remove();
    toast.error(error.message);
    return null;
  }

  if (!SearchedUsersArray) return null;

  return (
    <>
      {SearchedUsersArray.map((user) => (
        <div
          className="w-full overflow-hidden rounded-md bg-neutral-500/10 px-4 py-2 pr-10 outline-none transition-transform duration-200"
          key={user.id}
        >
          <span className="block truncate">
            {isLoading ? (
              <Skeleton
                baseColor={
                  theme === "dark" ? "rgb(163 163 163 / 0.1)" : "#ebebeb"
                }
                highlightColor={
                  theme === "dark"
                    ? "rgb(163 163 163 / 0.1)"
                    : "rgb(115 115 115 / 0.1)"
                }
              />
            ) : (
              user.name
            )}
          </span>
          <span className="block truncate">
            {isLoading ? (
              <Skeleton
                baseColor={
                  theme === "dark" ? "rgb(163 163 163 / 0.1)" : "#ebebeb"
                }
                highlightColor={
                  theme === "dark"
                    ? "rgb(163 163 163 / 0.1)"
                    : "rgb(115 115 115 / 0.1)"
                }
              />
            ) : (
              user.email
            )}
          </span>
        </div>
      ))}
    </>
  );
};

export default SearchResults
