import { IconType } from "react-icons";

const SocialIcon = ({ Icon }: { Icon: IconType }) => {
  return (
    <div className="w-fit rounded-full border border-neutral-600 p-2 cursor-pointer dark:border-white">
      <Icon className="text-neutral-600 dark:text-white" />
    </div>
  );
};
export default SocialIcon;
