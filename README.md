# GalaShow Client

## 환경별 주소와 실행

| Vite 모드 | 웹 주소 | API 기본값 |
| --- | --- | --- |
| development | https://dev.galashow.cloud | https://api-dev.galashow.cloud |
| production | https://galashow.cloud | https://api.galashow.cloud |

Node.js 24를 사용한다. `polychat-bridge`는 npm 레지스트리의 게시 버전을 설치한다(`package.json`의 `^1.2.0`). 새 버전을 쓰려면 `npm install polychat-bridge@latest`로 `package.json`과 `package-lock.json`을 함께 갱신한다. 처음 체크아웃할 때 Unity 빌드 서브모듈과 LFS 파일도 가져온다.

```sh
git submodule update --init --recursive
npm ci
npm run dev
npm test
npm run build:dev
npm run build:prod
```

빌드 결과는 `build/react/`이며 Unity 파일은 그 아래 `build/unity/`에 복사된다. 서브모듈에 실제 WebGL 파일이 있어야 배포용 빌드가 완성된다. 로컬 Vite 기본 주소는 `http://localhost:5173`이다.

Unity 소스의 기준 버전은 **6000.3.24f1 (Unity 6.3 LTS)**이다. Unity 빌드 게시 후 `build/unity` 서브모듈을 새 빌드 커밋으로 갱신해야 한다. React는 비압축 `WebGL.loader.js`, `WebGL.data`, `WebGL.framework.js`, `WebGL.wasm`을 `/build/unity/`에서 읽는다. 자세한 빌드 절차와 검증 범위는 [Unity 안내](../Unity/README.md)와 [전환 기록](../docs/unity-upgrade.md)을 따른다.

`.env.development`와 `.env.production`은 공개 API 주소를 저장하는 추적 파일이다. 개인별 API 변경은 무시되는 `.env.development.local` 또는 `.env.production.local`에서 `VITE_API_URL`을 지정한다. 실행 환경변수가 있으면 Vite의 환경 파일보다 우선한다. 값이 없거나 비어 있으면 빌드 모드에 맞는 API를 사용하며 끝의 `/`와 앞뒤 공백은 제거한다. `VITE_*`는 브라우저 번들에 포함되므로 비밀 값을 넣지 않는다.

## 홈 로그인 (PolyChat 연동)

홈의 SOOP·CHZZK·YouTube 카드는 `polychat-bridge`로 로그인 → 인증 → 채팅 연결을 한 번에 진행한다(`src/stores/polychat.ts`). 연결은 앱 전체에서 공유하는 `polyChat` 인스턴스에 유지되어 이후 화면에서 `polyChat.on('message')`로 채팅을 받을 수 있다.

PolyChat은 외부 서비스가 아니라 라이브러리다. 브라우저 어댑터(`polychat-bridge`)와 함께, Secret 보관·CHZZK CORS·YouTube gRPC 스트림처럼 브라우저가 할 수 없는 호출을 맡는 중계 핸들러(`polychat-bridge/server`)를 제공한다. Client는 이 핸들러를 자기 출처의 `/polychat`에 직접 띄운다. Client ID는 핸들러의 `/config`에서 받고 Secret은 서버 환경변수에만 둔다.

| 실행 | 중계 핸들러 |
| --- | --- |
| `npm run dev` | Vite 개발 서버가 `/polychat`에 내장해 실행 (별도 프로세스 없음) |
| 배포 | **미구성.** 정적 호스팅(S3·CloudFront)만으로는 실행되지 않으므로 `/polychat`을 처리할 Node 런타임(예: Lambda)을 Client 배포에 추가해야 한다 |

다른 주소에 띄웠다면 `VITE_POLYCHAT_API_URL`로 지정한다. 개발 서버의 자격증명(`CHZZK_CLIENT_ID`/`CHZZK_CLIENT_SECRET`, `SOOP_CLIENT_ID`/`SOOP_CLIENT_SECRET`, `YOUTUBE_CLIENT_ID`)은 이 저장소의 무시되는 `.env.local`에 둔다(`VITE_` 접두사 없이, 브라우저 번들에 포함되지 않음). 형제 폴더 `../PolyChat/.env.local`이 있으면 기본값으로 함께 읽는다. 자격증명이 없으면 개발 서버 로그에 경고가 나온다.

SOOP의 로그인 리디렉션 주소는 SOOP 개발자 센터에 Client origin의 `/callback`으로 등록해야 한다(SOOP은 코드에서 전달하지 않는다).

## 로비 (참가 모집)

PRD의 Lobby·FR-01~04를 기준으로 구현했다. 상태는 `src/stores/lobby.ts`(zustand)에 있어 이후 화면에서 참가자 목록을 사용할 수 있다.

- 모집: `참가 허용`(모집 시작·재개) / `참가 종료`(마감). 모집 중에만 연결된 모든 플랫폼의 채팅에서 참가 명령어를 받는다(메시지 전체가 `참여` 또는 `참가`). 중복·정원 초과·제외된 사용자·모집 중이 아닐 때의 신청은 반영하지 않는다.
- 최대 참가자 수: 직접 입력하거나 ±10 버튼으로 바꾼다(2~50명, 기본 50명). `참가 허용`이나 `참가 종료`를 누르면 잠기며 로비를 초기화해야 다시 바꿀 수 있다.
- 제외: 목록의 X로 제외하면 같은 사용자가 다시 신청해도 받지 않는다. 로비 초기화(상단 아이콘) 시 제외 목록도 비운다.
- 시작 조건: 채팅 연결 1개 이상, 모집 마감, 최소 인원, 시청자 아바타 1개 이상 선택, 최후의 1인 모드. 충족하지 않으면 시작 버튼 위에 첫 번째 이유를 표시한다. 시작하면 3초 카운트다운 팝업(취소 가능) 뒤 로딩 화면으로 넘어가고, 로딩이 끝나면 선택 화면으로 교차 페이드한다.
- 모드: MVP 우선인 최후의 1인만 선택할 수 있고, 소수 생존자·라운드 기반은 "준비 중"으로 표시한다.
- 시청자 시뮬레이터: 여러 계정 없이 채팅 참가를 시험하는 별도 Windows 앱([Simulator](Simulator/README.md), 이 저장소의 하위 폴더). Client는 로컬 개발 서버에서는 항상, 개발 배포에서는 주소에 `?sim`을 붙이면 `ws://127.0.0.1:47800`(`VITE_SIMULATOR_URL`로 변경)에 접속해 받은 가짜 채팅을 실제 채팅 경로로 넘기고 로비 상태를 보낸다(`src/dev/simulator/`). 연결되면 우측 하단에 배지가 뜬다. 운영 빌드(`--mode production`)에서는 연결 코드가 번들에서 제외된다.

PRD에서 미정인 값은 임시로 정했다: 참가 명령어 `참여`·`참가`(`JOIN_COMMANDS`), 최소 시작 인원 2명(`MIN_PARTICIPANTS`), 최대 참가자 수 상한 50명(`CAPACITY_MAX`). PolyChat 메시지에는 사용자 ID가 없어 참가자를 `플랫폼:닉네임`으로 구분한다. 플랫폼이 다르면 같은 닉네임도 구분하지만 **같은 플랫폼의 동명이인은 한 사람으로 처리**되어 PRD의 "닉네임만으로 식별하지 않는다"를 아직 충족하지 못한다(PolyChat에 사용자 ID 추가 필요). 호스트 카드의 시청자 수·소개 문구와 우측 방송 화면 영역은 아직 샘플이다.

## 선택 화면 (MinigameSelect)

PRD의 MinigameSelect(현재 라운드·생존 인원, 가능한 게임, 선택 확정)를 기준으로 구현했다. 세션 상태는 `src/stores/session.ts`에 있다.

- 세션: 로비 카운트다운이 끝나면 확정 참가자로 1라운드 세션을 시작한다. 라운드(`첫번째`, `두번째` …), 생존자, 선택한 게임, 진행한 게임을 이후 화면이 이어서 쓴다.
- 후보: API의 미니게임 중 최대 4개를 무작위로 보여준다. 진행한 게임은 가능하면 빼고, `재추첨`은 직전 후보가 아닌 게임을 먼저 고르며 투표와 선택을 초기화한다. 바꿀 후보가 없으면 재추첨을 막는다. PRD에서 직접/무작위 선택 정책은 미정이며 현재는 무작위 후보 + 스트리머 최종 선택이다.
- 민심 투표: 채팅 `!1`, `!투표1`처럼 카드 번호만 받는다. 시청자(플랫폼:닉네임)당 1표이며 다시 투표하면 마지막 표로 바뀐다. 참고용이며 최종 선택은 스트리머가 한다.
- 생존 예상: 게임별 생존율(API)로 현재 생존자 중 예상 생존 인원을 계산한다.
- `게임 시작`: 선택한 게임을 세션에 저장하고 튜토리얼로 넘어간다.

## 새로고침

새로고침하면 어느 화면이든 첫 화면(`/`)으로 돌아간다(`src/util/resetOnReload.ts`, OAuth `/callback` 제외). 채팅 연결과 진행 상태가 메모리에만 있어 중간 화면에서 다시 시작하지 않게 하기 위함이다. F5·Ctrl/Cmd+R은 확인 팝업을 띄우고, 브라우저의 새로고침 버튼·탭 닫기는 가로챌 수 없어 브라우저 기본 경고창을 띄운다(문구는 브라우저가 정한다). 개발 서버의 HMR 전체 새로고침에는 경고하지 않는다.

## OAuth 설정

PolyChat 샘플의 CHZZK/YouTube 기본 콜백은 `${window.location.origin}/callback`이다. 각 제공자에 실제 사용하는 주소를 정확히 등록한다.

- 개발: `https://dev.galashow.cloud/callback`
- 운영: `https://galashow.cloud/callback`
- 로컬: `http://localhost:5173/callback` (포트를 바꿨다면 해당 origin 사용)

Google의 승인된 JavaScript 원본에는 위 주소에서 `/callback`을 뺀 origin을 등록한다. 샘플에서 주소를 직접 수정한 경우 그 주소도 제공자 설정과 일치해야 한다. CloudFront는 `/callback` 등 SPA 경로를 `index.html`로 제공해야 한다. 제공자 등록과 실제 로그인 검증은 별도 운영 작업이다.

샘플의 CHZZK 요청은 `https://openapi.chzzk.naver.com`으로 직접 전송된다. GalaShow API나 개발 프록시를 거치지 않으며 `VITE_API_URL`의 영향을 받지 않는다. 설정 화면에서 Client ID와 Client Secret을 직접 입력한다. `init({ clientId, redirectUri })` 뒤 `authenticate({ clientSecret })`를 호출하며 입력값은 React 메모리에만 보관한다. Secret은 `VITE_*`, 공개 환경 파일 또는 브라우저 저장소에 넣지 않는다. 입력한 Secret은 현재 페이지와 개발자 도구에서 접근할 수 있다.

2026-09-29 확인 결과 개발 웹(`https://dev.galashow.cloud`)과 로컬(`http://localhost:5173`)에서 치지직 토큰·사용자·세션 API의 OPTIONS 요청은 모두 `403 Invalid CORS request`로 거부되고 허용 origin 헤더가 없다. 현재 치지직 정책에서는 브라우저 직접 호출로 토큰 발급과 채팅 연결을 완료할 수 없다. 코드와 빌드 검증은 이 제한을 해소하거나 실제 로그인 성공을 증명하지 않는다. 프록시나 CORS 우회는 포함하지 않는다.

## 배포

GitHub Actions는 `npm ci`로 `package-lock.json`에 고정된 `polychat-bridge` npm 버전을 설치하고, 실행 요약에 설치된 버전을 남긴다. PolyChat 변경을 배포하려면 먼저 PolyChat의 npm 게시를 마치고 Client의 의존성 버전을 올려 커밋한다. 형제 폴더 체크아웃과 저장소 Variable `POLYCHAT_REF`는 더 이상 사용하지 않는다.

Client가 참조하는 UnityBuild 커밋·LFS 파일은 Client보다 먼저 푸시한다. 아직 원격에 없는 커밋은 GitHub Actions에서 가져올 수 없다.

GitHub Actions `GalaShow Client CI/CD`는 모든 PR과 `develop` push에서 `npm ci`, 테스트, ESLint 및 개발·운영 빌드를 실행한다. 공개 Unity 빌드 서브모듈과 LFS 파일도 받아 완성된 번들을 검증한다. `develop` push는 검증 후 개발에 자동 배포한다. 수동 실행은 선택한 Git ref와 `stage` (`dev`/`prod`)를 사용한다. 운영 배포는 수동 실행만 가능하며 서울 리전(`ap-northeast-2`)을 사용한다.

GitHub Environment `dev`, `prod` 각각에 Variables `AWS_ACCOUNT_ID=251113431583`, `AWS_ROLE_ARN`을 설정한다. AWS 역할은 GitHub OIDC의 해당 저장소·환경 subject만 신뢰해야 한다. 워크플로는 `id-token: write`로 임시 자격증명을 받으며 정적 `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` Secret은 사용하지 않는다. 역할 계정·실제 AWS 계정·버킷 소유자가 다르면 업로드 전에 실패한다.

Environment의 배포 ref 정책은 Client의 `develop` 브랜치와 `v*` 태그를 허용한다. 수동 실행과 Unity에서 요청하는 Client ref도 이 정책을 따른다. `unity_ref`는 별도의 Unity 빌드 커밋이며 Client ref 제한을 대체하지 않는다.

AWS 인증 후 서울 리전의 `galashow-cloud-web-dev` 또는 `galashow-cloud-web-prod` 스택에서 `ClientBucket`, `ClientDistributionId`, `ClientUrl` 출력을 조회한다. 버킷은 `galashow-<계정>-<환경>-client`, URL은 선택한 환경과 일치해야 한다. 역할에는 `cloudformation:DescribeStacks`, 대상 S3 조회·업로드·삭제 및 CloudFront `CreateInvalidation`/`GetInvalidation` 권한이 필요하다. 업로드 후 무효화 완료와 HTTPS 루트·`/lobby` SPA 경로·WASM MIME 및 파일 헤더를 확인한다.

Unity는 기본적으로 Client 커밋의 `build/unity` 서브모듈 SHA를 사용한다. 수동 입력 `unity_ref`에 공개 `Thedum2/GalaShow_UnityBuild`의 정확한 40자리 커밋 SHA를 지정하면 해당 빌드를 사용한다. Unity 게시 워크플로도 이 입력으로 배포를 요청할 수 있다. Client에는 교차 저장소 쓰기 토큰이 필요하지 않다. 배포 전에 네 개의 비압축 WebGL 파일, LFS 포인터 여부, WASM 헤더를 확인하며 JS/WASM/data MIME을 명시한다.

React의 S3 `--delete` 동기화에서 `build/unity/*`, `sample-data/*`를 제외한다. Unity 네 파일은 별도로 갱신하고, 저장소의 샘플은 개발 환경에만 추가·갱신하며 원격 샘플을 삭제하지 않는다. MP4는 `video/mp4`로 업로드한다. 기존 WebGL 빌드와 개발 DB가 참조하는 샘플 미디어가 React 동기화로 사라지지 않도록 한다.

과거의 `S3_BUCKET_DEV`/`S3_BUCKET_PROD`, `DISTRIBUTION_ID_DEV`/`DISTRIBUTION_ID_PROD`, `VITE_API_URL_DEV`/`VITE_API_URL_PROD`, `AWS_REGION` Secret은 사용하지 않는다. GitHub Environment도 `dev`/`prod`로 구분하며 같은 환경의 동시 배포는 직렬화한다. CloudFront 도메인/인증서, API CORS, OAuth 등록은 [전체 도메인 전환 계획](../docs/domain-migration.md)을 따른다. 이 저장소의 빌드 성공은 AWS 배포나 실제 OAuth 성공을 의미하지 않는다.
