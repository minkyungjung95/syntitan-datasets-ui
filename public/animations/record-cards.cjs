/**
 * 6개 카드 애니메이션을 자동으로 MP4 녹화
 *
 * 사용법:
 *   1) cd "/Users/minkyungjung/Downloads/신타이탄 프로덕트 UI"
 *   2) brew install ffmpeg                                 # ffmpeg 필요
 *   3) npm install puppeteer puppeteer-screen-recorder
 *   4) node public/animations/record-cards.js
 *
 *   결과: public/animations/out/ 폴더에 6개 MP4 파일 생성
 */

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

const CARDS = [
  { hash: 'feature', label: '01_feature-derivation' },   // 컬럼 증강
  { hash: 'mask',    label: '02_masking' },              // 가명화
  { hash: 'signal',  label: '03_low-signal-removal' },   // 저신호 컬럼 제거
  { hash: 'outlier', label: '04_outlier-refinement' },   // 이상치/분포/카테고리
  { hash: 'impute',  label: '05_missing-treatment' },    // 결측치 처리
  { hash: 'row',     label: '06_row-augmentation' },     // 행 증강
];

// 카드별 화면 크기 — 카드 416×186 + 여백, Retina 2x로 고화질
const VIEWPORT = { width: 520, height: 260, deviceScaleFactor: 2 };

// 녹화 시간 — 5s 루프 한 사이클을 충분히 포함 + 약간 더
const DURATION_MS = 10500;

const HTML_PATH = path.resolve(__dirname, 'feature-derivation.html');
const OUT_DIR   = path.resolve(__dirname, 'out');

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: VIEWPORT,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const recorderConfig = {
    followNewTab: false,
    fps: 60,
    videoFrame: { width: VIEWPORT.width * 2, height: VIEWPORT.height * 2 },
    videoCrf: 15,
    videoCodec: 'libx264',
    videoPreset: 'slow',
    videoBitrate: 8000,
    autopad: { color: 'white' },
  };

  for (const card of CARDS) {
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    const url = `file://${HTML_PATH}?clean=1#${card.hash}`;
    console.log(`▶ Recording ${card.label} (${url})`);

    const recorder = new PuppeteerScreenRecorder(page, recorderConfig);
    const outPath = path.join(OUT_DIR, `${card.label}.mp4`);

    // 1) 페이지 먼저 로드하고 안정될 때까지 대기 (흰 화면 방지)
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // 2) 그 다음 녹화 시작
    await recorder.start(outPath);
    await new Promise(r => setTimeout(r, DURATION_MS));
    await recorder.stop();
    await page.close();
    console.log(`  → saved ${outPath}`);
  }

  await browser.close();
  console.log('\n✅ All 6 MP4 files saved to:', OUT_DIR);
})().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
