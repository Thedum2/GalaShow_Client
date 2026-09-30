/**
 * 개발용 로컬 미니게임 (DB에 등록되기 전 Unity 연동 시험용)
 * 개발 빌드(import.meta.env.DEV) 또는 VITE_LOCAL_MINIGAMES=true일 때만 게임 선택 후보에 나온다.
 * 내용은 docs/minigame-trolley.md 4·8절과 API/database/seeds/dev-samples-v1.sql(트롤리 블록)과 같다.
 */

export const LOCAL_MINIGAMES_ENABLED: boolean =
    Boolean(import.meta.env.DEV) || import.meta.env.VITE_LOCAL_MINIGAMES === "true";

/** 로컬 게임 ID는 음수 (API ID와 겹치지 않음) */
export const isLocalMinigameId = (id: number) => id < 0;

export const LOCAL_MINIGAMES: any[] = [
{
    "id": -101,
    "name": "트롤리 딜레마",
    "description": "호스트가 지킬 선택지를 예상하세요. 트롤리는 반대편으로 갑니다. 호스트와 같은 선택을 한 사람만 살아남습니다.",
    "videoUrl": "",
    "logoUrl": "",
    "tags": {
        "scale": "large",
        "difficulty": "2",
        "round": "1-2",
        "type": "choice",
        "survivalRate": "medium",
        "winCondition": "goal"
    },
    "phaseData": {
        "READY": 2000,
        "SETUP": 1500,
        "PRESENT": 6000,
        "INPUT": 15000,
        "WAIT": -1,
        "EXECUTE": 1000,
        "REVEAL": 8000,
        "CLEANUP": 1500
    },
    "gameData": {
        "schemaVersion": 1,
        "pluginId": "galashow.trolley",
        "players": {
            "min": 2,
            "max": 50
        },
        "rule": {
            "type": "match_host",
            "hostChoice": {
                "source": "host_ui",
                "hiddenUntil": "REVEAL",
                "lockAt": "WAIT_END",
                "ifMissing": "random"
            },
            "noInput": "random",
            "inputChange": "last",
            "allEliminated": "all_survive"
        },
        "content": {
            "pick": "random_unplayed",
            "dilemmas": [
                {
                    "id": "classic",
                    "category": "classic",
                    "title": "고전 트롤리",
                    "description": "트롤리가 다섯 명이 있는 선로로 달려갑니다. 레버를 당기면 한 명이 있는 선로로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "레버를 당긴다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "그대로 둔다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "self-switch",
                    "category": "classic",
                    "title": "나 vs 다섯",
                    "description": "선로를 바꾸면 다섯 명은 살지만, 트롤리가 내가 서 있는 쪽으로 옵니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "선로를 바꾼다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "바꾸지 않는다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "auto-lever",
                    "category": "classic",
                    "title": "자동 레버",
                    "description": "아무것도 안 하면 10초 뒤 레버가 저절로 당겨집니다. 막으려면 버튼을 눌러야 합니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "버튼을 누른다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "가만히 있는다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "chicken-vs-tteokbokki",
                    "category": "food",
                    "title": "야식 트롤리",
                    "description": "트롤리가 방금 도착한 치킨 다섯 마리로 돌진 중! 레버를 당기면 내 최애 떡볶이 한 그릇 쪽으로 갑니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "치킨을 살린다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "떡볶이를 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "mint-choco",
                    "category": "food",
                    "title": "민초 공장",
                    "description": "트롤리가 민트초코 공장으로 달려갑니다. 레버를 당기면 하와이안 피자 공장으로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "민초를 지킨다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "하와이안을 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "last-ramen",
                    "category": "food",
                    "title": "새벽 3시의 라면",
                    "description": "남은 라면은 하나. 트롤리가 끓기 직전의 라면으로 갑니다. 레버를 당기면 내일 아침밥이 사라집니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "지금 라면을 먹는다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "내일 아침을 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "sweet-or-spicy",
                    "category": "food",
                    "title": "평생 금지",
                    "description": "트롤리가 '평생 매운 음식 금지' 표지판을 향해 갑니다. 레버를 당기면 '평생 단 음식 금지' 쪽으로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "매운 걸 포기한다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "단 걸 포기한다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "pour-or-dip",
                    "category": "food",
                    "title": "탕수육 선로",
                    "description": "트롤리가 '부먹' 마을로 돌진 중. 레버를 당기면 '찍먹' 마을로 갑니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "부먹을 지킨다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "찍먹을 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "donation-split",
                    "category": "stream",
                    "title": "후원 트롤리",
                    "description": "트롤리가 '천 원 후원 다섯 개'로 달려갑니다. 레버를 당기면 '만 원 후원 하나'가 사라집니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "다섯 개를 지킨다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "한 방을 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "end-stream-button",
                    "category": "stream",
                    "title": "방종 버튼",
                    "description": "트롤리가 '방송 종료' 버튼을 누르러 갑니다. 레버를 당기면 '마이크 음소거' 버튼을 누릅니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "음소거가 낫다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "차라리 방종",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "upload-or-vacation",
                    "category": "stream",
                    "title": "편집자의 휴가",
                    "description": "트롤리가 오늘 올릴 영상으로 돌진 중. 레버를 당기면 편집자의 휴가가 취소됩니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "영상을 살린다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "휴가를 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "chat-freeze",
                    "category": "stream",
                    "title": "채팅창 얼리기",
                    "description": "트롤리가 채팅창을 10분간 얼리러 갑니다. 레버를 당기면 내 카메라가 10분간 꺼집니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "채팅을 지킨다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "카메라를 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "sub-or-viewer",
                    "category": "stream",
                    "title": "숫자 선로",
                    "description": "트롤리가 '오늘 시청자 수 두 배' 선로로 갑니다. 레버를 당기면 '구독자 천 명 증가' 선로로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "시청자를 늘린다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "구독자를 늘린다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "snooze-alarm",
                    "category": "daily",
                    "title": "알람 선로",
                    "description": "트롤리가 '5분만 더' 알람 다섯 개로 달려갑니다. 레버를 당기면 한 번에 깨우는 무서운 알람 하나가 사라집니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "5분 알람을 지킨다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "무서운 알람을 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "read-receipt",
                    "category": "daily",
                    "title": "단톡방",
                    "description": "트롤리가 '읽씹' 버튼으로 갑니다. 레버를 당기면 '안읽씹' 버튼으로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "읽고 답 안 하기",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "아예 안 읽기",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "wifi-or-aircon",
                    "category": "daily",
                    "title": "한여름의 선택",
                    "description": "한여름, 트롤리가 와이파이 공유기로 돌진 중. 레버를 당기면 에어컨이 부서집니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "와이파이를 지킨다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "에어컨을 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "spoiler",
                    "category": "daily",
                    "title": "스포일러 열차",
                    "description": "트롤리에 드라마 결말을 스포하는 사람이 타고 있습니다. 레버를 당기면 대신 다음 화 공개가 한 달 미뤄집니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "스포를 듣는다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "한 달 기다린다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "time-machine",
                    "category": "final",
                    "title": "시간 열차",
                    "description": "트롤리가 '10년 전으로 돌아가기' 역으로 갑니다. 레버를 당기면 '10년 뒤로 건너뛰기' 역으로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "과거로 간다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "미래로 간다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "lottery",
                    "category": "final",
                    "title": "복권 선로",
                    "description": "트롤리가 '지금 당장 1억' 선로로 갑니다. 레버를 당기면 '평생 매달 100만 원' 선로로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "지금 1억",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "평생 100만 원",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "save-file",
                    "category": "final",
                    "title": "세이브 파일",
                    "description": "트롤리가 100시간 플레이한 세이브 파일로 돌진 중. 레버를 당기면 대신 신작 게임 하나를 영영 못 합니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "세이브를 살린다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "신작을 지킨다",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "superpower",
                    "category": "final",
                    "title": "초능력 열차",
                    "description": "트롤리가 '순간이동' 초능력 상자로 갑니다. 레버를 당기면 '투명인간' 상자가 부서집니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "순간이동",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "투명인간",
                            "description": ""
                        }
                    ]
                },
                {
                    "id": "cat-or-dog",
                    "category": "final",
                    "title": "간식 창고",
                    "description": "트롤리가 고양이 간식 창고로 달려갑니다. 레버를 당기면 강아지 간식 창고로 바뀝니다.",
                    "choices": [
                        {
                            "id": "A",
                            "label": "냥이 간식을 지킨다",
                            "description": ""
                        },
                        {
                            "id": "B",
                            "label": "멍이 간식을 지킨다",
                            "description": ""
                        }
                    ]
                }
            ]
        }
    },
    "tutorial": [
        {
            "step": 1,
            "description": "화면의 딜레마와 두 선택지를 읽으세요."
        },
        {
            "step": 2,
            "description": "호스트가 지킬 선택지를 예상해 채팅으로 1 또는 2를 입력하세요. 캐릭터가 그 선로에 눕습니다."
        },
        {
            "step": 3,
            "description": "트롤리는 호스트가 고른 반대편 선로로 달려갑니다. 호스트와 같은 선택을 한 사람만 살아남습니다."
        }
    ],
    "controls": [
        {
            "keyName": "1번",
            "key": [
                "1"
            ]
        },
        {
            "keyName": "2번",
            "key": [
                "2"
            ]
        }
    ],
    "createdAt": "",
    "updatedAt": ""
},
];

export const findLocalMinigame = (id: number) => LOCAL_MINIGAMES.find((g) => g.id === id) ?? null;
