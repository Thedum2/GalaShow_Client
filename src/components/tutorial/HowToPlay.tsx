interface HowToPlayProps {
    title: string;
    subtitle: string;
    icon: string;
    descriptions: string[];
    question: string;
}

export default function HowToPlay({
    title,
    subtitle,
    icon,
    descriptions,
    question
}: HowToPlayProps) {
    return (
        <div className="w-full flex flex-col overflow-hidden rounded-2xl shadow-2xl min-h-0">
            {/* 타이틀 영역 */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-6 py-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl font-black text-gray-900 flex items-center justify-center gap-2">
                        <span>{icon}</span>
                        <span>{title}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{subtitle}</div>
                </div>
            </div>

            {/* 내용 영역 */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 flex-1 px-6 py-5 overflow-y-auto">
                {/* 설명 텍스트 */}
                <div className="text-gray-300 text-sm mb-3 space-y-1">
                    {descriptions.map((desc, index) => (
                        <p key={index}>{desc}</p>
                    ))}
                </div>

                {/* 질문 */}
                <p className="text-yellow-400 font-bold text-base mb-4">
                    {question}
                </p>

                {/* 게임 단계 박스 */}
                <div className="border-4 border-yellow-600 rounded-2xl p-4 space-y-3">
                    {/* 단계 1 */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-900 font-black text-lg">1</span>
                        </div>
                        <p className="text-white font-bold text-base">질문이 공개됩니다!</p>
                    </div>

                    {/* 단계 2 */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-900 font-black text-lg">2</span>
                        </div>
                        <p className="text-white font-bold text-base">
                            30초 안에 <span className="text-blue-400">1명</span> 또는{" "}
                            <span className="text-red-500">5명</span>을 선택
                        </p>
                    </div>

                    {/* 단계 3 */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-900 font-black text-lg">3</span>
                        </div>
                        <p className="text-white font-bold text-base">스트리머의 선택 시간!</p>
                    </div>

                    {/* 단계 4 */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-900 font-black text-lg">4</span>
                        </div>
                        <p className="text-white font-bold text-base">
                            스트리머와 <span className="text-green-400">같은 선택 = 생존</span>
                        </p>
                    </div>

                    {/* 단계 5 */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-900 font-black text-lg">5</span>
                        </div>
                        <p className="text-white font-bold text-base">
                            <span className="text-red-500">다른 선택 or 미선택 = 탈락</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
