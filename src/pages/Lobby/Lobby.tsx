import React, { useMemo, useState } from "react";
import GenericBox from "../../components/lobby/GenericBox";
import Participation from "../../components/lobby/Participation";
import HostInformation from "../../components/lobby/HostInformation";
import VictoryConditions, { VictoryOptionId } from "../../components/lobby/VictoryConditions";
import SelectionTime from "../../components/lobby/SelectionTime";
import StartGameButton from "@/components/lobby/StartGameButton";
import {Icon} from "@/components/icons";
import {ParticipantListItem} from "@/types/components";
import ParticipantList from "@/components/lobby/ParticipantList";
import {makeRandomName} from "@/components/sample/randomName";

const createInitialParticipants = (): ParticipantListItem[] =>
    Array.from({ length: 28 }, (_, index) => {
        const id = index + 1;
        const isBench = id % 4 === 0;

        return {
            id: `participant-${id}`,
            name: makeRandomName(" "),
            avatarUrl: `https://i.pravatar.cc/40?u=lobby-user-${id}`,
            detail: isBench ? "대기 중" : "방송 참여 중",
            badgeLabel: isBench ? "대기" : "참여중",
            badgeClassName: isBench ? "bg-purple-500/20 text-purple-200" : "bg-green-500/20 text-green-400",
        };
    });

export default function Lobby() {
    const [participants, setParticipants] = useState<ParticipantListItem[]>(() => createInitialParticipants());
    const [searchKeyword, setSearchKeyword] = useState("");
    const [maxParticipantTier, setMaxParticipantTier] = useState("100");
    const [selectedVictoryOption, setSelectedVictoryOption] = useState<VictoryOptionId>("lastOne");
    const [survivorCount, setSurvivorCount] = useState(3);
    const [roundCount, setRoundCount] = useState(3);
    const [selectedTime, setSelectedTime] = useState(40);

    const filteredParticipants = useMemo(() => {
        const trimmed = searchKeyword.trim().toLowerCase();
        if (!trimmed) {
            return participants;
        }

        return participants.filter((participant) => {
            const nameMatch = participant.name.toLowerCase().includes(trimmed);
            const detailMatch = participant.detail?.toLowerCase().includes(trimmed) ?? false;
            return nameMatch || detailMatch;
        });
    }, [participants, searchKeyword]);

    const handleRemoveParticipant = (participantId: string) => {
        setParticipants((prev) => prev.filter((participant) => participant.id !== participantId));
    };

    const handleRefreshParticipants = () => {
        setParticipants(createInitialParticipants());
        setSearchKeyword("");
    };

    const maxParticipantOptions = [
        { value: "100", label: "100명 (대규모)" },
        { value: "50", label: "50명 (중규모)" },
        { value: "10", label: "10명 (소규모)" },
    ];

    const selectionTimeDescription = {
        prefix: "선택을 ",
        suffix: "초 안에 완료해야 합니다.",
    };

    const totalCapacity = Number(maxParticipantTier);

    return (
        <div className="flex h-full w-full flex-col gap-[10px] overflow-hidden p-[15px] text-white">
            <div className="h-[50px] flex items-center justify-end gap-[10px]">
                <Icon name="chzzk_mini" className="h-[40px] w-[40px] text-yellow-500" />
                <Icon name="chzzk_mini" className="h-[40px] w-[40px] text-y0ellow-500" />
                <button
                    type="button"
                    className={`rounded-lg py-2 px-10 font-semibold transition-all duration-200 bg-gray-700 text-white hover:bg-gray-400`}
                >
                    처음으로
                </button>
                <button
                    type="button"
                    className={`rounded-lg py-2 px-10 font-semibold transition-all duration-200 bg-red-800 text-white hover:bg-red-300`}
                >
                    로그아웃
                </button>
            </div>

            <div className="flex flex-1 min-h-0 gap-[35px] overflow-hidden">
                <div className="flex basis-0 min-h-0 grow-[4] flex-col gap-[35px] overflow-hidden">
                    <div className="flex basis-0 min-h-0 grow-[3] flex-col gap-[35px] overflow-hidden md:flex-row">
                        <div className="basis-0 min-h-0 grow-[1.3]">
                            <Participation
                                className="h-full"
                                title="참여 신청하기"
                                instructions={{
                                    prefix: "채팅창에 ",
                                    highlight: "\" 참여 \"",
                                    suffix: "를 입력해 주세요.",
                                }}
                                helperText="스트리머가 참가 신청을 받고 있을 때만 자동으로 등록돼요."
                                maxLabel="최대 참가자 수"
                                maxOptions={maxParticipantOptions}
                                selectedMaxOption={maxParticipantTier}
                                onMaxOptionChange={setMaxParticipantTier}
                                totalCount={participants.length}
                                totalCountCaption="명의 참가자가 대기 중입니다."
                            />
                        </div>
                        <div className="basis-0 min-h-0 grow">
                            <HostInformation
                                className="h-full"
                                logoText="Z"
                                streamerTag="방송 호스트"
                                viewerCountLabel="2.2만"
                                hostName="아야츠노 유니"
                                description="동해물과 백두산이 마르고 닳도록! 하느님이 보우하사 우리나라 만세!"
                                ratingLabel="평균 시청 유지율 85%"
                                imageUrl= "https://nng-phinf.pstatic.net/MjAyNTAzMzFfMjQw/MDAxNzQzNDMwNTM4OTg4.Bam6imHvAZLBWT0GHFprz94iS5CaGFmVI9RoXktnY-4g.AkwRyhY_RhSGzEiBXTvs4pEyo7KxI4GmUd151O8cVcYg.PNG/%EC%9C%A0%EB%8B%883.png?type=f120_120_na"
                            />
                        </div>
                    </div>
                    <div className="basis-0 min-h-0 grow-[5] overflow-hidden">
                        <ParticipantList
                            className="h-full"
                            title="참가자 현황"
                            currentCount={participants.length}
                            capacity={totalCapacity}
                            participants={filteredParticipants}
                            searchValue={searchKeyword}
                            onSearchChange={setSearchKeyword}
                            onRefresh={handleRefreshParticipants}
                            onRemove={handleRemoveParticipant}
                            actionButtons={[
                                { label: "참가 허용", variant: "primary" },
                                { label: "신청 중단", variant: "warning" },
                                { label: "참가 종료", variant: "danger" },
                            ]}
                        />
                    </div>
                </div>

                <div className="flex basis-0 min-h-0 grow-[3] flex-col gap-[35px] overflow-hidden">
                    <div className="basis-0 min-h-0 grow-[3] overflow-hidden">
                        <VictoryConditions
                            className="h-full"
                            selectedOption={selectedVictoryOption}
                            onSelectOption={setSelectedVictoryOption}
                            survivorCount={survivorCount}
                            onSurvivorCountChange={setSurvivorCount}
                            roundCount={roundCount}
                            onRoundCountChange={setRoundCount}
                            minSurvivorCount={2}
                            maxSurvivorCount={10}
                            minRoundCount={1}
                        />
                    </div>
                    <div className="basis-0 min-h-0 grow-[1.5] overflow-hidden">
                        <SelectionTime
                            className="h-full"
                            title="선택 시간 조정"
                            descriptionPrefix={selectionTimeDescription.prefix}
                            descriptionSuffix={selectionTimeDescription.suffix}
                            selectedTime={selectedTime}
                            onSelectTime={setSelectedTime}
                        />
                    </div>
                    <div className="basis-0 min-h-0 grow-[0.5] overflow-hidden p-2">
                            <StartGameButton
                                onClick={() => {
                                    console.log("게임 시작!");
                                }}
                            />
                    </div>
                </div>

                <div className="basis-0 min-h-0 grow overflow-hidden">
                    <GenericBox className="overflow-hidden bg-transparent p-0">
                        7
                    </GenericBox>
                </div>
            </div>
        </div>
    );
}
