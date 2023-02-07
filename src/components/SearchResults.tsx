import useSwr from "swr";
import type { UserSearch } from "../pages/api/search";
import Skeleton from "react-loading-skeleton";
import toast from "react-hot-toast";
import { fetcher } from "../utils/functions";
import ProfileImage, { ProfileImageSkeleton } from "./ProfileImage";

const SearchResultSkeleton = ({ count }: { count?: number }) => {
  return (
    <>
      {Array(count || 1)
        .fill(0)
        .map((_, index) => (
          <div
            className="w-full overflow-hidden rounded-md bg-neutral-500/10 px-4 py-2 outline-none transition-transform duration-200"
            key={index}
          >
            <div className="flex items-center gap-4">
              <ProfileImageSkeleton />
              <div className="w-full">
                <Skeleton className="block truncate" />
                <Skeleton className="block truncate" />
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

const SearchResults = ({
  searchQuery,
  userId,
}: {
  searchQuery: string;
  userId: string | undefined;
}) => {
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

  if (isLoading) return <SearchResultSkeleton count={2} />;

  if (!SearchedUsersArray) return null;

  return (
    <>
      {SearchedUsersArray.map((user) => (
        <div
          className="w-full overflow-hidden rounded-md bg-neutral-500/10 px-4 py-2 pr-10 outline-none transition-transform duration-200"
          key={user.id}
        >
          <div className="flex items-center gap-4">
            <ProfileImage image={user.image} />
            <div>
              <span className="block truncate">{user.name}</span>
              <span className="block truncate">{user.id}</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SearchResults;
