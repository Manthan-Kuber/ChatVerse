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
            className="flex w-full items-center gap-4 overflow-hidden rounded-md bg-neutral-500/10 px-4 py-2 outline-none transition-transform duration-200"
            key={index}
          >
            <ProfileImageSkeleton />
            <div className="w-full">
              <Skeleton className="block truncate" />
              <Skeleton className="block truncate" />
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
    searchQuery
      ? `http://localhost:3000/api/search?searchQuery=${searchQuery}&userId=${userId}`
      : null,
    fetcher
  );

  if (error) {
    toast.remove();
    toast.error(error.message);
    return null;
  }

  if (isLoading) return <SearchResultSkeleton count={4} />;

  //TODO Return active conversations here
  if (!SearchedUsersArray) return null;

  if (SearchedUsersArray.length === 0)
    return <p className="text-center">No results found</p>;

  return (
    <>
      {SearchedUsersArray.map((user) => (
        <div
          className="grid grid-cols-[auto_1fr] items-center gap-4 rounded-md bg-neutral-500/10 px-4 py-2 outline-none transition-transform duration-200"
          key={user.id}
        >
          {/*  TODO Handle overflowing text */}
          <ProfileImage image={user.image} />
          <div className="max-w-full overflow-hidden ">
            <span className="block truncate">{user.name}</span>
            <span className="block truncate">~ {user.email}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default SearchResults;