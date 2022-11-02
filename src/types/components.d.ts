type ChatVerseTextProps = {
  textSize?: string;
  mdTextSize?: string;
  isCentered?: boolean;
};

type InputProps = {
  inputName: string;
  type?: "email" | "text";
  label: string;
  placeholder?: string;
  register: UseFormRegister<FieldValues>;
  isError: boolean;
  errorMessage:string;
};
