import type { MouseEventHandler, ReactNode } from "react";
import ProfileImage from "./ProfileImage";

/**
 * @param {string} divClassName Classname for container
 * @param {string} spanClassName1 Classname for children of container (spans)
 *
 */

const ChatOrUserInfo = ({
  divClassName,
  spanClassName1,
  spanClassName2,
  ...props
}: {
  image: string | null | undefined;
  field1: string | ReactNode;
  field2: string | ReactNode;
  divClassName?: string;
  spanClassName1?: string;
  spanClassName2?: string;
  isOnline?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      className={`grid grid-cols-[auto_1fr] content-center items-center gap-4 rounded-md border bg-neutral-500/10 px-4 py-2 outline-none backdrop-blur-lg transition-transform duration-200 ${divClassName}`}
      onClick={props.onClick}
    >
      <div className="relative">
        <ProfileImage image={props.image} />
        {props.isOnline && (
          <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full border bg-green-400" />
        )}
      </div>
      <div className="max-w-full overflow-hidden ">
        <span className={`block truncate ${spanClassName1}`}>
          {props.field1}
        </span>
        <span className={`block truncate ${spanClassName2}`}>
          {props.field2}
        </span>
      </div>
    </div>
  );
};
export default ChatOrUserInfo;
