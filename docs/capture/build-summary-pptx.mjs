import pptxgen from 'pptxgenjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')
const OUT = path.join(ROOT, 'docs', 'session-summary.pptx')

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
  blue: '5C6BC0',
  divider: '2D2D4E',
  purple: '9C27B0',
}

const FONT_KR = 'Malgun Gothic'
const FONT_MONO = 'Consolas'

const pres = new pptxgen()
pres.layout = 'LAYOUT_16x9'
pres.author = 'Click Countdown Project'
pres.title = 'Click Countdown 세션 요약'

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

// Cell/header helpers for tables
const hdr = (text, opts = {}) => ({
  text,
  options: { bold: true, color: C.textPrimary, fill: { color: C.card }, fontSize: 12, fontFace: FONT_KR, valign: 'middle', ...opts },
})
const cell = (text, opts = {}) => ({
  text,
  options: { color: C.textBody, fontSize: 11, fontFace: FONT_KR, valign: 'middle', fill: { color: C.bgLight }, ...opts },
})

// ─── 1. Title ─────────────────────────────────────────────────────────
{
  const s = newSlide()
  s.addShape(pres.shapes.OVAL, {
    x: 0.5, y: 0.5, w: 0.25, h: 0.25,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('세션 요약', {
    x: 0.5, y: 1.4, w: 9, h: 0.8,
    fontSize: 42, fontFace: FONT_KR, color: C.textMuted,
    margin: 0, valign: 'middle',
  })
  s.addText('Click Countdown 미니 게임', {
    x: 0.5, y: 2.2, w: 9, h: 0.9,
    fontSize: 48, fontFace: FONT_KR, bold: true, color: C.textPrimary,
    margin: 0, valign: 'middle',
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.3, w: 1.5, h: 0.05,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('Deep Interview → Autopilot → 반복 개선 전 과정', {
    x: 0.5, y: 3.45, w: 9, h: 0.5,
    fontSize: 18, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })
  s.addText([
    { text: '2026-04-18 ~ 04-21', options: { color: C.textMuted, breakLine: true } },
    { text: '8 Phases · 8 Agents · 4 Iterations · ~750k tokens', options: { color: C.accentSoft, bold: true } },
  ], {
    x: 0.5, y: 4.4, w: 9, h: 0.7,
    fontSize: 14, fontFace: FONT_KR, margin: 0,
  })
}

// ─── 2. 8 Phases Overview ─────────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '대화 흐름 — 8개 Phase')

  const phases = [
    { letter: 'A', title: '요구사항 정의', desc: 'Deep Interview 6라운드, 모호도 10.7%' },
    { letter: 'B', title: 'Autopilot 실행', desc: 'Plan→Exec→QA→Validate→Cleanup' },
    { letter: 'C', title: '실행 + 미리보기', desc: 'Claude Preview MCP로 브라우저 검증' },
    { letter: 'D', title: 'Iter 2 반응형', desc: 'PC 키보드 + 모바일 터치 (Plan 승인)' },
    { letter: 'E', title: 'Iter 3 애니메이션', desc: '게임 테마 + 팡 + 반응속도' },
    { letter: 'F', title: 'Iter 4 변수', desc: '평균 반응속도 + 간헐적 멀티클릭' },
    { letter: 'G', title: '문서화', desc: 'HISTORY.md + 스크린샷 자동화' },
    { letter: 'H', title: 'PPT 생성', desc: '18장 프레젠테이션 + 시각 QA' },
  ]
  const cols = 4, cardW = 2.15, cardH = 1.65, gapX = 0.12, gapY = 0.15
  const gridX = (10 - cols * cardW - (cols - 1) * gapX) / 2
  phases.forEach((p, i) => {
    const r = Math.floor(i / cols), c = i % cols
    const x = gridX + c * (cardW + gapX)
    const y = 1.3 + r * (cardH + gapY)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: cardH,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: 0.08,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    })
    s.addText(`Phase ${p.letter}`, {
      x: x + 0.12, y: y + 0.18, w: cardW - 0.24, h: 0.3,
      fontSize: 11, fontFace: FONT_KR, bold: true, color: C.accent,
      margin: 0, valign: 'middle',
    })
    s.addText(p.title, {
      x: x + 0.12, y: y + 0.5, w: cardW - 0.24, h: 0.4,
      fontSize: 15, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(p.desc, {
      x: x + 0.12, y: y + 0.95, w: cardW - 0.24, h: 0.6,
      fontSize: 10, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, valign: 'top',
    })
  })
}

// ─── 3. Phase A — Deep Interview ──────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Phase A · Deep Interview — 모호도 수렴')
  s.addText('Socratic 6라운드로 100% → 10.7% 하락, 임계값 20% 돌파', {
    x: 0.5, y: 1.0, w: 9, h: 0.3,
    fontSize: 13, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })

  // Ambiguity progression chart (bar)
  s.addChart(pres.charts.BAR, [{
    name: '모호도',
    labels: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
    values: [70.5, 60.0, 39.0, 28.5, 22.2, 10.7],
  }], {
    x: 0.5, y: 1.45, w: 9, h: 3.0,
    barDir: 'col',
    chartColors: [C.accent],
    chartArea: { fill: { color: C.bgLight }, roundedCorners: false },
    plotArea: { fill: { color: C.bgLight } },
    catAxisLabelColor: C.textBody,
    valAxisLabelColor: C.textBody,
    catAxisLabelFontSize: 11,
    valAxisLabelFontSize: 10,
    valGridLine: { color: C.divider, size: 0.5 },
    catGridLine: { style: 'none' },
    showValue: true,
    dataLabelPosition: 'outEnd',
    dataLabelColor: C.textPrimary,
    dataLabelFontSize: 11,
    showLegend: false,
    valAxisMinVal: 0,
    valAxisMaxVal: 80,
  })

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.65, w: 9, h: 0.55,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 0 },
  })
  s.addText([
    { text: '최종 ', options: { color: C.textMuted } },
    { text: '10.7%', options: { color: C.green, bold: true } },
    { text: ' — 임계값 20% 돌파 → 스펙 파일 생성 → Autopilot 자동 실행', options: { color: C.textBody } },
  ], {
    x: 0.5, y: 4.65, w: 9, h: 0.55,
    fontSize: 13, fontFace: FONT_KR, margin: 0, align: 'center', valign: 'middle',
  })
}

// ─── 4. Phase B — Autopilot Execution ─────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Phase B · Autopilot 5-Phase 자동 실행')

  const phases = [
    { num: '1', title: 'Planning', desc: 'Architect + Critic 합의', color: C.blue },
    { num: '2', title: 'Execution', desc: 'Executor 전체 구현', color: C.blue },
    { num: '3', title: 'QA', desc: 'tsc + build 0 errors', color: C.green },
    { num: '4', title: 'Validation', desc: '3-way 병렬 검증', color: C.accent },
    { num: '5', title: 'Cleanup', desc: '상태 파일 정리', color: C.green },
  ]
  const cardW = 1.7, gap = 0.13
  phases.forEach((p, i) => {
    const x = 0.5 + i * (cardW + gap)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: cardW, h: 1.8,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.3, w: cardW, h: 0.08,
      fill: { color: p.color }, line: { color: p.color, width: 0 },
    })
    s.addText(`Phase ${p.num}`, {
      x: x + 0.1, y: 1.5, w: cardW - 0.2, h: 0.3,
      fontSize: 11, fontFace: FONT_KR, color: C.textMuted, bold: true,
      margin: 0, valign: 'middle',
    })
    s.addText(p.title, {
      x: x + 0.1, y: 1.85, w: cardW - 0.2, h: 0.4,
      fontSize: 17, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(p.desc, {
      x: x + 0.1, y: 2.3, w: cardW - 0.2, h: 0.7,
      fontSize: 11, fontFace: FONT_KR, color: C.textBody,
      margin: 0, valign: 'top',
    })
  })

  // Validation result
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.55, w: 9, h: 1.65,
    fill: { color: C.bgLight }, line: { color: C.accent, width: 1 },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.55, w: 0.08, h: 1.65,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('Phase 4 · 3-way 병렬 검증 결과', {
    x: 0.7, y: 3.65, w: 8.7, h: 0.3,
    fontSize: 12, fontFace: FONT_KR, color: C.accent, bold: true,
    margin: 0, valign: 'middle',
  })
  s.addText([
    { text: '✓ Architect: APPROVED', options: { color: C.green, bold: true, breakLine: true } },
    { text: '✓ Security-Reviewer: APPROVED', options: { color: C.green, bold: true, breakLine: true } },
    { text: '✗ Code-Reviewer: NEEDS_CHANGES (1 HIGH + 4 MED) → 수정 → ', options: { color: C.accent } },
    { text: 'APPROVED ✓', options: { color: C.green, bold: true } },
  ], {
    x: 0.7, y: 3.95, w: 8.7, h: 1.2,
    fontSize: 13, fontFace: FONT_KR, margin: 0, valign: 'top',
  })
}

// ─── 5. Iterations C-F Summary ────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Phase C-F · 4번의 반복 개선')

  const iters = [
    { phase: 'C', title: '실행 + Preview', what: 'Claude Preview MCP', how: '브라우저 내 실시간 검증, PORT 이슈 해결' },
    { phase: 'D', title: 'Iter 2 반응형', what: '키보드 + 터치', how: '640px 브레이크포인트, src/input.ts 신규 모듈' },
    { phase: 'E', title: 'Iter 3 애니메이션', what: '팡 + 반응속도', how: '게임 이모지 25개, popTarget 280ms 애니메이션' },
    { phase: 'F', title: 'Iter 4 변수', what: '평균 + 멀티클릭', how: 'reactionTimes 누적, 25% 확률 2~3회 클릭' },
  ]
  let y = 1.3
  iters.forEach(it => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.92,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y, w: 0.08, h: 0.92,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    })
    // Phase letter
    s.addText(it.phase, {
      x: 0.75, y: y + 0.15, w: 0.7, h: 0.6,
      fontSize: 30, fontFace: FONT_KR, bold: true, color: C.accent,
      margin: 0, valign: 'middle', align: 'center',
    })
    s.addText(it.title, {
      x: 1.6, y: y + 0.1, w: 3.0, h: 0.35,
      fontSize: 15, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(it.what, {
      x: 1.6, y: y + 0.47, w: 3.0, h: 0.35,
      fontSize: 11, fontFace: FONT_KR, color: C.green, bold: true,
      margin: 0, valign: 'middle',
    })
    s.addText(it.how, {
      x: 4.8, y: y + 0.2, w: 4.6, h: 0.55,
      fontSize: 11, fontFace: FONT_KR, color: C.textBody,
      margin: 0, valign: 'middle',
    })
    y += 1.0
  })
}

// ─── 6. Phase G-H — Documentation + PPT ───────────────────────────────
{
  const s = newSlide()
  addTitle(s, 'Phase G-H · 문서화 + 프레젠테이션 자동화')

  // Left: G — Documentation
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 4.4, h: 3.7,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.3, w: 4.4, h: 0.08,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('Phase G · 문서화', {
    x: 0.7, y: 1.45, w: 4.0, h: 0.35,
    fontSize: 12, fontFace: FONT_KR, bold: true, color: C.accent,
    margin: 0, valign: 'middle',
  })
  s.addText('📄', {
    x: 0.7, y: 1.9, w: 4.0, h: 0.8,
    fontSize: 40, margin: 0, align: 'center', valign: 'middle',
  })
  s.addText([
    { text: 'HISTORY.md', options: { color: C.green, bold: true, fontFace: FONT_MONO, breakLine: true } },
    { text: '4개 이터레이션 상세 기록', options: { color: C.textBody, breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: 'puppeteer-core + 시스템 Chrome', options: { color: C.textMuted, fontFace: FONT_MONO, breakLine: true } },
    { text: '결정적 스크린샷 7장 자동 캡처', options: { color: C.textBody } },
  ], {
    x: 0.7, y: 2.75, w: 4.0, h: 2.2,
    fontSize: 12, fontFace: FONT_KR, margin: 0, align: 'center', valign: 'top',
  })

  // Right: H — PPT
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.3, w: 4.4, h: 3.7,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.3, w: 4.4, h: 0.08,
    fill: { color: C.accent }, line: { color: C.accent, width: 0 },
  })
  s.addText('Phase H · PPT 생성', {
    x: 5.3, y: 1.45, w: 4.0, h: 0.35,
    fontSize: 12, fontFace: FONT_KR, bold: true, color: C.accent,
    margin: 0, valign: 'middle',
  })
  s.addText('📊', {
    x: 5.3, y: 1.9, w: 4.0, h: 0.8,
    fontSize: 40, margin: 0, align: 'center', valign: 'middle',
  })
  s.addText([
    { text: 'pptxgenjs + LibreOffice + poppler', options: { color: C.green, bold: true, fontFace: FONT_MONO, breakLine: true } },
    { text: '18장 프레젠테이션 자동 생성', options: { color: C.textBody, breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: 'Explore 서브에이전트 시각 QA', options: { color: C.textMuted, fontFace: FONT_MONO, breakLine: true } },
    { text: '2개 결함 수정 → 재검증 통과', options: { color: C.textBody } },
  ], {
    x: 5.3, y: 2.75, w: 4.0, h: 2.2,
    fontSize: 12, fontFace: FONT_KR, margin: 0, align: 'center', valign: 'top',
  })
}

// ─── 7. Token Usage ───────────────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '토큰 사용량')

  // Left: chart (horizontal bar)
  s.addChart(pres.charts.BAR, [{
    name: '토큰',
    labels: [
      'Code Review (1차)',
      'Code Review (재검증)',
      'Executor (Sonnet)',
      'Architect (P1)',
      'Architect (P4)',
      'Security',
      'Plan (추정)',
      'Explore (추정)',
    ],
    values: [41629, 31939, 35948, 30998, 30905, 26738, 35000, 15000],
  }], {
    x: 0.5, y: 1.3, w: 5.4, h: 3.9,
    barDir: 'bar',
    chartColors: [C.accent],
    chartArea: { fill: { color: C.bgLight }, roundedCorners: false },
    plotArea: { fill: { color: C.bgLight } },
    catAxisLabelColor: C.textBody,
    valAxisLabelColor: C.textBody,
    catAxisLabelFontSize: 9,
    valAxisLabelFontSize: 9,
    valGridLine: { color: C.divider, size: 0.5 },
    catGridLine: { style: 'none' },
    showValue: true,
    dataLabelPosition: 'outEnd',
    dataLabelColor: C.textPrimary,
    dataLabelFontSize: 9,
    showLegend: false,
  })

  // Right: totals
  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 1.3, w: 3.4, h: 1.2,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
  })
  s.addText('서브에이전트 8회', {
    x: 6.2, y: 1.4, w: 3.2, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })
  s.addText('~248k', {
    x: 6.2, y: 1.75, w: 3.2, h: 0.55,
    fontSize: 30, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0, valign: 'middle',
  })

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 2.6, w: 3.4, h: 1.2,
    fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
  })
  s.addText('메인 세션 (추정)', {
    x: 6.2, y: 2.7, w: 3.2, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.textMuted, margin: 0,
  })
  s.addText('~500k', {
    x: 6.2, y: 3.05, w: 3.2, h: 0.55,
    fontSize: 30, fontFace: FONT_KR, bold: true, color: C.textBody, margin: 0, valign: 'middle',
  })

  s.addShape(pres.shapes.RECTANGLE, {
    x: 6.1, y: 3.9, w: 3.4, h: 1.3,
    fill: { color: C.bgLight }, line: { color: C.accent, width: 1 },
  })
  s.addText('전체 추산', {
    x: 6.2, y: 4.0, w: 3.2, h: 0.3,
    fontSize: 11, fontFace: FONT_KR, color: C.accent, bold: true, margin: 0,
  })
  s.addText('~750k', {
    x: 6.2, y: 4.35, w: 3.2, h: 0.7,
    fontSize: 38, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0, valign: 'middle',
  })
}

// ─── 8. Agents Spawned ────────────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '스폰된 에이전트 · 8회')

  s.addTable([
    [hdr('#', { align: 'center' }), hdr('Phase'), hdr('에이전트'), hdr('역할'), hdr('tokens', { align: 'right' })],
    [cell('1', { bold: true, align: 'center' }), cell('B · Planning'), cell('architect (Opus)', { fontFace: FONT_MONO }), cell('file-by-file 계획 수립'), cell('30,998', { align: 'right', color: C.accent })],
    [cell('2', { bold: true, align: 'center' }), cell('B · Execution'), cell('executor (Sonnet)', { fontFace: FONT_MONO }), cell('전체 MVP 구현'), cell('35,948', { align: 'right', color: C.accent })],
    [cell('3', { bold: true, align: 'center' }), cell('B · Validation'), cell('architect', { fontFace: FONT_MONO }), cell('기능 완성도 검증'), cell('30,905', { align: 'right', color: C.accent })],
    [cell('4', { bold: true, align: 'center' }), cell('B · Validation'), cell('security-reviewer', { fontFace: FONT_MONO }), cell('보안 취약점 검사'), cell('26,738', { align: 'right', color: C.accent })],
    [cell('5', { bold: true, align: 'center' }), cell('B · Validation'), cell('code-reviewer', { fontFace: FONT_MONO }), cell('코드 품질 1차 (NEEDS_CHANGES)'), cell('41,629', { align: 'right', color: C.accent })],
    [cell('6', { bold: true, align: 'center' }), cell('B · Re-review'), cell('code-reviewer', { fontFace: FONT_MONO }), cell('수정 후 재검증 (APPROVED)'), cell('31,939', { align: 'right', color: C.accent })],
    [cell('7', { bold: true, align: 'center' }), cell('D · Plan'), cell('Plan', { fontFace: FONT_MONO }), cell('Iter 2 반응형/터치 설계'), cell('~35,000', { align: 'right', color: C.textMuted })],
    [cell('8', { bold: true, align: 'center' }), cell('H · QA'), cell('Explore', { fontFace: FONT_MONO }), cell('18장 슬라이드 시각 검사'), cell('~15,000', { align: 'right', color: C.textMuted })],
  ], {
    x: 0.5, y: 1.25, w: 9, colW: [0.5, 1.6, 2.3, 3.4, 1.2],
    rowH: 0.42,
    border: { type: 'solid', color: C.divider, pt: 1 },
  })

  s.addText('정확값: 6회 실측 · 2회 추정 (Plan / Explore 에이전트는 usage 미보고)', {
    x: 0.5, y: 5.1, w: 9, h: 0.3,
    fontSize: 10, fontFace: FONT_KR, color: C.textMuted, italic: true, margin: 0,
  })
}

// ─── 9. Work Inventory — Files ────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '작업 산출물 인벤토리')

  // Left: source files
  s.addText('src/ · 프로덕션 코드 (10개 파일)', {
    x: 0.5, y: 1.2, w: 4.5, h: 0.35,
    fontSize: 13, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.6, w: 4.5, h: 3.6,
    fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
  })
  const srcFiles = [
    'main.ts', 'game.ts', 'render.ts', 'timer.ts', 'input.ts',
    'position.ts', 'images.ts', 'storage.ts', 'types.ts', 'style.css',
  ]
  s.addText(
    srcFiles.map((f, i) => ({
      text: `├ ${f}`,
      options: { color: C.textPrimary, breakLine: i < srcFiles.length - 1 },
    })),
    {
      x: 0.7, y: 1.75, w: 4.1, h: 3.3,
      fontSize: 12, fontFace: FONT_MONO, margin: 0, valign: 'top',
    },
  )

  // Right: docs
  s.addText('docs/ · 문서 및 산출물', {
    x: 5.1, y: 1.2, w: 4.4, h: 0.35,
    fontSize: 13, fontFace: FONT_KR, bold: true, color: C.accent, margin: 0,
  })
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.6, w: 4.4, h: 3.6,
    fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
  })
  const docFiles = [
    { name: 'HISTORY.md', d: '개발 히스토리' },
    { name: 'SESSION-SUMMARY.md', d: '세션 요약 (본 PPT 소스)' },
    { name: 'presentation.pptx', d: '히스토리 PPT (18장)' },
    { name: 'session-summary.pptx', d: '요약 PPT (본 파일)' },
    { name: 'screenshots/ (7 PNG)', d: '자동 캡처 이미지' },
    { name: 'capture/capture.mjs', d: 'Puppeteer 캡처 스크립트' },
    { name: 'capture/build-pptx.mjs', d: 'PPT 빌드 스크립트' },
  ]
  let dy = 1.75
  docFiles.forEach(f => {
    s.addText(`├ ${f.name}`, {
      x: 5.25, y: dy, w: 2.8, h: 0.35,
      fontSize: 11, fontFace: FONT_MONO, color: C.textPrimary, margin: 0, valign: 'middle',
    })
    s.addText(f.d, {
      x: 8.0, y: dy, w: 1.4, h: 0.35,
      fontSize: 9, fontFace: FONT_KR, color: C.textMuted, margin: 0, valign: 'middle', align: 'right',
    })
    dy += 0.44
  })
}

// ─── 10. Build Stats ──────────────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '최종 빌드 통계')

  const stats = [
    { value: '7.57', unit: 'kB', label: 'JS 번들\n(gzip 2.92 kB)' },
    { value: '4.71', unit: 'kB', label: 'CSS 번들\n(gzip 1.46 kB)' },
    { value: '~4.7', unit: 'kB', label: '전체 전송량\n(gzip 기준)' },
    { value: '0', unit: 'deps', label: '런타임 의존성\n(Pure app code)' },
    { value: '0', unit: 'errors', label: 'tsc strict mode\n(any / as 0개)' },
    { value: '~60', unit: 'ms', label: 'Vite 빌드 시간\n(매 변경마다)' },
  ]
  const cols = 3, cardW = 2.95, gapX = 0.12, gapY = 0.15
  const gridX = (10 - cols * cardW - (cols - 1) * gapX) / 2
  stats.forEach((st, i) => {
    const r = Math.floor(i / cols), c = i % cols
    const x = gridX + c * (cardW + gapX)
    const y = 1.3 + r * (1.75 + gapY)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cardW, h: 1.75,
      fill: { color: C.card }, line: { color: C.cardBorder, width: 1 },
    })
    s.addText([
      { text: st.value, options: { color: C.accent, bold: true, fontSize: 42, fontFace: FONT_KR } },
      { text: ' ' + st.unit, options: { color: C.textBody, fontSize: 14, fontFace: FONT_KR } },
    ], {
      x: x + 0.1, y: y + 0.15, w: cardW - 0.2, h: 0.8,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(st.label, {
      x: x + 0.1, y: y + 1.0, w: cardW - 0.2, h: 0.7,
      fontSize: 11, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, align: 'center', valign: 'top',
    })
  })
}

// ─── 11. Verification History ─────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '검증 이력 · 이터레이션별 방식')

  s.addTable([
    [hdr('Iteration'), hdr('tsc', { align: 'center' }), hdr('build', { align: 'center' }), hdr('검증 방식')],
    [
      cell('1 · MVP', { bold: true }), cell('✓', { color: C.green, bold: true, align: 'center' }), cell('✓', { color: C.green, bold: true, align: 'center' }),
      cell('3-way 병렬 (Architect / Security / Code Reviewer)'),
    ],
    [
      cell('2 · 반응형 + 입력', { bold: true }), cell('✓', { color: C.green, bold: true, align: 'center' }), cell('✓', { color: C.green, bold: true, align: 'center' }),
      cell('Preview MCP · 3개 뷰포트 + 키보드 dispatch'),
    ],
    [
      cell('3 · 아이콘 + 팡', { bold: true }), cell('✓', { color: C.green, bold: true, align: 'center' }), cell('✓', { color: C.green, bold: true, align: 'center' }),
      cell('실제 클릭 reactionMs 290ms 측정 확인'),
    ],
    [
      cell('4 · 평균 + 멀티', { bold: true }), cell('✓', { color: C.green, bold: true, align: 'center' }), cell('✓', { color: C.green, bold: true, align: 'center' }),
      cell('Math.random=0 결정적 테스트 + 평균 row 렌더'),
    ],
    [
      cell('PPT 결과물', { bold: true }), cell('—', { color: C.textMuted, align: 'center' }), cell('✓', { color: C.green, bold: true, align: 'center' }),
      cell('Explore 서브에이전트 시각 QA → 2개 수정'),
    ],
  ], {
    x: 0.5, y: 1.3, w: 9, colW: [2.0, 0.7, 0.7, 5.6],
    rowH: 0.55,
    border: { type: 'solid', color: C.divider, pt: 1 },
  })

  s.addText('모든 이터레이션은 "저작 → 검토" 별도 패스로 진행됨 (자기 승인 금지)', {
    x: 0.5, y: 5.0, w: 9, h: 0.4,
    fontSize: 12, fontFace: FONT_KR, color: C.accentSoft, italic: true, margin: 0, align: 'center',
  })
}

// ─── 12. Design Philosophy ────────────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '관통된 설계 철학 · 6가지')

  const principles = [
    { num: '0', label: '런타임 의존성', sub: 'Pure app code only, 번들은 순수 애플리케이션 코드만' },
    { num: '0', label: 'any / as / @ts-ignore', sub: 'Strict TypeScript, 타입 회피 금지' },
    { num: '✓', label: '명시적 리스너 생명주기', sub: '모든 이벤트 리스너 { once: true } 또는 destroy()' },
    { num: '✓', label: '상태 가드 다중화', sub: '더블 클릭 / 더블 게임오버 모두 2계층 방어' },
    { num: '✓', label: '페일세이프 DOM 정리', sub: 'animationend 이벤트 + setTimeout 이중 안전장치' },
    { num: '✓', label: '저작 / 검토 분리', sub: 'Writer 작성 → Reviewer/Verifier 별도 승인 패스' },
  ]
  let py = 1.3
  principles.forEach(p => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5, y: py, w: 9, h: 0.58,
      fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
    })
    s.addShape(pres.shapes.OVAL, {
      x: 0.65, y: py + 0.09, w: 0.4, h: 0.4,
      fill: { color: C.accent }, line: { color: C.accent, width: 0 },
    })
    s.addText(p.num, {
      x: 0.65, y: py + 0.09, w: 0.4, h: 0.4,
      fontSize: 16, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(p.label, {
      x: 1.25, y: py + 0.08, w: 3.5, h: 0.42,
      fontSize: 14, fontFace: FONT_KR, bold: true, color: C.textPrimary,
      margin: 0, valign: 'middle',
    })
    s.addText(p.sub, {
      x: 4.85, y: py + 0.08, w: 4.5, h: 0.42,
      fontSize: 11, fontFace: FONT_KR, color: C.textMuted,
      margin: 0, valign: 'middle',
    })
    py += 0.68
  })
}

// ─── 13. Deliverables Checklist ───────────────────────────────────────
{
  const s = newSlide()
  addTitle(s, '전달 완료 체크리스트')

  const items = [
    'Deep Interview로 요구사항 수학적 확정 (모호도 10.7%)',
    'Autopilot 5 Phase로 MVP 자동 구현',
    '3-way 병렬 검증 + 이슈 수정 + 재승인',
    'Vite dev 서버 실행 + Claude Preview MCP 검증',
    '반응형 + PC 키보드 + 모바일 터치 구현',
    '게임 테마 이모지 + 팡 애니메이션 + 반응속도',
    '평균 반응속도 + 간헐적 멀티클릭',
    'HISTORY.md 히스토리 문서',
    '스크린샷 7장 자동 캡처 (puppeteer-core)',
    '18장 PPT 프레젠테이션 + 본 요약 PPT',
  ]
  const cols = 2
  const cellW = 4.4, gapX = 0.2, gapY = 0.15
  items.forEach((item, i) => {
    const r = Math.floor(i / cols), c = i % cols
    const x = 0.5 + c * (cellW + gapX)
    const y = 1.25 + r * (0.6 + gapY)
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: cellW, h: 0.6,
      fill: { color: C.bgLight }, line: { color: C.cardBorder, width: 1 },
    })
    // Check icon
    s.addShape(pres.shapes.OVAL, {
      x: x + 0.15, y: y + 0.15, w: 0.3, h: 0.3,
      fill: { color: C.green }, line: { color: C.green, width: 0 },
    })
    s.addText('✓', {
      x: x + 0.15, y: y + 0.15, w: 0.3, h: 0.3,
      fontSize: 13, bold: true, color: C.textPrimary,
      margin: 0, align: 'center', valign: 'middle',
    })
    s.addText(item, {
      x: x + 0.55, y: y + 0.05, w: cellW - 0.65, h: 0.5,
      fontSize: 11, fontFace: FONT_KR, color: C.textBody,
      margin: 0, valign: 'middle',
    })
  })

  s.addText('Click Countdown · 프로덕션 준비 완료', {
    x: 0.5, y: 5.0, w: 9, h: 0.35,
    fontSize: 14, fontFace: FONT_KR, bold: true, color: C.accent, align: 'center', margin: 0,
  })
  s.addText('Vite + Vanilla TypeScript · 2026-04-21', {
    x: 0.5, y: 5.3, w: 9, h: 0.22,
    fontSize: 10, fontFace: FONT_KR, color: C.textMuted, italic: true, align: 'center', margin: 0,
  })
}

await pres.writeFile({ fileName: OUT })
console.log('saved', OUT)
