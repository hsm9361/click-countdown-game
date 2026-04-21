# Click Countdown Mini Game — 개발 히스토리

> 2026-04-18 ~ 2026-04-19
> Deep Interview → Autopilot → 반복 개선 파이프라인으로 개발된 카운트다운 스타일 웹 미니게임
> 스택: **Vite + Vanilla TypeScript** (프레임워크 없음, 런타임 의존성 0)

---

## Iteration 1 — MVP 초기 릴리스

### 사용자 입력
> "미니 게임을 만들어보려고 해. 클릭하면 이미지가 나오고, 시간/촉박함을 줘서 안 누르면 안 되게끔 하는 장치도 있었으면 해."

### Deep Interview (6라운드, 최종 모호도 10.7%)
Socratic 질문으로 요구사항을 수학적으로 측정 가능한 수준까지 구체화.

| 라운드 | 타겟 차원 | 결정 | 모호도 |
|---|---|---|---|
| 1 | Goal | 장르: **폭탄 해체 / 카운트다운** | 70.5% |
| 2 | Constraints | 플랫폼: **웹 브라우저 (데스크톱)** | 60.0% |
| 3 | Success Criteria | MVP: **난이도 상승 + 고득점 저장** | 39.0% |
| 4 | Contrarian Mode | 복잡도: **Vite + Vanilla TS** (프레임워크 거부) | 28.5% |
| 5 | Goal 디테일 | 라운드 시퀀스: **이미지 → 클릭** (타겟 방식) | 22.2% |
| 6 | Simplifier Mode | 이미지: **랜덤 위치 + 라운드별 다른** | **10.7%** ✅ |

최종 모호도 20% 임계값 통과 → 스펙 파일 생성 → Autopilot 실행.

### Autopilot (Phase 0 스킵 → Phase 1~5)
- **Phase 1 Planning**: Architect + Critic 합의 — 10개 소스 파일 file-by-file 설계
- **Phase 2 Execution**: Executor가 전체 구현 (zero runtime deps, strict TS)
- **Phase 3 QA**: `tsc --noEmit` 0 errors, `npm run build` 성공
- **Phase 4 Validation** (병렬 3-way):
  - Architect: **APPROVED** (11/11 수용 기준 충족)
  - Security: **APPROVED** (XSS, localStorage, supply-chain 전부 clean)
  - Code Reviewer: **NEEDS_CHANGES** — 1 HIGH + 4 MED 이슈
- **수정**:
  - HIGH: 더블 클릭 레이스 → `addEventListener('click', h, { once: true })`
  - MED: `#target-area` CSS 누락 → `position: absolute; inset: 0; pointer-events: none` + 버튼에 `pointer-events: auto`
  - MED: `pickEmoji`의 redundant `do-while` 제거
  - MED: 미사용 `RoundInfo` 타입 제거
  - MED: 미사용 `EMOJI_POOL` export 제거
  - LOW: `safeMarginPx` 32→56 (점수 표시 겹침 방지)
  - LOW: `DOMContentLoaded` 리스너에 `{ once: true }` 추가
- **재검증**: Code Reviewer **APPROVED** ✓

### 산출물
- 타이머 2000ms → 0.93× decay, 최소 300ms
- 25개 이모지 풀 (랜덤 위치, 비반복)
- localStorage 고득점 영구 저장
- 다크 테마 UI, "다시 하기" 재시작

![초기 데스크톱 플레이](screenshots/01-desktop-gameplay.png)
*그림 1. 초기 MVP 플레이 화면 — 상단 타이머 바, 우측 점수, 랜덤 위치 이모지 타겟*

![초기 게임오버](screenshots/02-desktop-gameover.png)
*그림 2. 게임오버 — 최종 점수, 최고 점수, 다시 하기 버튼*

---

## Iteration 2 — 반응형 + PC 키보드 + 모바일 터치

### 사용자 입력
> "반응형 적응해주고, PC 버전일 때랑 모바일 버전일 때의 이동을 좀 고려해서 개발이 되면 좋을 것 같은데?"

### 해석 (AskUserQuestion으로 명확화)
- "이동" = **입력 방식 차이** (PC: 마우스+키보드, 모바일: 터치)
- 범위: 반응형 레이아웃 + 터치 지원

### Plan 모드 설계
3단계 접근 — **CSS 단일 브레이크포인트 + TS에서 뷰포트 기반 동적 계산 + 전용 입력 모듈 1개 추가**. 계획 파일: `/Users/hongsamyung/.claude/plans/pc-shiny-parrot.md` (사용자 승인 후 구현).

### 구현
- **CSS 반응형**: `@media (max-width: 640px)` 단일 브레이크포인트 — 점수/타이머 바/게임오버 패널 크기·패딩·폰트 조정
- **동적 크기 계산**:
  - `computeTargetSize(defaultSize)` = `clamp(48, floor(min(W,H) × 0.13), 72)`
  - `computeSafeMargin(defaultMargin)` = `max(16, min(56, floor(min(W,H) × 0.08)))`
- **신규 `src/input.ts`**: `window.keydown` 핸들러, `Space`/`Enter` 키 → 현재 타겟 `.click()`, 게임오버 시 Enter → 재시작 버튼 `.click()`, `event.repeat` 가드로 홀드 연사 방지
- **터치 튜닝**:
  - `.target-btn` / `#restart-btn`: `touch-action: manipulation`, `-webkit-tap-highlight-color: transparent`, `-webkit-user-select: none`
  - `.target-btn:hover` 규칙을 `@media (hover: hover) and (pointer: fine)` 로 감싸 모바일 탭 플리커 제거
- **뷰포트 meta 업그레이드**: `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover` (고정 캔버스 게임)
- **리사이즈 처리**: 라운드 중 재배치 없음 (공정성) — 다음 `startRound`가 자연 보정

### 검증
| 뷰포트 | 타겟 크기 | 점수 폰트 | 타이머 바 | 결과 |
|---|---|---|---|---|
| Desktop 1280×800 | 72px (cap) | 24px | 8px | ✅ |
| Tablet 768×1024 | 72px (cap) | 24px | 8px | ✅ |
| Mobile 375×812 | 48px (floor) | 17.6px | 6px | ✅ |

키보드: Space → 점수 +1 ✓, Enter (게임오버) → 재시작 ✓, `repeat: true` → 증가 없음 ✓

![모바일 포트레이트 플레이](screenshots/03-mobile-gameplay.png)
*그림 3. 375×812 모바일 뷰 — 타겟 48px, 점수/타이머 축소, 가로 스크롤 없음*

![모바일 게임오버](screenshots/04-mobile-gameover.png)
*그림 4. 모바일 게임오버 — 패널이 좁은 화면에 맞게 `calc(100vw - 32px)` 로 조정*

---

## Iteration 3 — 게임 테마 아이콘 + 팡 애니메이션 + 반응속도

### 사용자 입력
> "아이콘도 사이트 조사해서 게임에 어울리는 걸로 변경해주고, 선택되면 반응속도가 노출되고 팡 터지는 애니메이션이 나왔으면 좋겠어."

### 구현
- **이모지 풀 교체** (`src/images.ts`): 25개 전부 게임 테마로
  ```
  🎮 🕹️ 🎯 💎 🪙 ⭐ 🌟 ⚡ 💥 🔥
  💣 🚀 🏆 🥇 👑 🎁 💰 🪄 ⚔️ 🛡️
  🏹 🎲 🎰 👾 🤖
  ```
- **반응속도 계산** (`src/game.ts`): `performance.now() - roundStartedAt` → 라운드 시작 시각 추적
- **신규 `popTarget(reactionMs)`** (`src/render.ts`):
  1. 기존 `currentTarget`을 클로저에서 분리 (`currentTarget = null`)
  2. 분리된 버튼에 `.is-popping` 클래스 → 280ms pop 애니메이션 (`scale 1→1.5→2` + `brightness 1.6` + `drop-shadow yellow glow`)
  3. 타겟 중심 좌표에 `.reaction-text` 요소 추가 → 900ms `rise-fade` 애니메이션 (아래→위로 떠오르며 페이드)
  4. `animationend` 리스너 + 600ms/1200ms `setTimeout` 이중 안전장치로 DOM 정리
- **게임 페이싱 유지**: 팝 애니메이션은 기존 타겟에 적용, 다음 라운드 타겟은 즉시 생성 — 지연 없음

### 기술적 포인트
기존 타겟을 `currentTarget = null` 로 분리 후 애니메이션 실행하는 패턴 덕분에 `showTarget` 이 다음 라운드에서 새 버튼을 즉시 생성 가능. 플레이어는 클릭 즉시 다음 타겟으로 넘어가면서도 이전 타겟의 팡 효과를 시각적으로 감상.

![팡 애니메이션 + 반응속도](screenshots/05-pop-reaction.png)
*그림 5. 이전 타겟(🎲)이 팡 애니메이션 중이고 "290ms" 반응속도가 떠오르는 사이, 새 타겟(🪙)이 이미 화면에 등장*

---

## Iteration 4 — 평균 반응속도 + 간헐적 멀티클릭

### 사용자 입력
> "마지막에 평균 반응속도 노출해줬으면 좋겠고, 간헐적으로 몇 번 더 눌러야 하는 변수도 좀 있었으면 좋겠어."

### 구현
- **`GameConfig` 확장** (`src/types.ts`):
  ```ts
  multiClickChance: 0.25       // 25% 확률
  multiClickStartRound: 3       // 라운드 3부터 발생
  multiClickMin: 2              // 2~3회 클릭 필요
  multiClickMax: 3
  ```
- **게임 로직** (`src/game.ts`):
  - `reactionTimes: number[]` — 완료된 라운드의 반응속도 누적
  - `roundIndex` — 현재 라운드 번호
  - `pickClicksRequired()` — 라운드 인덱스 ≥ start 이고 `Math.random() < chance` 이면 `[min, max]` 범위 랜덤, 아니면 1
  - `onTargetClicked` — 남은 클릭 > 0 이면 `pulseTarget()` 후 리턴, 최종 클릭에만 팡 + 반응속도 기록
  - `gameOver` — `reactionTimes.length === 0 ? null : sum / length` 평균 계산 후 전달
- **렌더 레이어** (`src/render.ts`):
  - `showTarget(..., clicksRequired)` — `clicksRequired > 1` 시 `.click-badge` 배지 + `.is-multi` 클래스 (오렌지 글로우)
  - 신규 `pulseTarget(clicksRemaining, onClick)` — 180ms 바운스 애니메이션, 배지 카운터 갱신, `{ once: true }` 리스너 재부착
  - `showGameOver(..., avgReactionMs)` — `avgReactionMs !== null` 이면 `.avg-row` 추가 삽입
- **CSS**:
  - `.click-badge` — 우상단 오렌지 원형 뱃지, 숫자 표시
  - `.target-btn.is-multi` — `drop-shadow(0 0 10px rgba(255, 87, 34, 0.55))` 시각적 구분
  - `@keyframes target-pulse` — `scale 1 → 1.25 → 1` + brightness flare 180ms

### 결정적 테스트
`Math.random = () => 0` 강제 → 25% chance 항상 충족 + `min + floor(0 × span) = 2` 반환.
결과: 라운드 1-2 단일 클릭 (badge 없음), 라운드 3+ 배지 "2" + `is-multi` 확인 ✓

![멀티클릭 배지](screenshots/06-multiclick-badge.png)
*그림 6. 라운드 3 멀티클릭 타겟(🎮) — 오렌지 "2" 배지 + 오렌지 글로우로 시각적 구분*

![평균 반응속도 게임오버](screenshots/07-gameover-with-avg.png)
*그림 7. 게임오버 패널에 "평균 반응속도: 82ms" 줄 추가 + NEW! 최고 점수 배지*

---

## 아키텍처 최종 형상

```
src/
├── main.ts          엔트리 (DOMContentLoaded, { once: true })
├── game.ts          상태 머신 (playing/gameover), 라운드 루프, 멀티클릭 로직
├── render.ts        DOM 렌더 레이어 (GameUI 인터페이스)
├── timer.ts         requestAnimationFrame + performance.now 델타
├── input.ts         키보드 입력 모듈 (Space/Enter) — Iteration 2
├── position.ts      랜덤 위치 + 동적 크기/여백 계산
├── images.ts        게임 테마 이모지 풀 + 비반복 픽커
├── storage.ts       localStorage try/catch 래퍼
├── types.ts         GameConfig, GameState, DEFAULT_CONFIG
└── style.css        다크 테마 + 반응형 + 애니메이션
```

### 설계 철학
- **0 런타임 의존성** — 번들은 순수 애플리케이션 코드만
- **Strict TypeScript** — `any`/`as` 금지
- **명시적 리스너 생명주기** — 모든 리스너 `{ once: true }` 또는 명시적 `removeEventListener`
- **상태 가드 다중화** — 더블 클릭/더블 게임오버 모두 두 계층 방어
- **페일세이프 DOM 정리** — 애니메이션 이벤트 + setTimeout 이중화

## 빌드 통계 (최종)

| 항목 | 원본 | gzip |
|---|---|---|
| JS 번들 | 7.57 kB | 2.92 kB |
| CSS 번들 | 4.71 kB | 1.46 kB |
| HTML | 0.46 kB | 0.30 kB |
| **전체 전송량** | **~12.7 kB** | **~4.7 kB** |

빌드 시간: ~60ms. Vite 6 + TypeScript strict.

## 검증 이력

| Iteration | tsc | build | 코드 리뷰 | 주요 검증 |
|---|---|---|---|---|
| 1 | ✅ 0 errors | ✅ | APPROVED (수정 후) | 11/11 수용 기준, 보안 clean |
| 2 | ✅ 0 errors | ✅ | — | Desktop/Tablet/Mobile + 키보드 Space/Enter |
| 3 | ✅ 0 errors | ✅ | — | 실제 클릭 reactionMs: 290ms 측정 ✓ |
| 4 | ✅ 0 errors | ✅ | — | 결정적 multiClick 트리거 + 평균 row 렌더 ✓ |

## 스크린샷 캡처 방법

`docs/capture/capture.mjs` — puppeteer-core + 시스템 Chrome 으로 headless 자동 캡처.
```bash
npm run dev            # 별도 터미널에서 dev 서버 실행
node docs/capture/capture.mjs   # 7장 PNG를 docs/screenshots/ 에 저장
```

스크립트는 뷰포트 리사이즈, `Math.random` 오버라이드, 프로그래매틱 클릭으로 각 상태를 결정적으로 재현.

---

## 파일 목록

**프로덕션 코드**: `/Users/hongsamyung/project/src/*.ts`, `src/style.css`, `index.html`
**설정**: `package.json`, `tsconfig.json`, `vite.config.ts`
**문서**:
- `.omc/specs/deep-interview-click-countdown-minigame.md` — Iteration 1 스펙
- `.omc/plans/autopilot-impl.md` — Iteration 1 실행 계획
- `~/.claude/plans/pc-shiny-parrot.md` — Iteration 2 설계
- `docs/HISTORY.md` — 본 문서
- `docs/screenshots/*.png` — 이력 스크린샷 7장
- `docs/capture/capture.mjs` — 캡처 자동화 스크립트
