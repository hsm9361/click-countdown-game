import pptxgen from 'pptxgenjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')
const SHOTS = path.join(ROOT, 'docs', 'screenshots')
const OUT = path.join(ROOT, 'docs', 'presentation.pptx')

const C = {
  bg: '0F0F1F',
  bgLight: '1A1A2E',
  card: '252548',
  cardBorder: '3D3D6B',
  textPrimary: 'FFFFFF',
  textBody: 'E0E0E0',
  textMuted: '8A8AB3',
  accent: 'FF5722',
  accentSoft: 'FFAB91',
  green: '4CAF50',
  yellow: 'FFEB3B',
  blue: '5C6BC0',
  divider: '2D2D4E',
  red: 'FF5252',
  orange: 'FFB74D',
}

const FONT_KR = 'Malgun Gothic'
const FONT_MONO = 'Consolas'

const pres = new pptxgen()
pres.layout = 'LAYOUT_16x9'
pres.author = 'Click Countdown Project'
pres.title = 'Click Countdown 미니 게임 개발 히스토리'

function newSlide() {
  const s = pres.addSlide()
  s.background = { color: C.bg }
  return s
}

function addTitle(slide, text) {
  slide.addText(text, {
    x: 0.5, y: 0.3, w: 9, h: 0.7,
    fontSize: 26, fontFace: FONT_KR, bold: true, color: C.textPrimary,
    margin: 0, valign: 'middle',
  })
}

// ─── 1. Title ─────────────────────────────────────────────────────────
{
  const s = newSlide()
  s.addShape(pres.shapes.OVAL, {
    x: 0.5, y: 0.5, w: 0.25, h: 0.25,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('Click Countdown', {
    x: 0.5, y: 1.6, w: 9, h: 1.0,
    fontSize: 54, fontFace: FONT_KR, bold: true, color: C.textPrimary,
    margin: 0, valign: 'middle',
  })
  s.addText('미니 게임 개발 히스토리', {
    x: 0.5, y: 2.55, w: 9, h: 0.7,
    fontSize: 30, fontFace: FONT_KR, color: C.textBody,
    margin: 0, valign: 'middle',
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.55, w: 1.5, h: 0.05,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('Deep Interview → Autopilot → 반복 개선', {
    x: 0.5, y: 3.7, w: 9, h: 0.5,
    fontSize: 17, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })
  s.addText([
    { text: '2026-04-18 ~ 04-19', options: { color: C.textMuted, breakLine: true } },
    { text: 'Vite + Vanilla TypeScript', options: { color: C.accentSoft, bold: true } },
  ], {
    x: 0.5, y: 4.6, w: 9, h: 0.7,
    fontSize: 14, fontFace: FONT_KR, margin: 0,
  })
}

// ─── 2. Overview ──────────────────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '4단계 반복 개선 사이클')
  const items = [
    { num: '01', title: 'MVP', desc: '카운트다운 게임 기본 구현 + Deep Interview + Autopilot' },
    { num: '02', title: '반응형 + 입력', desc: 'CSS 미디어쿼리 + PC 키보드 + 모바일 터치 지원' },
    { num: '03', title: '아이콘 + 애니메이션', desc: '게임 테마 이모지 + 팡 효과 + 반응속도 표시' },
    { num: '04', title: '평균 + 멀티클릭', desc: '평균 반응속도 노출 + 25% 확률 멀티클릭 변수' },
  ]
  let y = 1.3
  items.forEach((it) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.85,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.08, h: 0.85,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    })
    s.addText(it.num, {
      x: 0.7, y: y + 0.1, w: 0.8, h: 0.65,
      fontSize: 26, fontFace: FONT_KR, bold: true, color: C.accent,
      margin: 0, valign: 'middle',
    })
    s.addText(it.title, {
      x: 1.6, y: y + 0.08, w: 2.6, h: 0.35,
      fontSize: 17, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(it.desc, {
      x: 1.6, y: y + 0.42, w: 7.2, h: 0.4,
      fontSize: 12, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, valign: 'middle',
    })
    y += 1.0
  })
}

// ─── 3. Iter 1 — Deep Interview Table ─────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 1 · Deep Interview (6라운드)')
  s.addText('Socratic 질문으로 모호도를 수학적으로 측정하며 요구사항 결정', {
    x: 0.5, y: 1.0, w: 9, h: 0.3,
    fontSize: 13, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })

  const hdr = (text, opts = {}) => ({
    text,
    options: { bold: true, color: C.textPrimary, fill: { color: C.card }, fontSize: 13, fontFace: FONT_KR, valign: 'middle', ...opts },
  })
  const cell = (text, opts = {}) => ({
    text,
    options: { color: C.textBody, fontSize: 12, fontFace: FONT_KR, valign: 'middle', fill: { color: C.bgLight }, ...opts },
  })
  const muted = (text, opts = {}) => cell(text, { color: C.textMuted, align: 'right', ...opts })
  const accent = (text) => cell(text, { color: C.accent, bold: true, align: 'right' })

  s.addTable([
    [hdr('#'), hdr('타겟 차원'), hdr('결정'), hdr('모호도', { align: 'right' })],
    [cell('1', { bold: true }), cell('Goal'), cell('폭탄 해체 / 카운트다운'), muted('70.5%')],
    [cell('2', { bold: true }), cell('Constraints'), cell('데스크톱 웹 브라우저'), muted('60.0%')],
    [cell('3', { bold: true }), cell('Success Criteria'), cell('난이도 상승 + 고득점 저장'), muted('39.0%')],
    [cell('4', { bold: true }), cell('Contrarian'), cell('Vite + Vanilla TS (프레임워크 거부)'), muted('28.5%')],
    [cell('5', { bold: true }), cell('Goal 디테일'), cell('이미지 등장 → 제한시간 내 클릭'), muted('22.2%')],
    [cell('6', { bold: true }), cell('Simplifier'), cell('랜덤 위치 + 라운드별 다른 이미지'), accent('10.7% ✓')],
  ], {
    x: 0.5, y: 1.4, w: 9, colW: [0.5, 1.8, 5.2, 1.5],
    rowH: 0.42,
    border: { type: 'solid', color: C.divider, pt: 1 },
  })

  s.addText('최종 모호도 10.7% — 임계값 20% 통과 → Autopilot 실행', {
    x: 0.5, y: 4.95, w: 9, h: 0.4,
    fontSize: 13, fontFace: FONT_KR, color: C.green, italic: true, margin: 0,
  })
}

// ─── 4. Iter 1 — Autopilot Phases ─────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 1 · Autopilot 5단계 (Phase 0 스킵)')
  const phases = [
    { num: '1', title: 'Planning', desc: 'Architect + Critic 합의로 file-by-file 설계 (10개 파일)', color: C.blue },
    { num: '2', title: 'Execution', desc: 'Executor 전체 구현, strict TS, zero deps', color: C.blue },
    { num: '3', title: 'QA', desc: 'tsc 0 errors, npm run build 성공', color: C.green },
    { num: '4', title: 'Validation', desc: '3-way 병렬 검증 (Architect / Security / Code Reviewer)', color: C.accent },
    { num: '5', title: 'Cleanup', desc: '상태 파일 정리 + 완료 보고', color: C.green },
  ]
  const cardW = 1.7, gap = 0.13
  phases.forEach((p, i) => {
    const x = 0.5 + i * (cardW + gap)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: cardW, h: 2.2,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: cardW, h: 0.08,
      fill: { color: p.color }, line: { color: p.color, width: 0 },
    })
    s.addText(`Phase ${p.num}`, {
      x: x + 0.12, y: 1.5, w: cardW - 0.24, h: 0.3,
      fontSize: 11, fontFace: FONT_KR, color: C.textMuted, bold: true,
      margin: 0, valign: 'middle',
    })
    s.addText(p.title, {
      x: x + 0.12, y: 1.85, w: cardW - 0.24, h: 0.4,
      fontSize: 17, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(p.desc, {
      x: x + 0.12, y: 2.35, w: cardW - 0.24, h: 1.05,
      fontSize: 10, fontFace: FONT_KR, color: C.textBody,
      margin: 0, valign: 'top',
    })
  })

  // Validation result callout
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.0, w: 9, h: 1.1,
    fill: { color: C.bgLight }, line: { color: C.accent, width: 1 },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.0, w: 0.08, h: 1.1,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('Phase 4 결과', {
    x: 0.7, y: 4.05, w: 8.7, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.accent, bold: true,
    margin: 0, valign: 'middle',
  })
  s.addText([
    { text: 'Architect: APPROVED   ·   Security: APPROVED   ·   ', options: { color: C.green } },
    { text: 'Code Reviewer: NEEDS_CHANGES', options: { color: C.accent, bold: true } },
    { text: ' (1 HIGH + 4 MED)', options: { color: C.textBody } },
  ], {
    x: 0.7, y: 4.35, w: 8.7, h: 0.4,
    fontSize: 13, fontFace: FONT_KR,
    margin: 0, valign: 'middle',
  })
  s.addText('5가지 이슈 수정 후 재검증 → APPROVED ✓', {
    x: 0.7, y: 4.7, w: 8.7, h: 0.35,
    fontSize: 12, fontFace: FONT_KR, color: C.textMuted, italic: true,
    margin: 0, valign: 'middle',
  })
}

// ─── 5. Iter 1 — Issues Fixed ─────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 1 · 수정된 코드 리뷰 이슈')
  const hdr = (text, opts = {}) => ({
    text,
    options: { bold: true, color: C.textPrimary, fill: { color: C.card }, fontSize: 13, fontFace: FONT_KR, valign: 'middle', ...opts },
  })
  const cell = (text, opts = {}) => ({
    text,
    options: { color: C.textBody, fontSize: 11, fontFace: FONT_KR, valign: 'middle', fill: { color: C.bgLight }, ...opts },
  })
  const sev = (label, color) => cell(label, { color, bold: true, align: 'center' })

  s.addTable([
    [hdr('심각도', { align: 'center' }), hdr('이슈'), hdr('수정 방법')],
    [sev('HIGH', C.red), cell('타겟 버튼 더블클릭 레이스 (점수 중복 증가)'), cell('addEventListener(.., { once: true })', { fontFace: FONT_MONO })],
    [sev('MED', C.orange), cell('#target-area CSS 누락 → 0차원 컨테이너'), cell('position: absolute; inset: 0', { fontFace: FONT_MONO })],
    [sev('MED', C.orange), cell('pickEmoji의 dead-code do-while 루프'), cell('필터로 이미 보장됨 → 직접 인덱스 선택')],
    [sev('MED', C.orange), cell('미사용 RoundInfo 타입 export'), cell('인터페이스 제거')],
    [sev('LOW', C.textMuted), cell('타겟이 점수 표시와 시각적 겹침'), cell('safeMarginPx 32 → 56', { fontFace: FONT_MONO })],
  ], {
    x: 0.5, y: 1.3, w: 9, colW: [1.0, 4.5, 3.5],
    rowH: 0.55,
    border: { type: 'solid', color: C.divider, pt: 1 },
  })
}

// ─── 6. Iter 1 — Result Screenshots ───────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 1 · 결과 — 카운트다운 게임 MVP')
  s.addImage({ path: path.join(SHOTS, '01-desktop-gameplay.png'), x: 0.5, y: 1.3, w: 4.4, h: 2.75 })
  s.addText('플레이 화면', {
    x: 0.5, y: 4.05, w: 4.4, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.textMuted, italic: true, margin: 0, align: 'center',
  })
  s.addImage({ path: path.join(SHOTS, '02-desktop-gameover.png'), x: 5.1, y: 1.3, w: 4.4, h: 2.75 })
  s.addText('게임오버 화면', {
    x: 5.1, y: 4.05, w: 4.4, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.textMuted, italic: true, margin: 0, align: 'center',
  })

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.6, w: 9, h: 0.55,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 0 },
  })
  s.addText([
    { text: '타이머 ', options: { color: C.textMuted } },
    { text: '2000ms → 0.93× decay', options: { color: C.green, bold: true } },
    { text: ' (최소 300ms)   ·   ', options: { color: C.textMuted } },
    { text: 'localStorage 고득점', options: { color: C.accent, bold: true } },
    { text: ' 영구 저장', options: { color: C.textMuted } },
  ], {
    x: 0.5, y: 4.6, w: 9, h: 0.55,
    fontSize: 13, fontFace: FONT_KR,
    margin: 0, valign: 'middle', align: 'center',
  })
}

// ─── 7. Iter 2 — Request + Interpretation ─────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 2 · 반응형 + PC/모바일 입력')
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 9, h: 1.0,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 0.08, h: 1.0,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('사용자 요청', {
    x: 0.7, y: 1.35, w: 8.7, h: 0.25,
    fontSize: 10, fontFace: FONT_KR, color: C.accent, bold: true, margin: 0,
  })
  s.addText('"반응형 적응해주고, PC 버전일 때랑 모바일 버전일 때의 이동을 좀 고려해서 개발이 되면 좋을 것 같은데?"', {
    x: 0.7, y: 1.6, w: 8.7, h: 0.65,
    fontSize: 14, fontFace: FONT_KR, color: C.textBody, italic: true,
    margin: 0, valign: 'middle',
  })

  s.addText('AskUserQuestion으로 명확화 ↓', {
    x: 0.5, y: 2.45, w: 9, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.textMuted, align: 'center', margin: 0, italic: true,
  })

  // Two interpretations
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.85, w: 4.4, h: 2.0,
    fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
  })
  s.addText('"이동" = 입력 방식 차이', {
    x: 0.7, y: 2.95, w: 4.0, h: 0.4,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })
  s.addText([
    { text: 'PC: ', options: { color: C.textMuted } },
    { text: '마우스 + 키보드', options: { color: C.textPrimary, bold: true, breakLine: true } },
    { text: 'Mobile: ', options: { color: C.textMuted } },
    { text: '터치 (또는 외부 마우스)', options: { color: C.textPrimary, bold: true } },
  ], {
    x: 0.7, y: 3.45, w: 4.0, h: 1.3,
    fontSize: 13, fontFace: FONT_KR, margin: 0, valign: 'top',
  })

  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 2.85, w: 4.4, h: 2.0,
    fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
  })
  s.addText('범위: 반응형 + 터치 지원', {
    x: 5.3, y: 2.95, w: 4.0, h: 0.4,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })
  s.addText([
    { text: '단일 브레이크포인트 ', options: { color: C.textMuted } },
    { text: '640px', options: { color: C.green, bold: true, breakLine: true } },
    { text: '동적 타겟 크기 ', options: { color: C.textMuted } },
    { text: 'clamp(48, ·, 72)', options: { color: C.green, bold: true, fontFace: FONT_MONO, breakLine: true } },
    { text: '신규 ', options: { color: C.textMuted } },
    { text: 'src/input.ts', options: { color: C.green, bold: true, fontFace: FONT_MONO } },
  ], {
    x: 5.3, y: 3.45, w: 4.0, h: 1.3,
    fontSize: 12, fontFace: FONT_KR, margin: 0, valign: 'top',
  })
}

// ─── 8. Iter 2 — Implementation 5 items ───────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 2 · 핵심 구현 5가지')
  const items = [
    { title: 'CSS 단일 브레이크포인트', code: '@media (max-width: 640px)', desc: '점수/타이머/모달 크기·패딩·폰트만 조정' },
    { title: '동적 타겟 크기', code: 'clamp(48, floor(min(W,H) × 0.13), 72)', desc: '뷰포트 기반으로 라운드마다 재계산' },
    { title: '동적 안전 여백', code: 'max(16, min(56, floor(min(W,H) × 0.08)))', desc: '320px 폭에서도 가장자리 클립 방지' },
    { title: '키보드 입력 모듈 (신규)', code: 'src/input.ts', desc: 'Space/Enter 키로 타겟 클릭, event.repeat 가드' },
    { title: '터치 튜닝', code: 'touch-action: manipulation', desc: '300ms 탭 지연 제거, hover는 (hover:hover)로 격리' },
  ]
  let y = 1.3
  items.forEach(it => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.7,
      fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.OVAL, {
      x: 0.7, y: y + 0.18, w: 0.36, h: 0.36,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    })
    s.addText(it.title, {
      x: 1.2, y: y + 0.05, w: 3.6, h: 0.3,
      fontSize: 13, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(it.code, {
      x: 1.2, y: y + 0.36, w: 3.6, h: 0.3,
      fontSize: 11, fontFace: FONT_MONO, color: C.green,
      margin: 0, valign: 'middle',
    })
    s.addText(it.desc, {
      x: 4.95, y: y + 0.15, w: 4.4, h: 0.4,
      fontSize: 12, fontFace: FONT_KR, color: C.textBody,
      margin: 0, valign: 'middle',
    })
    y += 0.78
  })
}

// ─── 9. Iter 2 — Verification + Mobile Screenshots ────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 2 · 뷰포트 검증 + 모바일 결과')

  const hdr = (text, opts = {}) => ({
    text,
    options: { bold: true, color: C.textPrimary, fill: { color: C.card }, fontSize: 11, fontFace: FONT_KR, valign: 'middle', align: 'center', ...opts },
  })
  const cell = (text, opts = {}) => ({
    text,
    options: { color: C.textBody, fontSize: 11, fontFace: FONT_KR, valign: 'middle', fill: { color: C.bgLight }, align: 'center', ...opts },
  })

  s.addTable([
    [hdr('뷰포트'), hdr('타겟'), hdr('점수폰트'), hdr('타이머')],
    [cell('Desktop\n1280', { bold: true }), cell('72px', { color: C.green }), cell('24px'), cell('8px')],
    [cell('Tablet\n768', { bold: true }), cell('72px', { color: C.green }), cell('24px'), cell('8px')],
    [cell('Mobile\n375', { bold: true, color: C.accent }), cell('48px', { color: C.accent }), cell('17.6px', { color: C.accent }), cell('6px', { color: C.accent })],
  ], {
    x: 0.5, y: 1.4, w: 4.0, colW: [1.0, 1.0, 1.0, 1.0],
    rowH: 0.55,
    border: { type: 'solid', color: C.divider, pt: 1 },
  })

  s.addText([
    { text: '키보드 검증', options: { color: C.accent, bold: true, breakLine: true } },
    { text: 'Space → 점수 +1 ✓', options: { color: C.textBody, breakLine: true } },
    { text: 'Enter (게임오버) → 재시작 ✓', options: { color: C.textBody, breakLine: true } },
    { text: 'repeat: true → 가드됨 ✓', options: { color: C.textBody } },
  ], {
    x: 0.5, y: 3.85, w: 4.0, h: 1.3,
    fontSize: 12, fontFace: FONT_KR, margin: 0, valign: 'top',
  })

  s.addImage({ path: path.join(SHOTS, '03-mobile-gameplay.png'), x: 4.85, y: 1.2, w: 2.0, h: 4.0 })
  s.addText('모바일 플레이', {
    x: 4.85, y: 5.2, w: 2.0, h: 0.3,
    fontSize: 10, fontFace: FONT_KR, color: C.textMuted, italic: true, margin: 0, align: 'center',
  })

  s.addImage({ path: path.join(SHOTS, '04-mobile-gameover.png'), x: 7.4, y: 1.2, w: 2.0, h: 4.0 })
  s.addText('모바일 게임오버', {
    x: 7.4, y: 5.2, w: 2.0, h: 0.3,
    fontSize: 10, fontFace: FONT_KR, color: C.textMuted, italic: true, margin: 0, align: 'center',
  })
}

// ─── 10. Iter 3 — Request + 3 features ────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 3 · 게임 테마 + 팡 + 반응속도')
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 9, h: 1.0,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 0.08, h: 1.0,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('사용자 요청', {
    x: 0.7, y: 1.35, w: 8.7, h: 0.25,
    fontSize: 10, fontFace: FONT_KR, color: C.accent, bold: true, margin: 0,
  })
  s.addText('"아이콘도 사이트 조사해서 게임에 어울리는 걸로 변경해주고, 선택되면 반응속도가 노출되고 팡 터지는 애니메이션이 나왔으면 좋겠어."', {
    x: 0.7, y: 1.6, w: 8.7, h: 0.65,
    fontSize: 13, fontFace: FONT_KR, color: C.textBody, italic: true,
    margin: 0, valign: 'middle',
  })

  const pills = [
    { icon: '🎮', title: '게임 테마 아이콘', sub: '25개 이모지 풀 교체' },
    { icon: '⏱️', title: '반응속도 노출', sub: 'performance.now 델타' },
    { icon: '💥', title: '팡 애니메이션', sub: 'CSS keyframes 280ms' },
  ]
  const pillW = 2.85, pillGap = 0.13
  pills.forEach((p, i) => {
    const x = 0.5 + i * (pillW + pillGap)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.6, w: pillW, h: 2.4,
      fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.6, w: pillW, h: 0.08,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    })
    s.addText(p.icon, {
      x, y: 2.85, w: pillW, h: 1.3,
      fontSize: 56, margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(p.title, {
      x: x + 0.1, y: 4.1, w: pillW - 0.2, h: 0.4,
      fontSize: 14, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(p.sub, {
      x: x + 0.1, y: 4.5, w: pillW - 0.2, h: 0.4,
      fontSize: 11, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, align: 'center', valign: 'middle',
    })
  })
}

// ─── 11. Iter 3 — Emoji Pool 5x5 grid ─────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 3 · 게임 테마 이모지 풀 (25개)')
  s.addText('잡다한 25개 → 액션 / 리워드 / 아케이드 테마로 전면 교체', {
    x: 0.5, y: 1.0, w: 9, h: 0.3,
    fontSize: 13, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })
  const emojis = ['🎮', '🕹️', '🎯', '💎', '🪙', '⭐', '🌟', '⚡', '💥', '🔥', '💣', '🚀', '🏆', '🥇', '👑', '🎁', '💰', '🪄', '⚔️', '🛡️', '🏹', '🎲', '🎰', '👾', '🤖']
  const cols = 5, cellW = 1.3, cellH = 0.7
  const gridX = (10 - cols * cellW) / 2
  const gridY = 1.6
  emojis.forEach((emoji, i) => {
    const r = Math.floor(i / cols)
    const c = i % cols
    const x = gridX + c * cellW
    const y = gridY + r * cellH
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.05, y: y + 0.05, w: cellW - 0.1, h: cellH - 0.1,
      fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
    })
    s.addText(emoji, {
      x: x + 0.05, y: y + 0.05, w: cellW - 0.1, h: cellH - 0.1,
      fontSize: 26, margin: 0, align: 'center', valign: 'middle',
    })
  })
}

// ─── 12. Iter 3 — popTarget 4-step Sequence ───────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 3 · popTarget — 4단계 시퀀스')
  s.addText('게임 페이싱을 깨뜨리지 않으면서 팡 효과 구현', {
    x: 0.5, y: 1.0, w: 9, h: 0.3,
    fontSize: 13, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })

  const steps = [
    { num: '1', title: '타겟 분리', desc: 'currentTarget = null\n(클로저에서 제거)' },
    { num: '2', title: '팡 클래스 부여', desc: '.is-popping 추가\n280ms scale + flare' },
    { num: '3', title: '반응속도 표시', desc: '.reaction-text 요소\n900ms rise-fade' },
    { num: '4', title: '안전 정리', desc: 'animationend +\nsetTimeout 이중화' },
  ]
  const cardW = 2.0, cardGap = 0.18
  const startX = (10 - cardW * 4 - cardGap * 3) / 2
  steps.forEach((st, i) => {
    const x = startX + i * (cardW + cardGap)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: cardW, h: 2.5,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.OVAL, {
      x: x + (cardW - 0.7) / 2, y: 1.8, w: 0.7, h: 0.7,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    })
    s.addText(st.num, {
      x: x + (cardW - 0.7) / 2, y: 1.8, w: 0.7, h: 0.7,
      fontSize: 24, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(st.title, {
      x: x + 0.1, y: 2.6, w: cardW - 0.2, h: 0.4,
      fontSize: 14, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(st.desc, {
      x: x + 0.1, y: 3.05, w: cardW - 0.2, h: 1.0,
      fontSize: 10, fontFace: FONT_KR, color: C.textBody,
      margin: 0, align: 'center', valign: 'top',
    })
    if (i < steps.length - 1) {
      s.addText('▸', {
        x: x + cardW, y: 2.8, w: cardGap, h: 0.4,
        fontSize: 18, color: C.accent,
        margin: 0, align: 'center', valign: 'middle',
      })
    }
  })

  s.addText('기존 타겟 분리 후 애니메이션 → 새 타겟 즉시 생성 가능 → 게임 페이싱 유지', {
    x: 0.5, y: 4.45, w: 9, h: 0.5,
    fontSize: 13, fontFace: FONT_KR, color: C.green, italic: true, align: 'center', margin: 0, valign: 'middle',
  })
}

// ─── 13. Iter 3 — Result Screenshot ───────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 3 · 팡 애니메이션 + 반응속도 (실측)')
  s.addImage({ path: path.join(SHOTS, '05-pop-reaction.png'), x: 1.5, y: 1.3, w: 7.0, h: 3.6 })

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 5.05, w: 9, h: 0.5,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 0 },
  })
  s.addText([
    { text: '이전 타겟 ', options: { color: C.textMuted } },
    { text: '🎲', options: {} },
    { text: ' 팡 애니메이션 중 ', options: { color: C.textMuted } },
    { text: '"290ms"', options: { color: C.green, bold: true, fontFace: FONT_MONO } },
    { text: ' 반응속도 표시 → 새 타겟 ', options: { color: C.textMuted } },
    { text: '🪙', options: {} },
    { text: ' 즉시 등장', options: { color: C.textMuted } },
  ], {
    x: 0.5, y: 5.05, w: 9, h: 0.5,
    fontSize: 12, fontFace: FONT_KR, margin: 0, align: 'center', valign: 'middle',
  })
}

// ─── 14. Iter 4 — Request + 2 features ────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 4 · 평균 반응속도 + 멀티클릭')
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 9, h: 1.0,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 0.08, h: 1.0,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('사용자 요청', {
    x: 0.7, y: 1.35, w: 8.7, h: 0.25,
    fontSize: 10, fontFace: FONT_KR, color: C.accent, bold: true, margin: 0,
  })
  s.addText('"마지막에 평균 반응속도 노출해줬으면 좋겠고, 간헐적으로 몇 번 더 눌러야 하는 변수도 좀 있었으면 좋겠어."', {
    x: 0.7, y: 1.6, w: 8.7, h: 0.65,
    fontSize: 14, fontFace: FONT_KR, color: C.textBody, italic: true,
    margin: 0, valign: 'middle',
  })

  // Left: 평균
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 2.6, w: 4.4, h: 2.6,
    fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
  })
  s.addText('⏱️', {
    x: 0.5, y: 2.75, w: 4.4, h: 0.8,
    fontSize: 44, margin: 0, align: 'center', valign: 'middle',
  })
  s.addText('평균 반응속도', {
    x: 0.5, y: 3.7, w: 4.4, h: 0.4,
    fontSize: 16, fontFace: FONT_KR, bold: true, color: C.textPrimary,
    margin: 0, align: 'center',
  })
  s.addText([
    { text: '게임오버 화면에', options: { color: C.textBody, breakLine: true } },
    { text: '"평균 반응속도: Nms"', options: { color: C.green, fontFace: FONT_MONO, breakLine: true } },
    { text: '완료 라운드의 sum / length', options: { color: C.textMuted } },
  ], {
    x: 0.7, y: 4.15, w: 4.0, h: 1.0,
    fontSize: 12, fontFace: FONT_KR, margin: 0, align: 'center',
  })

  // Right: 멀티클릭
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 2.6, w: 4.4, h: 2.6,
    fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
  })
  s.addText('🎯', {
    x: 5.1, y: 2.75, w: 4.4, h: 0.8,
    fontSize: 44, margin: 0, align: 'center', valign: 'middle',
  })
  s.addText('간헐적 멀티클릭', {
    x: 5.1, y: 3.7, w: 4.4, h: 0.4,
    fontSize: 16, fontFace: FONT_KR, bold: true, color: C.textPrimary,
    margin: 0, align: 'center',
  })
  s.addText([
    { text: '라운드 3+ ', options: { color: C.textBody } },
    { text: '25%', options: { color: C.accent, bold: true } },
    { text: ' 확률', options: { color: C.textBody, breakLine: true } },
    { text: '2~3회 클릭 필요', options: { color: C.green, fontFace: FONT_MONO, breakLine: true } },
    { text: '오렌지 배지로 시각적 구분', options: { color: C.textMuted } },
  ], {
    x: 5.3, y: 4.15, w: 4.0, h: 1.0,
    fontSize: 12, fontFace: FONT_KR, margin: 0, align: 'center',
  })
}

// ─── 15. Iter 4 — Implementation Code ─────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 4 · 구현 — Config + 로직')

  // Left: Config table
  s.addText('GameConfig 확장 (4 필드)', {
    x: 0.5, y: 1.2, w: 4.0, h: 0.35,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })

  const hdr = (text, opts = {}) => ({
    text,
    options: { bold: true, color: C.textPrimary, fill: { color: C.card }, fontSize: 11, fontFace: FONT_KR, valign: 'middle', ...opts },
  })
  const cell = (text, opts = {}) => ({
    text,
    options: { color: C.textBody, fontSize: 11, fontFace: FONT_MONO, valign: 'middle', fill: { color: C.bgLight }, ...opts },
  })

  s.addTable([
    [hdr('Field'), hdr('Value', { align: 'right' })],
    [cell('multiClickChance'), cell('0.25', { color: C.green, align: 'right' })],
    [cell('multiClickStartRound'), cell('3', { color: C.green, align: 'right' })],
    [cell('multiClickMin'), cell('2', { color: C.green, align: 'right' })],
    [cell('multiClickMax'), cell('3', { color: C.green, align: 'right' })],
  ], {
    x: 0.5, y: 1.6, w: 4.0, colW: [2.5, 1.5],
    rowH: 0.42,
    border: { type: 'solid', color: C.divider, pt: 1 },
  })

  // Right: code block
  s.addText('onTargetClicked() 핵심 로직', {
    x: 5.0, y: 1.2, w: 4.5, h: 0.35,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.0, y: 1.6, w: 4.5, h: 3.6,
    fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
  })
  s.addText([
    { text: 'clicksRemaining -= 1', options: { color: C.textPrimary, breakLine: true } },
    { text: 'if (clicksRemaining > 0) {', options: { color: C.textBody, breakLine: true } },
    { text: '  ui.pulseTarget(...)', options: { color: C.green, breakLine: true } },
    { text: '  return  // 라운드 안 끝남', options: { color: C.textMuted, breakLine: true } },
    { text: '}', options: { color: C.textBody, breakLine: true } },
    { text: 'reactionTimes.push(reactionMs)', options: { color: C.accent, breakLine: true } },
    { text: 'score += 1', options: { color: C.textPrimary, breakLine: true } },
    { text: 'currentTimeMs *= decayFactor', options: { color: C.textBody, breakLine: true } },
    { text: 'ui.popTarget(reactionMs)', options: { color: C.green, breakLine: true } },
    { text: 'startRound()', options: { color: C.textPrimary } },
  ], {
    x: 5.15, y: 1.7, w: 4.2, h: 3.45,
    fontSize: 10, fontFace: FONT_MONO, margin: 0.08, valign: 'top',
    paraSpaceAfter: 2,
  })
}

// ─── 16. Iter 4 — Result Screenshots ──────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Iteration 4 · 결과 — 멀티클릭 + 평균 반응속도')

  s.addImage({ path: path.join(SHOTS, '06-multiclick-badge.png'), x: 0.5, y: 1.3, w: 4.4, h: 2.75 })
  s.addText('라운드 3+ 멀티클릭 (배지 "2" + 오렌지 글로우)', {
    x: 0.5, y: 4.05, w: 4.4, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.textMuted, italic: true, margin: 0, align: 'center',
  })

  s.addImage({ path: path.join(SHOTS, '07-gameover-with-avg.png'), x: 5.1, y: 1.3, w: 4.4, h: 2.75 })
  s.addText('게임오버 — "평균 반응속도: 82ms"', {
    x: 5.1, y: 4.05, w: 4.4, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.textMuted, italic: true, margin: 0, align: 'center',
  })

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.6, w: 9, h: 0.55,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 0 },
  })
  s.addText([
    { text: '결정적 테스트: ', options: { color: C.textMuted } },
    { text: 'Math.random = () => 0', options: { color: C.green, bold: true, fontFace: FONT_MONO } },
    { text: ' → 라운드 1-2 단일, 라운드 3+ 배지 "2" + ', options: { color: C.textMuted } },
    { text: 'is-multi', options: { color: C.accent, fontFace: FONT_MONO } },
    { text: ' ✓', options: { color: C.green } },
  ], {
    x: 0.5, y: 4.6, w: 9, h: 0.55,
    fontSize: 12, fontFace: FONT_KR, margin: 0, valign: 'middle', align: 'center',
  })
}

// ─── 17. Final Architecture ───────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '최종 아키텍처')

  s.addText('src/', {
    x: 0.5, y: 1.2, w: 4.0, h: 0.35,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })

  const tree = [
    { f: 'main.ts', d: '엔트리 (DOMContentLoaded)' },
    { f: 'game.ts', d: '상태 머신 + 라운드 + 멀티클릭' },
    { f: 'render.ts', d: 'GameUI 인터페이스' },
    { f: 'timer.ts', d: 'rAF + performance.now 델타' },
    { f: 'input.ts', d: 'Space/Enter 키보드 (Iter. 2)' },
    { f: 'position.ts', d: '랜덤 위치 + 동적 크기/여백' },
    { f: 'images.ts', d: '게임 테마 이모지 풀 (Iter. 3)' },
    { f: 'storage.ts', d: 'localStorage try/catch' },
    { f: 'types.ts', d: 'GameConfig, GameState' },
    { f: 'style.css', d: '다크 + 반응형 + 애니메이션' },
  ]
  let y = 1.6
  tree.forEach(it => {
    s.addText(`├ ${it.f}`, {
      x: 0.5, y, w: 2.0, h: 0.32,
      fontSize: 11, fontFace: FONT_MONO, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(it.d, {
      x: 2.5, y, w: 2.5, h: 0.32,
      fontSize: 10, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, valign: 'middle',
    })
    y += 0.32
  })

  s.addText('설계 철학', {
    x: 5.5, y: 1.2, w: 4.0, h: 0.35,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })

  const principles = [
    { num: '0', label: '런타임 의존성', sub: 'Pure app code only' },
    { num: '0', label: 'any / as 사용', sub: 'Strict TypeScript' },
    { num: '✓', label: '명시적 리스너 생명주기', sub: '{ once: true } 또는 cleanup' },
    { num: '✓', label: '상태 가드 다중화', sub: '더블 클릭 / 더블 게임오버' },
    { num: '✓', label: '페일세이프 DOM 정리', sub: 'animationend + setTimeout' },
  ]
  let py = 1.6
  principles.forEach(p => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: py, w: 4.0, h: 0.7,
      fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
    })
    s.addText(p.num, {
      x: 5.55, y: py, w: 0.6, h: 0.7,
      fontSize: 22, fontFace: FONT_KR, bold: true, color: C.accent,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(p.label, {
      x: 6.2, y: py + 0.07, w: 3.2, h: 0.3,
      fontSize: 12, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(p.sub, {
      x: 6.2, y: py + 0.38, w: 3.2, h: 0.3,
      fontSize: 9, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, valign: 'middle',
    })
    py += 0.78
  })
}

// ─── 18. Final Stats + Verification ───────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '빌드 통계 + 검증 이력')

  const stats = [
    { value: '7.57', unit: 'kB', label: 'JS 번들 (gzip 2.92)' },
    { value: '4.71', unit: 'kB', label: 'CSS 번들 (gzip 1.46)' },
    { value: '0', unit: 'errors', label: 'tsc strict mode' },
    { value: '~60', unit: 'ms', label: 'Vite 빌드 시간' },
  ]
  const statW = 2.15, statGap = 0.1
  stats.forEach((st, i) => {
    const x = 0.5 + i * (statW + statGap)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: statW, h: 1.6,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addText([
      { text: st.value, options: { color: C.accent, bold: true, fontSize: 36, fontFace: FONT_KR } },
      { text: ' ' + st.unit, options: { color: C.textBody, fontSize: 14, fontFace: FONT_KR } },
    ], {
      x: x + 0.1, y: 1.45, w: statW - 0.2, h: 0.7,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(st.label, {
      x: x + 0.1, y: 2.2, w: statW - 0.2, h: 0.6,
      fontSize: 10, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, align: 'center', valign: 'top',
    })
  })

  s.addText('검증 이력', {
    x: 0.5, y: 3.15, w: 9, h: 0.3,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })

  const hdr = (text, opts = {}) => ({
    text,
    options: { bold: true, color: C.textPrimary, fill: { color: C.card }, fontSize: 11, fontFace: FONT_KR, valign: 'middle', ...opts },
  })
  const cell = (text, opts = {}) => ({
    text,
    options: { color: C.textBody, fontSize: 11, fontFace: FONT_KR, valign: 'middle', fill: { color: C.bgLight }, ...opts },
  })
  const ok = () => cell('✓', { color: C.green, bold: true, align: 'center' })

  s.addTable([
    [hdr('Iteration'), hdr('tsc', { align: 'center' }), hdr('build', { align: 'center' }), hdr('검증 결과')],
    [cell('1 · MVP', { bold: true }), ok(), ok(), cell('수용 기준 11/11, 수정 후 APPROVED')],
    [cell('2 · 반응형 + 입력', { bold: true }), ok(), ok(), cell('Desktop / Tablet / Mobile + 키보드 동작')],
    [cell('3 · 아이콘 + 팡', { bold: true }), ok(), ok(), cell('실제 클릭 reactionMs 290ms 측정')],
    [cell('4 · 평균 + 멀티', { bold: true }), ok(), ok(), cell('결정적 테스트 + 평균 row 렌더 확인')],
  ], {
    x: 0.5, y: 3.55, w: 9, colW: [2.0, 0.7, 0.7, 5.6],
    rowH: 0.32,
    border: { type: 'solid', color: C.divider, pt: 1 },
  })

  s.addText('Click Countdown · Vite + Vanilla TypeScript · 2026', {
    x: 0.5, y: 5.35, w: 9, h: 0.22,
    fontSize: 10, fontFace: FONT_KR, color: C.textMuted, italic: true, align: 'center', margin: 0,
  })
}

await pres.writeFile({ fileName: OUT })
console.log('saved', OUT)
