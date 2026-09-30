import React, { useCallback, useMemo, useState, useEffect } from "react";
import Participation from "../components/lobby/Participation";
import HostInformation from "../components/lobby/HostInformation";
import VictoryConditions from "../components/lobby/VictoryConditions";
import StartGameButton from "@/components/lobby/StartGameButton";
import { Icon } from "@/components/icons";
import { ParticipantListItem, ParticipationSelectionItem } from "@/types/domain/participant";
import ParticipantList from "@/components/lobby/ParticipantList";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import ParticipationSelection from "@/components/lobby/ParticipationSelection";
import { ViewerAvatarApi } from "@/api/modules/ViewerAvatarApi";
import { polyChat, selectMainBroadcaster, usePolyChatStore } from "@/stores/polychat";
import { CAPACITY_MAX, JOIN_COMMANDS, MIN_PARTICIPANTS, RecruitStatus, useLobbyStore } from "@/stores/lobby";
import TwoButtonPopup from "@/components/modals/TwoButtonPopup";
import CountdownPopup from "@/components/modals/CountdownPopup";
import { useSessionStore } from "@/stores/session";
import type { ChatMessage } from "polychat-bridge";
import type { PlatformType } from "@/types/common";

const PLATFORMS: PlatformType[] = ["chzzk", "soop", "youtube"];

const RECRUIT_STATUS_UI: Record<RecruitStatus, { label: string; helper: string; className: string }> = {
    ready: {
        label: "모집 전",
        helper: "'참가 허용'을 누르면 채팅 신청을 받기 시작해요.",
        className: "bg-gray-600/60 text-gray-100",
    },
    open: {
        label: "모집 중",
        helper: "채팅으로 신청하면 자동으로 등록돼요.",
        className: "bg-green-500/25 text-green-300 animate-pulse",
    },
    closed: {
        label: "모집 마감",
        helper: "모집이 마감되었어요. 다시 받으려면 '참가 허용'을 누르세요.",
        className: "bg-red-500/25 text-red-200",
    },
};

export default function Lobby() {
    const navigate = useNavigate();

    // 홈에서 고른 메인 프로필을 방송 호스트로 표시한다(연결 전에는 샘플 값).
    const mainPlatform = usePolyChatStore((state) => state.mainPlatform);
    const mainBroadcaster = usePolyChatStore(selectMainBroadcaster);
    const chatPlatforms = usePolyChatStore((state) => state.platforms);
    const connectedPlatforms = PLATFORMS.filter((p) => chatPlatforms[p].status === "connected");
    // 이번 세션에서 연동한 계정. 방송 종료 등으로 끊겨도 호스트 카드에 끊김으로 남긴다.
    const [linkedPlatforms, setLinkedPlatforms] = useState<PlatformType[]>(connectedPlatforms);
    useEffect(() => {
        setLinkedPlatforms((prev) => {
            const added = connectedPlatforms.filter((p) => !prev.includes(p));
            return added.length ? PLATFORMS.filter((p) => prev.includes(p) || added.includes(p)) : prev;
        });
    }, [connectedPlatforms.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

    const {
        status, capacity, participants, mode, survivorCount, roundCount, selectedAvatarIds,
        setStatus, setCapacity, setMode, setSurvivorCount, setRoundCount, toggleAvatar, exclude, reset: resetLobby,
    } = useLobbyStore();

    const [selectionItems, setSelectionItems] = useState<ParticipationSelectionItem[]>([]);
    const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    // 카운트다운이 끝나면 확정 참가자로 세션(1라운드)을 시작하고 로딩으로 넘어간다.
    const goToLoading = useCallback(() => {
        useSessionStore.getState().start(useLobbyStore.getState().participants);
        navigate(PATHS.loading, { viewTransition: true });
    }, [navigate]);

    // 연결된 모든 플랫폼의 채팅을 참가 신청으로 처리한다(FR-02).
    useEffect(() => {
        const handleMessage = ({ platform, message }: { platform: string; message: ChatMessage }) => {
            if (message.nickname === "SYSTEM") return;
            useLobbyStore.getState().handleChat(platform as PlatformType, message.nickname, message.content);
        };
        polyChat.on("message", handleMessage);
        return () => {
            polyChat.off("message", handleMessage);
        };
    }, []);

    // ViewerAvatarApi로부터 시청자 아바타 목록 로드
    useEffect(() => {
        const loadViewerAvatars = async () => {
            try {
                setIsLoadingAvatars(true);
                const avatars = await ViewerAvatarApi.list();

                // order 순서대로 정렬
                const sortedAvatars = [...avatars].sort((a, b) => a.order - b.order);

                // ParticipationSelectionItem 형식으로 변환 (최대 8개)
                const items: ParticipationSelectionItem[] = sortedAvatars
                    .slice(0, 8)
                    .map(avatar => ({
                        id: `avatar-${avatar.id}`,
                        name: avatar.name,
                        avatarUrl: avatar.gifUrl,
                    }));

                setSelectionItems(items);
            } catch (error) {
                console.error('Failed to load viewer avatars:', error);
                // 에러 시 빈 배열 유지
                setSelectionItems([]);
            } finally {
                setIsLoadingAvatars(false);
            }
        };

        loadViewerAvatars();
    }, []);

    const filteredParticipants = useMemo<ParticipantListItem[]>(() => {
        const trimmed = searchKeyword.trim().toLowerCase();
        return participants
            .filter((p) => !trimmed || p.nickname.toLowerCase().includes(trimmed))
            .map((p) => ({ id: p.id, name: p.nickname, platform: p.platform, joinedAt: p.joinedAt }));
    }, [participants, searchKeyword]);

    // 시작 조건(FR-04): 준비되지 않았으면 첫 번째 이유를 보여주고 시작하지 않는다.
    const startBlocker =
        connectedPlatforms.length === 0 ? "채팅이 연결된 계정이 없습니다. 홈에서 계정을 연동해 주세요."
            : status !== "closed" ? "참가 모집을 마감해야 게임을 시작할 수 있어요. ('참가 종료')"
                : participants.length < MIN_PARTICIPANTS ? `참가자가 최소 ${MIN_PARTICIPANTS}명 필요해요. (현재 ${participants.length}명)`
                    : !selectionItems.some((item) => selectedAvatarIds.includes(item.id)) ? "시청자 아바타를 1개 이상 선택해 주세요."
                        : mode !== "lastOne" ? "현재는 최후의 1인 서바이벌만 진행할 수 있어요."
                            : null;

    const statusUi = RECRUIT_STATUS_UI[status];

    const handleResetLobby = () => {
        resetLobby();
        setSearchKeyword("");
    };

    return (
        <div className="flex h-full w-full flex-col gap-[10px] overflow-hidden p-8 text-white animate-page-in motion-reduce:animate-none">
            <div className="h-[50px] flex items-center justify-end gap-[10px]">
                <button type="button" onClick={() => setShowResetConfirm(true)} aria-label="로비 초기화" title="로비 초기화" className="bg-transparent p-0">
                    <Icon name="reset" size={30} />
                </button>
                <button
                    type="button"
                    onClick={() => navigate(PATHS.welcome, { viewTransition: true })}
                    title="홈으로 돌아갑니다. 채팅 연결과 참가자 목록은 유지됩니다."
                    className={`rounded-lg py-2 px-10 font-semibold transition-all duration-200 bg-gray-700 text-white hover:bg-gray-400`}
                >
                    처음으로
                </button>
            </div>

            <div className="flex flex-1 min-h-0 gap-[35px] overflow-hidden">
                <div className="flex basis-0 min-w-0 grow-[5] flex-col gap-[35px] overflow-hidden">
                    <div className="flex basis-0 min-h-0 grow-[3] flex-col gap-[35px] overflow-hidden md:flex-row">
                        <div className="basis-0 min-h-0 grow-[1.3]">
                            <Participation
                                className="h-full"
                                title="참여 신청하기"
                                headerExtra={
                                    <span className={`rounded-full px-3 py-1 text-sm font-bold ${statusUi.className}`}>
                                        {statusUi.label}
                                    </span>
                                }
                                instructions={{
                                    prefix: "채팅창에 ",
                                    highlight: JOIN_COMMANDS,
                                    suffix: "를 입력해 주세요.",
                                }}
                                helperText={statusUi.helper}
                                maxLabel="최대 참가자 수"
                                maxValue={capacity}
                                onMaxValueChange={setCapacity}
                                minValue={MIN_PARTICIPANTS}
                                maxLimit={CAPACITY_MAX}
                                maxLocked={status !== "ready"}
                                totalCount={participants.length}
                                totalCountCaption={status === "closed" ? "명이 참가를 확정했습니다." : "명의 참가자가 대기 중입니다."}
                            />
                        </div>
                        <div className="basis-0 min-h-0 grow">
                            <HostInformation
                                className="h-full"
                                logoText="Z"
                                streamerTag="방송 호스트"
                                platform={mainPlatform ?? undefined}
                                isMain={mainPlatform !== null}
                                connections={linkedPlatforms.map((p) => ({ platform: p, connected: chatPlatforms[p].status === "connected" }))}
                                hostName={mainBroadcaster?.nickname ?? "아야츠노 유니"}
                                ratingLabel="평균 시청 유지율 85%"
                                /* 로그인 전에는 샘플 사진, 로그인했는데 사진이 없으면 카드의 기본 캐릭터를 보여준다. */
                                imageUrl={mainBroadcaster
                                    ? mainBroadcaster.profileImageUrl || undefined
                                    : "https://yt3.googleusercontent.com/aBBmBfA_6zGskSPx65DMzPDbOczqRkl_FPj05OiUfsXD3AhE0jevgR0ERIH44J1wNGixAkztmfM=s900-c-k-c0x00ffffff-no-rj"}
                            />
                        </div>
                    </div>
                    <div className="basis-0 min-h-0 grow-[5] overflow-hidden">
                        <ParticipantList
                            className="h-full"
                            title="참가자 현황"
                            currentCount={participants.length}
                            capacity={capacity}
                            participants={filteredParticipants}
                            searchValue={searchKeyword}
                            onSearchChange={setSearchKeyword}
                            onRefresh={() => setSearchKeyword("")}
                            onRemove={exclude}
                            emptyText={
                                searchKeyword.trim() ? "검색 결과가 없습니다."
                                    : status === "open" ? `채팅으로 ${JOIN_COMMANDS.map((c) => `"${c}"`).join(" 또는 ")}를 입력한 시청자가 여기에 표시됩니다.`
                                        : "아직 참가자가 없습니다."
                            }
                            actionButtons={[
                                {
                                    label: "참가 허용",
                                    variant: "primary",
                                    onClick: () => setStatus("open"),
                                    active: status === "open",
                                },
                                {
                                    label: "참가 종료",
                                    variant: "danger",
                                    onClick: () => setStatus("closed"),
                                    active: status === "closed",
                                },
                            ]}
                        />
                    </div>
                </div>

                <div className="flex basis-0 min-w-0 grow-[3] flex-col gap-[35px] overflow-hidden">
                    <div className="basis-0 min-h-0 grow-[3] overflow-hidden">
                        <VictoryConditions
                            className="h-full"
                            selectedOption={mode}
                            onSelectOption={setMode}
                            survivorCount={survivorCount}
                            onSurvivorCountChange={setSurvivorCount}
                            roundCount={roundCount}
                            onRoundCountChange={setRoundCount}
                            minSurvivorCount={2}
                            maxSurvivorCount={10}
                            minRoundCount={1}
                            unavailableOptions={["smallGroup", "rounds"]}
                        />
                    </div>
                    <div className="basis-0 min-h-0 grow-[1.5] overflow-hidden">
                        {isLoadingAvatars ? (
                            <div className="h-full flex items-center justify-center bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl">
                                <span className="text-white text-lg">아바타 로딩 중...</span>
                            </div>
                        ) : (
                            <ParticipationSelection
                                className="h-full"
                                items={selectionItems}
                                selectedIds={selectedAvatarIds}
                                onToggle={toggleAvatar}
                                title="시청자 아바타 선택(다수 선택 가능)"
                            />
                        )}
                    </div>
                    <div className="relative basis-0 min-h-0 grow-[0.5] p-2">
                        {/* 시작할 수 없는 이유는 버튼 위 여백(섹션 간격)에 표시한다 */}
                        {startBlocker && (
                            <p className="absolute -top-7 inset-x-0 flex items-center justify-center gap-1.5 text-sm font-semibold text-yellow-200 truncate">
                                <Icon name="Info" type="lucide" size={16} />
                                {startBlocker}
                            </p>
                        )}
                        <StartGameButton
                            disabled={startBlocker !== null}
                            onClick={() => setShowCountdown(true)}
                        />
                    </div>
                </div>

                <div className="w-[320px] h-full flex-shrink-0 border-4 border-purple-500">
                </div>
            </div>

            <CountdownPopup
                isOpen={showCountdown}
                subtitle={`참가자 ${participants.length}명 · 최후의 1인 서바이벌`}
                onComplete={goToLoading}
                onCancel={() => setShowCountdown(false)}
            />

            <TwoButtonPopup
                isOpen={showResetConfirm}
                title="로비를 초기화할까요?"
                subtitle="참가자 목록과 모집 상태, 제외 목록이 모두 초기화됩니다."
                cancelText="취소"
                confirmText="초기화"
                onConfirm={handleResetLobby}
                onClose={() => setShowResetConfirm(false)}
            />
        </div>
    );
}
