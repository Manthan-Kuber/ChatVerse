import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import useWindowSize from "../hooks/useWindowSize";

export const ProfileImageSkeleton = () => {
  const { width: screenWidth } = useWindowSize();
  const skeletonDimensions =
    screenWidth && screenWidth >= 640 ? "48px" : "36px";
  return (
    <Skeleton
      style={{
        width: skeletonDimensions,
        height: skeletonDimensions,
        borderRadius: "0.5rem",
      }}
    />
  );
};

const ProfileImage = ({ image }: { image: string | null | undefined }) => {
  return (
    <div className="h-12 w-12">
      {image ? (
        <Image
          src={image}
          fill
          className="rounded-lg"
          alt="profile photo"
          referrerPolicy="no-referrer"
        />
      ) : (
        <ProfileImageSkeleton />
      )}
    </div>
  );
};
export default ProfileImage;
