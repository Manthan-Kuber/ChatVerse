const GradientUnderline = ({
  className,
  height,
}: {
  className?: string;
  height?: string;
}) => (
  <div
    className={`${
      height ? height : "h-1"
    } w-full -skew-x-[36deg] bg-gradient-to-r from-lime-500 to-green-500 ${className}`}
  />
);

export default GradientUnderline;
