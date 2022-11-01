import { MdEmail } from "react-icons/md";

const Input = ({ inputName, label,placeholder }: InputProps) => {
  return (
    <div className="mt-4  relative">
      <label htmlFor={inputName}>
        <span className="font-semibold tracking-wide " >
          {label}
          <MdEmail className="absolute bottom-[11px] left-3 w-5 h-5"  />
        </span>
        <input
          id={inputName}
          name={inputName}
          className="mt-1 w-full rounded-lg border border-neutral-500 py-2 px-10"
          placeholder={placeholder}
        />
      </label>
    </div>
  );
};
export default Input;
