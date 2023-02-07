import Image from "next/image";

const ProfileImage = ({ image }: { image: string | null | undefined }) => {
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
        <div className="h-9 w-9 animate-pulse rounded-lg bg-neutral-500 sm:h-12 sm:w-12 " />
      )}
    </>
  );
};
export default ProfileImage;
