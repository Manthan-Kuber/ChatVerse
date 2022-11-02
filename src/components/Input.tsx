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
          <span className="font-semibold tracking-wide text-neutral-700 dark:text-white">
            {label}
            <MdEmail className="absolute  bottom-[11px] left-3 h-5 w-5 text-neutral-400" />
          </span>
          <input
            {...register(inputName)}
            className={`mt-1 w-full rounded-lg border-2 ${
              isError
                ? "border-red-500 focus:border-red-500"
                : "border-neutral-500 focus:border-lime-300"
            } py-2 px-10 focus:border-transparent focus:outline-none
            `}
            placeholder={placeholder}
            name={inputName}
            type={type}
          />
        </label>
      </div>
      {isError && (
        <small className="mt-2 font-medium text-red-500"> {errorMessage}</small>
      )}
    </>
  );
};
export default Input;
