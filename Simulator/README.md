# GalaShow Simulator

여러 계정 없이 방송 채팅 참가를 시험하는 Windows 데스크톱 앱(Electron)이다. 가짜 시청자의 채팅을 GalaShow Client에 보내 로비 참가·예외·부하 상황을 재현한다. 개발·테스트 전용이며 운영 서비스에는 연결되지 않는다.

## 동작 방식

```
[Simulator 앱] ──ws://127.0.0.1:47800──▶ [Client 페이지(개발 서버 또는 ?sim)]
   가짜 채팅·연결 흉내                      polyChat 'message' 이벤트로 전달 → 로비가 실제 채팅처럼 처리
   ◀── 로비 상태(참가자 수·모집 상태·제외 목록·연결 상태)
```

- 앱은 내 PC의 `127.0.0.1:47800`에만 WebSocket 서버를 연다(`GALASHOW_SIM_PORT`로 변경). 접속은 `http://localhost:*`, `http://127.0.0.1:*`, `https://*.galashow.cloud` 출처만 허용한다.
- Client는 로컬 개발 서버에서는 항상, 개발 배포(`https://dev.galashow.cloud`)에서는 주소에 `?sim`을 붙였을 때 자동으로 접속한다. 운영 빌드에는 연결 코드가 포함되지 않는다. 연결되면 Client 우측 하단에 "시뮬레이터 연결됨" 배지가 뜬다.
- 가짜 채팅은 실제 어댑터와 같은 경로로 들어가므로 로비의 참가 규칙(명령어·중복·정원·제외·모집 상태)이 그대로 적용된다.

## 기능

| 영역 | 내용 |
| --- | --- |
| 채팅 연결 흉내 | 방송 없이 로비의 "채팅 연결" 시작 조건을 통과시킨다. 실제로 연결된 계정은 건드리지 않는다. |
| 시청자 풀 | 포함할 플랫폼과 인원(최대 2000명)으로 가짜 시청자를 만든다. |
| 참가 신청 | N명 한 번에, 남은 인원 전부, 초당 N명씩 흘려보내기(잡담 섞기) |
| 예외 상황 | 중복 신청, 같은 닉네임·다른 플랫폼, 제외된 사람 재신청, 명령어가 아닌 채팅 |
| 부하 테스트 | 새 시청자의 메시지 N개(참가 70%, 잡담 30%)를 1초 동안 보낸다. |
| 게임 투표 | 선택 화면의 민심 투표. 참가한 시청자가 `!번호`/`!투표번호`로 투표한다(후보 수, 우세 번호 지정). |
| 직접 입력 | 플랫폼·닉네임·메시지를 골라 한 줄씩 보낸다. |

참가 명령어(`src/viewers.ts`의 `JOIN_COMMANDS`)는 Client의 `JOIN_COMMANDS`와 같아야 한다.

## 실행

Node.js 24를 사용한다.

```sh
npm install
npm run dev     # Vite + Electron 개발 실행
npm test        # WebSocket 서버 테스트
npm run dist    # Windows portable 실행 파일 → release/GalaShow-Simulator-<버전>.exe
```

`npm install` 후 `node_modules/electron/dist/electron.exe`가 없으면 `node node_modules/electron/install.js`로 Electron을 받는다. 실행 파일은 코드 서명 인증서 없이 만들어지므로 처음 실행할 때 Windows SmartScreen 경고가 뜰 수 있다.

시험 순서: 앱 실행 → Client `npm run dev` 후 `http://localhost:5173/lobby`(또는 개발 배포 주소 + `?sim`) 열기 → 앱 상단에 "게임 페이지 1개 연결됨" 확인 → 채팅 연결 흉내 → 로비에서 "참가 허용" → 앱에서 참가 신청.

## 프로토콜

JSON 한 줄 메시지. 정의와 검증은 `electron/server.cjs`, Client 쪽은 상위 Client의 `src/dev/simulator/simulatorBridge.ts`에 있다.

| 방향 | 메시지 |
| --- | --- |
| 앱 → Client | `{ type: "chat", platform, nickname, content }` |
| 앱 → Client | `{ type: "batch", messages: [{ platform, nickname, content }] }` |
| 앱 → Client | `{ type: "fakeConnection", platforms: ["chzzk", ...] }` |
| Client → 앱 | `{ type: "hello", app: "galashow-client", url }` |
| Client → 앱 | `{ type: "state", lobby: { status, participantCount, capacity, excluded }, connections: { chzzk: "real"\|"fake"\|"off", ... }, game?: { status, phase, gameName, round, survivorCount, forwardedInputs } }` |

`platform`은 `chzzk`/`soop`/`youtube`만 허용한다. 프로토콜을 바꾸면 두 파일과 이 표를 함께 갱신한다.

## 제약

- PolyChat 메시지에 사용자 ID가 없어 참가자는 `플랫폼:닉네임`으로 구분된다. 같은 플랫폼의 동명이인 상황은 재현할 수 없다.
- 플랫폼 서버의 지연·끊김은 재현하지 않는다.
- 미니게임 입력은 **트롤리 1/2**만 지원한다. 참가한 시청자가 설정한 비율·입력률·분산 시간·변경 비율로 `1` 또는 `2`를 채팅한다. Client는 Unity 입력 단계(INPUT)에서 생존 참가자의 채팅만 Unity로 보내므로, 입력 단계가 아닐 때 보낸 채팅은 반영되지 않는다. 상단에 게임 상태(단계·생존 인원·Unity로 전달한 입력 수)가 표시된다.
- 호스트 선택은 게임 화면(Unity) 하단의 호스트 버튼으로 한다(시뮬레이터 기능 아님).
