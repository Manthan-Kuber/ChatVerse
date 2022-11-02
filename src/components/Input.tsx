import { MdEmail } from "react-icons/md";

const Input = ({
  inputName,
  label,
  placeholder,
  register,
  isError,
  errorMessage,
  type = "text",
}: InputProps) => {
  return (
    <>
      <div className="relative">
        <label htmlFor={inputName}>
          <span className="font-semibold tracking-wide text-gray-700 dark:text-white">
            {label}
            <MdEmail className="absolute  bottom-[11px] left-3 h-5 w-5 text-neutral-400" />
          </span>
          <input
            {...register(inputName)}
            className="mt-1 w-full rounded-lg border border-neutral-500 py-2 px-10 focus:border-transparent
             "
            placeholder={placeholder}
            name={inputName}
            type={type}
          />
        </label>
      </div>
      {isError && <small className="mt-2 text-red-500"> {errorMessage}</small>}
    </>
  );
};
export default Input;
