// PolyChat 어댑터가 OAuth 팝업의 주소를 읽어 인증 결과를 가져간 뒤 이 창을 닫는다.
export default function OAuthCallback() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    const error = fragment.get("error") || query.get("error");
    const hasOpener = Boolean(window.opener);

    const message = error === "access_denied"
        ? "로그인이 취소되었거나 필요한 권한이 허용되지 않았습니다."
        : error
            ? "인증 요청에 실패했습니다. 원래 창에서 다시 시도해주세요."
            : hasOpener
                ? "로그인 결과를 확인하고 있습니다. 잠시 후 이 창이 자동으로 닫힙니다."
                : "갈라쇼 홈에서 로그인을 시작해주세요.";

    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-center text-white">
            <div className="flex max-w-sm flex-col items-center gap-4">
                <h1 className="text-2xl font-bold">{error ? "로그인을 완료하지 못했어요" : "갈라쇼 로그인"}</h1>
                <p className="text-white/70">{message}</p>
                {hasOpener ? (
                    <button className="rounded-xl bg-white/10 px-5 py-2 hover:bg-white/20" onClick={() => window.close()}>
                        창 닫기
                    </button>
                ) : (
                    <a className="rounded-xl bg-white/10 px-5 py-2 hover:bg-white/20" href="/">
                        홈으로 이동
                    </a>
                )}
            </div>
        </main>
    );
}
