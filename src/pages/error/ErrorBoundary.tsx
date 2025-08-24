import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
export default function ErrorBoundary(){
  const err = useRouteError();
  if (isRouteErrorResponse(err)) {
    return <div className="space-y-2"><div className="text-xl font-semibold">Error {err.status}</div><div className="text-sm text-zinc-400">{err.statusText}</div></div>;
  }
  return <div className="text-sm text-red-300">알 수 없는 오류가 발생했습니다.</div>;
}
