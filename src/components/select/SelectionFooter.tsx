import React from "react";
import { Icon } from "@/components/icons/Icon";

const SelectionFooter: React.FC = () => {
    return (
        <div className="h-[165px] w-full flex justify-between">
            {/* 왼쪽 박스 - 투표 안내 */}
            <div className="w-[450px] h-full bg-gray-800/50 rounded-lg px-6 py-4 flex flex-col justify-center gap-1.5">
                <div className="flex items-center gap-2">
                    <Icon name="MessageCircle" type="lucide" size={24} className="text-yellow-400" />
                    <h3 className="text-yellow-400 text-3xl font-bold">민심 확인을 위한 투표</h3>
                </div>
                <div>
                    <p className="text-xs text-gray-400">채팅창에 원하는 게임 번호를 입력해주세요!</p>
                </div>
                <div className="text-gray-300 text-sm space-y-1">
                    <p className="text-yellow-400 font-semibold">예시: 11 또는 1를 띄고</p>
                    <p className="text-xs text-gray-400">투표는 참고용이며, 최종 선택은 스트리머가 결정합니다</p>
                </div>
            </div>

            {/* 오른쪽 박스 - 버튼들 */}
            <div className="w-[450px] h-full flex flex-col gap-3">
                <button
                    type="button"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-lg font-black text-2xl flex items-center justify-center gap-3 transition-all duration-200"
                >
                    <Icon name="Play" type="lucide" size={28} />
                    게임 시작
                </button>

                <button
                    type="button"
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-black text-2xl flex items-center justify-center gap-3 transition-all duration-200"
                >
                    <Icon name="Dices" type="lucide" size={28} />
                    재추첨
                </button>
            </div>
        </div>
    );
};

export default SelectionFooter;
