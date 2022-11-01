type ChatVerseTextProps = {
  textSize?: string;
  mdTextSize?: string;
  isCentered?: boolean;
};

type InputProps = {
  inputName: string;
  type?: "email";
  label: string;
  placeholder?: string;
  inputRef: MutableRefObject<undefined>;
};
