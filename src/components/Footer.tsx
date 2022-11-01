import { SiTailwindcss } from "react-icons/si";
import { SiNextdotjs } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="flex justify-center p-5 text-lg md:text-xl">
      Made with{" "}
      <span className="mx-1 flex items-center gap-1">
        {" "}
        <SiNextdotjs className="rounded-full bg-white text-black" /> and{" "}
        <SiTailwindcss className="text-sky-500" /> 
      </span>{" "}
      by{" "}
      <a
        className="ml-1 italic "
        href="https://github.com/Manthan-Kuber"
        target="_blank"
        rel="noreferer"
      >
        Manthan Kuber
      </a>
    </footer>
  );
};
export default Footer;
