import React, { useMemo, useState } from "react";
import Participation from "../components/lobby/Participation";
import HostInformation from "../components/lobby/HostInformation";
import VictoryConditions, {
    VictoryOptionId,
} from "../components/lobby/VictoryConditions";
import StartGameButton from "@/components/lobby/StartGameButton";
import { Icon } from "@/components/icons";
import { ParticipantListItem, ParticipationSelectionItem } from "@/types/domain/participant";
import ParticipantList from "@/components/lobby/ParticipantList";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import ParticipationSelection from "@/components/lobby/ParticipationSelection";

const createInitialParticipants = (): ParticipantListItem[] =>
    Array.from({ length: 28 }, (_, index) => {
        const id = index + 1;
        const isBench = id % 4 === 0;

        return {
            id: `participant-${id}`,
            name: "두두광산",
            detail: isBench ? "대기 중" : "방송 참여 중",
            badgeLabel: isBench ? "대기" : "참여중",
            badgeClassName: isBench
                ? "bg-purple-500/20 text-purple-200"
                : "bg-green-500/20 text-green-400",
        };
    });

const createInitialSelectionItems = (): ParticipationSelectionItem[] => {
    const sampleNames = [
        "김철수", "이영희", "박민수", "최지은",
        "정현우", "강서연", "윤도현", "송하늘"
    ];

    const sampleAvatars = [
        "https://media.tenor.com/-QjqtEhN9soAAAAM/legend-of-zelda-botw.gif",
        "https://images.steamusercontent.com/ugc/449611652050198394/003B0F458420C44A75D10CBDC94A9C0B964C06F7/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
        "https://media1.tenor.com/m/eS71mKN_7GAAAAAd/neneko-mashiro-mashiro-neneko.gif",
        "https://giffiles.alphacoders.com/221/221856.gif",
        "https://img.wattpad.com/b0790cd22ac1469ba55c1d381db39e3aa6256bc0/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f67424134734a70384b6346414d413d3d2d3732303133333835322e313539356439353266336565343133633432373138363035313432382e676966",
        "https://wallpapers-clan.com/wp-content/uploads/2024/08/konosuba-smiling-megumin-gif-desktop-wallpaper-preview.gif",
        "https://giffiles.alphacoders.com/200/200252.gif",
        "https://giffiles.alphacoders.com/200/200002.gif",
    ];

    return Array.from({ length: 8 }, (_, index) => ({
        id: `selection-${index + 1}`,
        name: sampleNames[index],
        avatarUrl: sampleAvatars[index] || "",
    }));
};

export default function Lobby() {
    const [participants, setParticipants] = useState<ParticipantListItem[]>(() =>
        createInitialParticipants()
    );
    const [selectionItems, setSelectionItems] = useState(() =>
        createInitialSelectionItems()
    );
    const [searchKeyword, setSearchKeyword] = useState("");
    const [maxParticipantTier, setMaxParticipantTier] = useState("100");
    const [selectedVictoryOption, setSelectedVictoryOption] =
        useState<VictoryOptionId>("lastOne");
    const [survivorCount, setSurvivorCount] = useState(3);
    const [roundCount, setRoundCount] = useState(3);
    const [selectedTime, setSelectedTime] = useState(40);
    const [activeButtonLabel, setActiveButtonLabel] =
        useState<string>("참가 허용");
    const navigate = useNavigate();

    const filteredParticipants = useMemo(() => {
        const trimmed = searchKeyword.trim().toLowerCase();
        if (!trimmed) {
            return participants;
        }

        return participants.filter((participant) => {
            const nameMatch = participant.name.toLowerCase().includes(trimmed);
            const detailMatch =
                participant.detail?.toLowerCase().includes(trimmed) ?? false;
            return nameMatch || detailMatch;
        });
    }, [participants, searchKeyword]);

    const handleRemoveParticipant = (participantId: string) => {
        setParticipants((prev) =>
            prev.filter((participant) => participant.id !== participantId)
        );
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

    const handleSelectParticipant = (participantId: string) => {
        console.log(participantId);
    };

    return (
        <div className="flex h-full w-full flex-col gap-[10px] overflow-hidden p-8 text-white">
            <div className="h-[50px] flex items-center justify-end gap-[10px]">
                <Icon name="reset" size={30} />
                <Icon name="Volume2" size={35} type="lucide"/>
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
                <div className="flex grow-[4] flex-col gap-[35px] overflow-hidden">
                    <div className="flex basis-0 min-h-0 grow-[3] flex-col gap-[35px] overflow-hidden md:flex-row">
                        <div className="basis-0 min-h-0 grow-[1.3]">
                            <Participation
                                className="h-full"
                                title="참여 신청하기"
                                instructions={{
                                    prefix: "채팅창에 ",
                                    highlight: '" 참여 "',
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
                                imageUrl="https://yt3.googleusercontent.com/aBBmBfA_6zGskSPx65DMzPDbOczqRkl_FPj05OiUfsXD3AhE0jevgR0ERIH44J1wNGixAkztmfM=s900-c-k-c0x00ffffff-no-rj"
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
                                {
                                    label: "참가 허용",
                                    variant: "primary",
                                    onClick: () => setActiveButtonLabel("참가 허용"),
                                    active: activeButtonLabel === "참가 허용",
                                },
                                {
                                    label: "신청 중단",
                                    variant: "warning",
                                    onClick: () => setActiveButtonLabel("신청 중단"),
                                    active: activeButtonLabel === "신청 중단",
                                },
                                {
                                    label: "참가 종료",
                                    variant: "danger",
                                    onClick: () => setActiveButtonLabel("참가 종료"),
                                    active: activeButtonLabel === "참가 종료",
                                },
                            ]}
                        />
                    </div>
                </div>

                <div className="flex grow-[3] flex-col gap-[35px] overflow-hidden">
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
                        <ParticipationSelection
                            className="h-full"
                            items={selectionItems}
                            title="시청자 아바타 선택(다수 선택 가능)"
                        />
                    </div>
                    <div className="basis-0 min-h-0 grow-[0.5] overflow-hidden p-2">
                        <StartGameButton
                            onClick={() => {
                                navigate(PATHS.loading);
                            }}
                        />
                    </div>
                </div>

                <div className="w-[320px] h-full flex-shrink-0 border-4 border-purple-500">
                </div>
            </div>
        </div>
    );
}
