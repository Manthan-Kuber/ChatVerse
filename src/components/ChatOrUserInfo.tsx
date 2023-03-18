import type { MouseEventHandler, ReactNode } from "react";
import { resetScroll } from "../utils/functions";
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
  onClick?: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      className={`grid grid-cols-[auto_1fr] content-center items-center gap-4 rounded-md bg-neutral-500/10 px-4 py-2 outline-none backdrop-blur-lg transition-transform duration-200 ${divClassName}`}
      onClick={props.onClick}
    >
      <ProfileImage image={props.image} />
      <div className="max-w-full overflow-hidden ">
        <span
          className={`block truncate ${spanClassName1}`}
          onMouseLeave={resetScroll}
        >
          {props.field1}
        </span>
        <span
          className={`block truncate ${spanClassName2}`}
          onMouseLeave={resetScroll}
        >
          {props.field2}
        </span>
      </div>
    </div>
  );
};
export default ChatOrUserInfo;
