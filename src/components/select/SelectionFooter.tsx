import React from "react";
import {Icon} from "@/components/icons/Icon";
import {useNavigate} from "react-router-dom";
import {PATHS} from "@/routes/paths";

const SelectionFooter: React.FC = () => {

    const navigate = useNavigate();

    return (
        <div className="h-[170px] w-full flex justify-between bg-black/40 rounded-lg">
            {/* 왼쪽 박스 - 투표 안내 */}
            <div className="w-[450px] h-full flex flex-col justify-center items-start gap-1.5 px-6">
                <div className="flex items-center gap-2">
                    <Icon name="MessageCircle" type="lucide" size={24} className="text-yellow-600"/>
                    <h3 className="text-yellow-600 text-2xl font-bold">민심 확인을 위한 투표</h3>
                </div>
                <div>
                    <p className="text-sm text-gray-400">채팅창에 원하는 게임 번호를 입력해주세요!</p>
                </div>
                <div className="text-gray-300 text-sm space-y-1">
                    <div className="w-[400px] bg-yellow-900/70 rounded-lg flex items-center justify-start px-3 py-3 gap-2">
                        <p className="text-gray-400 text-xl font-semibold">투표 예시:</p>
                        <p className="text-yellow-400 text-3xl font-semibold">!1 또는 !투표1</p>
                    </div>
                    <p className="text-sm text-gray-400">※ 투표는 참고용이며, 최종 선택은 스트리머가 결정합니다</p>
                </div>
            </div>

            {/* 오른쪽 박스 - 버튼들 */}
            <div className="w-[450px] h-full flex flex-col gap-3 px-6 py-3">
                <button
                    onClick={()=>{navigate(PATHS.tutorial);}}
                    type="button"
                    className="flex-1 bg-green-700 hover:bg-green-600 text-white rounded-lg font-black text-xl flex items-center justify-center gap-3 transition-all duration-200"
                >
                    <Icon name="Play" type="lucide" size={28}/>
                    게임 시작
                </button>

                <button
                    type="button"
                    className="flex-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-black text-xl flex items-center justify-center gap-3 transition-all duration-200"
                >
                    <Icon name="Dices" type="lucide" size={28}/>
                    재추첨
                </button>
            </div>
        </div>
    );
};

export default SelectionFooter;
