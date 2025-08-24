import React from "react";

export default function MainPage() {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 text-zinc-100">
        <h1 className="text-3xl font-semibold tracking-tight">GalaShow — Main</h1>
        <p className="mt-2 text-zinc-400">필요한 기능을 카드/섹션으로 추가하며 확장하세요.</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="text-lg font-medium text-zinc-100">Welcome</div>
          <div className="mt-1 text-sm text-zinc-400">메인 페이지 기본 템플릿</div>
        </div>
      </section>
    </div>
  );
}
