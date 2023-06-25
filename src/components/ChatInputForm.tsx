import { motion } from "framer-motion";
import { type FormEvent, type KeyboardEvent, useRef, ChangeEvent } from "react";
import { type IconType } from "react-icons";
import { appearIntoView } from "../animations/animations";

const textAreaHeight = 43.6;

const ChatInputForm = (props: {
  handleSubmit: (
    e: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLTextAreaElement>
  ) => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  Icon: IconType;
  placeholder: string;
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const isDisabled = !(props.value.length > 0);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    props.setValue(e.target.value);
    if (
      textAreaRef.current &&
      textAreaRef.current.textLength <= textAreaHeight * 6
    ) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
        Math.max(textAreaRef.current.scrollHeight, textAreaHeight) + "px";
    }
  };

  return (
    <form
      className="relative flex items-end gap-4 "
      onSubmit={(e) => {
        if (textAreaRef.current) textAreaRef.current.style.height = "auto";
        props.handleSubmit(e);
      }}
    >
      <textarea
        className="no-scrollbar w-full resize-none rounded-md border-2 border-neutral-600 bg-neutral-500/10 px-4 py-2 pr-10 outline-none transition-transform duration-200 focus:border-lime-300"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => {
          handleChange(e);
        }}
        ref={textAreaRef}
        rows={1}
      />
      <motion.button
        className=" rounded-md bg-lime-400 p-3.5 transition-colors duration-200 hover:cursor-pointer hover:bg-lime-500 disabled:cursor-not-allowed disabled:bg-lime-600"
        type="submit"
        disabled={isDisabled}
        variants={appearIntoView}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <props.Icon className="h-4 w-4 text-white" />
      </motion.button>
    </form>
  );
};
export default ChatInputForm;
