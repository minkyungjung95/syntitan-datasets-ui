/* =========================================================
 *  AgentDataBanner
 *  - "에이전트 분석" 섹션 하단에 배치하는 다크 배너
 *  - 메시지: 에이전트 결과는, 데이터 상태가 결정합니다.
 *  - Before / After 비교 + CTA(내 데이터 상태 확인하기)
 *
 *  사용 예:
 *    import AgentDataBanner from "./agent-data-banner.jsx";
 *    ...
 *    <section> 에이전트 분석 ... </section>
 *    <AgentDataBanner onCheck={() => navigate("/dataset")} />
 * ========================================================= */

const MONO =
  "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', ui-monospace, Menlo, monospace";

export default function AgentDataBanner({ onCheck }) {
  return (
    <section style={S.wrap} aria-label="에이전트 결과는 데이터 상태가 결정합니다">
      <div style={S.glow} aria-hidden />

      <div style={S.header}>
        <span style={S.diamond} aria-hidden>◆</span>
        <span style={S.headline}>
          에이전트 결과는, <em style={S.em}>데이터 상태</em>가 결정합니다.
        </span>
      </div>

      <p style={S.sub}>
        같은 에이전트라도 데이터의 결측·균형·신호 품질에 따라 결과는 달라집니다.
        먼저 데이터 상태부터 진단해보세요.
      </p>

      <div style={S.compareRow}>
        <CompareCard
          state="before"
          title="Before"
          toneLabel="회색 톤"
          rows={[
            { k: "분석",   v: "4,680명" },
            { k: "식별",   v: "935명" },
            { k: "신뢰도", v: "62%" },
          ]}
        />

        <div style={S.arrowCol} aria-hidden>
          <div style={S.arrowLabel}>보완</div>
          <div style={S.arrowLine}>
            <span style={S.arrowHead}>→</span>
          </div>
        </div>

        <CompareCard
          state="after"
          title="After"
          toneLabel="컬러 톤"
          rows={[
            { k: "분석",   v: "5,000명" },
            { k: "식별",   v: "1,247명" },
            { k: "신뢰도", v: "91%" },
          ]}
        />
      </div>

      <div style={S.deltaRow}>
        <span style={S.deltaArrow}>↳</span>
        <span style={S.deltaText}>
          <b style={S.deltaNum}>312명</b> 새로 포함
        </span>
        <span style={S.sparkle} aria-hidden>✦</span>
      </div>

      <div style={S.ctaRow}>
        <button type="button" style={S.cta} onClick={onCheck}>
          내 데이터 상태 확인하기
          <span style={S.ctaArrow} aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}

function CompareCard({ state, title, toneLabel, rows }) {
  const isBefore = state === "before";
  return (
    <div
      style={{
        ...S.card,
        borderColor: isBefore ? "rgba(255,255,255,0.08)" : "rgba(167,139,250,0.55)",
        background: isBefore
          ? "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)"
          : "linear-gradient(180deg, rgba(167,139,250,0.16) 0%, rgba(167,139,250,0.06) 100%)",
        boxShadow: isBefore
          ? "inset 0 0 0 1px rgba(255,255,255,0.02)"
          : "inset 0 0 0 1px rgba(167,139,250,0.25), 0 12px 32px -16px rgba(167,139,250,0.45)",
      }}
    >
      <div style={S.cardHead}>
        <span style={{ ...S.cardTitle, color: isBefore ? "#9CA3AF" : "#E9E5FF" }}>
          {title}
        </span>
        <span
          style={{
            ...S.tone,
            color: isBefore ? "#9CA3AF" : "#C4B5FD",
            borderColor: isBefore ? "rgba(255,255,255,0.1)" : "rgba(196,181,253,0.35)",
            background: isBefore ? "rgba(255,255,255,0.02)" : "rgba(167,139,250,0.12)",
          }}
        >
          <span aria-hidden style={{ marginRight: 4 }}>
            {isBefore ? "⚠" : "✓"}
          </span>
          {toneLabel}
        </span>
      </div>

      <div style={S.cardBody}>
        {rows.map((r, i) => (
          <div
            key={r.k}
            style={{
              ...S.kv,
              borderTop: i === 0 ? "none" : "1px dashed rgba(255,255,255,0.06)",
            }}
          >
            <span style={S.k}>{r.k}</span>
            <span
              style={{
                ...S.v,
                color: isBefore ? "#D1D5DB" : "#FFFFFF",
                fontWeight: isBefore ? 500 : 700,
              }}
            >
              {r.v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== styles ===== */
const PURPLE = "#A78BFA";

const S = {
  wrap: {
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(120% 160% at 10% -10%, #1B1530 0%, #0B0B10 55%, #08080C 100%)",
    color: "#E5E7EB",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: "28px 32px 24px",
    fontFamily:
      "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    boxShadow:
      "0 24px 60px -28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
  },
  glow: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 360,
    height: 360,
    background:
      "radial-gradient(closest-side, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0) 70%)",
    pointerEvents: "none",
    filter: "blur(2px)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    position: "relative",
  },
  diamond: {
    color: "#60A5FA",
    fontSize: 14,
    lineHeight: 1,
    transform: "translateY(-1px)",
  },
  headline: {
    fontSize: 18,
    lineHeight: 1.4,
    fontWeight: 700,
    color: "#F3F4F6",
    letterSpacing: "-0.01em",
  },
  em: {
    fontStyle: "normal",
    color: "#C4B5FD",
    background:
      "linear-gradient(180deg, transparent 60%, rgba(167,139,250,0.25) 60%)",
    padding: "0 2px",
  },

  sub: {
    margin: "8px 0 22px",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#9CA3AF",
    maxWidth: 560,
  },

  compareRow: {
    display: "grid",
    gridTemplateColumns: "1fr 56px 1fr",
    alignItems: "stretch",
    gap: 12,
    position: "relative",
  },

  card: {
    border: "1px solid",
    borderRadius: 14,
    padding: "14px 16px",
    fontFamily: MONO,
    minWidth: 0,
  },
  cardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
  },
  tone: {
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: 999,
    border: "1px solid",
    fontWeight: 600,
    letterSpacing: "0.02em",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
  },
  kv: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "8px 0",
  },
  k: { fontSize: 12, color: "#6B7280", letterSpacing: "0.02em" },
  v: { fontSize: 14, fontVariantNumeric: "tabular-nums" },

  arrowCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#9CA3AF",
  },
  arrowLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    letterSpacing: "0.02em",
  },
  arrowLine: {
    width: 40,
    height: 1,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(167,139,250,0.6), rgba(255,255,255,0.05))",
    position: "relative",
  },
  arrowHead: {
    position: "absolute",
    right: -8,
    top: -10,
    color: PURPLE,
    fontSize: 14,
    fontFamily: MONO,
  },

  deltaRow: {
    marginTop: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    paddingLeft: 8,
    color: "#E9E5FF",
    fontFamily: MONO,
  },
  deltaArrow: { color: "#9CA3AF" },
  deltaText: { fontSize: 13, color: "#D1D5DB" },
  deltaNum: { color: "#FBBF24", fontWeight: 700, marginRight: 2 },
  sparkle: { color: "#FBBF24" },

  ctaRow: {
    marginTop: 18,
    display: "flex",
    justifyContent: "flex-end",
  },
  cta: {
    appearance: "none",
    background: "rgba(167,139,250,0.12)",
    border: "1px solid rgba(167,139,250,0.45)",
    color: "#E9E5FF",
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "-0.005em",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "all .15s ease",
  },
  ctaArrow: {
    fontFamily: MONO,
    color: "#C4B5FD",
    transform: "translateX(0)",
    transition: "transform .15s ease",
  },
};
