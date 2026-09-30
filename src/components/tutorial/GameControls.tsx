import Icon from "@/components/icons/Icon";

export interface ChoiceSection {
    title: string;
    titleColor: "blue" | "red" | "green" | "yellow" | "purple" | "pink";
    options: string[];
}

interface GameControlsProps {
    choices: ChoiceSection[];
    onRestart?: () => void;
    onStart?: () => void;
    restartLabel?: string;
    startLabel?: string;
    restartDisabled?: boolean;
    startDisabled?: boolean;
}

const titleColorMap = {
    blue: "text-blue-400",
    red: "text-red-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
    purple: "text-purple-400",
    pink: "text-pink-400"
};

export default function GameControls({
    choices,
    onRestart,
    onStart,
    restartLabel = "다시 연습하기",
    startLabel = "시작하기",
    restartDisabled = false,
    startDisabled = false,
}: GameControlsProps) {
    return (
        <div className="h-[130px] w-full flex gap-4">
            {/* 선택지 섹션들 */}
            {choices.map((choice, idx) => (
                <div key={idx} className="flex-1 bg-gray-700 rounded-2xl p-4 flex flex-col">
                    <div className={`${titleColorMap[choice.titleColor]} text-xl font-bold mb-3`}>
                        {choice.title}
                    </div>
                    <div className="flex gap-2 flex-1 items-center">
                        {choice.options.map((option, index) => (
                            <button
                                key={index}
                                className="flex-1 bg-gray-800 hover:bg-gray-600 text-white rounded-xl py-3 font-bold text-lg transition-colors border-2 border-gray-600"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}

            {/* 우측 버튼 영역 */}
            <div className="w-[200px] flex flex-col gap-3">
                {onRestart && (
                <button
                    onClick={onRestart}
                    disabled={restartDisabled}
                    className="flex-1 bg-pink-800 hover:bg-pink-900 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <Icon name="RotateCcw" type="lucide" size={25} color="#ffffffff" />
                    <span>{restartLabel}</span>
                </button>
                )}
                <button
                    onClick={onStart}
                    disabled={startDisabled}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <Icon name="LandPlot" type="lucide" size={25} color="#fde047" />
                    <span>{startLabel}</span>
                </button>
            </div>
        </div>
    );
}
