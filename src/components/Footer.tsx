import {
  SiTailwindcss,
  SiNextdotjs,
  SiPrisma,
  SiTypescript,
  SiSupabase,
} from "react-icons/si";
import GradientUnderline from "./GradientUnderline";

const techStackList = [
  {
    id: 0,
    Icon: SiTypescript,
    className:
      "text-[#3178c6] bg-white border-[0.5px] rounded-sm overflow-hidden",
  },
  {
    id: 1,
    Icon: SiNextdotjs,
    className: "rounded-full border bg-white text-black",
  },
  { id: 2, Icon: SiSupabase, className: "text-[#3dcf8f]" },
  { id: 3, Icon: SiPrisma, className: "" },
  { id: 4, Icon: SiTailwindcss, className: "text-sky-500" },
].map(({ Icon, id, className }) => (
  <li key={id}>
    <Icon className={className} />
  </li>
));

const Footer = () => {
  return (
    <footer className="flex items-center justify-center p-5 text-lg md:text-xl ">
      <span className="text-xs xs:text-sm  sm:text-lg">Made with</span>
      <ul className="mx-2 flex items-center gap-2">{techStackList}</ul>
      <span className="text-xs xs:text-sm  sm:text-lg">by</span>
      <div
        className="ml-1 italic"
        // href="https://github.com/Manthan-Kuber"
        // target="_blank"
        // rel="noopener noreferrer"
      >
        {/* TODO: Add underline animation on hover */}
        <div className="group w-fit">
          <span className="text-xs xs:text-sm sm:text-lg">Siuussy Bakas</span>
          <GradientUnderline
            className="w-0 transition-all duration-200 group-hover:w-full"
            height="h-0.5"
          />
        </div>
      </div>
    </footer>
  );
};
export default Footer;
