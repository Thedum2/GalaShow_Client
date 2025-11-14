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
                {/* 질문 */}
                <p className="text-yellow-400 font-bold text-base mb-4">
                    {question}
                </p>

                {/* 게임 단계 박스 - API 데이터로 동적 생성 */}
                <div className="border-4 border-yellow-600 rounded-2xl p-4 space-y-3">
                    {descriptions.map((desc, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-900 font-black text-lg">{index + 1}</span>
                            </div>
                            <p className="text-white font-bold text-base flex-1 pt-2">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
