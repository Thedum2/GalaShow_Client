import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function NotFoundPage(){
  return (
    <div className="space-y-3">
      <div className="text-3xl font-semibold">404</div>
      <div className="text-zinc-400">페이지를 찾을 수 없습니다.</div>
      <Link to={PATHS.root} className="inline-block rounded bg-zinc-800 px-3 py-1.5 text-sm">홈으로</Link>
    </div>
  );
}
