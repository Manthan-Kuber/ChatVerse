const GradientUnderline = ({ className }: { className?: string }) => (
  <div
    className={`h-1 w-full -skew-x-[36deg] bg-gradient-to-r from-lime-500 to-green-500 ${className}`}
  />
);

export default GradientUnderline;
