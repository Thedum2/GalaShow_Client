# 타입 정리 마이그레이션 가이드

## 🎉 마이그레이션 완료!

**완료 일시:** 2025년 (세션 재개 후)

모든 컴포넌트의 Props가 성공적으로 이동되었으며, `types/components.ts` 파일이 삭제되었습니다.

---

## ✅ 완료된 작업

### 1. 새로운 타입 구조 생성
```
src/types/
├── common.ts              ✅ 정리 완료 (전역 공통 타입만)
├── domain/                ✅ 새로 생성
│   ├── participant.ts     ✅ 참가자 관련 타입
│   ├── game.ts            ✅ 게임 로직 타입
│   └── platform.ts        ✅ 플랫폼 설정 타입
└── components.ts          ✅ 삭제 완료
```

### 2. 완료된 모든 컴포넌트

#### Welcome 관련
- ✅ `LoginCard.tsx` - Props 내부로 이동
- ✅ `LoginedCard.tsx` - Props 내부로 이동
- ✅ `StepsBox.tsx` - Props 내부로 이동, common.ts에서 Step import
- ✅ `Ribbon.tsx` - common.ts에서 RibbonProps import

#### Lobby 관련
- ✅ `HostInformation.tsx` - Props 내부로 이동
- ✅ `ParticipantList.tsx` - Props 내부로 이동, domain 타입 사용
- ✅ `Participation.tsx` - Props 내부로 이동, domain 타입 사용
- ✅ `ParticipationSelection.tsx` - Props 내부로 이동, domain 타입 사용
- ✅ `StartGameButton.tsx` - Props 내부로 이동
- ✅ `VictoryConditions.tsx` - Props 내부로 이동, domain 타입 사용

#### Common 컴포넌트
- ✅ `SurvivorPanel.tsx` - Props 내부로 이동, domain 타입 사용

#### Pages
- ✅ `Lobby.tsx` - import 수정 완료 (domain 타입 사용)

---

## 🔧 마이그레이션 패턴

### 패턴 1: Props만 이동
```typescript
// Before
import { ComponentProps } from '@/types/components';

export default function Component(props: ComponentProps) { ... }

// After
interface ComponentProps {
    // ... props 정의
}

export default function Component(props: ComponentProps) { ... }
```

### 패턴 2: Props + Domain 타입 사용
```typescript
// Before
import { ParticipantListProps, ParticipantListItem } from '@/types/components';

// After
import { ParticipantListItem } from '@/types/domain/participant';

interface ParticipantListProps {
    participants: ParticipantListItem[];  // domain에서 가져옴
    // ... 다른 props
}
```

### 패턴 3: 공통 타입은 common.ts에서
```typescript
import { Step } from '@/types/common';
import { Participant } from '@/types/domain/participant';

interface MyComponentProps {
    steps: Step[];           // common.ts에서
    participants: Participant[];  // domain에서
    title: string;           // 컴포넌트 전용
}
```

---

## 📂 최종 타입 구조

### types/common.ts ✅
**포함되는 것:**
- 전역 공통 타입 (PlatformType, BackgroundType, FitMode)
- 재사용되는 컴포넌트 Props (FitStageProps, BackgroundProps, IconProps, RibbonProps)
- 재사용되는 UI 타입 (Step, StepExtra)
- 인증 타입 (Tokens)

**포함되지 않는 것:**
- 한 컴포넌트에서만 사용하는 Props
- 비즈니스 로직 타입 (domain/으로)

### types/domain/ ✅
**participant.ts**
- Participant
- ParticipantListItem
- ParticipationSelectionItem

**game.ts**
- VictoryOptionId
- ParticipationOption
- ParticipationInstructions
- DEFAULT_TIME_OPTIONS

**platform.ts**
- PlatformConfig
- PLATFORM_CONFIGS

### 컴포넌트 내부
각 컴포넌트 파일에 해당 Props만 정의

---

## ⚡ 빠른 마이그레이션 명령어

각 파일 수정 시:

1. **types/components.ts**에서 Props 복사
2. 컴포넌트 파일 상단에 `interface` 추가
3. import 문 수정:
   ```typescript
   // 삭제
   - import { MyComponentProps } from '@/types/components';

   // 필요시 추가
   + import { DomainType } from '@/types/domain/...';
   + import { CommonType } from '@/types/common';
   ```
4. 동작 확인: `npm run dev`

---

## 🎯 Phase 2: types/components.ts 삭제

모든 컴포넌트 마이그레이션 완료 후:

1. 사용 확인:
   ```bash
   # types/components 사용하는 파일 검색
   grep -r "from '@/types/components'" src/
   ```

2. 결과가 0개면 삭제:
   ```bash
   rm src/types/components.ts
   ```

---

## 📊 진행 상황 추적

### ✅ 완료: 12/12 컴포넌트
- [x] LoginCard
- [x] LoginedCard
- [x] StepsBox
- [x] Ribbon
- [x] HostInformation
- [x] ParticipantList
- [x] Participation
- [x] ParticipationSelection
- [x] StartGameButton
- [x] VictoryConditions
- [x] SurvivorPanel
- [x] Lobby (page)

### ✅ types/components.ts 삭제 완료
모든 컴포넌트 마이그레이션이 완료되어 `src/types/components.ts` 파일을 안전하게 삭제했습니다.

---

## 💡 Tips

1. **한 번에 하나씩**: 파일 하나 수정 → 테스트 → 다음 파일
2. **Git commit**: 각 컴포넌트 수정 후 commit 권장
3. **TypeScript 에러**: `npm run build` 또는 IDE에서 확인
4. **domain 타입 우선**: 재사용 가능한 비즈니스 로직은 domain/으로

---

## ❓ FAQ

**Q: 어떤 타입을 common.ts에 넣어야 하나요?**
A: 2개 이상의 컴포넌트에서 사용되는 타입만

**Q: Props를 export해야 하나요?**
A: 기본적으로 export 불필요. 다른 파일에서 사용할 때만 export

**Q: 기존 types/components.ts는 언제 삭제?**
A: 모든 import가 제거되고 TypeScript 에러가 없을 때

---

**작업 시작 전 백업 권장!**
```bash
git add .
git commit -m "backup: before type migration"
```
