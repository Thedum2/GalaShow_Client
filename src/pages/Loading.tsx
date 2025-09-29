import React, { useEffect, useState } from "react";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const avatarUrl = 'https://yt3.googleusercontent.com/aBBmBfA_6zGskSPx65DMzPDbOczqRkl_FPj05OiUfsXD3AhE0jevgR0ERIH44J1wNGixAkztmfM=s900-c-k-c0x00ffffff-no-rj';
  

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 20);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-10">
        {/* 상단 브랜드 영역 */}
        <div className="flex items-center gap-10">
          {/* 아바타 */}
          <div className="relative h-[140px] w-[140px] rounded-full ring-4 ring-red-500 overflow-hidden">
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {/* X 구분 기호 */}
          <div className="text-7xl font-black select-none">×</div>

          {/* 갈라쇼 로고 텍스트 + 장식 아치 */}
          <Icon name="logo" s/>
        </div>

        {/* 진행 바 */}
        <div className="flex items-center gap-4 w-[560px] max-w-[80vw]">
          <div className="h-3 w-full rounded-full bg-white/20 border border-white/50 overflow-hidden">
            <div
              className="h-full bg-white transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-white/80 w-10 text-right">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

function Arc({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="70"
      height="40"
      viewBox="0 0 70 40"
      className={flip ? "-scale-x-100" : undefined}
      aria-hidden
    >
      <path
        d="M4 36 C 24 8, 46 8, 66 36"
        stroke="white"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="12 12"
      />
    </svg>
  );
}
