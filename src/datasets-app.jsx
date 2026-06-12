import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
 *  Syntitan · Datasets → 멀티선택 → 데이터 합치기(Union) 플로우
 *  화면: list → merge → merging(loading) → result
 *  + (기존) detail: AI Readiness / Detail
 *  가로 1600 기준
 * ========================================================= */

const FONT =
  "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const C = {
  bg: "#F9FAFB",
  panel: "#FFFFFF",
  border: "#E5E7EB",
  borderSoft: "#F1F2F4",
  text: "#18181B",
  sub: "#6B7280",
  faint: "#9CA3AF",
  dark: "#18181B",
  green: "#22C55E",
  greenText: "#16A34A",
  greenBg: "#F0FDF4",
  yellow: "#F5B82E",
  yellowText: "#D99106",
  red: "#EF4444",
  track: "#EEEFF1",
  chipBg: "#F3F4F6",
  blue: "#3B82F6",
  blueSoft: "#EFF4FF",
  purple: "#6366F1",
};

const READINESS_LEVEL = (pct) =>
  pct >= 90 ? C.green : pct >= 40 ? C.yellow : C.red;

const DATASETS = [
  { id: 1, name: "CUBIG Data", pct: 20, version: "v1", changes: "1 changes", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 2, name: "CUBIG Data", pct: 20, version: "v1", changes: "10 changes", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 3, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 4, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 5, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 6, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 7, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 8, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 9, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 10, name: "CUBIG Data", pct: 99, version: "v3", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 11, name: "CUBIG Data", pct: 99, version: "v3", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 12, name: "CUBIG Data", pct: 99, version: "v3", created: "Mar 24", updated: "Mar 25", ts: 25 },
  { id: 13, name: "CUBIG Data", pct: 100, version: "v9", created: "Mar 24", updated: "Mar 25", ts: 25 },
];

/* ---------------- icons ---------------- */
const Icon = {
  panel: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /><line x1="9" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="1.7" /></svg>),
  home: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 10.5 12 3l9 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 9.5V20h14V9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  db: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><ellipse cx="12" cy="5" rx="8" ry="3" stroke="currentColor" strokeWidth="1.7" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" stroke="currentColor" strokeWidth="1.7" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" stroke="currentColor" strokeWidth="1.7" /></svg>),
  agent: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  users: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" /><path d="M3 19c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M16 6.5a2.5 2.5 0 0 1 0 5M18 19c0-2.2-1-3.8-2.5-4.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  report: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 14v3M12 11v6M16 8v9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  search: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>),
  plus: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>),
  calendar: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>),
  kebab: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" /></svg>),
  chevR: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  chevD: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  back: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  x: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>),
  download: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  trash: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  spark: (p) => (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l1.8 5.6L19 9.4l-5.2 1.8L12 17l-1.8-5.8L5 9.4l5.2-1.8z" /><path d="M19 14l.8 2.4L22 17.2l-2.2.8L19 20l-.8-2-2.2-.8 2.2-.8z" /></svg>),
  checkCircle: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" fill={C.green} /><path d="m8 12 2.5 2.5L16 9" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  infoCircle: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  link: (p) => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  union: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="4" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" /><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.7" fill={C.panel} /></svg>),
  join: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="9" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" /><circle cx="15" cy="12" r="6" stroke="currentColor" strokeWidth="1.7" /></svg>),
  viewTable: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M3 9h18M3 14.5h18M9 4v16" stroke="currentColor" strokeWidth="1.5" /></svg>),
  viewList: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>),
  key: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" /><path d="m11 11 8 8M16 16l2-2M19 13l2 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>),
  hash: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  clock: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" /><path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  typeA: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 19 11 5l6 14M7 14h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  clipboard: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" /><rect x="9" y="2.5" width="6" height="3.5" rx="1.2" stroke="currentColor" strokeWidth="1.7" /><path d="M8.5 11h7M8.5 15h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  money: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" /><path d="M6 9v6M18 9v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  trend: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 16c3-1 4-7 8-7s5 4 8 1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="4" cy="16" r="1.6" fill="currentColor" /><circle cx="20" cy="10" r="1.6" fill="currentColor" /></svg>),
  group: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><circle cx="8" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" /><circle cx="16" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" /><path d="M3 18c0-2.5 2.2-4 5-4s5 1.5 5 4M13 18c0-2.5 2.2-4 5-4s3 1.5 3 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  warn: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 4 3 19h18L12 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  cursor: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="m5 4 14 6-6 2-2 6-6-14Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>),
  help: (p) => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.7.3-1.2.9-1.2 1.6v.5M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
  person: (p) => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" /><path d="M5 20c0-3.4 3-5.5 7-5.5s7 2.1 7 5.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
  sheet: (p) => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="3" width="16" height="18" rx="2" fill="#1E9E5A" /><path d="M8 8h8M8 12h8M8 16h8M12 8v8" stroke="#fff" strokeWidth="1.4" /></svg>),
  edit: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M14 5l5 5M4 20l1-4L16 5l3 3L8 19l-4 1Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
  swap: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><path d="M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
};

/* ---------------- atoms ---------------- */
function Bar({ pct, color, w = 120 }) {
  return (<div style={{ width: w, height: 7, borderRadius: 999, background: C.track, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: color }} /></div>);
}
function Avatar({ size = 22 }) {
  return (<div style={{ width: size, height: size, borderRadius: "50%", background: "#3F3F46", color: "#fff", fontSize: size * 0.45, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>A</div>);
}
function Checkbox({ checked, onChange, faded }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onChange && onChange(!checked); }}
      style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0, cursor: "pointer",
        border: `1.6px solid ${checked ? C.blue : "#CBD0D6"}`,
        background: checked ? C.blue : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: faded ? 0.4 : 1,
      }}
    >
      {checked && (<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>)}
    </div>
  );
}
function TypeTag({ kind = "String" }) {
  const icon = kind === "Integer" || kind === "Interger" ? <Icon.hash /> : kind === "Time" ? <Icon.clock /> : <Icon.typeA />;
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 7px", background: "#fff" }}>{icon}{kind}</span>);
}

/* =========================================================
 *  Sidebar
 * ========================================================= */
function NavItem({ icon, label, active, muted, onClick }) {
  return (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, cursor: "pointer", background: active ? "#F3F4F6" : "transparent", color: muted ? C.faint : C.text, fontWeight: active ? 600 : 500, fontSize: 14 }}>
      <span style={{ color: muted ? C.faint : "#3F3F46", display: "flex" }}>{icon}</span>{label}
    </div>
  );
}
function Sidebar({ active = "Home", onNav = () => {} }) {
  return (
    <aside style={{ width: 258, flexShrink: 0, alignSelf: "stretch", background: C.panel, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "18px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 16px" }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Syntitan</span>
        <span style={{ color: C.faint, cursor: "pointer", display: "flex" }}><Icon.panel /></span>
      </div>
      <NavItem icon={<Icon.home />} label="Home" active={active === "Home"} onClick={() => onNav("Home")} />
      <div style={{ fontSize: 12, color: C.faint, fontWeight: 600, padding: "14px 10px 6px" }}>Workspace</div>
      <NavItem icon={<Icon.db />} label="Edit Dataset" active={active === "Edit Dataset"} onClick={() => onNav("Edit Dataset")} />
      <NavItem icon={<Icon.agent />} label="Agent Analysis" active={active === "Agent Analysis"} onClick={() => onNav("Agent Analysis")} />
      <NavItem icon={<Icon.users />} label="Discussion Room" onClick={() => onNav("Discussion Room")} />
      <div style={{ fontSize: 12, color: C.faint, fontWeight: 600, padding: "14px 10px 6px" }}>Analyze</div>
      <NavItem icon={<Icon.report />} label="Report Hub" onClick={() => onNav("Report Hub")} />
      <div style={{ flex: 1 }} />
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#5B9BFF 0%,#7FB6FF 100%)", color: "#fff", fontWeight: 700, fontSize: 13, fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center" }}>Basic</div>
          <div><div style={{ fontSize: 11.5, color: C.faint }}>Current plan</div><div style={{ fontSize: 14, fontWeight: 600 }}>Basic</div></div>
        </div>
        <div style={{ height: 1, background: C.borderSoft, margin: "12px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
          <span style={{ color: C.sub }}>Credits</span>
          <span style={{ fontWeight: 600 }}>50,000<span style={{ color: C.faint, fontWeight: 500 }}>/600,000</span></span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: C.track }}><div style={{ width: "9%", height: "100%", borderRadius: 999, background: C.dark }} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", cursor: "pointer" }}>
        <Avatar size={26} /><span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Cubig Kim</span>
        <span style={{ color: C.faint, display: "flex" }}><Icon.chevR /></span>
      </div>
    </aside>
  );
}

/* =========================================================
 *  Datasets list (multi-select)
 * ========================================================= */
function SummaryCard({ dot, label, range, value }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", minWidth: 150, background: C.panel }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, fontWeight: 500 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />{label}
        </span>
        <span style={{ fontSize: 12, color: C.faint }}>{range}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}

function DatasetsPage({ datasets, onOpen, selected, setSelected, onMerge, onMergeDirect }) {
  const [q, setQ] = useState("");
  const [hover, setHover] = useState(null);
  const rows = useMemo(() => {
    const sorted = [...datasets].sort((a, b) => b.ts - a.ts); // 업데이트 최신순
    if (!q.trim()) return sorted;
    return sorted.filter((d) => (d.name || "CUBIG Data").toLowerCase().includes(q.trim().toLowerCase()));
  }, [datasets, q]);
  const selecting = selected.length > 0;
  const overLimit = selected.length > MAX_MERGE;
  const canMerge = selected.length >= 2 && selected.length <= MAX_MERGE;
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));
  const toggle = (id, v) => setSelected((s) => (v ? [...s, id] : s.filter((x) => x !== id)));
  const toggleAll = (v) => setSelected(v ? rows.map((r) => r.id) : []);

  const grid = "44px 1.6fr 1.1fr 1fr 1fr 0.8fr 0.8fr 40px";

  return (
    <div style={{ padding: "34px 40px 60px" }}>
      {/* title + summary cards */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Datasets</h1>
          <p style={{ color: C.sub, fontSize: 14, margin: "8px 0 0" }}>Upload your dataset to diagnose AI Readiness and optimize data gaps.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <SummaryCard dot={C.green} label="AI Ready" range="≥90%" value="2" />
          <SummaryCard dot={C.yellow} label="Caution" range="40–89%" value="2" />
          <SummaryCard dot={C.red} label="Critical" range="0–39%" value="1" />
        </div>
      </div>

      {/* search + actions OR selection toolbar — 고정 높이 컨테이너로 감싸 선택 시 표가 흔들리지 않게 */}
      <div style={{ height: 60, marginBottom: 14 }}>
      {!selecting ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%", gap: 16 }}>
          <div style={{ flex: 1, maxWidth: 520, display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.border}`, borderRadius: 10, padding: "0 14px", height: 44, background: C.panel }}>
            <span style={{ color: C.faint, display: "flex" }}><Icon.search /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontFamily: FONT, background: "transparent" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onMergeDirect} style={{ display: "flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px", background: C.panel, color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
              <Icon.link /> 데이터 합치기
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px", background: C.dark, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
              <Icon.plus /> Upload Data
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F1F4F9", borderRadius: 12, padding: "0 16px", height: "100%" }}>
          <span onClick={() => setSelected([])} style={{ color: C.sub, cursor: "pointer", display: "flex" }}><Icon.x /></span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{selected.length}개 선택됨</span>
          <div style={{ flex: 1 }} />
          {overLimit && <span style={{ fontSize: 12.5, color: C.red }}>최대 {MAX_MERGE}개</span>}
          <button
            onClick={() => canMerge && onMerge()}
            disabled={!canMerge}
            style={{ display: "flex", alignItems: "center", gap: 7, height: 40, padding: "0 16px", border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 600, fontFamily: FONT, cursor: canMerge ? "pointer" : "default", background: canMerge ? "#E4E9FF" : "#EEF0F3", color: canMerge ? C.purple : C.faint }}
          >
            <Icon.spark /> 데이터 합치기 ({selected.length}/{MAX_MERGE})
          </button>
          <button title="다운로드" style={{ display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", color: C.text, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}><Icon.download /> 다운로드</button>
          <button title="삭제" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", color: C.sub, cursor: "pointer", fontFamily: FONT }}><Icon.trash /></button>
        </div>
      )}
      </div>

      {/* table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.panel }}>
        <div style={{ display: "grid", gridTemplateColumns: grid, alignItems: "center", padding: "13px 20px", fontSize: 13, color: C.sub, fontWeight: 600, borderBottom: `1px solid ${C.border}`, background: "#FCFCFD" }}>
          <span>{selecting ? <Checkbox checked={allChecked} onChange={toggleAll} /> : ""}</span>
          <span>Dataset</span><span>AI Readiness</span><span>Version</span><span>Owner</span><span>Created</span><span>Updated</span><span />
        </div>
        {rows.map((d, i) => {
          const checked = selected.includes(d.id);
          const showCb = selecting || hover === d.id || checked;
          return (
            <div key={d.id} onClick={() => onOpen(d.id)} onMouseEnter={() => setHover(d.id)} onMouseLeave={() => setHover(null)}
              style={{ display: "grid", gridTemplateColumns: grid, alignItems: "center", padding: "13px 20px", fontSize: 14, borderBottom: i === rows.length - 1 ? "none" : `1px solid ${C.borderSoft}`, cursor: "pointer", background: checked ? C.blueSoft : hover === d.id ? "#FAFAFB" : "transparent" }}>
              <span onClick={(e) => e.stopPropagation()} style={{ display: "flex", height: "100%", alignItems: "center" }}>{showCb && <Checkbox checked={checked} onChange={(v) => toggle(d.id, v)} />}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, flexShrink: 0 }}><Icon.db /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name || "CUBIG Data"}</span>
                    {d.isNew && <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 700, color: C.blue, background: "#E4ECFF", borderRadius: 5, padding: "1px 6px", letterSpacing: 0.3 }}>NEW</span>}
                  </div>
                  <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>4.8GB · 247 columns · 47 rows</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Bar pct={d.pct} color={READINESS_LEVEL(d.pct)} /><span style={{ fontSize: 13, color: C.sub, minWidth: 34 }}>{d.pct}%</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontWeight: 500 }}>{d.version}</span>{d.changes && <span style={{ fontSize: 12, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 7px" }}>{d.changes}</span>}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar /><span>Luna Hart</span></div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 9px", width: "fit-content" }}><Icon.calendar /> {d.created}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.sub, fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 7, padding: "5px 9px", width: "fit-content" }}><Icon.calendar /> {d.updated}</span>
              <span style={{ color: C.faint, display: "flex", justifyContent: "flex-end" }}><Icon.kebab /></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
 *  Merge page
 * ========================================================= */
const MERGED_NAMES = (ids) => ids.map((_, i) => `CUBIG Data_${2024 + i}`);
const MAX_MERGE = 3; // 한 번에 합칠 수 있는 데이터셋 최대 개수
const poolLabel = (i) => (i === 0 ? "CUBIG Data_2024" : "CUBIG Data_2025");
const DEFAULT_NAMES = ["CUBIG Data_2024", "CUBIG Data_2025"];

const AUTO_ROWS = [
  ["customer_id", "Integer"], ["name", "String"], ["email", "String"],
  ["signup_date", "Integer"], ["region", "Integer"], ["age", "String"],
];
const NO_MATCH = "매칭 칼럼 없음";
const REVIEW_ROWS = [
  { left: "customer_id", lt: "String", right: NO_MATCH, note: "CUBIG Data_2025에 없는 칼럼이에요. 해당 행은 Null로 채워져요." },
  { left: "signup_date", lt: "String", right: "signup_date", rt: "Integer", note: "타입이 달라요. (e.g. String ↔ Integer) 합치면 일부 값이 깨질 수 있어요." },
  { left: "region", lt: "String", right: NO_MATCH, note: "합치려는 컬럼의 타입이 서로 다르면, 데이터 품질이 떨어질 수 있어요." },
];
const COL_OPTIONS = [
  { name: NO_MATCH },
  { name: "customer_id", type: "Integer" },
  { name: "name", type: "String" },
  { name: "email", type: "String" },
  { name: "signup_date", type: "Integer" },
  { name: "region", type: "String" },
  { name: "age", type: "Integer" },
];
const colType = (name) => COL_OPTIONS.find((o) => o.name === name)?.type;
const JOIN_KEYS = [
  { name: "customer_id", type: "Integer", rate: 92, recommended: true },
  { name: "email", type: "String", rate: 78 },
  { name: "name", type: "String", rate: 41 },
];
const rateColor = (r) => (r >= 80 ? C.green : r >= 50 ? C.yellow : C.red);

/* 클릭 가능한 매칭 드롭다운 (데이터 타입 표시) — 메뉴는 fixed 위치로 띄워 잘림 방지 */
function MatchDropdown({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const none = value === NO_MATCH;
  const t = colType(value);
  const toggle = () => {
    if (open) { setOpen(false); return; }
    const r = ref.current.getBoundingClientRect();
    const menuH = Math.min(280, COL_OPTIONS.length * 42 + 8);
    const below = window.innerHeight - r.bottom;
    const openUp = below < menuH + 16 && r.top > below;
    setPos({ left: r.left, width: r.width, top: openUp ? null : r.bottom + 4, bottom: openUp ? window.innerHeight - r.top + 4 : null });
    setOpen(true);
  };
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div onClick={toggle} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, border: `1px solid ${error ? "#F87171" : open ? C.dark : C.border}`, borderRadius: 9, padding: "9px 12px", background: error ? "#FEF2F2" : "#fff", cursor: "pointer" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: none ? C.faint : C.text }}>{value} {t && <TypeTag kind={t} />}</span>
        <span style={{ color: C.faint, display: "flex", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}><Icon.chevD /></span>
      </div>
      {open && pos && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "fixed", left: pos.left, width: pos.width, top: pos.top ?? undefined, bottom: pos.bottom ?? undefined, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", zIndex: 41, maxHeight: 280, overflowY: "auto", padding: 4 }}>
            {COL_OPTIONS.map((o) => (
              <div key={o.name} onClick={() => { onChange(o.name); setOpen(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", fontSize: 14, borderRadius: 7, cursor: "pointer", background: o.name === value ? C.blueSoft : "transparent" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, color: o.name === NO_MATCH ? C.faint : C.text }}>{o.name} {o.type && <TypeTag kind={o.type} />}</span>
                {o.name === value && <Icon.checkCircle width={15} height={15} />}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* 매칭 계산 스켈레톤 */
function MergeSkeleton() {
  const sk = (w, h = 13) => ({ height: h, width: w, borderRadius: 7, background: "#EEEFF1", animation: "pulse 1.2s ease-in-out infinite" });
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><StepNum n="01" /><span style={{ fontSize: 15, fontWeight: 700 }}>병합 방식</span></div>
      <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: "#EEEFF1", animation: "pulse 1.2s ease-in-out infinite", flexShrink: 0 }} />
            <div style={{ flex: 1 }}><div style={sk("55%", 14)} /><div style={{ height: 8 }} /><div style={sk("85%", 10)} /></div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}><StepNum n="02" /><span style={{ fontSize: 15, fontWeight: 700 }}>칼럼 매칭</span><span style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.faint }}><span style={{ width: 14, height: 14, border: `2px solid ${C.border}`, borderTopColor: C.sub, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} /> 칼럼을 매칭하고 있어요...</span></div>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i === 4 ? "none" : `1px solid ${C.borderSoft}` }}>
            <div style={sk("120px")} /><div style={sk("30px", 12)} /><div style={sk("40%")} />
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function StepNum({ n }) {
  return (<span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, background: "#F0F1F3", color: C.sub, fontSize: 12, fontWeight: 700 }}>{n}</span>);
}
function EditToggle({ editing, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 5, border: `1px solid ${editing ? C.dark : C.border}`, background: editing ? C.dark : "#fff", color: editing ? "#fff" : C.text, borderRadius: 8, padding: "5px 11px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
      {editing ? "완료" : <><Icon.edit width={13} height={13} /> 수정</>}
    </button>
  );
}

function LeftPanel({ picked, setPicked, picking, setPicking, onDone, onCancel, canCancel }) {
  const pool = useMemo(() => Array.from({ length: 18 }, (_, i) => poolLabel(i)), []);
  const atMax = picked.length >= MAX_MERGE;
  const togglePick = (i) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length >= MAX_MERGE ? p : [...p, i]));

  if (picking) {
    return (
      <div style={panel.left}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>데이터 선택</span>
          <span style={{ fontSize: 12.5, color: atMax ? C.purple : C.faint, fontWeight: 600 }}>{picked.length}/{MAX_MERGE}</span>
        </div>
        <div style={{ padding: "9px 16px", fontSize: 11.5, color: C.faint, borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", gap: 5, lineHeight: 1.5 }}>
          <Icon.infoCircle width={12} height={12} /> 처음 선택한 데이터셋이 기준이 돼요 · 최대 {MAX_MERGE}개
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {pool.map((nm, i) => {
            const checked = picked.includes(i);
            const isBase = picked[0] === i;
            const order = picked.indexOf(i) + 1;
            const disabled = !checked && atMax;
            return (
              <label key={i} onClick={() => !disabled && togglePick(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: disabled ? "default" : "pointer", background: isBase ? "#EEF4FF" : checked ? "#F7F8FA" : "transparent", opacity: disabled ? 0.45 : 1 }}>
                <Checkbox checked={checked} onChange={() => !disabled && togglePick(i)} />
                <span style={{ width: 30, height: 30, borderRadius: 7, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}><Icon.db /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{nm}</span>
                    {isBase && <span style={{ fontSize: 10.5, fontWeight: 700, color: C.sub, background: C.chipBg, borderRadius: 5, padding: "1px 6px" }}>기준</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.faint }}>58.2KB · 4컬럼 · 8,432행</div>
                </div>
                {checked && <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: `1px solid ${isBase ? C.blue : C.border}`, background: "#fff", color: isBase ? C.blue : C.sub, fontSize: 11.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{order}</span>}
              </label>
            );
          })}
        </div>
        <button onClick={() => picked.length >= 2 && onDone()} disabled={picked.length < 2} style={{ margin: 12, padding: "12px 0", borderRadius: 10, border: "none", background: picked.length >= 2 ? C.dark : "#E5E7EB", color: picked.length >= 2 ? "#fff" : C.faint, fontSize: 14, fontWeight: 600, cursor: picked.length >= 2 ? "pointer" : "default", fontFamily: FONT }}>완료</button>
      </div>
    );
  }

  return (
    <div style={panel.left}>
      <div style={{ padding: "16px 16px 10px", fontSize: 13, color: C.sub, fontWeight: 600 }}>데이터셋 ({picked.length}개)</div>
      <div style={{ padding: "0 12px 12px" }}>
        <button onClick={() => setPicking(true)} style={{ width: "100%", padding: "11px 0", borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Icon.swap width={14} height={14} /> 데이터 재선택</button>
      </div>
      {/* 기준 데이터셋 (첫 번째) */}
      <div style={{ padding: "8px 18px 6px", fontSize: 12, fontWeight: 700, color: C.sub, display: "flex", alignItems: "center", gap: 5 }}>기준 데이터셋</div>
      {picked.slice(0, 1).map((idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", margin: "0 8px 6px", borderRadius: 10 }}>
          <span style={{ width: 30, height: 30, borderRadius: 7, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}><Icon.db /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{poolLabel(idx)}</span>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: C.sub, background: C.chipBg, borderRadius: 5, padding: "1px 6px" }}>기준</span>
            </div>
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 1 }}>58.2KB · 4컬럼 · 8,432행</div>
          </div>
        </div>
      ))}

      {/* 추가될 데이터 */}
      {picked.length > 1 && <div style={{ padding: "10px 18px 6px", fontSize: 12, fontWeight: 700, color: C.sub }}>합칠 데이터 ({picked.length - 1})</div>}
      {picked.slice(1).map((idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", margin: "0 8px 6px", borderRadius: 10 }}>
          <span style={{ width: 30, height: 30, borderRadius: 7, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}><Icon.db /></span>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{poolLabel(idx)}</div><div style={{ fontSize: 11.5, color: C.faint }}>58.2KB · 4컬럼 · 8,432행</div></div>
        </div>
      ))}
    </div>
  );
}

const panel = {
  left: { width: 310, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.panel, display: "flex", flexDirection: "column" },
};

function MethodCard({ active, disabled, icon, title, desc, badge, onClick }) {
  return (
    <div onClick={disabled ? undefined : onClick} style={{ flex: 1, border: `1.5px solid ${active ? "#7B7E85" : C.border}`, borderRadius: 14, padding: "18px 20px", background: disabled ? "#FAFAFB" : "#fff", opacity: disabled ? 0.65 : 1, cursor: disabled ? "default" : "pointer", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <span style={{ width: 38, height: 38, borderRadius: 9, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 13, color: C.sub, marginTop: 3 }}>{desc}</div>
        </div>
        {badge}
      </div>
    </div>
  );
}

function MergePage({ selected, onBack, onRun }) {
  // 멀티선택으로 진입(2개 이상) → 요약부터 / 헤더 버튼으로 직접 진입(0개) → 데이터 선택부터
  const cameWithSelection = selected.length >= 2;
  const [picked, setPicked] = useState(cameWithSelection ? [0, 1] : []); // 좌측 드래프트 선택
  const [committed, setCommitted] = useState(cameWithSelection ? [0, 1] : []); // 실제 적용(우측 본문 기준)
  const [picking, setPicking] = useState(!cameWithSelection);
  const [method, setMethod] = useState("union"); // union | join
  const [joinKey, setJoinKey] = useState("customer_id");
  const [autoOpen, setAutoOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [autoSel, setAutoSel] = useState(AUTO_ROWS.map((r) => r[0]));
  const [reviewOpen, setReviewOpen] = useState(true);
  const [reviewSel, setReviewSel] = useState(REVIEW_ROWS.map((r) => r.right));

  // 완료(committed 변경) 시에만 매칭 재계산 스켈레톤
  const committedKey = committed.join(",");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (committed.length < 2) { setLoading(false); return; }
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [committedKey]);

  const hasContent = committed.length >= 2; // 우측에 보여줄 내용이 있는지 (재선택 중에도 유지)
  const isJoin = method === "join";
  // Union=행 추가(많아지면 행 한도 초과), Join=열 추가(행은 기준 기준 유지)
  const over = !isJoin && hasContent && committed.length >= 3;
  const afterCols = isJoin ? 10 : 12; // 기준 칼럼 기준이라 한도(100) 초과 불가
  const afterRows = isJoin ? 40 : committed.length >= 3 ? 12648 : 120;
  // 매칭 검증: 같은 컬럼 중복 선택 / 전부 매칭 없음
  const autoDupes = useMemo(() => {
    const c = {}; autoSel.forEach((v) => { if (v !== NO_MATCH) c[v] = (c[v] || 0) + 1; });
    return new Set(Object.keys(c).filter((k) => c[k] > 1));
  }, [autoSel]);
  const autoAllNone = autoSel.every((v) => v === NO_MATCH);
  const matchError = autoDupes.size > 0 || autoAllNone;
  const [toast, setToast] = useState("");
  useEffect(() => { if (editing && autoAllNone) setToast("칼럼을 1개 이상 매칭해야 합니다."); }, [editing, autoAllNone]);

  const ready = hasContent && !loading && !picking; // 우측 본문/수치 노출 조건
  const names = hasContent ? committed.map(poolLabel) : DEFAULT_NAMES;
  const canRun = ready && !over && !matchError; // 한도 초과·매칭 오류 시 실행 불가

  return (
    <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", flex: 1, minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <span onClick={onBack} style={{ cursor: "pointer", display: "flex", color: C.sub }}><Icon.back /></span>
        <span style={{ fontSize: 16, fontWeight: 700 }}>데이터 합치기</span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <LeftPanel picked={picked} setPicked={setPicked} picking={picking} setPicking={setPicking} canCancel={committed.length >= 2}
          onDone={() => { setCommitted(picked); setPicking(false); }}
          onCancel={() => { setPicked(committed); setPicking(false); }} />

        {!hasContent ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", color: C.faint }}>
            <span style={{ width: 56, height: 56, borderRadius: 14, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}><Icon.union width={26} height={26} /></span>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{picking ? "데이터 선택을 완료해 주세요" : "합칠 데이터를 선택해 주세요"}</div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{picking ? <>2~{MAX_MERGE}개 선택 후 <b>완료</b>를 누르면<br />병합 방식과 칼럼 매칭 결과를 확인할 수 있어요.</> : <>왼쪽에서 2~{MAX_MERGE}개의 데이터를 선택하면<br />병합 방식과 칼럼 매칭 결과를 확인할 수 있어요.</>}</div>
          </div>
        ) : loading ? (
          <MergeSkeleton />
        ) : (
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px 120px", position: "relative", background: "#FBFBFB" }}>
          {over && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#FEF2F2", border: `1px solid #FCA5A5`, borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>!</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>합본 한도를 초과했어요</div>
                <div style={{ fontSize: 13, color: "#7F1D1D", marginTop: 4, lineHeight: 1.5 }}>합치면 <b>{afterRows.toLocaleString()}행</b>으로 한도(10,000행)를 넘어 병합할 수 없어요. 데이터를 2개 이하로 줄이거나 행 수를 줄여주세요.</div>
              </div>
            </div>
          )}
          {/* 01 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><StepNum n="01" /><span style={{ fontSize: 15, fontWeight: 700 }}>병합 방식</span></div>
          <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
            <MethodCard active={method === "union"} onClick={() => setMethod("union")} icon={<Icon.union />} title="Union" desc="컬럼이 같은 두 데이터를 위아래로 쌓아요. (행 추가)" badge={<span style={{ display: "flex", alignItems: "center", gap: 4, background: "#EEF2FF", color: C.purple, fontSize: 12, fontWeight: 600, borderRadius: 7, padding: "4px 9px" }}><Icon.spark /> 추천</span>} />
            <MethodCard active={method === "join"} onClick={() => setMethod("join")} icon={<Icon.join />} title="Join" desc="기준 데이터 옆에 열을 추가해요. (컬럼 추가)" />
          </div>

          {/* 02 */}
          {method === "join" ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><StepNum n="02" /><span style={{ fontSize: 15, fontWeight: 700 }}>조인 키 매칭</span></div>
              <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>두 데이터를 연결할 기준 컬럼(조인 키)을 선택하세요. AI가 매칭률이 높은 키를 추천해요.</div>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
                {JOIN_KEYS.map((k, i) => {
                  const sel = joinKey === k.name;
                  return (
                    <div key={k.name} onClick={() => setJoinKey(k.name)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer", borderBottom: i === JOIN_KEYS.length - 1 ? "none" : `1px solid ${C.borderSoft}`, background: sel ? C.blueSoft : "#fff" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${sel ? C.blue : "#CBD0D6"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{sel && <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.blue }} />}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, minWidth: 180 }}>{k.name} <TypeTag kind={k.type} />{k.recommended && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: C.purple, background: "#EEF2FF", borderRadius: 5, padding: "1px 6px" }}><Icon.spark /> 추천</span>}</span>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 7, borderRadius: 999, background: C.track, overflow: "hidden", maxWidth: 260 }}><div style={{ width: `${k.rate}%`, height: "100%", background: rateColor(k.rate), borderRadius: 999 }} /></div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: rateColor(k.rate), minWidth: 38, textAlign: "right" }}>{k.rate}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12.5, color: C.faint, marginBottom: 30, lineHeight: 1.5 }}><Icon.infoCircle width={13} height={13} /> <span><b>매칭률</b> = 두 데이터셋에서 조인 키 값이 양쪽에 모두 존재해 연결되는 행의 비율. 낮을수록 매칭 안 되는 행(빈 값)이 많아져요.</span></div>
            </>
          ) : (
          <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><StepNum n="02" /><span style={{ fontSize: 15, fontWeight: 700 }}>칼럼 매칭</span></div>

          {/* AI auto */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8 }}>
              <span onClick={() => setAutoOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <span style={{ transform: autoOpen ? "none" : "rotate(-90deg)", display: "flex", transition: "transform .15s", color: C.purple }}><Icon.chevD /></span>
                <Icon.spark style={{ color: "#7C3AED" }} />
                <span style={{ background: "linear-gradient(90deg, #7C3AED, #3B82F6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>AI 자동 매칭 (120건)</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.greenText }}><Icon.checkCircle /> 이름 일치 · 타입 일치</span>
                <EditToggle editing={editing} onClick={() => { if (!editing) { setAutoOpen(true); setReviewOpen(true); } setEditing((v) => !v); }} />
              </span>
            </div>
            {autoOpen && (
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                {editing && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.sub, padding: "12px 16px", background: "#F5F3FF", borderBottom: `1px solid ${C.borderSoft}` }}><Icon.infoCircle width={13} height={13} /> AI가 매칭한 결과가 틀렸다면 오른쪽에서 직접 바꿀 수 있어요.</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 30px 1fr", padding: "12px 16px", fontSize: 13, color: C.sub, background: "#fff", borderBottom: `1px solid ${C.borderSoft}` }}>
                  <span>{names[0]} <span style={{ color: C.faint, fontWeight: 600 }}>(기준)</span></span><span /><span>{names[1]}</span>
                </div>
                {AUTO_ROWS.map((r, i) => {
                  const dup = editing && autoDupes.has(autoSel[i]);
                  return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 30px 1fr", alignItems: "start", padding: "11px 16px", borderBottom: i === AUTO_ROWS.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, paddingTop: editing ? 9 : 0 }}>{r[0]} <TypeTag kind={r[1]} /></span>
                    <span style={{ color: C.faint, display: "flex", justifyContent: "center", paddingTop: editing ? 11 : 0 }}><Icon.link /></span>
                    {editing ? (
                      <div>
                        <MatchDropdown value={autoSel[i]} error={dup} onChange={(v) => setAutoSel((s) => s.map((x, idx) => (idx === i ? v : x)))} />
                        {dup && <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#DC2626", marginTop: 6 }}><Icon.infoCircle width={12} height={12} /> 중복된 칼럼이 있어요. 다시 선택해 주세요.</div>}
                      </div>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: autoSel[i] === NO_MATCH ? C.faint : C.text }}>{autoSel[i]} {colType(autoSel[i]) && <TypeTag kind={colType(autoSel[i])} />}</span>
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* review */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8 }}>
              <span onClick={() => setReviewOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <span style={{ transform: reviewOpen ? "none" : "rotate(-90deg)", display: "flex", transition: "transform .15s" }}><Icon.chevD /></span>
                검토 필요 (3건)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.faint }}><Icon.infoCircle width={15} height={15} /> 이름 불일치 · 타입 불일치</span>
                <EditToggle editing={editing} onClick={() => { if (!editing) { setAutoOpen(true); setReviewOpen(true); } setEditing((v) => !v); }} />
              </span>
            </div>
            {reviewOpen && (
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "12px 16px", fontSize: 13, color: C.sub, background: "#fff", borderBottom: `1px solid ${C.borderSoft}` }}>
                  <span>{names[0]} <span style={{ color: C.faint, fontWeight: 600 }}>(기준)</span></span><span>{names[1]}</span>
                </div>
                {REVIEW_ROWS.map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 30px 1fr", alignItems: "start", padding: "16px", borderBottom: i === REVIEW_ROWS.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, paddingTop: 9 }}>{r.left} <TypeTag kind={r.lt} /></span>
                    <span style={{ color: C.faint, display: "flex", justifyContent: "center", paddingTop: 11 }}><Icon.link /></span>
                    <div>
                      {editing ? (
                        <MatchDropdown value={reviewSel[i]} onChange={(v) => setReviewSel((s) => s.map((x, idx) => (idx === i ? v : x)))} />
                      ) : (
                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: reviewSel[i] === NO_MATCH ? C.faint : C.text, paddingTop: 9 }}>{reviewSel[i]} {colType(reviewSel[i]) && <TypeTag kind={colType(reviewSel[i])} />}</span>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: reviewSel[i] === NO_MATCH ? C.yellowText : C.faint, marginTop: 8 }}>
                        <Icon.infoCircle width={13} height={13} /> {reviewSel[i] === NO_MATCH ? "매칭 칼럼이 없어 신규 데이터 행은 Null로 채워져요." : r.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </>
          )}

          {/* 03 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><StepNum n="03" /><span style={{ fontSize: 15, fontWeight: 700 }}>저장 위치</span></div>
          <div style={{ maxWidth: 560, marginBottom: 8, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, background: "#fff", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.blue }}><Icon.db /></span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{names[0]}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: C.sub, background: C.chipBg, borderRadius: 5, padding: "1px 6px" }}>기준</span>
                </div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>기준 데이터셋에 병합돼요.</div>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: C.greenText, background: "#DCFCE7", borderRadius: 7, padding: "5px 10px" }}><Icon.clock width={13} height={13} /> 새 스냅샷</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: C.faint, marginBottom: 8 }}>새 파일이 아니라 <b>{names[0]}</b>에 <b>새 스냅샷</b>으로 저장됩니다.</div>
        </div>
        )}
      </div>

      {/* bottom bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 36px", borderTop: `1px solid ${C.border}`, background: "#FCFCFD" }}>
        <span style={{ fontSize: 14, color: C.sub }}>결합 후</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.sub }}>Columns <span style={pill}>{ready ? afterCols.toLocaleString() : "—"}</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.sub }}>Rows <span style={{ ...pill, ...(over ? { color: "#DC2626", borderColor: "#FCA5A5" } : {}) }}>{ready ? afterRows.toLocaleString() : "—"}</span></span>
        {ready && (over ? (
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "5px 10px" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span> 행 수 한도 초과 · {afterRows.toLocaleString()} / 10,000행
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.greenText, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "5px 10px" }}>
            <Icon.checkCircle width={13} height={13} /> 한도 내 · 0.1MB / 100MB
          </span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: over ? "#DC2626" : C.faint }}>{!hasContent ? "합칠 데이터를 2개 이상 선택해 주세요." : picking ? "데이터 선택을 먼저 완료해 주세요." : loading ? "칼럼을 매칭하고 있어요..." : over ? "한도를 초과해 병합할 수 없어요." : ""}</span>
        <button onClick={() => canRun && onRun(names)} disabled={!canRun} style={{ background: canRun ? C.dark : "#E5E7EB", color: canRun ? "#fff" : C.faint, border: "none", borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 600, cursor: canRun ? "pointer" : "default", fontFamily: FONT }}>데이터 병합 실행하기</button>
      </div>

      {/* 오류 토스트 */}
      {toast && (
        <div style={{ position: "absolute", bottom: 92, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 12, background: "#27272A", color: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 30 }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{toast}</span>
          <span onClick={() => setToast("")} style={{ cursor: "pointer", color: "#A1A1AA", display: "flex", marginLeft: 8 }}><Icon.x width={16} height={16} /></span>
        </div>
      )}
    </div>
  );
}
const pill = { border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 12px", fontSize: 14, fontWeight: 700, background: "#fff" };

/* 결합 전/후 수치 (기존 → 변경 +증가) */
function BeforeAfter({ label, before, after, delta, show, danger }) {
  const fmt = (n) => (typeof n === "number" ? n.toLocaleString() : n);
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.sub }}>
      <span>{label}</span>
      {show ? (
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ ...pill, fontWeight: 600, color: C.faint }}>{fmt(before)}</span>
          <Icon.chevR width={14} height={14} />
          <span style={{ ...pill, ...(danger ? { color: "#DC2626", borderColor: "#FCA5A5" } : {}) }}>{fmt(after)}</span>
          {delta && <span style={{ color: C.greenText, fontWeight: 700 }}>{delta}</span>}
        </span>
      ) : (
        <span style={{ ...pill, color: C.faint }}>—</span>
      )}
    </span>
  );
}

/* =========================================================
 *  Merging (loading)
 * ========================================================= */
function MergingPage({ names, onLeave }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, alignSelf: "stretch", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <span onClick={onLeave} style={{ cursor: "pointer", display: "flex", color: C.sub }}><Icon.back /></span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{names.join(", ")}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#EFF4FF", color: C.blue, fontSize: 12.5, fontWeight: 600, borderRadius: 7, padding: "4px 9px" }}><Icon.union width={14} height={14} /> Union</span>
        <div style={{ flex: 1 }} />
        <button onClick={onLeave} style={{ display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.border}`, background: "#fff", borderRadius: 9, padding: "8px 14px", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>백그라운드로 두고 나가기</button>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Union 중....</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.faint, fontSize: 14, marginBottom: 14 }}>
          <span style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderTopColor: C.sub, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />
          두 데이터의 행을 이어붙이고 있어요...
        </div>
        <div style={{ width: 720, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", background: "#fff" }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const added = i >= 3; // 앞 3행 = 기준, 뒤 = 합쳐져 쌓이는 행
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, padding: "15px 28px", borderBottom: i === 6 ? "none" : `1px solid ${C.borderSoft}`, borderLeft: added ? `2px solid #BBF7D0` : "2px solid transparent", animation: added ? `rowIn 2.6s ease-in-out ${(i - 3) * 0.22}s infinite` : "none" }}>
                <div style={{ height: 11, borderRadius: 6, background: added ? "#DCFCE7" : "#EEEFF1", width: `${50 + (i * 7) % 38}%` }} />
                <div style={{ height: 11, borderRadius: 6, background: added ? "#DCFCE7" : "#EEEFF1", width: `${45 + (i * 11) % 42}%` }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.sub, background: "#F4F4F5", borderRadius: 9, padding: "10px 16px", marginTop: 10 }}>
          <Icon.infoCircle width={14} height={14} /> 이 화면을 나가도 병합은 백그라운드에서 계속 진행돼요. 완료되면 목록에서 알려드릴게요.
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}@keyframes rowIn{0%{opacity:0;transform:translateY(10px)}18%{opacity:1;transform:none}82%{opacity:1;transform:none}100%{opacity:0;transform:translateY(10px)}}`}</style>
    </div>
  );
}

/* 백그라운드 병합 작업 트레이 (목록 우하단) */
function MergeTray({ job, onOpen, onClose }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "absolute", bottom: 24, right: 32, width: 384, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, boxShadow: "0 12px 32px rgba(0,0,0,0.14)", overflow: "hidden", zIndex: 20 }}>
      <div onClick={() => setOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer", borderBottom: open ? `1px solid ${C.borderSoft}` : "none" }}>
        <span style={{ fontSize: 14.5, fontWeight: 700 }}>{job.done ? "데이터 병합 완료" : "데이터 병합 진행중"}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {onClose && <span onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ color: C.faint, display: "flex" }}><Icon.x width={16} height={16} /></span>}
          <span style={{ color: C.faint, display: "flex", transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }}><Icon.chevR width={16} height={16} /></span>
        </span>
      </div>

      {!open ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px" }}>
          <Icon.sheet />
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.names.join(", ")}</span>
          {job.done ? <Icon.checkCircle /> : <span style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderTopColor: C.sub, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />}
        </div>
      ) : (
        <div style={{ padding: "14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Icon.sheet />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{job.names.join(", ")}</div>
              <div style={{ fontSize: 11.5, color: C.faint }}>Union · 12 Columns · 120 Rows</div>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: 5, background: job.done ? "#DCFCE7" : "#EFF4FF", color: job.done ? C.greenText : C.blue, fontSize: 12, fontWeight: 600, borderRadius: 7, padding: "3px 9px" }}>{job.done ? "완료" : "진행중"}</span>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: C.track, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ width: job.done ? "100%" : "62%", height: "100%", borderRadius: 999, background: job.done ? C.green : C.blue, transition: "width .4s" }} />
          </div>
          <div style={{ fontSize: 12.5, color: C.sub, marginBottom: 14 }}>{job.done ? "병합이 완료됐어요." : "두 데이터의 칼럼을 매칭하고 있어요..."}</div>
          <button onClick={() => job.done && onOpen()} disabled={!job.done} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "none", borderRadius: 9, padding: "11px 0", fontSize: 13.5, fontWeight: 600, cursor: job.done ? "pointer" : "default", fontFamily: FONT, background: job.done ? C.dark : "#EEF0F3", color: job.done ? "#fff" : C.faint }}>
            결과 보기 <Icon.chevR width={14} height={14} />
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
 *  Result
 * ========================================================= */
const RESULT_COLS = 6;
const RES_GRID = `repeat(${RESULT_COLS}, minmax(200px, 1fr))`;
const RES_MINW = 1280;
const RES_CELLS = ["UTC+12:00", "500-1000", "ios", "2026.11.12", "2026.11.12", "2026.11.12"];
function NullCell() {
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: C.faint, fontStyle: "italic", fontSize: 12, background: "#F5F5F6", border: `1px dashed #CBD0D6`, borderRadius: 6, padding: "2px 9px" }}>Null</span>);
}

/* 컬럼 리스트 뷰 – 컬럼별 처리 결과 */
const COLUMN_RESULTS = [
  { name: "칼럼명 1", type: "Interger", kind: "keep" },
  { name: "칼럼명 2", type: "Integer", kind: "keep" },
  { name: "칼럼명 3", type: "Time", kind: "keep" },
  { name: "칼럼명 4", type: "Time", kind: "nullNew", note: "신규 행만 비어 있어요 (Null)" },
  { name: "칼럼명 5", type: "String", kind: "nullNew", note: "신규 행만 비어 있어요 (Null)" },
  { name: "칼럼명 6", type: "String", kind: "keep" },
  { name: "user_id", type: "Integer", kind: "excluded", note: "[제거 사유 작성]" },
  { name: "signup_date", type: "Integer", kind: "excluded", note: "매칭 칼럼 없음" },
];
function StatusCell({ kind, note }) {
  if (kind === "keep") {
    return (<span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: C.text }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l4.5 4.5L19 7" stroke={C.greenText} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> 기존 값 유지</span>);
  }
  if (kind === "excluded") {
    return (<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: "#DC2626", background: "#FEE2E2", borderRadius: 6, padding: "3px 9px" }}>칼럼 제외</span><span style={{ fontSize: 13, color: C.faint }}>{note}</span></span>);
  }
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: C.sub, background: C.chipBg, borderRadius: 6, padding: "3px 9px" }}>일부 Null 처리</span><span style={{ fontSize: 13, color: C.faint }}>{note}</span></span>);
}
function ResultTableRow({ nulls = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: RES_GRID, borderBottom: `1px solid ${C.borderSoft}`, fontSize: 13.5 }}>
      {RES_CELLS.map((v, i) => (
        <div key={i} style={{ ...rcell, background: nulls.includes(i) ? "#FCFCFD" : "transparent" }}>{nulls.includes(i) ? <NullCell /> : v}</div>
      ))}
    </div>
  );
}
const rcell = { padding: "11px 16px" };

/* ---- AI Readiness Before/After ---- */
const RD_AXES = [
  { label: "Privacy", key: "Privacy" },
  { label: "Traceability", key: "Traceability" },
  { label: "Operational\nReliability", key: "Operational Reliability" },
  { label: "Conciseness", key: "Conciseness" },
  { label: "Contextuality", key: "Contextuality" },
  { label: "Integrity", key: "Integrity" },
];
const RD_BARS = ["Privacy", "Integrity", "Contextuality", "Conciseness", "Operational Reliability", "Traceability"];
const BEFORE_SCORES = { Privacy: 30, Integrity: 10, Contextuality: 25, Conciseness: 20, "Operational Reliability": 100, Traceability: 100 };
const AFTER_SCORES = { Privacy: 100, Integrity: 95, Contextuality: 90, Conciseness: 99, "Operational Reliability": 100, Traceability: 100 };
const barColor = (p) => (p >= 90 ? C.green : p >= 40 ? C.yellow : C.red);

function ReadinessRadar({ scores, color, size = 250 }) {
  const cx = size / 2, cy = size / 2 + 4, r = size * 0.3;
  const ang = (i) => (Math.PI / 2) - (i * Math.PI) / 3;
  const pt = (i, rad) => [cx + rad * Math.cos(ang(i)), cy - rad * Math.sin(ang(i))];
  const grid = [0.33, 0.66, 1].map((f) => RD_AXES.map((_, i) => pt(i, r * f).join(",")).join(" "));
  const poly = RD_AXES.map((a, i) => pt(i, r * ((scores[a.key] || 0) / 100)).join(",")).join(" ");
  const fill = color === C.red ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.18)";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {grid.map((g, i) => <polygon key={i} points={g} fill="none" stroke={C.border} strokeWidth="1" />)}
      {RD_AXES.map((_, i) => { const [x, y] = pt(i, r); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.border} strokeWidth="1" />; })}
      <polygon points={poly} fill={fill} stroke={color} strokeWidth="2" />
      {RD_AXES.map((a, i) => { const [x, y] = pt(i, r + 22); return (<text key={i} x={x} y={y} fontSize="10.5" fill={C.sub} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT}>{a.label.split("\n").map((ln, j) => <tspan key={j} x={x} dy={j === 0 ? 0 : 11}>{ln}</tspan>)}</text>); })}
    </svg>
  );
}

function ReadinessCard({ phase, tag, scores, overall, level, color, allGreen }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, background: C.panel }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>{phase}</span>
        <span style={{ background: C.chipBg, color: C.sub, fontSize: 12, fontWeight: 600, borderRadius: 6, padding: "3px 8px" }}>{tag}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>AI Readiness</span>
        <span style={{ marginLeft: "auto", fontSize: 24, fontWeight: 800 }}>{overall}%</span>
        <span style={{ marginLeft: 10, background: color === C.red ? "#FEE2E2" : "#DCFCE7", color: color === C.red ? "#DC2626" : C.greenText, fontSize: 12.5, fontWeight: 600, borderRadius: 7, padding: "4px 10px" }}>{level}</span>
      </div>
      {RD_BARS.map((k) => (
        <div key={k} style={{ display: "grid", gridTemplateColumns: "150px 1fr 46px", alignItems: "center", gap: 12, marginBottom: 11 }}>
          <span style={{ fontSize: 13.5, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k === "Operational Reliability" ? "Operational Reli..." : k}</span>
          <Bar pct={scores[k]} color={allGreen ? C.green : barColor(scores[k])} w="100%" />
          <span style={{ fontSize: 13.5, fontWeight: 600, textAlign: "right" }}>{scores[k]}%</span>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, background: color === C.red ? "#FEF2F2" : C.greenBg, border: `1px solid ${color === C.red ? "#FECACA" : "#BBF7D0"}`, borderRadius: 12, padding: "14px 16px", margin: "18px 0 24px" }}>
        <span style={{ display: "flex", flexShrink: 0, marginTop: 1 }}>{color === C.red ? <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span> : <Icon.checkCircle />}</span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: color === C.red ? "#DC2626" : C.greenText }}>AI analysis results</div>
          <div style={{ fontSize: 13, color: "#4B5563", marginTop: 4 }}>{color === C.red ? "Privacy·Integrity·Contextuality·Conciseness 항목이 낮아 분석 신뢰도가 떨어질 수 있어요." : "병합·전처리 후 대부분의 항목이 개선되어 AI 분석에 적합한 상태예요."}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}><ReadinessRadar scores={scores} color={color} /></div>
    </div>
  );
}

function ReadinessCompareModal({ name, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.4)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}>
      <div style={{ width: 1080, maxWidth: "82vw", height: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 32px 28px" }}>
          <div style={{ fontSize: 22, fontWeight: 700 }}>데이터 병합 완료</div>
          <div style={{ fontSize: 14, color: C.sub, margin: "8px 0 14px" }}>병합 전후의 AI Readiness 변화를 확인하세요.</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "12px 14px", marginBottom: 22, fontSize: 13, color: "#92400E", lineHeight: 1.55 }}>
            <Icon.infoCircle width={15} height={15} /> <span>데이터가 추가되면 <b>결측(Null)·중복이 늘어나 일부 항목 점수는 낮아질 수도</b> 있어요. 낮아진 항목은 전처리(Get AI-Ready)로 보완하세요.</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            <ReadinessCard phase="Before" tag="v1" scores={BEFORE_SCORES} overall={19} level="Critical" color={C.red} />
            <ReadinessCard phase="After" tag="Snapshot - d34kjdf" scores={AFTER_SCORES} overall={99} level="AI Ready" color={C.green} allGreen />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 28px", borderTop: `1px solid ${C.border}` }}>
          <button onClick={onClose} style={{ background: C.dark, color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>Close</button>
        </div>
      </div>
    </div>
  );
}

function ResultSummary({ names, onCompare, onColumns, onClose }) {
  const keep = COLUMN_RESULTS.filter((c) => c.kind === "keep").length;
  const nul = COLUMN_RESULTS.filter((c) => c.kind.startsWith("null")).length;
  const exc = COLUMN_RESULTS.filter((c) => c.kind === "excluded").length;
  const Divider = () => <div style={{ height: 1, background: C.borderSoft, margin: "20px 0" }} />;
  const Title = ({ children }) => <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 14 }}>{children}</div>;
  return (
    <div style={{ width: 340, flexShrink: 0, borderLeft: `1px solid ${C.border}`, padding: "24px 26px", background: C.panel, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>요약 결과</div>

      {/* 병합 정보 */}
      <Title>병합 정보</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#EFF4FF", color: C.blue, fontSize: 12, fontWeight: 600, borderRadius: 7, padding: "3px 9px" }}><Icon.union width={13} height={13} /> Union</span>
        <span style={{ fontSize: 12.5, color: C.sub }}>데이터셋 {names.length}개</span>
      </div>
      <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.7 }}>{names.join("  +  ")}</div>
      <div style={{ fontSize: 12, color: C.faint, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}><Icon.clock width={12} height={12} /> Snapshot · d34kjdf · 방금 생성</div>

      <Divider />

      {/* 데이터 병합 후 */}
      <Title>데이터 병합 후</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <BeforeAfter label="Columns" before={6} after={12} show />
        <BeforeAfter label="Rows" before={40} after={120} delta="+80" show />
      </div>

      <Divider />

      {/* 칼럼 처리 요약 */}
      <Title>칼럼 처리</Title>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 12 }}>
        {[["유지", keep, C.green], ["일부 Null", nul, C.yellow], ["제외", exc, C.red]].map(([label, n, dot]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot }} />
            <span style={{ color: C.sub }}>{label}</span>
            <span style={{ marginLeft: "auto", fontWeight: 700 }}>{n}</span>
          </div>
        ))}
      </div>
      <button onClick={onColumns} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${C.border}`, borderRadius: 9, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, background: "#fff", color: C.sub }}>
        컬럼별 처리 결과 보기 <Icon.chevR width={13} height={13} />
      </button>

      <Divider />

      {/* AI Readiness 변화 */}
      <Title>AI Readiness 변화</Title>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, textAlign: "center", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 8px" }}>
          <div style={{ fontSize: 20, fontWeight: 800 }}>19%</div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "#DC2626", background: "#FEE2E2", borderRadius: 6, padding: "2px 7px" }}>Critical</span>
        </div>
        <span style={{ color: C.faint, display: "flex" }}><Icon.chevR width={18} height={18} /></span>
        <div style={{ flex: 1, textAlign: "center", border: `1px solid #BBF7D0`, background: C.greenBg, borderRadius: 10, padding: "12px 8px" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.greenText }}>99%</div>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.greenText, background: "#DCFCE7", borderRadius: 6, padding: "2px 7px" }}>AI Ready</span>
        </div>
      </div>
      <button onClick={onCompare} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 0", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT, background: "#fff" }}>
        AI Readiness 변화 자세히 보기 <Icon.chevR width={14} height={14} />
      </button>

      {/* 확인 → 하단 고정 (24 여백), 닫으면 목록에 새 스냅샷 추가 */}
      <div style={{ marginTop: "auto", paddingTop: 24 }}>
        <button onClick={onClose} style={{ width: "100%", background: C.dark, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>확인</button>
      </div>
    </div>
  );
}

function ResultPage({ names, onClose }) {
  const [view, setView] = useState("table"); // table | columns
  const [compare, setCompare] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, alignSelf: "stretch", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <span onClick={onClose} style={{ cursor: "pointer", display: "flex", color: C.sub }}><Icon.x /></span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{names.join(", ")}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#EFF4FF", color: C.blue, fontSize: 12.5, fontWeight: 600, borderRadius: 7, padding: "4px 9px" }}><Icon.union width={14} height={14} /> Union</span>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, position: "relative", minWidth: 0, background: "#fff" }}>
          <div style={{ position: "absolute", inset: 0, overflow: "auto", paddingBottom: 80, background: "#fff" }}>
            {view === "table" ? (
              <div style={{ minWidth: RES_MINW }}>
                <div style={{ display: "grid", gridTemplateColumns: RES_GRID, position: "sticky", top: 0, background: "#fff", borderBottom: `1px solid ${C.border}`, zIndex: 1 }}>
                  {Array.from({ length: RESULT_COLS }).map((_, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "13px 16px", fontSize: 13, fontWeight: 600 }}><span style={{ color: C.faint, display: "flex" }}><Icon.typeA /></span> 칼럼명 {i + 1}</div>
                  ))}
                </div>
                {/* 기준 데이터셋 (선택한 기존 데이터셋, Null 없음) */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: C.blueSoft, color: C.blue, fontSize: 13.5, fontWeight: 600, borderBottom: `1px solid #DBE6FF` }}><Icon.db /> <span style={{ fontSize: 11, fontWeight: 700, background: "#DBE6FF", borderRadius: 5, padding: "1px 7px" }}>기준</span> {names[0]} · 6 컬럼 · 100 행</div>
                {Array.from({ length: 10 }).map((_, i) => <ResultTableRow key={i} />)}
                {/* 추가된 데이터셋 (미매칭/미선택 칼럼은 Null) */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: C.greenBg, color: C.greenText, fontSize: 13.5, fontWeight: 600, borderBottom: `1px solid #DCFCE7` }}><Icon.plus width={14} height={14} /> <span style={{ fontSize: 11, fontWeight: 700, background: "#DCFCE7", borderRadius: 5, padding: "1px 7px" }}>추가</span> {names.slice(1).join(", ") || names[1]} · 4 컬럼 매칭 · 100 행</div>
                {Array.from({ length: 14 }).map((_, i) => <ResultTableRow key={i} nulls={[0, 4]} />)}
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.8fr", position: "sticky", top: 0, background: "#fff", borderBottom: `1px solid ${C.border}`, zIndex: 1 }}>
                  {["컬럼", "데이터 타입", "처리 결과"].map((h, i) => <div key={i} style={{ padding: "13px 20px", fontSize: 13, fontWeight: 600, color: C.sub }}>{h}</div>)}
                </div>
                {COLUMN_RESULTS.map((c, i) => {
                  const excluded = c.kind === "excluded";
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1.8fr", alignItems: "center", borderBottom: `1px solid ${C.borderSoft}`, fontSize: 14, background: excluded ? "#FCFCFD" : "transparent" }}>
                      <div style={{ padding: "14px 20px", fontWeight: 500, color: excluded ? C.faint : C.text, textDecoration: excluded ? "line-through" : "none" }}>{c.name}</div>
                      <div style={{ padding: "14px 20px" }}><TypeTag kind={c.type} /></div>
                      <div style={{ padding: "14px 20px" }}><StatusCell kind={c.kind} note={c.note} /></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* view toggle – pinned to bottom of content area */}
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ display: "flex", gap: 4, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 5, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", pointerEvents: "auto" }}>
              <button onClick={() => setView("table")} style={tgl(view === "table")}><Icon.viewTable /></button>
              <button onClick={() => setView("columns")} style={tgl(view === "columns")}><Icon.viewList /></button>
            </div>
          </div>
        </div>
        <ResultSummary names={names} onCompare={() => setCompare(true)} onColumns={() => setView("columns")} onClose={onClose} />
      </div>
      {compare && <ReadinessCompareModal name={names.join(", ")} onClose={() => setCompare(false)} />}
    </div>
  );
}
const tgl = (active) => ({ width: 40, height: 36, borderRadius: 8, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: active ? "#F0F1F3" : "transparent", color: active ? C.text : C.faint });

/* =========================================================
 *  (기존) Detail – AI Readiness / Detail  ※ 행 클릭 진입
 * ========================================================= */
const btnGhost = { display: "flex", alignItems: "center", gap: 6, background: C.panel, color: C.text, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 14px", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: FONT };

function DetailHeader({ tab, setTab, onBack }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
          <span onClick={onBack} style={{ color: C.sub, cursor: "pointer" }}>Dataset</span>
          <span style={{ color: C.faint, display: "flex" }}><Icon.chevR width={14} height={14} /></span>
          <span style={{ fontWeight: 600 }}>Sample ._voc_data</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={btnGhost}>History</button><button style={btnGhost}>Share</button>
          <button style={{ ...btnGhost, background: C.dark, color: "#fff", border: "none" }}>Release</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px 0" }}>
        <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 10, padding: 4 }}>
          {["AI Readiness", "Detail"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT, background: tab === t ? C.panel : "transparent", color: tab === t ? C.text : C.sub, boxShadow: tab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>{t}</button>
          ))}
        </div>
        {tab === "AI Readiness" && <button style={{ ...btnGhost, background: C.dark, color: "#fff", border: "none", fontWeight: 600 }}><Icon.spark /> Get AI-Ready</button>}
      </div>
    </>
  );
}

const SCORES = [["Privacy", 8], ["Integrity", 10], ["Contextuality", 50], ["Conciseness", 100], ["Operational Reliability", 100], ["Traceability", 100]];
function RadarChart() {
  const size = 300, cx = size / 2, cy = size / 2 + 6, r = 100;
  const axes = ["Privacy", "Traceability", "Operational\nReliability", "Conciseness", "Contextuality", "Integrity"];
  const vals = [1, 1, 1, 1, 0.62, 0.78];
  const ang = (i) => (Math.PI / 2) - (i * Math.PI) / 3;
  const pt = (i, rad) => [cx + rad * Math.cos(ang(i)), cy - rad * Math.sin(ang(i))];
  const grid = [0.33, 0.66, 1].map((f) => axes.map((_, i) => pt(i, r * f).join(",")).join(" "));
  const poly = axes.map((_, i) => pt(i, r * vals[i]).join(",")).join(" ");
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {grid.map((g, i) => <polygon key={i} points={g} fill="none" stroke={C.border} strokeWidth="1" />)}
      {axes.map((_, i) => { const [x, y] = pt(i, r); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={C.border} strokeWidth="1" />; })}
      <polygon points={poly} fill="rgba(34,197,94,0.18)" stroke={C.green} strokeWidth="2" />
      {axes.map((a, i) => { const [x, y] = pt(i, r + 26); return (<text key={i} x={x} y={y} fontSize="11" fill={C.sub} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT}>{a.split("\n").map((line, j) => <tspan key={j} x={x} dy={j === 0 ? 0 : 12}>{line}</tspan>)}</text>); })}
    </svg>
  );
}
function MetricCard({ title, pct, children }) {
  const color = pct >= 90 ? C.greenText : pct >= 40 ? C.yellowText : C.red;
  return (<div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, background: C.panel }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}><span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 16, fontWeight: 700 }}>{title} <span style={{ color: C.faint, display: "flex" }}><Icon.infoCircle width={14} height={14} /></span></span><span style={{ fontSize: 16, fontWeight: 700, color }}>{pct}%</span></div>{children}</div>);
}
function KVTable({ rows, highlight }) {
  return (<div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>{rows.map(([k, v], i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i === rows.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}><div style={{ padding: "11px 14px", fontSize: 13.5, color: C.sub, borderRight: `1px solid ${C.borderSoft}` }}>{k}</div><div style={{ padding: "11px 14px", fontSize: 13.5, color: highlight ? C.faint : C.text }}>{v}</div></div>))}</div>);
}
function Chips({ title, items }) {
  return (<div style={{ marginTop: 18 }}><div style={{ fontSize: 12.5, color: C.sub, marginBottom: 8 }}>{title}</div><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{items.map((t) => <span key={t} style={{ background: C.chipBg, color: "#374151", fontSize: 13, borderRadius: 7, padding: "6px 12px" }}>{t}</span>)}</div></div>);
}
function AIReadinessTab() {
  return (
    <div style={{ padding: "20px 32px 60px" }}>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, background: C.panel, display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}><span style={{ fontSize: 18, fontWeight: 700 }}>AI Readiness</span><span style={{ marginLeft: "auto", fontSize: 26, fontWeight: 800 }}>99%</span><span style={{ background: "#DCFCE7", color: C.greenText, fontSize: 12.5, fontWeight: 600, borderRadius: 7, padding: "4px 10px" }}>AI Ready</span></div>
          {SCORES.map(([label, pct]) => (<div key={label} style={{ display: "grid", gridTemplateColumns: "200px 1fr 52px", alignItems: "center", gap: 14, marginBottom: 12 }}><span style={{ fontSize: 14, color: "#374151" }}>{label}</span><Bar pct={pct} color={C.green} w="100%" /><span style={{ fontSize: 14, fontWeight: 600, textAlign: "right" }}>{pct}%</span></div>))}
          <div style={{ display: "flex", gap: 10, background: C.greenBg, border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 16px", marginTop: 22 }}><span style={{ display: "flex", flexShrink: 0 }}><Icon.checkCircle /></span><div><div style={{ fontSize: 14, fontWeight: 600, color: C.greenText }}>AI analysis results</div><div style={{ fontSize: 13.5, color: "#4B5563", marginTop: 4 }}>The AI Readiness of the data is generally good, but three items are critically low at just 10%.</div></div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><RadarChart /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 22 }}>
        <MetricCard title="Privacy" pct={100}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>[감지된 민감 컬럼 수_받아올 값 by AI] N sensitive columns detected and processed.</div><KVTable highlight rows={[["Full Name", "칼럼명"], ["Phone Number", "칼럼명"], ["National ID", "칼럼명"], ["Passport Number", "칼럼명"], ["Email Address", "칼럼명"], ["Bank Account Number", "칼럼명"], ["Credit Card Number", "칼럼명"], ["Address", "칼럼명"]]} /></MetricCard>
        <MetricCard title="Integrity" pct={50}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Data quality issues detected.</div><KVTable rows={[["Missing Values", "N cases"], ["Duplicate Records", "N cases"], ["Type Errors", "N cases"], ["Distribution Skew", "N cases"]]} /><Chips title="Recommended AI-Readiness Actions" items={["Missing Pattern Imputation", "Outlier & Skew Correction"]} /></MetricCard>
        <MetricCard title="Contextuality" pct={80}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>N columns lack descriptions.</div><KVTable rows={[["Column Description Coverage", "N%"], ["Columns Missing for Stated Intent", "N cases"]]} /><Chips title="Recommended AI-Readiness Actions" items={["Semantic Context Enrichment enrichment"]} /></MetricCard>
        <MetricCard title="Conciseness" pct={99}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Low-signal columns detected.</div><KVTable rows={[["Low-Contribution Columns", "N cases"], ["High-Cardinality Columns", "N cases"], ["Redundant Text Fields", "N cases"]]} /><Chips title="Recommended AI-Readiness Actions" items={["Low-Signal Column Removal"]} /></MetricCard>
        <MetricCard title="Operational Reliability" pct={100}><div style={{ fontSize: 12.5, color: C.faint, marginTop: -8, marginBottom: 16 }}>*Automatically fulfilled by SynTitan — no action required</div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Your dataset is being managed in a reliable and consistent state.</div><Chips title="Platform-Provided Features" items={["Preprocessing Result Validation", "AI Readiness Achievement Tracking", "Standard Consistency"]} /></MetricCard>
        <MetricCard title="Traceability" pct={100}><div style={{ fontSize: 12.5, color: C.faint, marginTop: -8, marginBottom: 16 }}>*Automatically fulfilled by SynTitan — no action required</div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>All changes are being recorded and are fully traceable.</div><Chips title="Platform-Provided Features" items={["Auto Snapshot Generation", "Release Version Labeling", "Author & Timestamp Logging"]} /></MetricCard>
      </div>
    </div>
  );
}
function Histogram({ heights }) {
  return (<div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 46 }}>{heights.map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, background: C.blue, borderRadius: "1px 1px 0 0" }} />)}</div>);
}
const H1 = [30, 45, 60, 80, 95, 70, 50, 40, 30, 25, 35, 55, 75, 60, 45, 30], H2 = [70, 95, 60, 45, 30, 25, 20, 18, 16, 14, 12, 10, 9, 8, 7, 6], H3 = [40, 60, 85, 70, 50, 30, 20, 15, 90, 75, 55, 40, 30, 25, 20, 15], H4 = [50, 80, 30, 95, 40, 70, 55, 85, 35, 60, 75, 45, 90, 50, 65, 40];
const D_NAMES = Array.from({ length: 22 }, (_, i) => `[이름${i + 8}]`);
const D_SIZES = ["500-1000", "1000-2000", "1000-2000", "1000-2000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-100005000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000", "5000-10000"];
const D_SESS = ["2.5", "2.5", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6", "3.6"];
function DetailTab() {
  const cols = [
    { icon: <Icon.key />, name: "customer_name", special: "unique" },
    { icon: <Icon.hash />, name: "time_zone", hist: H1, axis: ["UTC+01:00", "UTC+23:59"] },
    { icon: <Icon.hash />, name: "company size", hist: H2, axis: ["0", "10,000"] },
    { icon: <Icon.hash />, name: "Devices", dist: true },
    { icon: <Icon.clock />, name: "signup_date", hist: H3, axis: ["0", "10,000"] },
    { icon: <Icon.typeA />, name: "avg_session_minutes", hist: H4, axis: ["0", "1000"] },
    { icon: <Icon.typeA />, name: "avg_session_minutes", hist: H1, axis: ["1.1", "10"] },
  ];
  const cellD = (error, first, last) => ({ padding: "11px 14px", borderRight: last ? "none" : `1px solid ${C.borderSoft}`, background: error ? "#FEE2E2" : "transparent", color: error ? "#B91C1C" : first ? C.sub : C.text });
  return (
    <div style={{ padding: "20px 32px 60px" }}>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, background: C.panel, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 18, fontWeight: 700 }}>Sample ._voc_data.csvta.csv <span style={{ color: C.faint, fontWeight: 500, fontSize: 15 }}>(99.8MB)</span></div><button style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: C.panel, color: C.sub, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.download /></button></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>{["Snapshot - 238fkj", "247 columns · 47 rows", "Updated Mar 25, 10:01 AM"].map((t) => <span key={t} style={{ fontSize: 13, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px" }}>{t}</span>)}<span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}>15 Columns <Icon.chevD /></span></div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 1100 }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(150px, 1fr))`, borderBottom: `1px solid ${C.border}`, background: "#FCFCFD" }}>
              {cols.map((c, i) => (
                <div key={i} style={{ padding: "12px 14px 14px", borderRight: i === cols.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}><span style={{ color: C.faint, display: "flex" }}>{c.icon}</span> {c.name}</div>
                  <div style={{ marginTop: 12, height: 64 }}>
                    {c.special === "unique" && <div style={{ textAlign: "center", paddingTop: 8 }}><div style={{ fontSize: 22, fontWeight: 700 }}>893건</div><div style={{ fontSize: 12, color: C.faint }}>unique values</div></div>}
                    {c.dist && <div style={{ fontSize: 12 }}>{[["Korean", "20%"], ["En", "15%"], ["Jap", "5%"], ["Other", "60%"]].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ color: C.sub }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>)}</div>}
                    {c.hist && <div><Histogram heights={c.hist} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.faint, marginTop: 3 }}><span>{c.axis[0]}</span><span>{c.axis[1]}</span></div></div>}
                  </div>
                </div>
              ))}
            </div>
            {D_NAMES.map((nm, r) => (
              <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(150px, 1fr))`, borderBottom: `1px solid ${C.borderSoft}`, fontSize: 13.5 }}>
                <div style={cellD(false, true)}>{nm}</div><div style={cellD()}>UTC+12:00</div><div style={cellD(D_SIZES[r].length > 14)}>{D_SIZES[r]}</div><div style={cellD()}>Android</div><div style={cellD()}>2026.11.12</div><div style={cellD()}>{D_SESS[r]}</div><div style={cellD(false, false, true)}>{D_SESS[r]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  Agent Analysis
 * ========================================================= */
const AGENT_TABS = ["전체 에이전트", "재무", "운영", "마케팅", "영업", "고객 성공"];

const AGENTS = [
  {
    icon: <Icon.clipboard />, title: "페르소나 설문",
    desc: "합성 페르소나의 설문 응답을 생성하고 행동 패턴을 분석합니다.",
    chips: ["CUBIG", "합성 페르소나 DB"], chipSoftIdx: 1,
    sectionLabel: "설문 기간 및 인원",
    before: { label: "직접 설문 시", value: "한달 · 100명" },
    after: { label: "에이전트 실행 시", value: "한시간 · 10만 명", icon: <Icon.group width={15} height={15} /> },
    variant: "purple",
    note: "합성 페르소나 DB로 실제 응답자 모집 없이 균형 잡힌 결과를 빠르게 얻어요.",
  },
  {
    icon: <Icon.money />, title: "신제품 가격 전략",
    desc: "가격 민감도를 분석하여 수익 및 이탈 영향을 고려한 출시 가격을 추천합니다.",
    chips: ["CUBIG", "합성 페르소나 DB"], chipSoftIdx: 1,
    sectionLabel: "제품 반응",
    before: { label: "부족한 데이터", value: "추정 불가" },
    after: { label: "에이전트 실행 시", value: "추정 가능", icon: <Icon.money width={15} height={15} /> },
    variant: "purple",
    note: "합성 페르소나 DB로 출시 전에 가격 반응을 미리 시뮬레이션할 수 있어요.",
  },
  {
    icon: <Icon.trend />, title: "이탈 예측",
    desc: "행동 신호로 이탈 위험이 있는 고객을 찾아내고 리텐션 액션을 제안합니다.",
    chips: ["CUBIG"],
    tip: { text: "분석 전, 데이터를 정제하면 탐지율이 ", em: "+28%p", tail: " 올라요!" },
    sectionLabel: "이탈 탐지율",
    before: { label: "데이터 정제 전", value: "탐지율 61%" },
    after: { label: "데이터 정제 후", value: "탐지율 89% ↑" },
    variant: "green",
    note: "노이즈를 걷어낸 행동 데이터에 드문 이벤트를 보강하면 이탈 신호를 더 정확하게 탐지할 수 있어요.",
  },
  {
    icon: <Icon.group />, title: "전략 제안",
    desc: "고객을 행동 및 인구 통계에 따라 세분화하고 ROI 기반 전략을 시뮬레이션합니다.",
    chips: ["CUBIG"],
    tip: { text: "분석 전, 데이터를 정제하면 적중률이 ", em: "+35%p", tail: " 올라요!" },
    sectionLabel: "핵심 타겟 적중률",
    before: { label: "데이터 정제 전", value: "적중률 47%" },
    after: { label: "데이터 정제 후", value: "적중률 82% ↑" },
    variant: "green",
    note: "데이터가 부족한 구간도 합성 데이터로 보강해 타겟팅 정확도를 끌어올려요.",
  },
  {
    icon: <Icon.warn />, title: "이상 거래 탐지",
    desc: "비정상 거래 패턴을 탐지해 주의가 필요한 거래를 찾아냅니다.",
    chips: ["Coming Soon"], comingSoon: true,
    tip: { text: "분석 전, 데이터를 정제하면 오탐률이 ", em: "-9%p", tail: " 내려가요!" },
    sectionLabel: "이상 거래 탐지 오탐률",
    before: { label: "데이터 정제 전", value: "오탐률 12%" },
    after: { label: "데이터 정제 후", value: "오탐률 3% ↓" },
    variant: "green",
    note: "희귀 패턴을 합성 데이터로 보강하면 정상 거래와 비슷해 보이는 이상 거래를 정확하게 잡아낼 수 있어요.",
  },
  {
    icon: <Icon.cursor />, title: "리드 스코어링",
    desc: "CRM 데이터로 구매 가능성을 예측해 리드에 점수를 매기고 영업 우선순위를 정합니다.",
    chips: ["Coming Soon"], comingSoon: true,
    tip: { text: "분석 전, 데이터를 정제하면 적중률이 ", em: "+26%p", tail: " 올라요!" },
    sectionLabel: "상위 리드 적중률",
    before: { label: "데이터 정제 전", value: "적중률 52%" },
    after: { label: "데이터 정제 후", value: "적중률 78% ↑" },
    variant: "green",
    note: "합성 데이터로 패턴을 보강해 가능성 높은 리드에 영업 자원을 집중할 수 있어요.",
  },
];

function CompareBox({ data, variant }) {
  const styles = {
    plain: { bg: "#fff", border: C.border, label: C.faint, value: C.text },
    purple: { bg: "#F3F1FF", border: "#D9D3FF", label: C.purple, value: C.purple },
    green: { bg: C.greenBg, border: "#BBF7D0", label: C.greenText, value: C.greenText },
  }[variant];
  return (
    <div style={{ flex: 1, border: `1px solid ${styles.border}`, background: styles.bg, borderRadius: 12, padding: "16px 18px", textAlign: "center" }}>
      <div style={{ fontSize: 12.5, color: styles.label, marginBottom: 8 }}>{data.label}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 16, fontWeight: 700, color: styles.value }}>
        {data.icon}{data.value}
      </div>
    </div>
  );
}

function AgentCard({ a }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 26, background: C.panel }}>
      <div style={{ color: "#3F3F46", marginBottom: 14 }}>{a.icon}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{a.title}</div>
      <div style={{ fontSize: 14, color: C.sub, marginTop: 8, lineHeight: 1.55 }}>{a.desc}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {a.chips.map((c, i) => (
          <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 500, borderRadius: 7, padding: "5px 11px", border: a.comingSoon ? `1px solid ${C.border}` : i === a.chipSoftIdx ? "none" : `1px solid ${C.border}`, background: a.comingSoon ? "#fff" : i === a.chipSoftIdx ? C.chipBg : "#fff", color: a.comingSoon ? C.faint : C.text }}>
            {!a.comingSoon && i !== a.chipSoftIdx && <Icon.person />}{c}
          </span>
        ))}
      </div>

      <div style={{ height: 1, background: C.borderSoft, margin: "22px 0 18px" }} />

      {a.tip && (
        <div style={{ fontSize: 13.5, marginBottom: 16 }}>
          <span style={{ color: C.greenText, fontWeight: 700 }}>Tip</span>{" "}
          <span style={{ color: C.text }}>{a.tip.text}</span>
          <span style={{ color: C.greenText, fontWeight: 700 }}>{a.tip.em}</span>
          <span style={{ color: C.text }}>{a.tip.tail}</span>
        </div>
      )}

      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 12 }}>{a.sectionLabel}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <CompareBox data={a.before} variant="plain" />
        <span style={{ color: C.faint, display: "flex" }}><Icon.chevR width={18} height={18} /></span>
        <CompareBox data={a.after} variant={a.variant} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12.5, color: C.faint, marginTop: 16, lineHeight: 1.5 }}>
        <span style={{ display: "flex", flexShrink: 0, marginTop: 1 }}><Icon.infoCircle width={14} height={14} /></span>{a.note}
      </div>
    </div>
  );
}

function InquiryCard({ title, desc, link }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, padding: 26, background: C.panel }}>
      <div style={{ color: C.faint, marginBottom: 14 }}><Icon.help /></div>
      <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 14, color: C.sub, marginTop: 8, lineHeight: 1.55 }}>{desc}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, fontWeight: 600, marginTop: 22, cursor: "pointer" }}>{link} <Icon.chevR width={15} height={15} /></div>
    </div>
  );
}

function BannerMock() {
  const rows = [
    { name: "이탈예측.csv", pct: 40, color: C.yellow, ver: "v5", owner: "한아름" },
    { name: "B2B_매출데이터.csv", pct: 99, color: C.green, ver: "v1", owner: "정희연", active: true },
    { name: "구매데이터.csv", pct: 50, color: C.yellow, ver: "v2", owner: "김현수" },
  ];
  return (
    <div style={{ position: "relative", width: 470, height: 150, overflow: "hidden" }}>
      {rows.map((r, i) => (
        <div key={i} style={{ position: "absolute", left: r.active ? 0 : 30, right: 0, top: 14 + i * 44, display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 10, padding: "10px 14px", boxShadow: r.active ? "0 6px 20px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.05)", border: r.active ? `1px solid ${C.border}` : "none", zIndex: r.active ? 2 : 1, opacity: r.active ? 1 : 0.7 }}>
          <span style={{ width: 24, height: 24, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}><Icon.db /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>{r.name}</div>
            <div style={{ fontSize: 10, color: C.faint }}>4.8GB · 247 columns · 47 rows</div>
          </div>
          <Bar pct={r.pct} color={r.color} w={70} />
          <span style={{ fontSize: 11, color: C.sub, width: 28 }}>{r.pct}%</span>
          <span style={{ fontSize: 11, color: C.sub, width: 16 }}>{r.ver}</span>
          <Avatar size={18} />
          <span style={{ fontSize: 11, color: C.sub, whiteSpace: "nowrap" }}>{r.owner}</span>
        </div>
      ))}
      <div style={{ position: "absolute", left: 230, top: 96, background: C.dark, color: "#fff", fontSize: 11.5, fontWeight: 600, borderRadius: 7, padding: "6px 11px", zIndex: 3 }}>AI-Ready 데이터셋</div>
    </div>
  );
}

function AgentAnalysisPage() {
  const [tab, setTab] = useState("전체 에이전트");
  return (
    <div style={{ padding: "34px 40px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Agent Analysis Modules</h1>
          <p style={{ color: C.sub, fontSize: 14, margin: "8px 0 0" }}>데이터를 기반으로 AI 에이전트를 실행해 시뮬레이션·예측·심층 인사이트를 얻으세요.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", background: C.panel, width: 360 }}>
          <span style={{ color: C.faint, display: "flex" }}><Icon.search /></span>
          <input placeholder="검색" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontFamily: FONT, background: "transparent" }} />
        </div>
      </div>

      {/* tabs */}
      <div style={{ display: "flex", gap: 26, borderBottom: `1px solid ${C.border}`, margin: "26px 0 24px" }}>
        {AGENT_TABS.map((t) => (
          <div key={t} onClick={() => setTab(t)} style={{ paddingBottom: 12, fontSize: 15, fontWeight: tab === t ? 700 : 500, color: tab === t ? C.text : C.faint, cursor: "pointer", borderBottom: tab === t ? `2px solid ${C.dark}` : "2px solid transparent", marginBottom: -1 }}>{t}</div>
        ))}
      </div>

      {/* banner */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#EEF1FB", borderRadius: 16, padding: "26px 30px", marginBottom: 24, overflow: "hidden" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>좋은 퀄리티의 에이전트 결과를 받고 싶으신가요?</div>
          <div style={{ fontSize: 14, color: C.sub, marginTop: 8 }}>데이터를 먼저 다듬으면, 같은 에이전트가 다른 답을 줍니다.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, fontWeight: 600, marginTop: 20, cursor: "pointer" }}>AI-Ready 데이터셋 만들기 <Icon.chevR width={15} height={15} /></div>
        </div>
        <BannerMock />
      </div>

      {/* grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {AGENTS.map((a) => <AgentCard key={a.title} a={a} />)}
        <InquiryCard title="찾고 있는 에이전트가 없나요?" desc="원하는 분석 시나리오를 알려주시면, 맞춤 에이전트를 설계해 드립니다." link="신규 제작 문의" />
        <InquiryCard title="보유한 모델·에이전트가 있나요?" desc="API 연결을 통해 AI-Ready 적용 전/후 성능을 비교해 드립니다." link="연동·검증 문의" />
      </div>
    </div>
  );
}

/* =========================================================
 *  Root
 * ========================================================= */
export default function DatasetsApp() {
  const [screen, setScreen] = useState("list"); // list | detail | merge | merging | result
  const [tab, setTab] = useState("AI Readiness");
  const [selected, setSelected] = useState([]);
  const [mergeJob, setMergeJob] = useState(null); // { names, done } – 백그라운드에서도 유지
  const [datasets, setDatasets] = useState(DATASETS);

  // 병합 완료까지 카운트 (화면을 나가도 계속 진행)
  useEffect(() => {
    if (!mergeJob || mergeJob.done) return;
    const t = setTimeout(() => setMergeJob((j) => (j ? { ...j, done: true } : j)), 5000);
    return () => clearTimeout(t);
  }, [mergeJob]);

  // 로딩 화면에 머물러 있으면 완료 시 자동으로 결과로 이동
  useEffect(() => {
    if (screen === "merging" && mergeJob?.done) setScreen("result");
  }, [screen, mergeJob?.done]);

  const sidebarActive = screen === "agent" ? "Agent Analysis" : "Edit Dataset";

  const handleNav = (label) => {
    if (label === "Agent Analysis") setScreen("agent");
    else if (label === "Home" || label === "Edit Dataset") { setSelected([]); setScreen("list"); }
  };

  const startMerge = (names) => { setMergeJob({ names, done: false }); setSelected([]); setScreen("merging"); };
  const resultNames = mergeJob?.names || DEFAULT_NAMES;

  // 결과 닫기(=확정) → 병합 데이터셋을 목록 최상단에 NEW로 추가
  const closeResult = () => {
    if (mergeJob) {
      setDatasets((ds) => {
        const maxTs = ds.reduce((m, d) => Math.max(m, d.ts), 0);
        // 기준(첫 번째) 데이터셋의 새 버전으로 저장
        const merged = { id: 1000 + ds.length, name: mergeJob.names[0], pct: 99, version: "v1", changes: "새 스냅샷", created: "Mar 24", updated: "Mar 26", ts: maxTs + 1, isNew: true };
        return [merged, ...ds];
      });
    }
    setSelected([]); setMergeJob(null); setScreen("list");
  };

  const scrollArea = { flex: 1, minWidth: 0, minHeight: 0, overflowY: "auto" };

  return (
    <div style={{ width: 1600, margin: "0 auto", display: "flex", height: "100vh", overflow: "hidden", background: C.bg, fontFamily: FONT, color: C.text }}>
      <Sidebar active={sidebarActive} onNav={handleNav} />
      <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {screen === "agent" && <div style={scrollArea}><AgentAnalysisPage /></div>}
        {screen === "list" && (
          <div style={{ ...scrollArea, background: "#fff" }}>
            <DatasetsPage datasets={datasets} selected={selected} setSelected={setSelected} onOpen={() => { setScreen("detail"); setTab("AI Readiness"); }} onMerge={() => setScreen("merge")} onMergeDirect={() => { setSelected([]); setScreen("merge"); }} />
          </div>
        )}
        {screen === "detail" && (
          <>
            <DetailHeader tab={tab} setTab={setTab} onBack={() => setScreen("list")} />
            <div style={scrollArea}>{tab === "AI Readiness" ? <AIReadinessTab /> : <DetailTab />}</div>
          </>
        )}
        {screen === "merge" && <MergePage selected={selected} onBack={() => setScreen("list")} onRun={startMerge} />}
        {screen === "merging" && <MergingPage names={mergeJob?.names || DEFAULT_NAMES} onLeave={() => setScreen("list")} />}
        {screen === "result" && <ResultPage names={resultNames} onClose={closeResult} />}

        {/* 백그라운드 병합 트레이 (목록에서만 노출) */}
        {screen === "list" && mergeJob && (
          <MergeTray job={mergeJob} onOpen={() => setScreen("result")} onClose={mergeJob.done ? () => setMergeJob(null) : undefined} />
        )}
      </main>
    </div>
  );
}
