import type { IconType } from "react-icons";

const SocialIcon = ({ Icon, color }: { Icon: IconType; color: string }) => {
  return (
    <Icon className="h-5 w-5 text-neutral-600 dark:text-white" color={color} />
  );
};
export default SocialIcon;
