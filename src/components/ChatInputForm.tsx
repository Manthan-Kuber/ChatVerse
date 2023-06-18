import { AnimatePresence, motion } from "framer-motion";
import { type FormEvent, type KeyboardEvent, useState, useRef } from "react";
import { type IconType } from "react-icons";
import { appearIntoView } from "../animations/animations";

const ChatInputForm = (props: {
  handleSubmit: (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  Icon: IconType;
  placeholder: string;
  scrollIntoView: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = !(props.value.length > 0);

  return (
    <form
      className="relative flex items-center gap-4 "
      onSubmit={(e) => {
        if (textAreaRef.current) textAreaRef.current.style.height = "";
        props.handleSubmit(e);
      }}
    >
      <textarea
        className="w-full resize-none rounded-md bg-neutral-500/10 px-4 py-2 pr-10 outline-none transition-transform duration-200"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        onFocus={() => {
          setIsFocused(true);
          props.scrollIntoView();
        }}
        onBlur={() => setIsFocused(false)}
        ref={textAreaRef}
        onInput={() => {
          if (textAreaRef.current && textAreaRef.current.textLength <= 300) {
            textAreaRef.current.style.height = "";
            textAreaRef.current.style.height =
              Math.min(textAreaRef.current?.scrollHeight, 300) + "px";
          }
        }}
        rows={1}
      />
      <AnimatePresence>
        {(isFocused || !isDisabled) && (
          <motion.button
            className="absolute right-1 rounded-md bg-lime-400 p-2 transition-colors duration-200 hover:cursor-pointer hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-600"
            type="submit"
            disabled={isDisabled}
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
