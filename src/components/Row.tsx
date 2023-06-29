import { ReactNode, useEffect, useRef } from "react";

type RowProps = {
  index: number;
  windowWidth: number | undefined;
  setSize: (index: any, size: any) => void;
  children: ReactNode;
};

/**
 * Component to represent each row of the list.
 * It calculates the height of each of the element of the list depending upon the width of the window as elements are resized depending upon the width of the window
 * 
 * @component
 * @example
 * return (
 *   <Row index={index} setSize={setSize} windowWidth={windowWidth} >{children}</Row>
 * )
 */

const Row = ({ index, setSize, windowWidth, children }: RowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSize(index, rowRef.current?.getBoundingClientRect().height);
  }, [setSize, index, windowWidth]);

  return <div ref={rowRef}>{children}</div>;
};

export default Row;
