import { PlatformIcon } from "@/components/common/PlatformIcon";
import { Icon } from "@/components/icons/Icon";
import type { PlatformType } from "@/types/common";

export interface Participant {
    id: string;
    name: string;
    platform: PlatformType;
}

interface SurvivorsListProps {
    survivors: Participant[];
}

export default function SurvivorsList({ survivors }: SurvivorsListProps) {
    return (
        <div className="flex-[1] bg-black/40 rounded-3xl p-5 flex flex-col border-4 border-green-400 min-h-0">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Icon name="CircleCheckBig" size={35} type="lucide" color="#45E175"/>
                    <span className="text-white text-2xl font-bold">생존</span>
                </div>
                <div className="bg-green-800 text-white px-4 py-1 rounded-full text-xl font-bold">
                    {survivors.length}명
                </div>
            </div>

            {/* 참가자 목록 */}
            <div
                className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1 scrollbar-green"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#45E175 transparent'
                }}
            >
                {survivors.map((participant) => (
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
