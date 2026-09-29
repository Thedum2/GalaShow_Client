# GalaShow Client

## 환경별 주소와 실행

| Vite 모드 | 웹 주소 | API 기본값 |
| --- | --- | --- |
| development | https://dev.galashow.cloud | https://api-dev.galashow.cloud |
| production | https://galashow.cloud | https://api.galashow.cloud |

Node.js 24를 사용한다. Client의 `polychat-bridge`는 형제 폴더 `../PolyChat`의 로컬 패키지를 참조한다. 먼저 공개 저장소 `https://github.com/Thedum2/Poly_chat.git`을 `../PolyChat`에 복제한다 (기본 브랜치 `develop`). 처음 체크아웃할 때 Unity 빌드 서브모듈과 LFS 파일도 가져온다.

```sh
git submodule update --init --recursive
npm ci --prefix ../PolyChat
npm run build --prefix ../PolyChat
npm ci
npm run dev
npm test
npm run build:dev
npm run build:prod
```

빌드 결과는 `build/react/`이며 Unity 파일은 그 아래 `build/unity/`에 복사된다. 서브모듈에 실제 WebGL 파일이 있어야 배포용 빌드가 완성된다. 로컬 Vite 기본 주소는 `http://localhost:5173`이다.

Unity 소스의 기준 버전은 **6000.3.24f1 (Unity 6.3 LTS)**이다. Unity 빌드 게시 후 `build/unity` 서브모듈을 새 빌드 커밋으로 갱신해야 한다. React는 비압축 `WebGL.loader.js`, `WebGL.data`, `WebGL.framework.js`, `WebGL.wasm`을 `/build/unity/`에서 읽는다. 자세한 빌드 절차와 검증 범위는 [Unity 안내](../Unity/README.md)와 [전환 기록](../docs/unity-upgrade.md)을 따른다.

`.env.development`와 `.env.production`은 공개 API 주소를 저장하는 추적 파일이다. 개인별 API 변경은 무시되는 `.env.development.local` 또는 `.env.production.local`에서 `VITE_API_URL`을 지정한다. 실행 환경변수가 있으면 Vite의 환경 파일보다 우선한다. 값이 없거나 비어 있으면 빌드 모드에 맞는 API를 사용하며 끝의 `/`와 앞뒤 공백은 제거한다. `VITE_*`는 브라우저 번들에 포함되므로 비밀 값을 넣지 않는다.

## OAuth 설정

PolyChat 샘플의 CHZZK/YouTube 기본 콜백은 `${window.location.origin}/callback`이다. 각 제공자에 실제 사용하는 주소를 정확히 등록한다.

- 개발: `https://dev.galashow.cloud/callback`
- 운영: `https://galashow.cloud/callback`
- 로컬: `http://localhost:5173/callback` (포트를 바꿨다면 해당 origin 사용)

Google의 승인된 JavaScript 원본에는 위 주소에서 `/callback`을 뺀 origin을 등록한다. 샘플에서 주소를 직접 수정한 경우 그 주소도 제공자 설정과 일치해야 한다. CloudFront는 `/callback` 등 SPA 경로를 `index.html`로 제공해야 한다. 제공자 등록과 실제 로그인 검증은 별도 운영 작업이다.

샘플의 CHZZK 요청은 선택한 API의 `/chzzk`로 전송된다. 공개 clientId는 API의 `/chzzk/config`에서 받고, CHZZK Client Secret은 서버에만 설정한다. 샘플은 CHZZK ID 또는 Secret 입력을 요구하지 않는다.

## 배포

GitHub Actions는 공개 PolyChat 저장소를 형제 폴더로 체크아웃하고 빌드한 뒤 Client를 설치한다. 저장소 Variable `POLYCHAT_REF`에는 배포할 PolyChat의 40자리 커밋 SHA를 권장하며 브랜치·태그도 사용할 수 있다. 값이 없으면 `develop`을 사용한다. 검증 job에서 ref를 정확한 커밋으로 확정하고 배포 job도 같은 커밋을 사용하므로 검증 중 브랜치가 이동해도 다른 코드를 배포하지 않는다. 실행 요약에 실제 PolyChat 커밋을 남긴다.

PolyChat 변경과 Client가 참조하는 UnityBuild 커밋·LFS 파일을 먼저 푸시한 뒤 Client를 푸시한다. 아직 원격에 없는 로컬 커밋은 GitHub Actions에서 가져올 수 없다. 새 CHZZK 계약을 배포할 때도 PolyChat 코드와 `POLYCHAT_REF`를 먼저 반영한다.

GitHub Actions `GalaShow Client CI/CD`는 모든 PR과 `develop` push에서 `npm ci`, 테스트, ESLint 및 개발·운영 빌드를 실행한다. 공개 Unity 빌드 서브모듈과 LFS 파일도 받아 완성된 번들을 검증한다. `develop` push는 검증 후 개발에 자동 배포한다. 수동 실행은 선택한 Git ref와 `stage` (`dev`/`prod`)를 사용한다. 운영 배포는 수동 실행만 가능하며 서울 리전(`ap-northeast-2`)을 사용한다.

GitHub Environment `dev`, `prod` 각각에 Variables `AWS_ACCOUNT_ID=251113431583`, `AWS_ROLE_ARN`을 설정한다. AWS 역할은 GitHub OIDC의 해당 저장소·환경 subject만 신뢰해야 한다. 워크플로는 `id-token: write`로 임시 자격증명을 받으며 정적 `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` Secret은 사용하지 않는다. 역할 계정·실제 AWS 계정·버킷 소유자가 다르면 업로드 전에 실패한다.

Environment의 배포 ref 정책은 Client의 `develop` 브랜치와 `v*` 태그를 허용한다. 수동 실행과 Unity에서 요청하는 Client ref도 이 정책을 따른다. `unity_ref`는 별도의 Unity 빌드 커밋이며 Client ref 제한을 대체하지 않는다.

AWS 인증 후 서울 리전의 `galashow-cloud-web-dev` 또는 `galashow-cloud-web-prod` 스택에서 `ClientBucket`, `ClientDistributionId`, `ClientUrl` 출력을 조회한다. 버킷은 `galashow-<계정>-<환경>-client`, URL은 선택한 환경과 일치해야 한다. 역할에는 `cloudformation:DescribeStacks`, 대상 S3 조회·업로드·삭제 및 CloudFront `CreateInvalidation`/`GetInvalidation` 권한이 필요하다. 업로드 후 무효화 완료와 HTTPS 루트·`/lobby` SPA 경로·WASM MIME 및 파일 헤더를 확인한다.

Unity는 기본적으로 Client 커밋의 `build/unity` 서브모듈 SHA를 사용한다. 수동 입력 `unity_ref`에 공개 `Thedum2/GalaShow_UnityBuild`의 정확한 40자리 커밋 SHA를 지정하면 해당 빌드를 사용한다. Unity 게시 워크플로도 이 입력으로 배포를 요청할 수 있다. Client에는 교차 저장소 쓰기 토큰이 필요하지 않다. 배포 전에 네 개의 비압축 WebGL 파일, LFS 포인터 여부, WASM 헤더를 확인하며 JS/WASM/data MIME을 명시한다.

React의 S3 `--delete` 동기화에서 `build/unity/*`, `sample-data/*`를 제외한다. Unity 네 파일은 별도로 갱신하고, 저장소의 샘플은 개발 환경에만 추가·갱신하며 원격 샘플을 삭제하지 않는다. MP4는 `video/mp4`로 업로드한다. 기존 WebGL 빌드와 개발 DB가 참조하는 샘플 미디어가 React 동기화로 사라지지 않도록 한다.

과거의 `S3_BUCKET_DEV`/`S3_BUCKET_PROD`, `DISTRIBUTION_ID_DEV`/`DISTRIBUTION_ID_PROD`, `VITE_API_URL_DEV`/`VITE_API_URL_PROD`, `AWS_REGION` Secret은 사용하지 않는다. GitHub Environment도 `dev`/`prod`로 구분하며 같은 환경의 동시 배포는 직렬화한다. CloudFront 도메인/인증서, API CORS, OAuth 등록은 [전체 도메인 전환 계획](../docs/domain-migration.md)을 따른다. 이 저장소의 빌드 성공은 AWS 배포나 실제 OAuth 성공을 의미하지 않는다.
