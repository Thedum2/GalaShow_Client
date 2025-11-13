import { PlatformIcon } from "@/components/common/PlatformIcon";
import { Icon } from "@/components/icons/Icon";
import type { PlatformType } from "@/types/common";

export interface Participant {
    id: string;
    name: string;
    platform: PlatformType;
}

interface EliminatedListProps {
    eliminated: Participant[];
}

export default function EliminatedList({ eliminated }: EliminatedListProps) {
    return (
        <div className="flex-[1] bg-black/40 rounded-3xl p-5 flex flex-col border-4 border-red-400 min-h-0">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Icon name="ShieldX" size={35} type="lucide" color="#EE0000"/>
                    <span className="text-white text-2xl font-bold">탈락</span>
                </div>
                <div className="bg-red-800 text-white px-4 py-1 rounded-full text-xl font-bold">
                    {eliminated.length}명
                </div>
            </div>

            {/* 참가자 목록 */}
            <div
                className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1 scrollbar-red"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#EE0000 transparent'
                }}
            >
                {eliminated.map((participant) => (
                    <div
                        key={participant.id}
                        className="bg-black rounded-xl px-4 py-3 flex items-center gap-3"
                    >
                        <PlatformIcon platform={participant.platform} size={32} />
                        <span className="text-white text-lg font-medium truncate">
                            {participant.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
