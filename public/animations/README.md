# Augmentation Animations — MP4 녹화 가이드

전처리 6단계 애니메이션 카드를 MP4로 자동 녹화합니다.

## 사전 설치

```bash
# macOS — ffmpeg 설치 (영상 인코딩에 필요)
brew install ffmpeg

# 프로젝트 의존성 (신타이탄 프로덕트 UI 폴더에서)
cd "/Users/minkyungjung/Downloads/신타이탄 프로덕트 UI"
npm install puppeteer puppeteer-screen-recorder
```

## 실행

```bash
node public/animations/record-cards.js
```

`public/animations/out/` 폴더에 6개 MP4 파일이 생성됩니다.

| 파일명 | 카드 | 영문 |
|---|---|---|
| `01_feature-derivation.mp4` | 컬럼 증강 | Feature Derivation |
| `02_masking.mp4` | 가명화 | Masking |
| `03_low-signal-removal.mp4` | 저신호 컬럼 제거 | Low-Signal Column Removal |
| `04_outlier-refinement.mp4` | 이상치·분포·카테고리 정제 | Outlier / Distribution / Category |
| `05_missing-treatment.mp4` | 결측치 처리 | Missing Value Treatment |
| `06_row-augmentation.mp4` | 행 증강 | Row Augmentation |

## URL hash 단일 카드 미리보기

녹화 없이 브라우저에서 단일 카드만 보고 싶을 때:

- `feature-derivation.html#feature` — 컬럼 증강
- `feature-derivation.html#mask` — 가명화
- `feature-derivation.html#signal` — 저신호 컬럼 제거
- `feature-derivation.html#outlier` — 이상치 정제
- `feature-derivation.html#impute` — 결측치 처리
- `feature-derivation.html#row` — 행 증강
- `feature-derivation.html` (hash 없음) — 6개 카드 전체

## 옵션 조정

`record-cards.js` 상단의 상수로 조정 가능:

- `VIEWPORT` — 녹화 영역 크기 (기본 520×260)
- `DURATION_MS` — 녹화 시간 (기본 10500ms = 5s 루프 두 번)
- `videoCrf` — 화질 (낮을수록 고화질, 18~23 권장)
