/* =========================================================
 *  SyntheticDataThumb — 305 x 123
 *  - 주제: "실제 데이터 노출 없이 합성 데이터셋으로 변환하세요"
 *  - 레퍼런스: 번역기 UI처럼 두 카드가 살짝 겹친 스타일
 *      · 뒤(원본 테이블)        : 살짝 흐림 + 회색 톤
 *      · 앞(합성 데이터 테이블) : 블루 강조 + 블루 하이라이트 + 합성데이터 토글 ON
 * ========================================================= */

export default function SyntheticDataThumb() {
  return (
    <div style={S.frame}>
      {/* 뒤: 원본 테이블 (살짝 흐림) */}
      <div style={{ ...S.window, ...S.back }}>
        <div style={S.windowHead}>
          <span style={{ ...S.headLabel, color: "#9CA3AF" }}>원본</span>
          <Chevron color="#C9CDD2" />
          <span style={{ flex: 1 }} />
          <span style={S.closeX} aria-hidden>×</span>
        </div>
        <MiniTable
          tone="muted"
          rows={[
            ["김민서", "32", "010-****"],
            ["이준호", "28", "010-****"],
            ["박지영", "41", "010-****"],
          ]}
        />
      </div>

      {/* 앞: 합성 데이터 테이블 (블루 강조) */}
      <div style={{ ...S.window, ...S.front }}>
        <div style={S.windowHead}>
          <span style={{ ...S.headLabel, color: "#1F2937" }}>합성데이터</span>
          <Chevron color="#1F2937" />
          <span style={{ flex: 1 }} />
          <Toggle on />
        </div>
        <MiniTable
          tone="accent"
          rows={[
            ["S-0421", "31", "010-####"],
            ["S-0188", "27", "010-####"],
            ["S-0930", "42", "010-####"],
          ]}
        />
      </div>
    </div>
  );
}

/* ---------------- Subcomponents ---------------- */

function MiniTable({ tone, rows }) {
  const isAccent = tone === "accent";
  const text = isAccent ? "#1F2937" : "#9CA3AF";
  const hl = isAccent ? "#DCEAFE" : "transparent";
  const hlText = isAccent ? "#1D4ED8" : text;

  return (
    <div style={S.table}>
      {rows.map((r, i) => (
        <div key={i} style={S.tr}>
          <span
            style={{
              ...S.cell,
              ...S.cellName,
              color: hlText,
              background: hl,
              fontWeight: isAccent ? 600 : 500,
            }}
          >
            {r[0]}
          </span>
          <span style={{ ...S.cell, color: text }}>{r[1]}</span>
          <span style={{ ...S.cell, color: text }}>{r[2]}</span>
        </div>
      ))}
    </div>
  );
}

function Toggle({ on }) {
  return (
    <span
      style={{
        ...S.toggle,
        background: on ? "#2F6FED" : "#D1D5DB",
        justifyContent: on ? "flex-end" : "flex-start",
      }}
      aria-hidden
    >
      <span style={S.toggleKnob} />
    </span>
  );
}

function Chevron({ color }) {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
      <polyline
        points="6 9 12 15 18 9"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------- Styles ---------------- */
const S = {
  frame: {
    position: "relative",
    width: 305,
    height: 123,
    background: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    fontFamily:
      "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },

  window: {
    position: "absolute",
    background: "#FFFFFF",
    borderRadius: 8,
    padding: "8px 10px 9px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  /* 뒤 카드: 회색 톤, 살짝 어긋나게 위쪽에 배치 */
  back: {
    top: 6,
    left: 18,
    width: 192,
    height: 92,
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 0 rgba(15, 23, 42, 0.02)",
    opacity: 0.9,
  },

  /* 앞 카드: 블루 강조, 살짝 아래로 오른쪽으로 겹치게 */
  front: {
    top: 30,
    left: 96,
    width: 196,
    height: 88,
    border: "1.4px solid #2F6FED",
    boxShadow:
      "0 4px 14px -6px rgba(47, 111, 237, 0.35), 0 1px 0 rgba(15, 23, 42, 0.02)",
  },

  windowHead: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    minHeight: 14,
  },
  headLabel: {
    fontSize: 9.5,
    fontWeight: 600,
    letterSpacing: "-0.005em",
  },
  closeX: {
    fontSize: 11,
    color: "#C9CDD2",
    lineHeight: 1,
  },

  toggle: {
    width: 22,
    height: 12,
    borderRadius: 999,
    padding: 1.5,
    display: "inline-flex",
    alignItems: "center",
    transition: "background .15s ease",
  },
  toggleKnob: {
    width: 9,
    height: 9,
    borderRadius: 999,
    background: "#FFFFFF",
    boxShadow: "0 1px 1.5px rgba(0,0,0,0.18)",
  },

  table: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  tr: {
    display: "grid",
    gridTemplateColumns: "1fr 22px 60px",
    alignItems: "center",
    columnGap: 6,
  },
  cell: {
    fontSize: 8.8,
    lineHeight: "12px",
    fontVariantNumeric: "tabular-nums",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cellName: {
    padding: "1px 4px",
    borderRadius: 3,
    justifySelf: "start",
  },
};
