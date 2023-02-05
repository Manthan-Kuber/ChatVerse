import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, KeyboardEvent, useState } from "react";
import { IconType } from "react-icons";
import { appearIntoView } from "../animations/animations";

const ChatInputForm = (props: {
  handleSubmit: (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>
  ) => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  Icon: IconType;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form
      className="relative flex items-center gap-4 "
      onSubmit={props.handleSubmit}
    >
      <input
        className="w-full rounded-md bg-neutral-500/10 px-4 py-2 pr-10 outline-none transition-transform duration-200"
        placeholder={`Message channel name`}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        type="text"
        onKeyDown={(e) => e.key === "Enter" && props.handleSubmit(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <AnimatePresence>
        {(isFocused || props.value.length > 0) && (
          <motion.button
            className="absolute right-1 rounded-md bg-lime-400 p-2 transition-colors duration-200 hover:cursor-pointer hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-600"
            type="submit"
            disabled={!(props.value.length > 0)}
            variants={appearIntoView}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <props.Icon className="h-4 w-4 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </form>
  );
};
export default ChatInputForm;
