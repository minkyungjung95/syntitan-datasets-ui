/* =========================================================
 *  Design System – Agent Thumbnails
 *  - 외곽 430 x 150, radius 20
 *  - 내부 흰 카드 266 x 130, top-only radius 14
 *  - 타이틀: Pretendard 11.18px, color: alternative #7B7E85
 *  - 6 Agent variants (background colors differ)
 * ========================================================= */

const ALT = "#7B7E85"; // fg/neutual/alternative

/* 6 Agent 썸네일 (1번 ~ 5번 확정, 6번 대기) */
const AGENTS = [
  {
    key: "persona-survey",
    label: "01 · Persona Survey",
    title: "Persona Survey",
    bg: "linear-gradient(180deg, #C3D0EA 0%, #D4DBE8 100%)",
    Body: PersonaSurveyBody,
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
  },
  {
    key: "pricing-strategy",
    label: "02 · New Product Pricing Strategy",
    title: "New Product Pricing Strategy",
    bg: "linear-gradient(180deg, #D6DAFF 0%, #D2D3F2 100%)",
    Body: PricingStrategyBody,
    cardBg: "#FFFFFF",
  },
  {
    key: "audience-strategy",
    label: "03 · Audience Strategy",
    title: "Audience Strategy",
    bg: "#C3EADA",
    Body: AudienceStrategyBody,
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
  },
  {
    key: "churn-prediction",
    label: "04 · Churn Prediction",
    title: "Churn Prediction",
    bg: "#FFEDE9",
    Body: ChurnPredictionBody,
    cardBg: "#FFFFFF",
  },
  {
    key: "process-efficiency",
    label: "05 · Process Efficiency Analyzer",
    title: "Process Efficiency Analyzer",
    bg: "#FFEDD6",
    Body: null,
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
  },
  {
    key: "pipeline",
    label: "06 · Pipeline",
    title: "Pipeline",
    bg: "#C3EADA",
    Body: null,
    cardBg: "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 100%)",
  },
];

export default function DesignSystem() {
  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.h1}>Design System</div>
        <div style={S.sub}>Agent 카드용 썸네일 모음.</div>
      </div>

      <section style={S.section}>
        <div style={S.sectionTitle}>Agent Thumbnails</div>
        <div style={S.sectionMeta}>430 × 150 · radius 20 · 6 agents</div>
        <div style={S.thumbGrid}>
          {AGENTS.map((a) => (
            <div key={a.key} style={S.thumbCard}>
              <AgentThumb agent={a} />
              <div style={S.thumbLabel}>{a.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={S.section}>
        <div style={S.sectionTitle}>Agent Thumbnails — Variant B</div>
        <div style={S.sectionMeta}>220 × 120 · radius 14 · purple accent · 4 agents</div>
        <div style={S.thumbGrid}>
          {AGENTS_B.map((a) => (
            <div key={a.key} style={S.thumbCard}>
              <AgentThumbB agent={a} />
              <div style={S.thumbLabel}>{a.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* =========================================================
 *  Variant B – 컴팩트 단일 카드 (220 x 120)
 *  외곽 컬러 프레임 없이 흰 카드 1개. 보라색 단일 액센트.
 * ========================================================= */
const AGENTS_B = [
  { key: "persona-b",  label: "01 · Persona Survey",            title: "Persona Survey",            Body: PersonaSurveyBodyB },
  { key: "pricing-b",  label: "02 · New Product Pricing Strategy", title: "New Product Pricing Strategy", Body: PricingStrategyBodyB },
  { key: "churn-b",    label: "03 · Churn Prediction",          title: "Churn Prediction",          Body: ChurnPredictionBodyB },
  { key: "audience-b", label: "04 · Audience Strategy",         title: "Audience Strategy",         Body: AudienceStrategyBodyB },
];

function AgentThumbB({ agent }) {
  return (
    <div style={TB.outer}>
      <div style={TB.title}>{agent.title}</div>
      <div style={TB.bodyArea}>
        <agent.Body />
      </div>
    </div>
  );
}

/* ---------- B.01 Persona Survey ---------- */
function PersonaSurveyBodyB() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      <div style={ROWB.selected}>
        <div style={ROWB.radioOuterSelected}>
          <div style={ROWB.radioDot} />
        </div>
        <div style={{ height: 6, width: 52, borderRadius: 999, background: "#D0C9FF" }} />
      </div>
      <div style={ROWB.normal}>
        <div style={ROWB.radioOuter} />
        <div style={{ height: 6, width: 100, borderRadius: 999, background: "#EAEBED" }} />
      </div>
      <div style={{ ...ROWB.normal, opacity: 0.85 }}>
        <div style={ROWB.radioOuter} />
        <div style={{ height: 6, width: 78, borderRadius: 999, background: "#EAEBED" }} />
      </div>
    </div>
  );
}

const ROWB = {
  selected: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "5px 7px", borderRadius: 6,
    background: "#F3EFFF",
    border: "1px solid #B5ABF2",
  },
  normal: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "5px 7px", borderRadius: 6,
    background: "#F7F7F7",
  },
  radioOuter: {
    width: 11, height: 11, borderRadius: 999,
    border: "1px solid #D5D6D9", background: "transparent", flexShrink: 0,
  },
  radioOuterSelected: {
    width: 11, height: 11, borderRadius: 999,
    background: "#8A77E0", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  radioDot: { width: 5, height: 5, borderRadius: 999, background: "#FFFFFF" },
};

/* ---------- B.02 New Product Pricing Strategy ---------- */
function PricingStrategyBodyB() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "stretch" }}>
        <div style={PRICEB.cardPlain}>
          <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Star fill="#E6E7E9" size={9} />
            <Star fill="#E6E7E9" size={9} />
          </div>
          <div style={PRICEB.priceMuted}>$120</div>
        </div>
        <div style={PRICEB.cardRec}>
          <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} fill="#D0C9FF" size={9} />
            ))}
          </div>
          <div style={PRICEB.price}>$150</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[
          { w: 110, op: 0.9 },
          { w: 60,  op: 0.6 },
          { w: 95,  op: 0.6 },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, opacity: r.op }}>
            <div style={{ width: 6, height: 6, borderRadius: 999, background: "#EAEBED" }} />
            <div style={{ height: 6, width: r.w, borderRadius: 999, background: "#EAEBED" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PRICEB = {
  cardPlain: {
    flex: "0 0 auto", width: 64,
    background: "#FBFBFB",
    border: "1px solid #F0F0F2",
    borderRadius: 8,
    padding: "5px 6px 4px",
    display: "flex", flexDirection: "column", gap: 2,
  },
  cardRec: {
    flex: "1 1 0", minWidth: 0,
    background: "#F7F5FF",
    border: "1px solid #B5ABF2",
    borderRadius: 8,
    padding: "5px 6px 4px",
    display: "flex", flexDirection: "column", gap: 2,
    justifyContent: "center",
  },
  price: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: 13, fontWeight: 600, color: "#171719", lineHeight: "16px",
  },
  priceMuted: {
    fontFamily: "Pretendard, sans-serif",
    fontSize: 13, fontWeight: 600, color: "#9A9DA3", lineHeight: "16px",
  },
};

/* ---------- B.03 Churn Prediction ---------- */
function ChurnPredictionBodyB() {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 5, width: "100%", height: 62 }}>
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        fontFamily: "Pretendard, sans-serif", fontSize: 6.5, color: ALT,
        textAlign: "right", lineHeight: "5px",
      }}>
        <span>100%</span>
        <span>0%</span>
      </div>
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ flex: 1, display: "flex" }}>
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #EAEBED",
                borderLeft: "0.5px dashed #EAEBED",
                borderBottom: row === 2 ? "0.5px dashed #EAEBED" : "none",
              }} />
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #EAEBED",
                borderLeft: "0.5px dashed #EAEBED",
                borderRight: "0.5px dashed #EAEBED",
                borderBottom: row === 2 ? "0.5px dashed #EAEBED" : "none",
              }} />
            </div>
          ))}
        </div>
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="churnAreaB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8A77E0" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8A77E0" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path
            d="M0,48 C30,42 55,30 95,26 C130,22 155,16 200,8 L200,60 L0,60 Z"
            fill="url(#churnAreaB)"
          />
          <path
            d="M0,48 C30,42 55,30 95,26 C130,22 155,16 200,8"
            fill="none"
            stroke="#8A77E0"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="0"   cy="48" r="2.6" fill="#FFFFFF" stroke="#8A77E0" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          <circle cx="95"  cy="26" r="2.6" fill="#FFFFFF" stroke="#8A77E0" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          <circle cx="198" cy="8"  r="2.6" fill="#FFFFFF" stroke="#8A77E0" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- B.04 Audience Strategy ---------- */
function AudienceStrategyBodyB() {
  return (
    <div style={{ display: "flex", gap: 6, height: 64, width: "100%" }}>
      <div style={{ ...AUDB.card, background: "#F3EFFF", border: "1px solid #B5ABF2" }}>
        <IdentityPlatformIcon fill="#8A77E0" />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
          <div style={{ height: 6, width: 18, borderRadius: 999, background: "rgba(208,201,255,0.95)" }} />
          <div style={{ height: 6, width: "100%", borderRadius: 999, background: "rgba(208,201,255,0.6)" }} />
        </div>
      </div>
      <div style={{ ...AUDB.card, background: "#F7F7F7" }}>
        <IdentityPlatformIcon fill="#CACCCF" />
        <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
          <div style={{ height: 6, width: 18, borderRadius: 999, background: "#EAEBED" }} />
          <div style={{ height: 6, width: "100%", borderRadius: 999, background: "rgba(234,235,237,0.6)" }} />
        </div>
      </div>
    </div>
  );
}

const AUDB = {
  card: {
    flex: "1 1 0",
    minWidth: 0,
    height: "100%",
    padding: 8,
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
};

/* ---------- Variant B shell styles ---------- */
const TB = {
  outer: {
    width: 220,
    height: 120,
    borderRadius: 14,
    background: "#FFFFFF",
    border: "1px solid #EFEEF4",
    padding: "11px 12px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    overflow: "hidden",
  },
  title: {
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 10.2,
    fontWeight: 500,
    color: ALT,
    lineHeight: "14px",
  },
  bodyArea: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    width: "100%",
  },
};

/* =========================================================
 *  Shared Thumbnail Shell (430 x 150)
 * ========================================================= */
function AgentThumb({ agent }) {
  return (
    <div style={{ ...T.outer, background: agent.bg }}>
      <div style={{ ...T.card, background: agent.cardBg }}>
        <div style={T.title}>{agent.title}</div>
        {agent.Body && (
          <div style={T.bodyArea}>
            <agent.Body />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
 *  01. Persona Survey – 라디오 버튼 리스트
 * ========================================================= */
function PersonaSurveyBody() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
      {/* 선택된 옵션 */}
      <div style={ROW.selected}>
        <div style={ROW.radioOuterSelected}>
          <div style={ROW.radioDot} />
        </div>
        <div style={{ height: 8, width: 60, borderRadius: 999, background: "#BEDBFF" }} />
      </div>
      {/* 미선택 옵션 */}
      <div style={ROW.normal}>
        <div style={ROW.radioOuter} />
        <div style={{ height: 8, width: 130, borderRadius: 999, background: "#EAEBED" }} />
      </div>
      <div style={{ ...ROW.normal, opacity: 0.8 }}>
        <div style={ROW.radioOuter} />
        <div style={{ height: 8, width: 100, borderRadius: 999, background: "#EAEBED" }} />
      </div>
    </div>
  );
}

const ROW = {
  selected: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 9px",
    borderRadius: 7,
    background: "#EFF6FF",
    border: "1px solid #51A2FF",
  },
  normal: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 9px",
    borderRadius: 7,
    background: "#F7F7F7",
  },
  radioOuter: {
    width: 14, height: 14, borderRadius: 999, border: "1px solid #E6E7E9",
    background: "transparent", flexShrink: 0,
  },
  radioOuterSelected: {
    width: 14, height: 14, borderRadius: 999, background: "#51A2FF", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  radioDot: { width: 7, height: 7, borderRadius: 999, background: "#FFFFFF" },
};

/* =========================================================
 *  02. New Product Pricing Strategy – 가격 카드 2개 + 바
 * ========================================================= */
function PricingStrategyBody() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
      {/* 가격 카드 2개 */}
      <div style={{ display: "flex", gap: 5, alignItems: "stretch" }}>
        {/* 좌 (Plain) */}
        <div style={PRICE.cardPlain}>
          <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Star fill="#E6E7E9" />
            <Star fill="#E6E7E9" />
          </div>
          <div style={PRICE.price}>$120</div>
        </div>
        {/* 우 (Recommended) */}
        <div style={PRICE.cardRec}>
          <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} fill="#D0C9FF" />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <div style={PRICE.price}>$150</div>
            <div style={PRICE.badge}>Recommended</div>
          </div>
        </div>
      </div>

      {/* 점 + 바 placeholder 3행 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {[
          { dot: "rgba(234,235,237,0.9)", bar: "rgba(234,235,237,0.9)", w: 153 },
          { dot: "rgba(234,235,237,0.6)", bar: "rgba(234,235,237,0.6)", w: 79 },
          { dot: "rgba(234,235,237,0.6)", bar: "rgba(234,235,237,0.6)", w: 142 },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 0", opacity: 0.7 }}>
            <div style={{ width: 8, height: 8, borderRadius: 999, background: r.dot }} />
            <div style={{ height: 8, width: r.w, borderRadius: 999, background: r.bar }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const PRICE = {
  cardPlain: {
    flex: "0 0 auto",
    width: 88,
    background: "#FBFBFB",
    border: "1px solid #F0F0F2",
    borderRadius: 10,
    padding: "8px 8px 6px",
    display: "flex", flexDirection: "column",
    gap: 3,
  },
  cardRec: {
    flex: "1 1 0",
    minWidth: 0,
    background: "#F7F5FF",
    border: "1px solid #B5ABF2",
    borderRadius: 10,
    padding: "8px 8px 6px",
    display: "flex", flexDirection: "column",
    justifyContent: "center",
    gap: 3,
  },
  price: {
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 18.9,
    fontWeight: 600,
    color: "#171719",
    lineHeight: "25.8px",
  },
  badge: {
    background: "#EFEBFF",
    border: "0.86px solid #B5ABF2",
    borderRadius: 7,
    padding: "1.7px 5px",
    fontFamily: "Pretendard, sans-serif",
    fontSize: 9.5,
    fontWeight: 500,
    color: "#8A77E0",
    lineHeight: "12px",
    whiteSpace: "nowrap",
  },
};

function Star({ fill, size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={fill} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <polygon points="12,3 14.7,9 21,9.6 16.3,13.9 17.6,20 12,16.8 6.4,20 7.7,13.9 3,9.6 9.3,9" />
    </svg>
  );
}

/* =========================================================
 *  03. Audience Strategy – 2 카드 (좌 그린, 우 그레이)
 * ========================================================= */
function AudienceStrategyBody() {
  return (
    <div style={{ display: "flex", gap: 8, height: 78, width: "100%" }}>
      {/* 좌 */}
      <div style={{ ...AUD.card, background: "#F7FFEC", border: "1px solid #B6E274" }}>
        <IdentityPlatformIcon fill="#B6E274" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <div style={{ height: 8, width: 23, borderRadius: 999, background: "rgba(216,242,166,0.8)" }} />
          <div style={{ height: 8, width: "100%", borderRadius: 999, background: "rgba(216,242,166,0.6)" }} />
        </div>
      </div>
      {/* 우 */}
      <div style={{ ...AUD.card, background: "#F7F7F7" }}>
        <IdentityPlatformIcon fill="#CACCCF" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
          <div style={{ height: 8, width: 23, borderRadius: 999, background: "#EAEBED" }} />
          <div style={{ height: 8, width: "100%", borderRadius: 999, background: "rgba(234,235,237,0.6)" }} />
        </div>
      </div>
    </div>
  );
}

const AUD = {
  card: {
    flex: "1 1 0",
    minWidth: 0,
    height: "100%",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
};

function IdentityPlatformIcon({ fill }) {
  return (
    <svg width="20" height="20" viewBox="0 0 14.1667 16.0288" fill="none" aria-hidden="true">
      <path
        d="M6.29646 14.3542C6.54215 14.5047 6.80444 14.5779 7.08333 14.5738C7.36222 14.5694 7.62451 14.4919 7.87021 14.3413L11.5496 12.0929C10.8819 11.6442 10.1697 11.3036 9.41271 11.0713C8.65576 10.8389 7.87931 10.7227 7.08333 10.7227C6.28736 10.7227 5.50882 10.8402 4.74771 11.0752C3.98646 11.3103 3.265 11.6453 2.58333 12.08L6.29646 14.3542ZM7.08333 8.63938C7.83542 8.63938 8.47486 8.37604 9.00167 7.84938C9.52833 7.32257 9.79167 6.68313 9.79167 5.93104C9.79167 5.17896 9.52833 4.53951 9.00167 4.01271C8.47486 3.48604 7.83542 3.22271 7.08333 3.22271C6.33125 3.22271 5.69181 3.48604 5.165 4.01271C4.63833 4.53951 4.375 5.17896 4.375 5.93104C4.375 6.68313 4.63833 7.32257 5.165 7.84938C5.69181 8.37604 6.33125 8.63938 7.08333 8.63938ZM6.29646 15.8027L0.719583 12.3877C0.490972 12.251 0.313889 12.0683 0.188333 11.8396C0.0627776 11.611 0 11.3642 0 11.0994V4.92938C0 4.66451 0.0627776 4.41778 0.188333 4.18917C0.313889 3.96042 0.490972 3.77771 0.719583 3.64104L6.29646 0.226041C6.54215 0.0753467 6.80444 0 7.08333 0C7.36222 0 7.62451 0.0753467 7.87021 0.226041L13.4471 3.64104C13.6757 3.77771 13.8528 3.96042 13.9783 4.18917C14.1039 4.41778 14.1667 4.66451 14.1667 4.92938V11.0994C14.1667 11.3642 14.1039 11.611 13.9783 11.8396C13.8528 12.0683 13.6757 12.251 13.4471 12.3877L7.87021 15.8027C7.62451 15.9534 7.36222 16.0288 7.08333 16.0288C6.80444 16.0288 6.54215 15.9534 6.29646 15.8027Z"
        fill={fill}
      />
    </svg>
  );
}

/* =========================================================
 *  04. Churn Prediction – 라인 차트
 * ========================================================= */
function ChurnPredictionBody() {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 6, height: 74, width: "100%", position: "relative" }}>
      {/* Y축 라벨 */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "Pretendard, sans-serif", fontSize: 7, color: ALT, textAlign: "right", lineHeight: "5px" }}>
        <span>100%</span>
        <span>0%</span>
      </div>

      {/* 차트 */}
      <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
        {/* 그리드 (3행 x 2열) */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {[0, 1, 2].map((row) => (
            <div key={row} style={{ flex: 1, display: "flex" }}>
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #E6E7E9",
                borderLeft: "0.5px dashed #E6E7E9",
                borderBottom: row === 2 ? "0.5px dashed #E6E7E9" : "none",
              }} />
              <div style={{
                flex: 1,
                borderTop: "0.5px dashed #E6E7E9",
                borderLeft: "0.5px dashed #E6E7E9",
                borderRight: "0.5px dashed #E6E7E9",
                borderBottom: row === 2 ? "0.5px dashed #E6E7E9" : "none",
              }} />
            </div>
          ))}
        </div>

        {/* Area + Line + 데이터 포인트 (라인 위에 직접 배치) */}
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="churnArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFA2A2" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFA2A2" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M0,40 C30,30 50,15 80,18 C110,21 130,8 160,12 C180,14 195,5 200,4 L200,60 L0,60 Z"
            fill="url(#churnArea)"
          />
          <path
            d="M0,40 C30,30 50,15 80,18 C110,21 130,8 160,12 C180,14 195,5 200,4"
            fill="none"
            stroke="#FFA2A2"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          {/* 데이터 포인트: 곡선 위에 정확히 올림 */}
          <circle cx="160" cy="10" r="3" fill="#FFFFFF" stroke="#FFA2A2" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx="198" cy="4" r="3" fill="#FFFFFF" stroke="#FFA2A2" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}

/* ---------- Thumbnail shell styles ---------- */
const T = {
  outer: {
    position: "relative",
    width: 430,
    height: 150,
    borderRadius: 20,
    overflow: "hidden",
  },
  card: {
    position: "absolute",
    left: "50%",
    bottom: 0,
    transform: "translateX(-50%)",
    width: 266,
    height: 130,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: "14px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflow: "hidden",
  },
  title: {
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 11.18,
    fontWeight: 500,
    color: ALT,
    lineHeight: "15.48px",
  },
  bodyArea: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    width: "100%",
  },
};

/* ---------- Page styles ---------- */
const S = {
  page: {
    padding: "28px 32px",
    background: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Pretendard, Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#101828",
  },
  header: { marginBottom: 20 },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 13, color: "#667085" },

  tabs: {
    display: "flex",
    gap: 4,
    borderBottom: "1px solid #EAECF0",
    marginBottom: 24,
  },
  tab: {
    padding: "10px 14px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#667085",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    marginBottom: -1,
  },
  tabActive: {
    color: "#101828",
    borderBottomColor: "#101828",
  },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 15, fontWeight: 600, color: "#101828", marginBottom: 4 },
  sectionMeta: { fontSize: 12, color: "#98A2B3", marginBottom: 16 },
  thumbGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 24,
  },
  thumbCard: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  thumbLabel: {
    fontSize: 12,
    color: "#475467",
    fontWeight: 500,
  },

  placeholder: {
    padding: "48px 16px",
    textAlign: "center",
    color: "#98A2B3",
    fontSize: 13,
    border: "1px dashed #EAECF0",
    borderRadius: 10,
  },
};
