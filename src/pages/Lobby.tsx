import React from 'react';

const Box = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
  <div className={`border-2 border-yellow-500 rounded-xl flex items-center justify-center text-white w-full h-full ${className}`}>
    {children}
  </div>
);

export default function Lobby() {
  return (
    <div className="flex w-full h-full text-white overflow-hidden gap-[35px]">
      {/* Left Section (Ratio 4) */}
      <div className="grow-[4] basis-0 flex flex-col gap-[35px]">
        {/* Top part (Ratio 1) */}
        <div className="grow-[1] basis-0 flex gap-[35px]">
          <div className="grow-[1.3] basis-0">
            <Box>1</Box>
          </div>
          <div className="grow-[1] basis-0">
            <Box>2</Box>
          </div>
        </div>
        {/* Bottom part (Ratio 2) */}
        <div className="grow-[2] basis-0">
          <Box>3</Box>
        </div>
      </div>

      {/* Center Section (Ratio 3) */}
      <div className="grow-[3] basis-0 flex flex-col gap-[35px]">
        <div className="grow-[3] basis-0">
          <Box>4</Box>
        </div>
        <div className="grow-[2] basis-0">
          <Box>5</Box>
        </div>
        <div className="grow-[1] basis-0">
          <Box>6</Box>
        </div>
      </div>

      {/* Right Section (Ratio 1) */}
      <div className="grow-[1] basis-0">
        <Box>7</Box>
      </div>
    </div>
  );
}
