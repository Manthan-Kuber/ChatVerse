import { ReactNode, useEffect, useRef } from "react";

type RowProps = {
  index: number;
  windowWidth: number | undefined;
  setSize: (index: any, size: any) => void;
  children: ReactNode;
};

const Row = ({ index, setSize, windowWidth, children }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSize(index, rowRef.current?.getBoundingClientRect().height);
  }, [setSize, index, windowWidth]);

  return <div ref={rowRef}>{children}</div>;
};

export default Row;
