import { PlatformIcon } from "@/components/common/PlatformIcon";
import { Icon } from "@/components/icons/Icon";
import type { PlatformType } from "@/types/common";

export interface MVPData {
    id: string;
    name: string;
    platform: PlatformType;
    achievement?: string;
    comment?: string;
}

interface RoundMVPProps {
    mvps: MVPData[];
    onGameEnd?: () => void;
    onNextRound?: () => void;
}

export default function RoundMVP({ mvps, onGameEnd, onNextRound }: RoundMVPProps) {
    return (
        <div className="flex-[2] bg-black/40 rounded-3xl p-8 flex flex-col min-h-0 border-2 border-white">
            {/* MVP 헤더 */}
            <div className="flex flex-col items-center mb-8 gap-3">
                <Icon name="crown" size={140} mode="eager" />
                <h2 className="text-yellow-400 text-5xl font-black">라운드 MVP</h2>
            </div>

            {/* MVP 목록 */}
            <div
                className="flex-1 space-y-6 overflow-y-auto min-h-0 bg-gray-700 p-5 rounded-xl pr-6 scrollbar-yellow"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#FACC15 transparent'
                }}
            >
                {mvps.map((mvp) => (
                    <div key={mvp.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                            <PlatformIcon platform={mvp.platform} size={40} />
                            <span className="text-white text-2xl font-bold">{mvp.name}</span>
                        </div>
                        <div className="bg-black/90 rounded-xl px-5 py-3">
                            {mvp.comment && (
                                <p className="text-white text-lg font-medium mb-1">{mvp.comment}</p>
                            )}
                            {mvp.achievement && (
                                <p className="text-yellow-400 text-xl font-bold">{mvp.achievement}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* 하단 버튼 */}
            <div className="flex gap-4 mt-6">
                <button
                    onClick={onGameEnd}
                    className="flex-1 bg-red-400 hover:bg-red-500 rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors"
                >
                    <span className="text-black text-xl font-black">✗</span>
                    <span className="text-black text-xl font-black">게임 그만하기</span>
                </button>
                <button
                    onClick={onNextRound}
                    className="flex-1 bg-green-400 hover:bg-green-500 rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors"
                >
                    <span className="text-black text-xl font-black">▶</span>
                    <span className="text-black text-xl font-black">다음 라운드로</span>
                </button>
            </div>
        </div>
    );
}
