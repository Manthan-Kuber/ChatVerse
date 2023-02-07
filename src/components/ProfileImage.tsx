import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import useWindowSize from "../hooks/useWindowSize";

const ProfileImage = ({ image }: { image: string | null | undefined }) => {
  const { width: screenWidth } = useWindowSize();
  const skeletonDimensions =
    screenWidth && screenWidth >= 640 ? "48px" : "36px";
  return (
    <>
      {image ? (
        <Image
          src={image}
          width={36}
          height={36}
          className="rounded-lg sm:h-12 sm:w-12"
          alt="profile photo"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Skeleton
          style={{
            width: skeletonDimensions,
            height: skeletonDimensions,
            borderRadius: "0.5rem",
          }}
        />
      )}
    </>
  );
};
export default ProfileImage;
