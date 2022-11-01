import { IconType } from "react-icons";

const SocialIcon = ({ Icon }: { Icon: IconType }) => {
  return (
    <div className="w-fit cursor-pointer rounded-full border border-neutral-600 p-2 transition-all duration-200 hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-600">
      <Icon className="text-neutral-600  dark:text-white" />
    </div>
  );
};
export default SocialIcon;
