import React, { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
 *  Syntitan · Datasets → 멀티선택 → 데이터 합치기(Union) 플로우
 *  화면: list → merge → merging(loading) → result
 *  + (기존) detail: AI Readiness / Detail
 *  가로 유동: 1280(min)~1920(max), 1440·1920 대응
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
  { id: 6, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25, locked: true },
  { id: 7, name: "CUBIG Data", pct: 50, version: "v2", created: "Mar 24", updated: "Mar 25", ts: 25, locked: true },
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
  lock: (p) => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" /></svg>),
  folder: (p) => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>),
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
  const isInt = kind === "Integer" || kind === "Interger";
  const isTime = kind === "Time";
  const icon = isInt ? <Icon.hash /> : isTime ? <Icon.clock /> : <Icon.typeA />;
  const c = isInt
    ? { bg: "#EFF4FF", fg: "#2D5BD0", bd: "#D6E2FB" }
    : isTime
    ? { bg: "#FEF6E7", fg: "#B45309", bd: "#F6E0B5" }
    : { bg: "#F4F4F5", fg: "#52525B", bd: "#E4E4E7" };
  return (<span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color: c.fg, border: `1px solid ${c.bd}`, borderRadius: 6, padding: "2px 7px", background: c.bg }}>{icon}{kind}</span>);
}
// 타입 아이콘 프리픽스 (# Integer / A String / 시계 Time) — 칼럼명 앞에 회색으로
function TypeIcon({ kind }) {
  const isInt = kind === "Integer" || kind === "Interger";
  const isTime = kind === "Time";
  return <span style={{ display: "inline-flex", color: C.faint }}>{isInt ? <Icon.hash /> : isTime ? <Icon.clock /> : <Icon.typeA />}</span>;
}

/* =========================================================
 *  Sidebar
 * ========================================================= */
function NavItem({ icon, label, active, muted, onClick, collapsed }) {
  return (
    <div onClick={onClick} title={collapsed ? label : undefined} style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10, padding: collapsed ? "9px 0" : "9px 10px", borderRadius: 8, cursor: "pointer", background: active ? "#F3F4F6" : "transparent", color: muted ? C.faint : C.text, fontWeight: active ? 600 : 500, fontSize: 14 }}>
      <span style={{ color: muted ? C.faint : "#3F3F46", display: "flex" }}>{icon}</span>{!collapsed && label}
    </div>
  );
}
function Sidebar({ active = "Home", onNav = () => {} }) {
  const [collapsed, setCollapsed] = useState(false);
  if (collapsed) {
    return (
      <aside style={{ width: 64, flexShrink: 0, alignSelf: "stretch", background: C.panel, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "18px 10px" }}>
        <span onClick={() => setCollapsed(false)} title="사이드바 펼치기" style={{ color: C.sub, cursor: "pointer", display: "flex", padding: 6, borderRadius: 8, marginBottom: 14 }}><Icon.panel /></span>
        <NavItem icon={<Icon.home />} label="Home" active={active === "Home"} onClick={() => onNav("Home")} collapsed />
        <div style={{ height: 14 }} />
        <NavItem icon={<Icon.db />} label="Edit Dataset" active={active === "Edit Dataset"} onClick={() => onNav("Edit Dataset")} collapsed />
        <NavItem icon={<Icon.agent />} label="Agent Analysis" active={active === "Agent Analysis"} onClick={() => onNav("Agent Analysis")} collapsed />
        <NavItem icon={<Icon.users />} label="Discussion Room" active={active === "Discussion Room"} onClick={() => onNav("Discussion Room")} collapsed />
        <div style={{ height: 14 }} />
        <NavItem icon={<Icon.report />} label="Report Hub" active={active === "Report Hub"} onClick={() => onNav("Report Hub")} collapsed />
        <div style={{ flex: 1 }} />
        <div title="Basic plan" style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#5B9BFF 0%,#7FB6FF 100%)", color: "#fff", fontWeight: 700, fontSize: 12, fontStyle: "italic", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>Basic</div>
        <Avatar size={30} />
      </aside>
    );
  }
  return (
    <aside style={{ width: 258, flexShrink: 0, alignSelf: "stretch", background: C.panel, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "18px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 6px 16px" }}>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Syntitan</span>
        <span onClick={() => setCollapsed(true)} title="사이드바 접기" style={{ color: C.faint, cursor: "pointer", display: "flex", padding: 2 }}><Icon.panel /></span>
      </div>
      <NavItem icon={<Icon.home />} label="Home" active={active === "Home"} onClick={() => onNav("Home")} />
      <div style={{ fontSize: 12, color: C.faint, fontWeight: 600, padding: "14px 10px 6px" }}>Workspace</div>
      <NavItem icon={<Icon.db />} label="Edit Dataset" active={active === "Edit Dataset"} onClick={() => onNav("Edit Dataset")} />
      <NavItem icon={<Icon.agent />} label="Agent Analysis" active={active === "Agent Analysis"} onClick={() => onNav("Agent Analysis")} />
      <NavItem icon={<Icon.users />} label="Discussion Room" active={active === "Discussion Room"} onClick={() => onNav("Discussion Room")} />
      <div style={{ fontSize: 12, color: C.faint, fontWeight: 600, padding: "14px 10px 6px" }}>Analyze</div>
      <NavItem icon={<Icon.report />} label="Report Hub" active={active === "Report Hub"} onClick={() => onNav("Report Hub")} />
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

function SummaryStat({ dot, label, value }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{value}</span>
    </span>
  );
}

function FolderTree({ folders, setFolders, activeFolder, setActiveFolder, datasets, setDatasets, onHide }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [open, setOpen] = useState(true);        // 폴더 하위 펼침
  const [hoverId, setHoverId] = useState(null);
  const [menuFor, setMenuFor] = useState(null);  // … 메뉴 열린 폴더 id
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [tipPlus, setTipPlus] = useState(false);
  const countOf = (fid) => datasets.filter((d) => (fid === null ? true : d.folderId === fid)).length;
  const add = () => {
    const n = name.trim();
    if (!n) { setCreating(false); return; }
    setFolders((f) => [...f, { id: "f" + (f.length + 1) + "_" + n.length, name: n }]);
    setName(""); setCreating(false);
  };
  const rename = (id) => {
    const n = editName.trim();
    if (n) setFolders((f) => f.map((x) => (x.id === id ? { ...x, name: n } : x)));
    setEditingId(null);
  };
  const del = (id) => {
    setFolders((f) => f.filter((x) => x.id !== id));
    setDatasets((ds) => ds.map((d) => (d.folderId === id ? { ...d, folderId: null } : d)));
    if (activeFolder === id) setActiveFolder(null);
    setMenuFor(null);
  };
  return (
    <aside style={{ width: 240, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: "#FCFCFD", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      {/* 패널 헤더 */}
      <div style={{ display: "flex", alignItems: "center", padding: "16px 12px 10px" }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>데이터셋</span>
      </div>

      <div style={{ padding: "0 8px" }}>
        {/* 전체 데이터셋 = 부모 행 (+ 새 폴더 / 펼치기) */}
        {(() => {
          const active = activeFolder === null;
          return (
            <div onMouseEnter={() => setHoverId("all")} onMouseLeave={() => setHoverId(null)} onClick={() => setActiveFolder(null)}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 8px", borderRadius: 8, cursor: "pointer", background: active ? "#EEF2FF" : "transparent", color: active ? C.purple : C.text, fontWeight: active ? 700 : 600, fontSize: 13.5 }}>
              <span style={{ display: "flex", color: active ? C.purple : C.sub }}><Icon.db width={17} height={17} /></span>
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>전체 데이터셋</span>
              {(hoverId === "all") ? (
                <span style={{ display: "flex", gap: 2 }}>
                  <span onClick={(e) => { e.stopPropagation(); setOpen(true); setCreating(true); setTipPlus(false); }} onMouseEnter={() => setTipPlus(true)} onMouseLeave={() => setTipPlus(false)} style={{ position: "relative", color: C.sub, cursor: "pointer", display: "flex", padding: 2, borderRadius: 5 }}>
                    <Icon.plus width={15} height={15} />
                    {tipPlus && <span style={{ position: "absolute", top: "calc(100% + 7px)", left: "50%", transform: "translateX(-50%)", background: "#18181B", color: "#fff", fontSize: 11.5, fontWeight: 500, padding: "5px 9px", borderRadius: 6, whiteSpace: "nowrap", zIndex: 40, boxShadow: "0 4px 12px rgba(0,0,0,0.18)" }}>Add folder<span style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "4px solid #18181B" }} /></span>}
                  </span>
                  <span onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }} title={open ? "접기" : "펼치기"} style={{ color: C.sub, cursor: "pointer", display: "flex", padding: 2, borderRadius: 5, transform: open ? "none" : "rotate(-90deg)", transition: "transform .15s" }}><Icon.chevD width={14} height={14} /></span>
                </span>
              ) : (
                <span style={{ fontSize: 12, color: C.faint }}>{countOf(null)}</span>
              )}
            </div>
          );
        })()}

        {/* 폴더 (하위, 들여쓰기) */}
        {open && folders.map((f) => {
          const active = activeFolder === f.id;
          const hovered = hoverId === f.id;
          if (editingId === f.id) {
            return (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 26px" }}>
                <span style={{ color: C.sub, display: "flex" }}><Icon.folder width={16} height={16} /></span>
                <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") rename(f.id); if (e.key === "Escape") setEditingId(null); }} onBlur={() => rename(f.id)} style={{ flex: 1, minWidth: 0, border: `1px solid ${C.blue}`, borderRadius: 7, padding: "5px 8px", fontSize: 13, fontFamily: FONT, outline: "none" }} />
              </div>
            );
          }
          return (
            <div key={f.id} onMouseEnter={() => setHoverId(f.id)} onMouseLeave={() => setHoverId(null)} onClick={() => setActiveFolder(f.id)}
              style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, padding: "9px 8px 9px 26px", borderRadius: 8, cursor: "pointer", background: active ? "#EEF2FF" : hovered ? "#F2F3F5" : "transparent", color: active ? C.purple : C.text, fontWeight: active ? 600 : 500, fontSize: 13.5 }}>
              <span style={{ display: "flex", color: active ? C.purple : C.sub }}><Icon.folder width={16} height={16} /></span>
              <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</span>
              {(hovered || menuFor === f.id) ? (
                <span onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === f.id ? null : f.id); }} title="더보기" style={{ color: C.sub, cursor: "pointer", display: "flex", padding: 2, borderRadius: 5 }}><Icon.kebab width={15} height={15} /></span>
              ) : (
                <span style={{ fontSize: 12, color: C.faint }}>{countOf(f.id)}</span>
              )}
              {menuFor === f.id && (
                <>
                  <div onClick={(e) => { e.stopPropagation(); setMenuFor(null); }} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
                  <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: "calc(100% - 2px)", right: 6, width: 150, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 31, padding: 4 }}>
                    <div onClick={() => { setEditingId(f.id); setEditName(f.name); setMenuFor(null); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", fontSize: 13, borderRadius: 7, cursor: "pointer", color: C.text }}><Icon.edit width={14} height={14} /> 이름 변경</div>
                    <div onClick={() => del(f.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", fontSize: 13, borderRadius: 7, cursor: "pointer", color: "#DC2626" }}><Icon.trash width={14} height={14} /> 삭제</div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {open && creating && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 26px" }}>
            <span style={{ color: C.sub, display: "flex" }}><Icon.folder width={16} height={16} /></span>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); if (e.key === "Escape") { setCreating(false); setName(""); } }} onBlur={add} placeholder="새 폴더" style={{ flex: 1, minWidth: 0, border: `1px solid ${C.blue}`, borderRadius: 7, padding: "5px 8px", fontSize: 13, fontFamily: FONT, outline: "none" }} />
          </div>
        )}
        {open && folders.length === 0 && !creating && <div style={{ padding: "6px 8px 6px 26px", fontSize: 12, color: C.faint }}>＋로 폴더를 추가하세요</div>}
      </div>
    </aside>
  );
}

function DatasetsPage({ datasets, setDatasets, folders, setFolders, activeFolder, setActiveFolder, onOpen, selected, setSelected, onMerge, onMergeDirect, onAsk, onUpload }) {
  const [q, setQ] = useState("");
  const [hover, setHover] = useState(null);
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [dragSrc, setDragSrc] = useState(null);     // 드래그 중인 데이터셋 id(단일)
  const dragRef = useRef({ mode: null, src: null }); // stale-state 방지용
  const [dragOverId, setDragOverId] = useState(null); // 드롭 대상(유효) id
  const [denyId, setDenyId] = useState(null);        // 잠긴(권한없음) 대상 id
  const [mergeAnim, setMergeAnim] = useState(null);  // 합쳐지는 순간 { a, b }
  const startMergeAnim = (aId, bId) => {
    setDragSrc(null); setDragOverId(null); setDenyId(null);
    setMergeAnim({ a: aId, b: bId });
    setTimeout(() => { setSelected([aId, bId]); setMergeAnim(null); onMerge(); }, 1250);
  };
  const nameOf = (id) => (datasets.find((d) => d.id === id)?.name) || "CUBIG Data";
  const rows = useMemo(() => {
    let list = [...datasets].sort((a, b) => b.ts - a.ts); // 업데이트 최신순
    if (activeFolder !== null) list = list.filter((d) => d.folderId === activeFolder);
    if (q.trim()) list = list.filter((d) => (d.name || "CUBIG Data").toLowerCase().includes(q.trim().toLowerCase()));
    return list;
  }, [datasets, q, activeFolder]);
  const moveToFolder = (fid) => { setDatasets((ds) => ds.map((d) => (selected.includes(d.id) ? { ...d, folderId: fid } : d))); setSelected([]); };
  const selecting = selected.length > 0;
  const overLimit = selected.length > MAX_MERGE;
  const canMerge = selected.length >= 2 && selected.length <= MAX_MERGE;
  const selectable = rows.filter((r) => !r.locked);
  const allChecked = selectable.length > 0 && selectable.every((r) => selected.includes(r.id));
  const toggle = (id, v) => setSelected((s) => (v ? [...s, id] : s.filter((x) => x !== id)));
  const toggleAll = (v) => setSelected(v ? selectable.map((r) => r.id) : []);

  const grid = "30px 1.6fr 1.1fr 1fr 1fr 0.8fr 0.8fr 40px";

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, height: "100%" }}>
      <div style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "34px 40px 60px", display: "flex", flexDirection: "column" }}>
      {/* title + summary cards */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Datasets</h1>
            <p style={{ color: C.sub, fontSize: 14, margin: "8px 0 0" }}>Upload your dataset to diagnose AI Readiness and optimize data gaps.</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, border: `1px solid ${C.border}`, borderRadius: 10, background: C.panel, padding: "8px 4px", marginTop: 4 }}>
          <SummaryStat dot={C.green} label="AI Ready" value="2" />
          <span style={{ width: 1, height: 22, background: C.borderSoft }} />
          <SummaryStat dot={C.yellow} label="Caution" value="2" />
          <span style={{ width: 1, height: 22, background: C.borderSoft }} />
          <SummaryStat dot={C.red} label="Critical" value="1" />
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
            <button onClick={() => onMerge()} style={{ display: "flex", alignItems: "center", gap: 7, height: 44, padding: "0 18px", background: "#fff", color: C.text, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
              <Icon.plus /> Combine
            </button>
            <button onClick={() => onUpload && onUpload()} style={{ display: "flex", alignItems: "center", gap: 7, height: 44, padding: "0 18px", background: C.dark, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>
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
          {canMerge && <span style={{ fontSize: 12, color: C.faint, display: "flex", alignItems: "center", gap: 5 }}><Icon.union width={13} height={13} /> 드래그해서 합치기</span>}
          <button onClick={() => canMerge && onMerge()} disabled={!canMerge} style={{ display: "flex", alignItems: "center", gap: 7, height: 40, padding: "0 16px", border: "none", borderRadius: 9, fontSize: 13.5, fontWeight: 600, fontFamily: FONT, cursor: canMerge ? "pointer" : "default", background: canMerge ? C.dark : "#EEF0F3", color: canMerge ? "#fff" : C.faint }}><Icon.union width={15} height={15} /> Combine ({selected.length}/{MAX_MERGE})</button>
          <button onClick={() => { setMoveTarget(undefined); setMoveOpen(true); }} style={{ display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", color: C.text, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}><Icon.folder width={15} height={15} /> 폴더로 이동</button>
          <button title="다운로드" style={{ display: "flex", alignItems: "center", gap: 6, height: 40, padding: "0 14px", borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", color: C.text, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}><Icon.download /> 다운로드</button>
          <button title="삭제" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", color: C.sub, cursor: "pointer", fontFamily: FONT }}><Icon.trash /></button>
        </div>
      )}
      </div>

      {/* table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: C.panel }}>
        <div style={{ display: "grid", gridTemplateColumns: grid, alignItems: "center", padding: "13px 20px", fontSize: 13, color: C.sub, fontWeight: 600, borderBottom: `1px solid ${C.border}`, background: "#FCFCFD" }}>
          <span>{selecting ? <Checkbox checked={allChecked} onChange={toggleAll} /> : ""}</span>
          <span>Dataset</span><span>AI 준비도</span><span>Version</span><span>Owner</span><span>Created</span><span>Updated</span><span />
        </div>
        {rows.map((d, i) => {
          const checked = selected.includes(d.id);
          const showCb = !d.locked && (selecting || hover === d.id || checked);
          return (
            <div key={d.id} draggable={!d.locked}
              onDragStart={(e) => { e.stopPropagation(); e.dataTransfer.setData("text/plain", String(d.id)); e.dataTransfer.effectAllowed = "move"; const multi = selected.length >= 2 && selected.includes(d.id); dragRef.current = { mode: multi ? "multi" : "single", src: d.id }; if (!multi) setDragSrc(d.id); }}
              onDragEnd={() => { const { mode } = dragRef.current; if (mode === "multi" && selected.length >= 2) startMergeAnim(selected[0], selected[1]); dragRef.current = { mode: null, src: null }; setDragSrc(null); setDragOverId(null); setDenyId(null); }}
              onDragOver={(e) => { const s = dragRef.current.src; if (dragRef.current.mode !== "single" || s == null || s === d.id) return; e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (d.locked) { setDenyId(d.id); setDragOverId(null); } else { setDragOverId(d.id); setDenyId(null); } }}
              onDragLeave={() => { if (dragOverId === d.id) setDragOverId(null); if (denyId === d.id) setDenyId(null); }}
              onDrop={(e) => { e.preventDefault(); const { mode, src } = dragRef.current; if (mode === "single" && src != null && src !== d.id && !d.locked) startMergeAnim(src, d.id); setDragOverId(null); setDenyId(null); }}
              onClick={() => { if (dragSrc == null) onOpen(d.id); }} onMouseEnter={() => setHover(d.id)} onMouseLeave={() => setHover(null)}
              style={{ position: "relative", display: "grid", gridTemplateColumns: grid, alignItems: "center", padding: "13px 20px", fontSize: 14, borderBottom: i === rows.length - 1 ? "none" : `1px solid ${C.borderSoft}`, cursor: dragSrc != null ? "grabbing" : "pointer", background: dragOverId === d.id ? "#EAF1FF" : denyId === d.id ? "#FEF2F2" : checked ? C.blueSoft : hover === d.id ? "#FAFAFB" : "transparent", boxShadow: dragOverId === d.id ? `inset 0 0 0 2px ${C.blue}` : "none", opacity: dragSrc === d.id ? 0.4 : 1, transition: "background .12s" }}>
              {denyId === d.id && (
                <div style={{ position: "absolute", left: 44, top: "50%", transform: "translateY(-50%)", zIndex: 20, display: "flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 10px 28px rgba(0,0,0,0.16)", padding: "9px 13px", fontSize: 13, color: C.text, pointerEvents: "none", whiteSpace: "nowrap" }}><span style={{ display: "flex", color: "#B45309" }}><Icon.warn width={15} height={15} /></span> 데이터셋의 편집 권한이 없습니다.</div>
              )}
              <span onClick={(e) => e.stopPropagation()} title={d.locked ? "편집 권한이 없어 합치기에 선택할 수 없어요" : undefined} style={{ display: "flex", height: "100%", alignItems: "center" }}>{d.locked ? ((selecting || hover === d.id) && <span style={{ color: C.faint, display: "flex" }}><Icon.lock /></span>) : (showCb && <Checkbox checked={checked} onChange={(v) => toggle(d.id, v)} />)}</span>
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
        {rows.length === 0 && (
          <div style={{ padding: "56px 0", textAlign: "center", color: C.faint, fontSize: 14 }}>
            이 폴더에 데이터셋이 없어요. 데이터를 선택해 <b>폴더로 이동</b>해 보세요.
          </div>
        )}
      </div>
      </div>

      {/* 폴더로 이동 모달 (ClovaNote 스타일) */}
      {moveOpen && (
        <div onClick={() => setMoveOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 360, background: "#fff", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.2)", padding: "22px 22px 18px", fontFamily: FONT }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700 }}>폴더로 이동</div>
                <div style={{ fontSize: 12.5, color: C.sub, marginTop: 4 }}>선택한 {selected.length}개를 다른 폴더로 옮길 수 있어요.</div>
              </div>
              <span onClick={() => setMoveOpen(false)} style={{ color: C.faint, cursor: "pointer", display: "flex", padding: 2 }}><Icon.x /></span>
            </div>
            <div style={{ margin: "18px 0 4px", maxHeight: 240, overflowY: "auto" }}>
              {[{ id: null, name: "전체 데이터셋 (폴더에서 빼기)" }, ...folders].map((f) => {
                const sel = moveTarget === f.id;
                return (
                  <div key={f.id ?? "all"} onClick={() => setMoveTarget(f.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 8px", borderRadius: 8, cursor: "pointer", background: sel ? "#EEF2FF" : "transparent" }}>
                    <span style={{ width: 17, height: 17, borderRadius: "50%", border: `2px solid ${sel ? C.purple : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{sel && <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.purple }} />}</span>
                    <span style={{ display: "flex", color: f.id === null ? C.sub : sel ? C.purple : C.sub }}>{f.id === null ? <Icon.db width={16} height={16} /> : <Icon.folder width={16} height={16} />}</span>
                    <span style={{ fontSize: 13.5, fontWeight: sel ? 600 : 500, color: sel ? C.purple : C.text }}>{f.name}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={() => { if (moveTarget !== undefined) { moveToFolder(moveTarget); setMoveOpen(false); } }} disabled={moveTarget === undefined}
              style={{ width: "100%", marginTop: 14, padding: "12px 0", borderRadius: 10, border: "none", background: moveTarget !== undefined ? C.dark : "#E5E7EB", color: moveTarget !== undefined ? "#fff" : C.faint, fontSize: 14, fontWeight: 600, cursor: moveTarget !== undefined ? "pointer" : "default", fontFamily: FONT }}>이동</button>
          </div>
        </div>
      )}

      {/* 데이터 합치기 진입 모달 */}
      {mergeModalOpen && (
        <ReselectModal
          initial={[0, 1]}
          title="어떤 데이터를 합칠까요?"
          desc="합칠 두 데이터를 선택해주세요."
          confirmLabel="확인"
          onClose={() => setMergeModalOpen(false)}
          onApply={() => { setMergeModalOpen(false); onMergeDirect(); }}
        />
      )}

      {/* 합쳐지는 순간 — 머지 애니메이션 */}
      {mergeAnim && (
        <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(17,24,39,0.55)", backdropFilter: "blur(2px)" }}>
          <style>{`@keyframes mgL{0%{transform:translateX(-46px) rotate(-5deg);opacity:.85}55%{transform:translateX(14px) rotate(0)}100%{transform:translateX(14px)}}@keyframes mgR{0%{transform:translateX(46px) rotate(5deg);opacity:.85}55%{transform:translateX(-14px) rotate(0)}100%{transform:translateX(-14px)}}@keyframes mgPop{0%,60%{transform:scale(0);opacity:0}75%{transform:scale(1.18);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes mgRing{0%{transform:scale(.6);opacity:.5}100%{transform:scale(1.7);opacity:0}}`}</style>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: 320, height: 130 }}>
              {/* 블루 카드 */}
              <div style={{ position: "absolute", animation: "mgL .9s cubic-bezier(.6,0,.2,1) forwards", display: "flex", alignItems: "center", gap: 9, padding: "13px 16px", borderRadius: 13, background: "#fff", border: "1.5px solid #BFD7FF", boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: "#EAF1FF", color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.db width={16} height={16} /></span>
                <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>{nameOf(mergeAnim.a)}</span>
              </div>
              {/* 그린 카드 */}
              <div style={{ position: "absolute", animation: "mgR .9s cubic-bezier(.6,0,.2,1) forwards", display: "flex", alignItems: "center", gap: 9, padding: "13px 16px", borderRadius: 13, background: "#fff", border: "1.5px solid #BBF7D0", boxShadow: "0 10px 30px rgba(0,0,0,0.18)" }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: "#E6F8EC", color: "#15803D", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.db width={16} height={16} /></span>
                <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>{nameOf(mergeAnim.b)}</span>
              </div>
              {/* 합쳐지는 스파크 */}
              <span style={{ position: "absolute", width: 56, height: 56, borderRadius: "50%", border: `2px solid #C9C2F2`, animation: "mgRing .7s ease-out .55s forwards", opacity: 0 }} />
              <span style={{ position: "absolute", width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#7C6BF0,#9C8CF6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(124,107,240,0.5)", animation: "mgPop .9s cubic-bezier(.5,1.6,.4,1) forwards" }}><Icon.spark width={22} height={22} /></span>
            </div>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: 0.2 }}>두 데이터를 합치는 중…</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
 *  Merge page
 * ========================================================= */
const MERGED_NAMES = (ids) => ids.map((_, i) => `CUBIG Data_${2024 + i}`);
const MAX_MERGE = 2; // 한 번에 합칠 수 있는 데이터셋 최대 개수
const PICK_MAX = 3;  // 선택 자체는 3개까지 허용 — 3개째부터 용량 초과 안내
const poolLabel = (i) => `CUBIG Data_${2024 + i}`;
const DEFAULT_NAMES = ["CUBIG Data_2024", "CUBIG Data_2025"];

const NO_MATCH = "매칭 칼럼 없음";
// 기준 4컬럼 + 추가 4컬럼 → 합치면 6 distinct: 결합 2 · 유지 2 · 제외 2
const AUTO_ROWS = [["customer_id", "Integer"], ["name", "String"], ["email", "String"], ["signup_date", "Integer"], ["gender", "String"], ["country", "String"]]; // 자동(양쪽 이름·타입 일치)
const REVIEW_ROWS = [
  { left: "region", lt: "String", right: NO_MATCH, note: "추가에만 있는 칼럼이에요. 기준 데이터 행은 Null로 채워져요." },
  { left: "age", lt: "Integer", right: NO_MATCH, note: "추가에만 있는 칼럼이에요. 기준 데이터 행은 Null로 채워져요." },
  { left: "phone", lt: "String", right: NO_MATCH, note: "기준에만 있는 칼럼이에요. 추가 데이터 행은 Null로 채워져요." },
  { left: "address", lt: "String", right: NO_MATCH, note: "기준에만 있는 칼럼이에요. 추가 데이터 행은 Null로 채워져요." },
  { left: "age_group", lt: "String", right: NO_MATCH, note: "추가에만 있는 칼럼이에요. 기준 데이터 행은 Null로 채워져요." },
  { left: "zip_code", lt: "String", right: NO_MATCH, note: "기준에만 있는 칼럼이에요. 추가 데이터 행은 Null로 채워져요." },
];
const COL_OPTIONS = [
  { name: NO_MATCH },
  { name: "customer_id", type: "Integer" }, { name: "name", type: "String" },
  { name: "email", type: "String" }, { name: "signup_date", type: "Integer" },
  { name: "gender", type: "String" }, { name: "country", type: "String" },
  { name: "region", type: "String" }, { name: "age", type: "Integer" },
];
const colType = (name) => COL_OPTIONS.find((o) => o.name === name)?.type;
const JOIN_KEYS = [
  { name: "customer_id", type: "Integer", rate: 92, recommended: true },
  { name: "email", type: "String", rate: 78 },
  { name: "name", type: "String", rate: 41 },
];
const rateColor = (r) => (r >= 80 ? C.green : r >= 50 ? C.yellow : C.red);

/* 클릭 가능한 매칭 드롭다운 (데이터 타입 표시) — 메뉴는 fixed 위치로 띄워 잘림 방지 */
function MatchDropdown({ value, onChange, error, recommended }) {
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
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: none ? C.faint : C.text }}>{!none && t && <TypeIcon kind={t} />}{value}</span>
        <span style={{ color: C.faint, display: "flex", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}><Icon.chevD /></span>
      </div>
      {recommended !== undefined && recommended !== value && (
        <div onClick={() => onChange(recommended)} title="AI 추천값으로 되돌리기" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 11.5, fontWeight: 600, color: C.purple, cursor: "pointer" }}>
          <Icon.spark width={12} height={12} /> AI 추천 「{recommended}」 으로 되돌리기
        </div>
      )}
      {open && pos && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "fixed", left: pos.left, width: pos.width, top: pos.top ?? undefined, bottom: pos.bottom ?? undefined, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", zIndex: 41, maxHeight: 280, overflowY: "auto", padding: 4 }}>
            {COL_OPTIONS.map((o) => (
              <div key={o.name} onClick={() => { onChange(o.name); setOpen(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", fontSize: 14, borderRadius: 7, cursor: "pointer", background: o.name === value ? C.blueSoft : "transparent" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, color: o.name === NO_MATCH ? C.faint : C.text }}>{o.type && <TypeIcon kind={o.type} />}{o.name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {o.name === recommended && <span style={{ fontSize: 10, fontWeight: 700, color: C.purple, background: "#EEF2FF", borderRadius: 4, padding: "1px 6px" }}>AI 추천</span>}
                  {o.name === value && <Icon.checkCircle width={15} height={15} />}
                </span>
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
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      {/* 01 병합 방식 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><StepNum n="01" /><span style={{ fontSize: 15, fontWeight: 700 }}>병합 방식</span></div>
      <div style={{ display: "flex", gap: 16, marginBottom: 30 }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ flex: 1, border: `1px solid ${C.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: "#EEEFF1", animation: "pulse 1.2s ease-in-out infinite", flexShrink: 0 }} />
            <div style={{ flex: 1 }}><div style={sk("55%", 14)} /><div style={{ height: 8 }} /><div style={sk("85%", 10)} /></div>
          </div>
        ))}
      </div>
      {/* 02 칼럼 매칭 (AI 계산 중) */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}><StepNum n="02" /><span style={{ fontSize: 15, fontWeight: 700 }}>칼럼 매칭</span><span style={{ marginLeft: 6, display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.purple, fontWeight: 600 }}><span style={{ width: 14, height: 14, border: `2px solid #DDD6FE`, borderTopColor: C.purple, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} /> AI가 칼럼을 매칭하고 있어요…</span></div>
      {/* 요약 칩 skeleton */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}`, borderRadius: 10, padding: "15px 16px" }}>
            <div style={sk("60px", 12)} /><div style={sk("34px", 16)} />
          </div>
        ))}
      </div>
      {/* 매칭 섹션 skeleton */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "#FAFAFB", borderBottom: `1px solid ${C.borderSoft}` }}>
          <div style={sk("90px", 13)} /><div style={sk("40px", 12)} />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 48px minmax(0,1.25fr)", alignItems: "center", padding: "13px 16px", borderBottom: i === 5 ? "none" : `1px solid ${C.borderSoft}` }}>
            <div style={sk("55%")} />
            <div style={{ display: "flex", justifyContent: "center", color: "#E0E1E4" }}>→</div>
            <div style={{ ...sk("100%"), height: 38, borderRadius: 9 }} />
          </div>
        ))}
      </div>
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

/* 데이터 워크플로우 캔버스 (#1 노드형 파이프라인 · 칼럼 단위 결합/유지/제외 노출) */
const WF_OPS = [
  { group: "소스 · 출력", items: [["Source", "데이터 가져오기", "db"], ["Output", "데이터 내보내기", "download"]] },
  { group: "AI 변환", items: [["AI Function", "AI로 분석", "spark"]] },
  { group: "변환", items: [["Aggregate", "행 요약", "union"], ["Combine", "두 테이블 병합", "join"], ["Filter", "행 필터", "search"], ["Join", "키로 연결", "join"], ["Sort", "정렬", "swap"]] },
];
const WF_BASE = [["customer_id", "Integer"], ["name", "String"], ["email", "String"], ["signup_date", "Integer"]];
const WF_ADD = [["customer_id", "Integer"], ["name", "String"], ["region", "String"], ["age", "Integer"]];
// 결과 칼럼 상태(오른쪽 매칭과 동일): 공통(양쪽 다 있음=AI 자동) / 일부 Null(한쪽만=검토 필요)
const WF_RESULT = [
  ["customer_id", "Integer", "공통"], ["name", "String", "공통"],
  ["email", "String", "일부 Null"], ["signup_date", "Integer", "일부 Null"],
  ["region", "String", "일부 Null"], ["age", "Integer", "일부 Null"],
];
const WF_STATUS = {
  공통: { bg: "#EEEDFE", fg: "#534AB7" },
  결합: { bg: "#EEEDFE", fg: "#534AB7" },
  유지: { bg: "#E6F1FB", fg: "#185FA5" },
  제외: { bg: "#F4F4F5", fg: "#9CA3AF" },
  "일부 Null": { bg: "#FEF6E7", fg: "#B45309" },
  Null: { bg: "#FEF6E7", fg: "#B45309" },
};
function WfIcon({ k }) {
  const m = { db: <Icon.db />, download: <Icon.download />, spark: <Icon.spark />, union: <Icon.union />, join: <Icon.join />, search: <Icon.search />, swap: <Icon.swap /> };
  return m[k] || <Icon.sheet />;
}
function WfColRow({ name, type, status, last }) {
  const st = status && WF_STATUS[status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderBottom: last ? "none" : `1px solid ${C.borderSoft}`, fontSize: 12.5 }}>
      <TypeIcon kind={type} />
      <span style={{ flex: 1, color: status === "제외" ? C.faint : C.text, textDecoration: status === "제외" ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
      {status ? <span style={{ fontSize: 10.5, fontWeight: 700, color: st.fg, background: st.bg, borderRadius: 5, padding: "1px 6px" }}>{status}</span> : <span style={{ fontSize: 11, color: C.faint }}>{type === "Integer" ? "int" : "string"}</span>}
    </div>
  );
}
function WfNode({ x, y, w, accent, icon, name, sub, children, onDragStart, dragging }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, background: "#fff", border: `1px solid ${accent ? "#C9C2F2" : C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: dragging ? "0 8px 24px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.05)", zIndex: dragging ? 5 : 1 }}>
      <div onMouseDown={onDragStart} style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 12px", borderBottom: children ? `1px solid ${C.borderSoft}` : "none", cursor: dragging ? "grabbing" : "grab", userSelect: "none" }}>
        <span style={{ width: 26, height: 26, borderRadius: 6, background: accent ? "#EEEDFE" : "#F3F4F6", color: accent ? C.purple : C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><WfIcon k={icon} /></span>
        <div style={{ minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div><div style={{ fontSize: 11, color: C.faint }}>{sub}</div></div>
      </div>
      {children}
    </div>
  );
}
function WorkflowGraph({ names, isJoin, afterRows, big }) {
  const CW = big ? 1900 : 1200, CH = big ? 1150 : 760;
  const [pos, setPos] = useState({ base: { x: 20, y: 60 }, add: { x: 20, y: 300 }, merge: { x: 420, y: 150 } });
  const [dragId, setDragId] = useState(null);
  const drag = useRef(null);
  useEffect(() => {
    const mv = (e) => { const d = drag.current; if (!d) return; setPos((p) => ({ ...p, [d.id]: { x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) } })); };
    const up = () => { drag.current = null; setDragId(null); };
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, []);
  const startDrag = (id) => (e) => { drag.current = { id, sx: e.clientX, sy: e.clientY, ox: pos[id].x, oy: pos[id].y }; setDragId(id); e.preventDefault(); };
  const W = { base: 230, add: 230, merge: 320 };
  const rPort = (id) => ({ x: pos[id].x + W[id], y: pos[id].y + 28 });
  const lPort = (id) => ({ x: pos[id].x, y: pos[id].y + 28 });
  const path = (a, b) => `M ${a.x} ${a.y} C ${a.x + 60} ${a.y} ${b.x - 60} ${b.y} ${b.x} ${b.y}`;
  return (
    <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "auto", backgroundColor: "#fff", backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.09) 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
      <div style={{ position: "relative", width: CW, height: CH }}>
        <svg width={CW} height={CH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <path d={path(rPort("base"), lPort("merge"))} fill="none" stroke="#C7CBD1" strokeWidth="1.5" />
          <path d={path(rPort("add"), lPort("merge"))} fill="none" stroke="#C7CBD1" strokeWidth="1.5" />
          {[rPort("base"), rPort("add"), lPort("merge")].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#9CA3AF" strokeWidth="1.5" />)}
        </svg>
        <WfNode x={pos.base.x} y={pos.base.y} w={230} icon="db" name={names[0]} sub="Source · 기준 · 4 columns" onDragStart={startDrag("base")} dragging={dragId === "base"}>
          {WF_BASE.map((c, i) => <WfColRow key={c[0]} name={c[0]} type={c[1]} last={i === WF_BASE.length - 1} />)}
        </WfNode>
        <WfNode x={pos.add.x} y={pos.add.y} w={230} icon="db" name={names[1]} sub="Source · 추가 · 4 columns" onDragStart={startDrag("add")} dragging={dragId === "add"}>
          {WF_ADD.map((c, i) => <WfColRow key={c[0]} name={c[0]} type={c[1]} last={i === WF_ADD.length - 1} />)}
        </WfNode>
        <WfNode x={pos.merge.x} y={pos.merge.y} w={320} accent icon={isJoin ? "join" : "union"} name={isJoin ? "병합 · Join" : "병합 · Union"} sub={isJoin ? `${afterRows.toLocaleString()}행 · 유지 4 · 추가 2` : `${afterRows.toLocaleString()}행 · 공통 2 · 일부 Null 4`} onDragStart={startDrag("merge")} dragging={dragId === "merge"}>
          {WF_RESULT.map((c, i) => <WfColRow key={c[0]} name={c[0]} type={c[1]} status={c[2]} last={i === WF_RESULT.length - 1} />)}
        </WfNode>
      </div>
    </div>
  );
}
function WorkflowCanvas({ names, isJoin, afterRows, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 70, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      {/* 상단 바 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700 }}><span style={{ width: 26, height: 26, borderRadius: 7, background: "#EEEDFE", color: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.union width={15} height={15} /></span> 데이터 워크플로우</span>
        <span style={{ fontSize: 12.5, color: C.faint }}>칼럼이 어떻게 결합·유지·제외되는지 보여줘요</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 6, color: C.faint }}>
          <span style={{ display: "flex", padding: 6, border: `1px solid ${C.border}`, borderRadius: 8 }}><Icon.search width={15} height={15} /></span>
        </span>
        <button onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 6, height: 34, padding: "0 14px", border: "none", borderRadius: 9, background: C.dark, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>닫기</button>
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <WorkflowGraph names={names} isJoin={isJoin} afterRows={afterRows} />
      </div>
      {/* 범례 + 프롬프트 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 18px", borderTop: `1px solid ${C.border}`, background: "#FCFCFD" }}>
        <span style={{ fontSize: 12, color: C.sub }}>칼럼 상태</span>
        {[["결합", "양쪽 데이터에 있어 합쳐짐"], ["유지", "기준에만 있어 그대로(추가는 Null)"], ["제외", "기준에 없어 빠짐"]].map(([s, d]) => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.sub }}><span style={{ fontSize: 10.5, fontWeight: 700, color: WF_STATUS[s].fg, background: WF_STATUS[s].bg, borderRadius: 5, padding: "1px 6px" }}>{s}</span> {d}</span>
        ))}
      </div>
    </div>
  );
}

function LeftPanel({ picked, setPicked, picking, setPicking, onDone, onCancel, canCancel }) {
  const pool = useMemo(() => Array.from({ length: 18 }, (_, i) => poolLabel(i)), []);
  const atMax = picked.length >= PICK_MAX;
  const overPick = picked.length > MAX_MERGE;
  const [collapsed, setCollapsed] = useState(false);
  const togglePick = (i) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length >= PICK_MAX ? p : [...p, i]));

  if (picking) {
    return (
      <div style={panel.left}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>데이터 선택</span>
            <span style={{ fontSize: 12.5, color: overPick ? "#DC2626" : picked.length === MAX_MERGE ? C.purple : C.faint, fontWeight: 600 }}>{picked.length}/{MAX_MERGE}</span>
          </div>
          {canCancel && <span onClick={onCancel} title="닫기" style={{ cursor: "pointer", color: C.faint, display: "flex", width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center" }}><Icon.panel width={16} height={16} /></span>}
        </div>
        <div style={{ padding: "9px 16px", fontSize: 11.5, color: overPick ? "#DC2626" : C.faint, borderBottom: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", gap: 5, lineHeight: 1.5 }}>
          <Icon.infoCircle width={12} height={12} /> {overPick ? `최대 ${MAX_MERGE}개까지 합칠 수 있어요 · 용량을 초과해요` : `처음 선택한 데이터셋이 기준이 돼요 · 최대 ${MAX_MERGE}개`}
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

  if (collapsed) {
    return (
      <div style={{ width: 52, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.panel, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0", gap: 14 }}>
        <span onClick={() => setCollapsed(false)} title="패널 펼치기" style={{ cursor: "pointer", color: C.sub, display: "flex", padding: 6, borderRadius: 7 }}><Icon.chevR width={17} height={17} /></span>
        <span title={`데이터 ${picked.length}개`} style={{ width: 30, height: 30, borderRadius: 7, background: "#F3F4F6", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.db /></span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>{picked.length}</span>
      </div>
    );
  }

  return (
    <div style={panel.left}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 12px 8px" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.sub, paddingLeft: 4 }}>선택한 데이터</span>
        <span onClick={() => setCollapsed(true)} title="패널 접기" style={{ cursor: "pointer", color: C.faint, display: "flex", padding: 5, borderRadius: 7 }}><span style={{ display: "flex", transform: "rotate(180deg)" }}><Icon.chevR width={17} height={17} /></span></span>
      </div>
      <div style={{ padding: "0 12px 8px" }}>
        <button onClick={() => setPicking(true)} style={{ width: "100%", padding: "11px 0", borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Icon.swap width={14} height={14} /> 데이터 재선택</button>
      </div>
      <div style={{ padding: "4px 18px 8px", fontSize: 12, color: C.faint, fontWeight: 600 }}>데이터셋 {picked.length}개</div>
      {/* 기준 데이터셋 (첫 번째, 기준 배지로 구분) */}
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

function VennIcon({ type, active }) {
  const f = active ? "#85B7EB" : "#E4E4E7";
  const s = active ? "#185FA5" : "#B4B2A9";
  return (
    <svg width="36" height="22" viewBox="0 0 36 22">
      <defs><clipPath id={`vc-${type}`}><circle cx="22" cy="11" r="9" /></clipPath></defs>
      {(type === "left" || type === "full") && <circle cx="14" cy="11" r="9" fill={f} />}
      {type === "inner" && <circle cx="14" cy="11" r="9" fill={f} clipPath={`url(#vc-${type})`} />}
      {(type === "right" || type === "full") && <circle cx="22" cy="11" r="9" fill={f} />}
      <circle cx="14" cy="11" r="9" fill="none" stroke={s} strokeWidth="1.3" />
      <circle cx="22" cy="11" r="9" fill="none" stroke={s} strokeWidth="1.3" />
    </svg>
  );
}

function KeyPicker({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const type = (options.find((o) => o[0] === value) || [])[1];
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div onClick={() => setOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, border: `1px solid ${open ? C.dark : C.border}`, borderRadius: 9, padding: "10px 12px", background: "#fff", cursor: "pointer", fontSize: 14 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}><TypeIcon kind={type} /> {value}</span>
        <span style={{ color: C.faint, display: "flex", transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}><Icon.chevD /></span>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", zIndex: 41, padding: 4 }}>
            {options.map(([nm, t]) => (
              <div key={nm} onClick={() => { onChange(nm); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 10px", fontSize: 14, borderRadius: 7, cursor: "pointer", background: nm === value ? C.blueSoft : "transparent" }}><TypeIcon kind={t} /> {nm}</div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ReselectModal({ initial, onApply, onClose, title = "데이터 재선택", desc = "합칠 두 데이터를 선택해주세요.", confirmLabel = "적용" }) {
  const pool = useMemo(() => Array.from({ length: 18 }, (_, i) => poolLabel(i)), []);
  const [draft, setDraft] = useState(initial);
  const atMax = draft.length >= PICK_MAX;
  const overPick = draft.length > MAX_MERGE;
  const canApply = draft.length >= 2 && draft.length <= MAX_MERGE;
  const toggle = (i) => setDraft((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length >= PICK_MAX ? p : [...p, i]));
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,0.45)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 560, maxHeight: "82vh", background: "#fff", borderRadius: 18, boxShadow: "0 24px 64px rgba(0,0,0,0.28)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 22px 16px" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: 13, color: overPick ? "#DC2626" : C.sub, marginTop: 5 }}>{overPick ? `최대 ${MAX_MERGE}개까지 합칠 수 있어요` : desc}</div>
          </div>
          <span onClick={onClose} style={{ cursor: "pointer", color: C.faint, display: "flex", padding: 2 }}><Icon.x /></span>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {pool.map((nm, i) => {
            const checked = draft.includes(i);
            const isBase = draft[0] === i;
            const order = draft.indexOf(i) + 1;
            const disabled = !checked && atMax;
            return (
              <label key={i} onClick={() => !disabled && toggle(i)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px", cursor: disabled ? "default" : "pointer", background: isBase ? "#EEF4FF" : checked ? "#F7F8FA" : "transparent", opacity: disabled ? 0.45 : 1 }}>
                <Checkbox checked={checked} onChange={() => !disabled && toggle(i)} />
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 22px", borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: overPick ? "#DC2626" : C.faint }}>{draft.length}/{MAX_MERGE} 선택됨</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ padding: "10px 18px", borderRadius: 9, border: `1px solid ${C.border}`, background: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>취소</button>
            <button onClick={() => canApply && onApply(draft)} disabled={!canApply} style={{ padding: "10px 20px", borderRadius: 9, border: "none", background: canApply ? C.dark : "#E5E7EB", color: canApply ? "#fff" : C.faint, fontSize: 13.5, fontWeight: 600, cursor: canApply ? "pointer" : "default", fontFamily: FONT }}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MergePage({ selected, onBack, onRun }) {
  // 멀티선택으로 진입(2개 이상) → 요약부터 / 헤더 버튼으로 직접 진입(0개) → 데이터 선택부터
  const cameWithSelection = selected.length >= 2;
  const [picked, setPicked] = useState(cameWithSelection ? [0, 1] : []); // 좌측 드래프트 선택
  const [committed, setCommitted] = useState(cameWithSelection ? [0, 1] : []); // 실제 적용(우측 본문 기준)
  const [picking, setPicking] = useState(false);
  const [method, setMethod] = useState("union"); // union | join
  const [joinType, setJoinType] = useState("left"); // 1차: left만 지원
  const [joinLeft, setJoinLeft] = useState("customer_id");   // 기준 키
  const [joinRight, setJoinRight] = useState("customer_id"); // 추가 키
  const KEY_RATE = { customer_id: 92, email: 78, name: 41, signup_date: 55, region: 30, age: 20 };
  const matchRate = KEY_RATE[joinLeft] ?? 55;
  const keyRecommended = joinLeft === "customer_id" && joinRight === "customer_id";
  const [autoOpen, setAutoOpen] = useState(true);
  const [autoEditing, setAutoEditing] = useState(false);
  const [reviewEditing, setReviewEditing] = useState(false);
  const [autoSel, setAutoSel] = useState(AUTO_ROWS.map((r) => r[0]));
  const [reviewOpen, setReviewOpen] = useState(true);
  const [reviewSel, setReviewSel] = useState(REVIEW_ROWS.map((r) => r.right));
  const [relOpen, setRelOpen] = useState(false); // (미사용) 풀스크린 — 인라인 확장으로 대체
  const [previewOpen, setPreviewOpen] = useState(false); // 구성 미리보기(on-demand)
  const [previewBig, setPreviewBig] = useState(false); // 넓게 보기(인라인 높이 확장)
  const [peek, setPeek] = useState(false); // ▢ hover 미리보기
  const [reselectOpen, setReselectOpen] = useState(!cameWithSelection); // 데이터 재선택 모달(빈 시작이면 자동 오픈)
  const [methodOpen, setMethodOpen] = useState(false); // 병합 방식 드롭다운

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
  const over = hasContent && committed.length > MAX_MERGE; // 3개 이상 = 용량 초과
  const afterCols = 6; // 합치면 생기는 distinct 칼럼 (결합2 + 유지2 + 제외2)
  const JOIN_ROWS = { left: 8432, inner: 7756, right: 8432, full: 9108 }; // 조인 타입별 결과 행수
  const afterRows = isJoin ? (JOIN_ROWS[joinType] ?? 8432) : committed.length > MAX_MERGE ? 25296 : 16864;
  // 매칭 검증: 같은 컬럼 중복 선택 / 전부 매칭 없음
  const autoDupes = useMemo(() => {
    const c = {}; autoSel.forEach((v) => { if (v !== NO_MATCH) c[v] = (c[v] || 0) + 1; });
    return new Set(Object.keys(c).filter((k) => c[k] > 1));
  }, [autoSel]);
  const autoAllNone = autoSel.every((v) => v === NO_MATCH);
  const matchError = autoDupes.size > 0 || autoAllNone;
  const [toast, setToast] = useState("");
  useEffect(() => { if (autoEditing && autoAllNone) setToast("칼럼을 1개 이상 매칭해야 합니다."); }, [autoEditing, autoAllNone]);

  const ready = hasContent && !loading && !picking; // 우측 본문/수치 노출 조건
  const names = hasContent ? committed.map(poolLabel) : DEFAULT_NAMES;
  const canRun = ready && !over && !matchError; // 한도 초과·매칭 오류 시 실행 불가

  return (
    <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", flex: 1, minHeight: 0 }}>
      {/* 상단 툴바: 병합 방식 + 데이터 선택 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        {!hasContent ? (
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 30, height: 30, borderRadius: 7, background: "#F3F4F6", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.union width={16} height={16} /></span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>Combine</span>
          </span>
        ) : (
        <>
        <span onClick={onBack} title="Combine으로" style={{ cursor: "pointer", display: "flex", color: C.sub, marginRight: 2 }}><Icon.back /></span>
        {/* 병합 방식 드롭다운 */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setMethodOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 10, height: 44, padding: "0 12px", borderRadius: 10, border: "1px solid transparent", background: methodOpen ? "#F1F2F4" : "transparent", cursor: "pointer", fontFamily: FONT }}>
            <span style={{ width: 30, height: 30, borderRadius: 7, background: "#F3F4F6", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{isJoin ? <Icon.join width={16} height={16} /> : <Icon.union width={16} height={16} />}</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{isJoin ? "Join" : "Union"}</span>
            <span style={{ fontSize: 12.5, color: C.faint, whiteSpace: "nowrap" }}>{isJoin ? "기준 데이터 옆에 열을 추가해요." : "컬럼이 같은 두 데이터를 위아래로 쌓아요."}</span>
            <span style={{ display: "flex", color: C.faint, marginLeft: 2 }}><Icon.chevD width={14} height={14} /></span>
          </button>
          {methodOpen && (
            <>
              <div onClick={() => setMethodOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 30 }} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, width: 320, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.14)", zIndex: 31, padding: 6 }}>
                {[["union", "Union", "컬럼이 같은 두 데이터를 위아래로 쌓아요.", true], ["join", "Join", "기준 데이터 옆에 열을 추가해요.", false]].map(([m, label, desc, rec]) => {
                  const act = method === m;
                  return (
                    <div key={m} onClick={() => { setMethod(m); setMethodOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 11px", borderRadius: 9, cursor: "pointer", background: act ? "#F5F7FF" : "transparent" }}>
                      <span style={{ width: 28, height: 28, borderRadius: 7, background: act ? "#EEF2FF" : "#F3F4F6", color: act ? C.purple : C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{m === "join" ? <Icon.join width={15} height={15} /> : <Icon.union width={15} height={15} />}</span>
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700 }}>{label}{rec && <span style={{ fontSize: 10, fontWeight: 700, color: C.purple, background: "#EEF2FF", borderRadius: 4, padding: "1px 5px" }}>추천</span>}</span>
                        <span style={{ display: "block", fontSize: 11.5, color: C.faint }}>{desc}</span>
                      </span>
                      {act && <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.purple, flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        </>
        )}

        <div style={{ flex: 1 }} />

        {/* 데이터 선택(재선택) 드롭다운 */}
        {hasContent && (
          <div style={{ position: "relative" }} onMouseEnter={() => setPeek(true)} onMouseLeave={() => setPeek(false)}>
            <button onClick={() => { setReselectOpen(true); setPeek(false); }} title="합칠 데이터 다시 선택" style={{ display: "flex", alignItems: "center", gap: 8, height: 40, padding: "0 12px", borderRadius: 9, border: `1px solid ${reselectOpen ? C.dark : C.border}`, background: "#fff", cursor: "pointer", color: C.text, fontFamily: FONT }}>
              <span style={{ color: C.sub, display: "flex" }}><Icon.db width={15} height={15} /></span>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{names[0]}{committed.length > 1 ? ` 외 ${committed.length - 1}` : ""}</span>
              <span style={{ display: "flex", color: C.faint }}><Icon.chevD width={14} height={14} /></span>
            </button>
            {peek && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 270, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14, boxShadow: "0 14px 36px rgba(0,0,0,0.16)", zIndex: 40, padding: 10 }}>
                <div style={{ fontSize: 12, color: C.faint, fontWeight: 600, padding: "4px 6px 8px" }}>selected data</div>
                {committed.map((idx, i) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px" }}>
                    <span style={{ width: 28, height: 28, borderRadius: 7, background: i === 0 ? "#EEF2FF" : "#F3F4F6", color: i === 0 ? C.purple : C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.db width={15} height={15} /></span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 13, fontWeight: 600 }}>{poolLabel(idx)}</span>{i === 0 && <span style={{ fontSize: 10, fontWeight: 700, color: C.sub, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 4, padding: "0 5px" }}>기준</span>}</div>
                      <div style={{ fontSize: 11, color: C.faint }}>58.2KB · 4컬럼 · 8,432행</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {loading ? (
          <MergeSkeleton />
        ) : !hasContent ? (
          <div onClick={() => setReselectOpen(true)} style={{ flex: 1, minHeight: 0, cursor: "pointer", backgroundColor: "#fff", backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.09) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
        ) : previewBig ? (
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700 }}>매칭 시각화 미리보기 <span style={{ fontWeight: 500, color: C.faint, fontSize: 12 }}>· 스크롤해서 전체 보기</span></span>
              <span style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setPreviewBig(false)} title="좁게 보기" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.sub }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 4v5H4M15 20v-5h5M9 9 4 4M15 15l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                <button title="리셋" style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
              </span>
            </div>
            <WorkflowGraph names={names} isJoin={isJoin} afterRows={afterRows} big />
          </div>
        ) : (
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", position: "relative", background: "#FBFBFB", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
          {over ? (
            <div style={{ minHeight: 460, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 18 }}>
              <span style={{ width: 64, height: 64, borderRadius: 18, background: "#FEF2F2", border: `1px solid #FCA5A5`, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 }}>!</span>
              <div style={{ fontSize: 19, fontWeight: 700, color: C.text }}>용량 한도를 초과했어요</div>
              <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.7, maxWidth: 470 }}>한 번에 최대 <b>{MAX_MERGE}개</b>까지만 합칠 수 있어요.<br />지금 <b>{committed.length}개</b>를 합치면 <b>{afterRows.toLocaleString()}행</b>이 되어 한도(<b>10,000행</b> · 100MB)를 넘어요.</div>
              <button onClick={() => setReselectOpen(true)} style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 7, background: C.dark, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}><Icon.swap width={15} height={15} /> 데이터 다시 선택</button>
            </div>
          ) : (
          <>
          {/* 02 */}
          {method === "join" ? (
            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 24px 28px" }}>
              {/* 02 조인 조건 (조인키) — 먼저 */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><StepNum n="02" /><span style={{ fontSize: 15, fontWeight: 700 }}>조인 조건</span></div>
              <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>두 데이터를 어떤 칼럼으로 연결할지 정해요. <b>기준 칼럼 = 추가 칼럼</b> 한 쌍이면 되고, 이름이 달라도 짝지을 수 있어요.</div>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginBottom: 6 }}>기준 · {names[0]}</div>
                    <KeyPicker value={joinLeft} options={WF_BASE} onChange={setJoinLeft} />
                  </div>
                  <span style={{ fontSize: 18, color: C.sub, fontWeight: 700, paddingBottom: 9 }}>=</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, color: C.faint, fontWeight: 600, marginBottom: 6 }}>추가 · {names[1]}</div>
                    <KeyPicker value={joinRight} options={WF_ADD} onChange={setJoinRight} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.borderSoft}` }}>
                  <span style={{ fontSize: 12.5, color: C.sub }}>매칭률</span>
                  <div style={{ flex: 1, height: 7, borderRadius: 999, background: C.track, overflow: "hidden", maxWidth: 320 }}><div style={{ width: `${matchRate}%`, height: "100%", background: rateColor(matchRate), borderRadius: 999 }} /></div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: rateColor(matchRate) }}>{matchRate}%</span>
                  {keyRecommended && <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: C.purple, background: "#EEF2FF", borderRadius: 5, padding: "2px 7px" }}><Icon.spark /> AI 추천</span>}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12.5, color: C.faint, marginBottom: 28, lineHeight: 1.5 }}><Icon.infoCircle width={13} height={13} /> <span><b>매칭률</b> = 두 데이터에서 이 키 값이 양쪽에 모두 존재해 연결되는 행의 비율. 낮을수록 매칭 안 되는 기준 행이 많아(추가 컬럼은 Null) 져요.</span></div>

              {/* 02 조인 방식 + 시각화 (합침) */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}><StepNum n="02" /><span style={{ fontSize: 15, fontWeight: 700 }}>조인 방식</span></div>
              <div style={{ fontSize: 13, color: C.sub, marginBottom: 14 }}>매칭 안 되는 행을 어떻게 처리할지 정해요. 선택하면 아래 미리보기에 결과 구조가 반영돼요.</div>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 30, background: "#fff" }}>
                <div style={{ display: "flex", gap: 10, padding: 16, borderBottom: `1px solid ${C.borderSoft}` }}>
                {[["left", "Left Join", "기준 전부 유지", false, true], ["inner", "Inner", "양쪽 매칭만", false, false], ["right", "Right", "추가 전부 유지", false, false], ["full", "Full Outer", "양쪽 전부", false, false]].map(([t, label, desc, soon, rec]) => {
                  const active = joinType === t;
                  return (
                    <div key={t} onClick={() => !soon && setJoinType(t)} style={{ flex: 1, border: `1.5px solid ${active ? C.blue : C.border}`, borderRadius: 12, padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: soon ? "default" : "pointer", opacity: soon ? 0.5 : 1, background: active ? "#F5F9FF" : "#fff", position: "relative" }}>
                      <VennIcon type={t} active={active} />
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: active ? "#185FA5" : C.text }}>{label}</div>
                        <div style={{ fontSize: 11, color: C.faint, marginTop: 1 }}>{desc}</div>
                      </div>
                      {soon && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9.5, fontWeight: 700, color: C.faint, background: "#F3F4F6", borderRadius: 4, padding: "1px 5px" }}>예정</span>}
                      {rec && <span style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center", gap: 3, fontSize: 9.5, fontWeight: 700, color: C.purple, background: "#EEF2FF", borderRadius: 4, padding: "2px 6px" }}><Icon.spark /> 추천</span>}
                    </div>
                  );
                })}
                </div>
                <div onClick={() => setPreviewOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", cursor: "pointer", background: previewOpen ? "#FAFAFB" : "#fff", borderBottom: previewOpen ? `1px solid ${C.borderSoft}` : "none" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14 }}>
                    <span style={{ display: "flex", color: C.faint, transform: previewOpen ? "none" : "rotate(-90deg)", transition: "transform .15s" }}><Icon.chevD /></span>
                    <span style={{ fontWeight: 700 }}>매칭 시각화 미리보기</span>
                  </span>
                  <span style={{ fontSize: 11.5, color: C.faint }}>*리셋 버튼을 눌러야 바뀐 값이 반영됩니다</span>
                </div>
                {previewOpen && (
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 3 }}>
                      <button onClick={(e) => { e.stopPropagation(); setPreviewBig((v) => !v); }} title={previewBig ? "좁게 보기" : "넓게 보기"} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.sub }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setPreviewBig(false); }} title="리셋 · 현재 설정 반영" style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    </div>
                    <div style={{ height: previewBig ? "72vh" : 380, display: "flex", transition: "height .2s ease" }}><WorkflowGraph names={names} isJoin={isJoin} afterRows={afterRows} /></div>
                  </div>
                )}
              </div>
            </div>
          ) : (
          <div style={{ flex: 1, minHeight: 0, display: "flex" }}>
          {/* LEFT — 매칭 시각화 그래프 (풀블리드) */}
          <div style={{ flex: 1.1, minWidth: 0, borderRight: `1px solid ${C.border}`, background: "#fff", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: `1px solid ${C.borderSoft}` }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>매칭 시각화 미리보기</span>
              <span style={{ fontSize: 11.5, color: C.faint }}>*업데이트를 눌러야 바뀐 값이 반영됩니다</span>
            </div>
            <div style={{ flex: 1, minHeight: 0, position: "relative", display: "flex" }}>
              <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 3 }}>
                <button onClick={() => setPreviewBig(true)} title="넓게 보기" style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.sub }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button title="업데이트 · 현재 설정 반영" style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: C.dark, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <WorkflowGraph names={names} isJoin={isJoin} afterRows={afterRows} />
            </div>
          </div>

          {/* RIGHT — 매칭(검토 + 자동) 풀블리드 스크롤 */}
          <div style={{ width: 600, flexShrink: 0, overflowY: "auto", background: "#fff" }}>
          {/* 검토 필요 (먼저) */}
          <div>
            <div onClick={() => setReviewOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#FAFAFB", borderBottom: `1px solid ${C.border}`, cursor: "pointer", position: "sticky", top: 0, zIndex: 2 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 14 }}>
                <span style={{ display: "flex", color: "#B45309" }}><Icon.warn width={16} height={16} /></span>
                <span style={{ fontWeight: 700 }}>검토 필요</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: C.sub }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>20건</span>
                <span style={{ display: "flex", color: C.faint, transform: reviewOpen ? "none" : "rotate(-90deg)", transition: "transform .15s" }}><Icon.chevD /></span>
              </span>
            </div>
            {reviewOpen && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 36px minmax(0,1fr)", padding: "11px 16px", fontSize: 12.5, color: C.faint, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Table 1 <span style={{ fontSize: 10, fontWeight: 700, color: C.sub, background: C.chipBg, borderRadius: 4, padding: "0 5px" }}>기준</span></span><span /><span>Table 2</span>
                </div>
                {REVIEW_ROWS.map((r, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 36px minmax(0,1fr)", alignItems: "start", padding: "14px 16px", borderBottom: i === REVIEW_ROWS.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, paddingTop: 9 }}><TypeIcon kind={r.lt} /> {r.left}</span>
                    <span style={{ color: C.faint, display: "flex", justifyContent: "center", paddingTop: 9, fontSize: 16 }}>→</span>
                    <div>
                      <MatchDropdown value={reviewSel[i]} onChange={(v) => setReviewSel((s) => s.map((x, idx) => (idx === i ? v : x)))} />
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12.5, color: reviewSel[i] === NO_MATCH ? C.yellowText : C.sub, marginTop: 8, lineHeight: 1.5 }}>
                        <span style={{ display: "flex", flexShrink: 0, marginTop: 1 }}><Icon.infoCircle width={13} height={13} /></span> {reviewSel[i] === NO_MATCH ? "매칭 칼럼이 없어 2번 데이터 행은 Null로 채워져요." : r.note}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* AI 자동 매칭 (다음) */}
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            <div onClick={() => setAutoOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "#F5F3FF", borderBottom: `1px solid ${C.borderSoft}`, cursor: "pointer", position: "sticky", top: 0, zIndex: 2 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <span style={{ color: C.purple, display: "flex" }}><Icon.spark /></span>
                <span style={{ fontWeight: 700, color: C.purple }}>AI 자동 매칭</span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8, color: C.purple }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>100건</span>
                <span style={{ display: "flex", transform: autoOpen ? "none" : "rotate(-90deg)", transition: "transform .15s" }}><Icon.chevD /></span>
              </span>
            </div>
            {autoOpen && (
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 36px minmax(0,1fr)", padding: "11px 16px", fontSize: 12.5, color: C.faint, fontWeight: 600, borderBottom: `1px solid ${C.borderSoft}` }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Table 1 <span style={{ fontSize: 10, fontWeight: 700, color: C.sub, background: C.chipBg, borderRadius: 4, padding: "0 5px" }}>기준</span></span><span /><span>Table 2</span>
              </div>
            )}
            {autoOpen && AUTO_ROWS.map((r, i) => {
              const dup = autoDupes.has(autoSel[i]);
              return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 36px minmax(0,1fr)", alignItems: "center", padding: "11px 16px", borderBottom: i === AUTO_ROWS.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14 }}><TypeIcon kind={r[1]} /> {r[0]}</span>
                <span style={{ color: C.faint, display: "flex", justifyContent: "center", fontSize: 16 }}>→</span>
                <div>
                  <MatchDropdown value={autoSel[i]} error={dup} onChange={(v) => setAutoSel((s) => s.map((x, idx) => (idx === i ? v : x)))} />
                  {dup && <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#DC2626", marginTop: 6 }}><Icon.infoCircle width={12} height={12} /> 중복된 칼럼이 있어요.</div>}
                </div>
              </div>
              );
            })}
          </div>
          </div>
          </div>
          )}

          </>
          )}
          </div>
        </div>
        )}
        </div>
      </div>

      {/* bottom bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 36px", borderTop: `1px solid ${C.border}`, background: "#FCFCFD" }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>총합</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.sub }}>행 <span style={{ ...pill, ...(over ? { color: "#DC2626", borderColor: "#FCA5A5" } : {}) }}>{ready ? afterRows.toLocaleString() : "0"}</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.sub }}>열 <span style={pill}>{ready ? "300" : "0"}</span></span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: C.sub }}>용량 <span style={pill}>{ready ? "3,000MB" : "0"}</span></span>
        {ready && (over ? (
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "5px 10px" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span> 행 수 한도 초과 · {afterRows.toLocaleString()} / 10,000행
          </span>
        ) : (
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.greenText, background: "#fff", border: "1px solid #BBF7D0", borderRadius: 8, padding: "5px 10px" }}>
            <Icon.checkCircle width={13} height={13} /> 한도 내 · 0.1MB / 100MB
          </span>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: over ? "#DC2626" : C.faint }}>{!hasContent ? "합칠 데이터를 2개 이상 선택해 주세요." : picking ? "데이터 선택을 먼저 완료해 주세요." : loading ? "칼럼을 매칭하고 있어요..." : over ? "한도를 초과해 병합할 수 없어요." : ""}</span>
        <button onClick={() => canRun && onRun(names)} disabled={!canRun} style={{ background: canRun ? C.dark : "#E5E7EB", color: canRun ? "#fff" : C.faint, border: "none", borderRadius: 10, padding: "13px 22px", fontSize: 14, fontWeight: 600, cursor: canRun ? "pointer" : "default", fontFamily: FONT }}>데이터 병합 실행하기</button>
      </div>

      {/* 데이터 워크플로우 캔버스 (#1 노드형 파이프라인) */}
      {relOpen && <WorkflowCanvas names={names} isJoin={isJoin} afterRows={afterRows} onClose={() => setRelOpen(false)} />}

      {/* 오류 토스트 */}
      {toast && (
        <div style={{ position: "absolute", bottom: 92, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 12, background: "#27272A", color: "#fff", borderRadius: 12, padding: "14px 18px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", zIndex: 30 }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: C.red, color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{toast}</span>
          <span onClick={() => setToast("")} style={{ cursor: "pointer", color: "#A1A1AA", display: "flex", marginLeft: 8 }}><Icon.x width={16} height={16} /></span>
        </div>
      )}
      {reselectOpen && (
        <ReselectModal
          initial={committed.length >= 2 ? committed : (picked.length ? picked : [0, 1])}
          title={hasContent ? "데이터 재선택" : "어떤 데이터를 결합할까요?"}
          confirmLabel={hasContent ? "적용" : "확인"}
          onClose={() => setReselectOpen(false)}
          onApply={(next) => { setPicked(next); setCommitted(next); setReselectOpen(false); }}
        />
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
  const [cnt, setCnt] = useState(8432);
  useEffect(() => {
    const id = setInterval(() => setCnt((c) => (c < 16864 ? Math.min(16864, c + 412) : 8432)), 110);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, alignSelf: "stretch", minHeight: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <span onClick={onLeave} style={{ cursor: "pointer", display: "flex", color: C.sub }}><Icon.back /></span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>{names.join(", ")}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, background: "#EFF4FF", color: C.blue, fontSize: 12.5, fontWeight: 600, borderRadius: 7, padding: "4px 9px" }}><Icon.union width={14} height={14} /> Union</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Union 중....</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.faint, fontSize: 14 }}>
          <span style={{ width: 16, height: 16, border: `2px solid ${C.border}`, borderTopColor: C.sub, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />
          두 데이터의 행을 이어붙이고 있어요 · <span style={{ fontVariantNumeric: "tabular-nums", color: C.greenText, fontWeight: 600 }}>{cnt.toLocaleString()}행</span>
        </div>
        {/* indeterminate progress */}
        <div style={{ width: 720, height: 4, borderRadius: 999, background: "#EEEFF1", overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: "40%", height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #86EFAC, #22C55E)", animation: "indet 1.3s ease-in-out infinite" }} />
        </div>
        <div style={{ width: 720, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: C.sub, background: "#FBFBFC", borderBottom: `1px solid ${C.borderSoft}` }}><Icon.db width={13} height={13} /> 기준 데이터</div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, padding: "15px 28px", borderBottom: `1px solid ${C.borderSoft}` }}>
              <div style={{ height: 11, borderRadius: 6, background: "#EEEFF1", width: `${50 + (i * 7) % 38}%` }} />
              <div style={{ height: 11, borderRadius: 6, background: "#EEEFF1", width: `${45 + (i * 11) % 42}%` }} />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", fontSize: 12, fontWeight: 600, color: C.greenText, background: C.greenBg, borderTop: `1px solid #DCFCE7`, borderBottom: `1px solid #DCFCE7` }}><Icon.plus width={13} height={13} /> 행 이어붙이는 중…</div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, padding: "15px 28px", borderBottom: i === 3 ? "none" : `1px solid ${C.borderSoft}`, borderLeft: `2px solid #BBF7D0`, animation: `rowIn 2.6s ease-in-out ${i * 0.22}s infinite` }}>
              <div style={{ height: 11, borderRadius: 6, background: "#DCFCE7", width: `${50 + (i * 9) % 38}%` }} />
              <div style={{ height: 11, borderRadius: 6, background: "#DCFCE7", width: `${45 + (i * 13) % 42}%` }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: C.sub, background: "#F4F4F5", borderRadius: 9, padding: "10px 16px", marginTop: 10 }}>
          <Icon.infoCircle width={14} height={14} /> 이 화면을 나가도 병합은 백그라운드에서 계속 진행돼요. 완료되면 목록에서 알려드릴게요.
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}@keyframes rowIn{0%{opacity:0;transform:translateY(10px)}18%{opacity:1;transform:none}82%{opacity:1;transform:none}100%{opacity:0;transform:translateY(10px)}}@keyframes indet{0%{transform:translateX(-110%)}100%{transform:translateX(310%)}}`}</style>
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
        <span style={{ fontSize: 18, fontWeight: 700 }}>AI 준비도</span>
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
          <div style={{ fontSize: 14, color: C.sub, margin: "8px 0 14px" }}>병합 전후의 AI 준비도 변화를 확인하세요.</div>
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
      <Title>AI 준비도 변화</Title>
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
        AI 준비도 변화 자세히 보기 <Icon.chevR width={14} height={14} />
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
          {view === "relation" ? (
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
              <WorkflowGraph names={names} isJoin={false} afterRows={16864} />
            </div>
          ) : (
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
          )}

          {/* view toggle – pinned to bottom of content area */}
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ display: "flex", gap: 4, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, padding: 5, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", pointerEvents: "auto" }}>
              <button onClick={() => setView("table")} style={tgl(view === "table")} title="표"><Icon.viewTable /></button>
              <button onClick={() => setView("columns")} style={tgl(view === "columns")} title="칼럼"><Icon.viewList /></button>
              <button onClick={() => setView("relation")} style={tgl(view === "relation")} title="관계 보기"><Icon.union width={16} height={16} /></button>
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

const VERSIONS = [
  { ts: "Mar 25, 10:05 AM", badge: "v2", current: true, title: "Released as v2", bullets: ["릴리즈 노트 내용 노출"], hash: null },
  { ts: "Mar 25, 10:03 AM", title: "Missing Value Treatment", bullets: ["N null values imputed — {컬럼명} N개, {컬럼명} N개"], hash: "a3f8c2d" },
  { ts: "Mar 25, 10:02 AM", title: "Outlier & Skew Correction", bullets: ["이상값 클리핑·로그 변환 — {컬럼명} N개"], hash: "b71e9f4" },
  { ts: "Mar 25, 10:01 AM", badge: "v1", title: "Initial upload", bullets: ["원본 데이터 업로드"], hash: "c4f8c2c" },
];
function VersionHistory({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,18,22,0.28)", zIndex: 200, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 380, maxWidth: "92vw", height: "100%", background: C.panel, borderLeft: `1px solid ${C.border}`, boxShadow: "-12px 0 40px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>Version History</span>
          <button onClick={onClose} style={{ display: "flex", background: "none", border: "none", cursor: "pointer", color: C.faint, padding: 2 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
          {VERSIONS.map((v, i) => (
            <div key={i} style={{ padding: "16px 22px", borderBottom: i === VERSIONS.length - 1 ? "none" : `1px solid ${C.borderSoft}`, background: v.current ? "#F5FAF6" : "transparent" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: C.sub }}>{v.ts}</span>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {v.current && <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, border: `1px solid ${C.blue}`, borderRadius: 20, padding: "1px 9px" }}>Current</span>}
                  {v.badge && <span style={{ fontSize: 12, fontWeight: 700, color: C.sub }}>{v.badge}</span>}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: v.bullets.length ? 6 : 0 }}>{v.title}</div>
              {v.bullets.map((b, j) => (<div key={j} style={{ display: "flex", gap: 7, fontSize: 12.5, color: C.sub, lineHeight: 1.5, marginBottom: 3 }}><span style={{ color: C.faint }}>·</span>{b}</div>))}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#34C77B", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>H</span>
                  <span style={{ fontSize: 12.5, color: C.sub }}>Hamilton</span>
                </span>
                {v.hash && <span style={{ fontSize: 11.5, fontFamily: "ui-monospace, monospace", color: C.faint }}>{v.hash}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function DetailHeader({ tab, setTab, onBack, onRefine, onHistory, onAsk }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15 }}>
          <span onClick={onBack} style={{ color: C.sub, cursor: "pointer" }}>Dataset</span>
          <span style={{ color: C.faint, display: "flex" }}><Icon.chevR width={14} height={14} /></span>
          <span style={{ fontWeight: 600 }}>Sample ._voc_data</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <AskAIBtn onClick={onAsk} />
          <button onClick={onHistory} style={btnGhost}>History</button><button style={btnGhost}>Share</button>
          <button style={{ ...btnGhost, background: C.dark, color: "#fff", border: "none" }}>Release</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px 0" }}>
        <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 10, padding: 4 }}>
          {["AI 준비도", "Detail"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT, background: tab === t ? C.panel : "transparent", color: tab === t ? C.text : C.sub, boxShadow: tab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>{t}</button>
          ))}
        </div>
        {tab === "AI 준비도" && <button onClick={onRefine} style={{ ...btnGhost, background: C.dark, color: "#fff", border: "none", fontWeight: 600 }}><Icon.spark /> Get AI-Ready</button>}
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
function MetricCard({ title, pct, desc, children }) {
  const color = pct >= 90 ? C.greenText : pct >= 40 ? C.yellowText : C.red;
  return (<div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, background: C.panel }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: desc ? 6 : 18 }}><span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 16, fontWeight: 700 }}>{title} <span style={{ color: C.faint, display: "flex" }}><Icon.infoCircle width={14} height={14} /></span></span><span style={{ fontSize: 16, fontWeight: 700, color }}>{pct}%</span></div>{desc && <div style={{ fontSize: 13, color: C.faint, marginBottom: 16, lineHeight: 1.55 }}>{desc}</div>}{children}</div>);
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
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}><span style={{ fontSize: 18, fontWeight: 700 }}>AI 준비도</span><span style={{ marginLeft: "auto", fontSize: 26, fontWeight: 800 }}>99%</span><span style={{ background: "#DCFCE7", color: C.greenText, fontSize: 12.5, fontWeight: 600, borderRadius: 7, padding: "4px 10px" }}>AI Ready</span></div>
          {SCORES.map(([label, pct]) => (<div key={label} style={{ display: "grid", gridTemplateColumns: "200px 1fr 52px", alignItems: "center", gap: 14, marginBottom: 12 }}><span style={{ fontSize: 14, color: "#374151" }}>{label}</span><Bar pct={pct} color={C.green} w="100%" /><span style={{ fontSize: 14, fontWeight: 600, textAlign: "right" }}>{pct}%</span></div>))}
          <div style={{ display: "flex", gap: 10, background: C.greenBg, border: "1px solid #BBF7D0", borderRadius: 12, padding: "14px 16px", marginTop: 22 }}><span style={{ display: "flex", flexShrink: 0 }}><Icon.checkCircle /></span><div><div style={{ fontSize: 14, fontWeight: 600, color: C.greenText }}>AI analysis results</div><div style={{ fontSize: 13.5, color: "#4B5563", marginTop: 4 }}>The AI Readiness of the data is generally good, but three items are critically low at just 10%.</div></div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><RadarChart /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 22 }}>
        <MetricCard title="Privacy" pct={100} desc="Logs of PII detection and protection handling status"><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>[감지된 민감 컬럼 수_받아올 값 by AI] N sensitive columns detected and processed.</div><KVTable highlight rows={[["Full Name", "칼럼명"], ["Phone Number", "칼럼명"], ["National ID", "칼럼명"], ["Passport Number", "칼럼명"], ["Email Address", "칼럼명"], ["Bank Account Number", "칼럼명"], ["Credit Card Number", "칼럼명"], ["Address", "칼럼명"]]} /></MetricCard>
        <MetricCard title="Integrity" pct={50} desc="Diagnostics covering missing values, duplicates, outliers, and skew"><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Data quality issues detected.</div><KVTable rows={[["Missing Values", "N cases"], ["Duplicate Records", "N cases"], ["Type Errors", "N cases"], ["Distribution Skew", "N cases"]]} /></MetricCard>
        <MetricCard title="Contextuality" pct={80} desc="Records of column semantics and alignment with analysis intent"><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>N columns lack descriptions.</div><KVTable rows={[["Column Description Coverage", "N%"], ["Columns Missing for Stated Intent", "N cases"]]} /></MetricCard>
        <MetricCard title="Conciseness" pct={99} desc="Column contribution and noise diagnostics relative to stated intent"><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Low-signal columns detected.</div><KVTable rows={[["Low-Contribution Columns", "N cases"], ["High-Cardinality Columns", "N cases"], ["Redundant Text Fields", "N cases"]]} /></MetricCard>
        <MetricCard title="Operational Reliability" pct={100}><div style={{ fontSize: 12.5, color: C.faint, marginTop: -8, marginBottom: 16 }}>*Automatically fulfilled by SynTitan — no action required</div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Your dataset is being managed in a reliable and consistent state.</div><Chips title="Platform-Provided Features" items={["Preprocessing Result Validation", "AI Readiness Achievement Tracking", "Standard Consistency"]} /></MetricCard>
        <MetricCard title="Traceability" pct={100}><div style={{ fontSize: 12.5, color: C.faint, marginTop: -8, marginBottom: 16 }}>*Automatically fulfilled by SynTitan — no action required</div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>All changes are being recorded and are fully traceable.</div><Chips title="Platform-Provided Features" items={["Auto Snapshot Generation", "Release Version Labeling", "Author & Timestamp Logging"]} /></MetricCard>
      </div>
    </div>
  );
}
const REFINE_MODULES = [
  { rec: true, on: false, title: "민감 데이터 탐지 및 마스킹", status: "감지된 민감 데이터가 없습니다.", how: ["민감 데이터를 식별 불가능한 데이터로 대체합니다.", "커스텀 필터: 민감 데이터 유형을 직접 지정할 수 있습니다. (출시 예정)"], meta: "PII 감지·마스킹 처리 및 변경 이력 기록" },
  { rec: false, on: false, title: "결측값 처리", status: "AI 추천 항목이 없습니다.", how: ["의미 있는 결측 패턴은 신호로 보존하고, 나머지 결측값은 통계적 방법으로 채웁니다. AI가 데이터에 맞는 처리 방식을 자동으로 결정합니다."], meta: "컬럼별 결측 처리 결과 및 보정 이력 기록" },
  { rec: false, on: false, title: "이상값·분포·범주 정제", status: "AI 추천 항목이 없습니다.", how: ["이상값 제거: 정상 범위를 벗어난 값을 잘라냅니다.", "분포 안정화: 심하게 왜곡된 컬럼을 변환합니다.", "희소 범주 통합: 빈도가 낮은 범주를 \"기타\"로 묶습니다.", "수치 범위가 크게 차이 나는 컬럼을 정규화합니다."], meta: "정제 전후 분포 상태 변화 및 처리 이력 기록" },
  { rec: true, on: true, title: "저신호 컬럼 제거", status: "기여도·신뢰도가 낮은 컬럼이 감지되었습니다.", how: ["중요도가 낮은 컬럼을 선별적으로 제거합니다.", "예측 결과를 오염시킬 수 있는 컬럼을 제거합니다."], meta: "컬럼별 중요도 판정 결과 및 제거 이력 기록" },
  { rec: false, on: false, title: "행 증강 및 클래스 밸런싱", status: "AI 추천 항목이 없습니다.", how: ["소수 클래스를 보강하는 합성 샘플을 생성합니다.", "다수 클래스의 비율을 줄입니다."], meta: "증강 전후 클래스 분포 및 행 수 변화 기록" },
  { rec: true, on: true, title: "피처 파생 및 증강", status: "범주형 컬럼에서 추가 신호를 도출할 수 있습니다.", how: ["구간화와 범주화로 새 컬럼을 만듭니다.", "컬럼 간 연산으로 복합 신호를 추가합니다."], meta: "파생 컬럼 목록·원본 컬럼 관계 및 생성 이력 기록" },
];
function RefineToggle({ on, onChange }) {
  return (<button onClick={onChange} style={{ width: 44, height: 26, borderRadius: 999, border: "none", cursor: "pointer", background: on ? "#3182F6" : "#D1D5DB", position: "relative", flexShrink: 0, transition: "background .15s", padding: 0 }}><span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} /></button>);
}
function RefineCard({ mod }) {
  const [on, setOn] = useState(mod.on);
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px 24px" }}>
      {mod.rec && <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: C.purple, marginBottom: 8 }}><Icon.spark width={13} height={13} /> AI 추천</div>}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div><div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{mod.title}</div><div style={{ fontSize: 13.5, color: C.sub }}>{mod.status}</div></div>
        <RefineToggle on={on} onChange={() => setOn(!on)} />
      </div>
      <div style={{ borderTop: `1px solid ${C.borderSoft}`, margin: "16px 0 14px" }} />
      <div style={{ fontSize: 12.5, color: C.faint, marginBottom: 10 }}>작동 방식</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {mod.how.map((h, i) => (<div key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, color: C.sub, lineHeight: 1.5 }}><span style={{ display: "flex", flexShrink: 0, color: C.faint, marginTop: 2 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>{h}</div>))}
      </div>
      <div style={{ borderTop: `1px solid ${C.borderSoft}`, marginTop: 16, paddingTop: 14, display: "flex", alignItems: "flex-start", gap: 9 }}>
        <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: "#0F6E56", background: "#E1F5EE", borderRadius: 7, padding: "4px 9px" }}>보완 메타데이터</span>
        <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{mod.meta}</span>
      </div>
    </div>
  );
}
function RefinePage({ onBack }) {
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: C.bg }}>
      <div style={{ padding: "16px 32px", display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <span onClick={onBack} style={{ display: "flex", color: C.sub, cursor: "pointer" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Sample ._voc_data (1).csv</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: C.faint }}>*30분 미사용 시 자동 종료</span>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 32px 60px" }}>
        <div style={{ background: C.dark, borderRadius: 16, padding: "20px 24px", color: "#fff", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "flex", width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.spark width={20} height={20} /></span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 17, fontWeight: 700 }}>데이터 품질 정제</div><div style={{ fontSize: 13.5, color: "#C9CACE", marginTop: 2 }}>AI 추천 전처리 단계를 적용해 데이터 품질을 개선하세요.</div></div>
            <button style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT, color: C.text, background: "#fff", border: "none", borderRadius: 10, padding: "10px 22px", cursor: "pointer" }}>다음</button>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9, background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 14px", marginTop: 16 }}>
            <span style={{ display: "flex", flexShrink: 0, color: "#9CA3AF", marginTop: 1 }}><Icon.db width={15} height={15} /></span>
            <div style={{ flex: 1, fontSize: 13.5, color: "#fff", lineHeight: 1.55 }}>정제 과정에서 데이터 품질 상태, 처리 결과, 변경 이력 등 AI 활용에 필요한 <b>메타 데이터</b>가 보완됩니다.</div>
            <span title="메타 데이터는 AI가 데이터의 상태와 처리 과정을 이해하고, 이후 Release 및 Agent 분석 결과를 재현할 수 있도록 돕는 기준 정보입니다." style={{ display: "flex", flexShrink: 0, color: "#9CA3AF", cursor: "help" }}><Icon.infoCircle width={15} height={15} /></span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}><RefineCard mod={REFINE_MODULES[0]} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
          {REFINE_MODULES.slice(1).map((m, i) => <RefineCard key={i} mod={m} />)}
        </div>
      </div>
    </div>
  );
}
/* =========================================================
 *  AI 성능 워크벤치 — Proof (정제 효과 입증)
 * ========================================================= */
const WB_BLUE = "#2F6FED", WB_BLUE_BG = "#EAF1FF";
function WbSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 16, position: "relative" }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 7 }}>{label}</div>
      <div onClick={() => setOpen((o) => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${open ? WB_BLUE : "#EFF1F4"}`, borderRadius: 12, padding: "13px 15px", fontSize: 14, fontWeight: 600, background: open ? "#fff" : "#F5F6F8", cursor: "pointer", color: C.text }}>{value}<span style={{ color: C.faint, display: "flex", transition: "transform .15s", transform: open ? "rotate(180deg)" : "none" }}><Icon.chevD /></span></div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 19 }} />
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 12px 32px rgba(0,0,0,0.14)", zIndex: 20, overflow: "hidden", maxHeight: 240, overflowY: "auto" }}>
            {options.map((o) => (
              <div key={o} onClick={() => { onChange && onChange(o); setOpen(false); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", fontSize: 13.5, cursor: "pointer", background: o === value ? WB_BLUE_BG : "transparent", color: o === value ? WB_BLUE : C.text, fontWeight: o === value ? 600 : 400 }}
                onMouseEnter={(e) => { if (o !== value) e.currentTarget.style.background = "#F7F7F8"; }} onMouseLeave={(e) => { if (o !== value) e.currentTarget.style.background = "transparent"; }}>
                {o}{o === value && <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
function WbResultCard({ tag, title, rows, accent }) {
  return (
    <div style={{ flex: 1, minWidth: 0, border: `1px solid ${accent ? C.purple : C.border}`, borderRadius: 12, padding: 16, background: accent ? "#FAF9FF" : C.panel }}>
      <div style={{ fontSize: 12, color: accent ? C.purple : C.faint, fontWeight: 600, marginBottom: 4 }}>{tag}</div>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      {rows.map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "7px 0", borderTop: `1px solid ${C.borderSoft}` }}><span style={{ color: C.sub }}>{k}</span><span style={{ fontWeight: 700 }}>{v}</span></div>)}
    </div>
  );
}

/* 이상탐지 점수 분포 (density) — 정제 전/후 */
const AN_NORMAL_A = [3, 12, 40, 110, 170, 180, 140, 80, 40, 18, 8, 4, 2, 1, 0, 0, 0, 0, 0, 0];
const AN_NORMAL_B = [2, 8, 25, 70, 120, 150, 140, 110, 80, 50, 30, 18, 10, 6, 3, 2, 1, 0, 0, 0];
const AN_ANOM_A = [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 5, 7, 9, 8, 5, 3, 1, 0, 0];
const AN_ANOM_B = [0, 0, 0, 1, 2, 3, 5, 7, 8, 8, 7, 5, 3, 2, 1, 1, 0, 0, 0, 0];
function anAP(normal, anom) { // Average Precision ≈ PR-AUC (점수 높은 bin부터 스윕)
  const totalA = anom.reduce((a, b) => a + b, 0);
  let TP = 0, FP = 0, ap = 0, prevR = 0;
  for (let i = normal.length - 1; i >= 0; i--) {
    TP += anom[i]; FP += normal[i];
    const r = totalA ? TP / totalA : 0;
    const p = TP + FP ? TP / (TP + FP) : 0;
    ap += (r - prevR) * p; prevR = r;
  }
  return ap;
}
function anPrecAtK(normal, anom, k) { // 상위 k건 중 실제 이상 비율
  let cum = 0, cumA = 0;
  for (let i = normal.length - 1; i >= 0; i--) {
    const tot = normal[i] + anom[i];
    if (cum + tot >= k) { const frac = tot ? (k - cum) / tot : 0; cumA += anom[i] * frac; cum = k; break; }
    cum += tot; cumA += anom[i];
  }
  return cum ? cumA / cum : 0;
}
function anStats(t, normal, anom) {
  let TP = 0, FP = 0, FN = 0, TN = 0;
  for (let i = 0; i < normal.length; i++) {
    const s = i * 5 + 2.5;
    if (s >= t) { FP += normal[i]; TP += anom[i]; } else { TN += normal[i]; FN += anom[i]; }
  }
  const precision = TP + FP ? TP / (TP + FP) : 0;
  const recall = TP + FN ? TP / (TP + FN) : 0;
  return { TP, FP, FN, TN, precision, recall, alerts: TP + FP };
}
function AnomalyResults({ before, after }) {
  const [t, setT] = useState(52);
  const [view, setView] = useState("after"); // before | after — 모든 패널 동기 전환
  const normal = view === "after" ? AN_NORMAL_A : AN_NORMAL_B;
  const anom = view === "after" ? AN_ANOM_A : AN_ANOM_B;
  const maxN = Math.max(...normal), maxA = Math.max(...anom);
  const s = anStats(t, normal, anom);
  // 타일 = 현재 임계값 기준 정제 후 vs 전 (분포에서 도출 → 슬라이더와 일관)
  const aff = anStats(t, AN_NORMAL_A, AN_ANOM_A), bef = anStats(t, AN_NORMAL_B, AN_ANOM_B);
  const f1 = (x) => (x.precision + x.recall ? 2 * x.precision * x.recall / (x.precision + x.recall) : 0);
  const praA = anAP(AN_NORMAL_A, AN_ANOM_A), praB = anAP(AN_NORMAL_B, AN_ANOM_B);
  const pkA = anPrecAtK(AN_NORMAL_A, AN_ANOM_A, 100), pkB = anPrecAtK(AN_NORMAL_B, AN_ANOM_B, 100);
  const pct = (x) => Math.round(x * 100) + "%";
  const dpp = (a, b) => { const d = Math.round((a - b) * 100); return (d >= 0 ? "+" : "−") + Math.abs(d) + "%p"; };
  const d2 = (a, b) => { const d = a - b; return (d >= 0 ? "+" : "−") + Math.abs(d).toFixed(2); };
  const tiles = [
    { k: "재현율", v: pct(aff.recall), d: dpp(aff.recall, bef.recall), good: aff.recall >= bef.recall, sub: `정제 전 ${pct(bef.recall)}` },
    { k: "정밀도", v: pct(aff.precision), d: dpp(aff.precision, bef.precision), good: aff.precision >= bef.precision, sub: `정제 전 ${pct(bef.precision)}` },
    { k: "F1", v: f1(aff).toFixed(2), d: d2(f1(aff), f1(bef)), good: f1(aff) >= f1(bef), sub: `정제 전 ${f1(bef).toFixed(2)}` },
    { k: "PR-AUC", v: praA.toFixed(2), d: d2(praA, praB), good: praA >= praB, sub: `정제 전 ${praB.toFixed(2)}` },
    { k: "Precision@100", v: pkA.toFixed(2), d: d2(pkA, pkB), good: pkA >= pkB, sub: `정제 전 ${pkB.toFixed(2)}` },
    { k: "알림/일", v: `${aff.alerts}건`, d: `${aff.alerts - bef.alerts >= 0 ? "+" : "−"}${Math.abs(aff.alerts - bef.alerts)}건`, good: aff.alerts <= bef.alerts, sub: `정제 전 ${bef.alerts}건` },
  ];
  const divider = { borderTop: `1px solid ${C.borderSoft}`, margin: "22px 0" };
  const secTitle = { fontSize: 13, fontWeight: 700, color: C.sub, marginBottom: 14 };
  return (
    <div>
      {/* 헤더 + 전/후 토글 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div><div style={{ fontSize: 15, fontWeight: 700 }}>시뮬레이션 결과</div><div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>{before} → {after} · 모델 동일, 데이터만 변경</div></div>
        <div style={{ display: "inline-flex", background: "#F2F4F6", borderRadius: 11, padding: 4 }}>
          {[["before", "정제 전"], ["after", "정제 후"]].map(([k, lab]) => (
            <button key={k} onClick={() => setView(k)} style={{ border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: view === k ? "#fff" : "transparent", color: view === k ? C.text : C.sub, boxShadow: view === k ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>{lab}</button>
          ))}
        </div>
      </div>
      {/* 지표 6종 — 구분선 그리드 (박스 없음) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {tiles.map((m, i) => (
          <div key={m.k} style={{ padding: `${i >= 3 ? 16 : 0}px 18px ${i < 3 ? 16 : 0}px`, borderLeft: i % 3 === 0 ? "none" : `1px solid ${C.borderSoft}`, borderTop: i >= 3 ? `1px solid ${C.borderSoft}` : "none" }}>
            <div style={{ fontSize: 12, color: C.sub, marginBottom: 6 }}>{m.k}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>{m.v}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: m.good ? "#16A34A" : "#E5484D" }}>{m.d.startsWith("+") ? "▲" : "▼"} {m.d.replace(/^[+−]/, "")}</span>
            </div>
            <div style={{ fontSize: 11.5, color: C.faint, marginTop: 3 }}>{m.sub}</div>
          </div>
        ))}
      </div>
      <div style={divider} />
      {/* 점수 분리도 + 임계값 슬라이더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={secTitle}>이상 점수 분리도</div>
        <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.sub }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: "#CBD5E1" }} /> 정상</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: "#EF4444" }} /> 이상</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 150, display: "flex", alignItems: "flex-end", gap: 2 }}>
        {normal.map((_, i) => (
          <div key={i} style={{ position: "relative", flex: 1, height: "100%" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(normal[i] / maxN) * 100}%`, background: "#CBD5E1", opacity: 0.6, borderRadius: "2px 2px 0 0" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(anom[i] / maxA) * 100}%`, background: "#EF4444", opacity: 0.72, borderRadius: "2px 2px 0 0" }} />
          </div>
        ))}
        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${t}%`, right: 0, background: "rgba(47,111,237,0.07)", borderLeft: `2px solid ${WB_BLUE}` }} />
        <div style={{ position: "absolute", top: -6, left: `${t}%`, transform: "translateX(-50%)", fontSize: 10.5, fontWeight: 700, color: WB_BLUE, background: WB_BLUE_BG, borderRadius: 5, padding: "1px 6px", whiteSpace: "nowrap" }}>임계값 {t}</div>
      </div>
      <input type="range" min="0" max="100" value={t} onChange={(e) => setT(+e.target.value)} style={{ width: "100%", marginTop: 12, accentColor: WB_BLUE }} />
      <div style={{ display: "flex", marginTop: 14 }}>
        {[["정밀도", `${Math.round(s.precision * 100)}%`], ["재현율", `${Math.round(s.recall * 100)}%`], ["알림/일", `${s.alerts}건`]].map(([k, v], i) => (
          <div key={k} style={{ flex: 1, textAlign: "center", borderLeft: i ? `1px solid ${C.borderSoft}` : "none" }}><div style={{ fontSize: 11.5, color: C.faint, marginBottom: 4 }}>{k}</div><div style={{ fontSize: 18, fontWeight: 800 }}>{v}</div></div>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: C.faint, marginTop: 12, lineHeight: 1.5 }}>임계값을 움직여 정밀도↔재현율, 하루 알림량의 트레이드오프를 확인하세요. 정제로 정상/이상 분포가 벌어져 같은 알림량에서 더 많이 잡고 거짓 경보는 줄어요. <b>{view === "after" ? "정제 후" : "정제 전"}</b> 분포 기준.</div>
      <div style={divider} />
      {/* 혼동행렬 — 인라인 4칸 (박스 없음) */}
      <div style={secTitle}>혼동행렬 <span style={{ fontSize: 11.5, fontWeight: 400, color: C.faint }}>· 임계값 {t} 기준</span></div>
      <div style={{ display: "flex" }}>
        {[["실제 이상 · 잡음 (TP)", s.TP, true], ["놓침 (FN)", s.FN], ["거짓 경보 (FP)", s.FP], ["정상 통과 (TN)", s.TN]].map(([label, v, accent], i) => (
          <div key={label} style={{ flex: 1, textAlign: "center", padding: "2px 8px", borderLeft: i ? `1px solid ${C.borderSoft}` : "none" }}>
            <div style={{ fontSize: 11, color: C.faint, marginBottom: 5, lineHeight: 1.35 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: accent ? WB_BLUE : C.text }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
const VER_OPTS = VERSIONS.map((v) => `${v.badge ? v.badge + " · " : ""}${v.title}`);
function PerfWorkbench() {
  const cardBox = { background: "#fff", border: "1px solid #EFF1F4", borderRadius: 20, padding: 26, boxShadow: "0 1px 3px rgba(17,24,39,0.04)" };
  const [ran, setRan] = useState(false);
  const [model, setModel] = useState("XGBoost · 지도학습");
  const [task, setTask] = useState("이상탐지 (Anomaly Detection)");
  const [metric, setMetric] = useState("고정 정밀도에서의 재현율 · PR-AUC");
  const [before, setBefore] = useState(VER_OPTS[VER_OPTS.length - 1]);
  const [after, setAfter] = useState(VER_OPTS[0]);
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: C.bg }}>
      <div style={{ padding: "32px 40px 60px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em", color: WB_BLUE, textTransform: "uppercase" }}>Proof run</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>모델 성능 평가 미리보기</div>
        <div style={{ fontSize: 14, color: C.sub, marginTop: 8, lineHeight: 1.55, marginBottom: 28 }}>버전 히스토리에서 정제 전·후를 골라 기준 모델에 넣고, AI 준비의 예상 효과를 미리 확인합니다. 표시 수치는 기준 추정치이며, 실제 영향은 자체 모델로 검증해 보세요.</div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 400px) 1fr", gap: 24, alignItems: "start" }}>
          <div style={cardBox}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>미리 보기 설정</div>
            <WbSelect label="검증 모델" value={model} onChange={setModel} options={["XGBoost · 지도학습", "Isolation Forest · 비지도", "LOF · 비지도", "AutoEncoder · 비지도", "내 모델 (MCP 연결)"]} />
            <WbSelect label="작업 유형" value={task} onChange={setTask} options={["이상탐지 (Anomaly Detection)", "이진 분류 (Classification)", "회귀 (Regression)"]} />
            <WbSelect label="목표 지표" value={metric} onChange={setMetric} options={["고정 정밀도에서의 재현율 · PR-AUC", "PR-AUC", "ROC-AUC", "F1 점수", "Precision@k", "오탐률 (FPR)"]} />
            <div style={{ borderTop: `1px solid ${C.borderSoft}`, margin: "6px 0 16px" }} />
            <div style={{ fontSize: 12.5, fontWeight: 700, color: C.sub, marginBottom: 10 }}>비교할 데이터 · 버전 히스토리에서 선택</div>
            <WbSelect label="정제 전 (기준)" value={before} onChange={setBefore} options={VER_OPTS} />
            <WbSelect label="정제 후 (비교)" value={after} onChange={setAfter} options={VER_OPTS} />
            <button onClick={() => setRan(true)} style={{ width: "100%", marginTop: 4, padding: "12px 0", borderRadius: 11, border: "none", background: C.dark, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>시뮬레이션 실행</button>
            <div style={{ fontSize: 12, color: C.faint, textAlign: "center", marginTop: 14, lineHeight: 1.55 }}>이상탐지 데이터가 없으신가요?<br /><span style={{ color: WB_BLUE, fontWeight: 600, cursor: "pointer" }}>이상탐지 샘플 데이터로 시작 →</span></div>
          </div>
          {ran ? (
            <div style={cardBox}><AnomalyResults before={before} after={after} /></div>
          ) : (
            <div style={{ ...cardBox, minHeight: 392, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 14 }}>
              <span style={{ width: 52, height: 52, borderRadius: 14, background: WB_BLUE_BG, color: WB_BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.trend width={24} height={24} /></span>
              <div style={{ fontSize: 15, fontWeight: 700 }}>전 · 후 버전을 선택하고 실행하세요</div>
              <div style={{ fontSize: 13, color: C.faint, lineHeight: 1.6, maxWidth: 380 }}>왼쪽에서 비교할 정제 전·후 버전을 고른 뒤 <b>시뮬레이션 실행</b>을 누르면, 기준 모델 기준 예상 효과가 여기에 표시됩니다.</div>
            </div>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <div style={{ fontSize: 13, color: C.faint, lineHeight: 1.55 }}>표시 수치는 <b>기준 추정치</b>입니다. 실제 영향은 자체 모델·데이터로 검증해 보시기 바랍니다.</div>
        </div>
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
// 컬럼 레벨 메타데이터 — 메타데이터가 "붙는" 곳 (Databricks Unity Catalog 스타일)
const TAG_C = { id: ["#EAF1FF", "#1D4ED8"], pii: ["#FEE2E2", "#B91C1C"], warn: ["#FEF3C7", "#B45309"], low: ["#F1F3F5", "#6B7280"], target: ["#F3F0FC", "#6A54D8"] };
const COL_META = [
  { icon: <Icon.key />, name: "customer_id", type: "String", desc: "고객을 구분하는 고유 식별자", tags: [["식별자", "id"]], mask: "해시", nullp: "0%", uniq: "100%" },
  { icon: <Icon.typeA />, name: "customer_name", type: "String", desc: "고객 이름 (개인정보)", tags: [["민감 · PII", "pii"]], mask: "부분 마스킹", nullp: "0%", uniq: "98%" },
  { icon: <Icon.clock />, name: "time_zone", type: "Category", desc: "고객 접속 타임존", tags: [], mask: "—", nullp: "2%", uniq: "24" },
  { icon: <Icon.hash />, name: "company_size", type: "Category", desc: "회사 규모 구간 · 일부 값 형식 오류", tags: [["품질 이슈", "warn"]], mask: "—", nullp: "5%", uniq: "6" },
  { icon: <Icon.typeA />, name: "device_os", type: "Category", desc: "접속 기기 운영체제", tags: [], mask: "—", nullp: "0%", uniq: "4" },
  { icon: <Icon.calendar />, name: "signup_date", type: "Date", desc: "서비스 가입일", tags: [], mask: "—", nullp: "0%", uniq: "—" },
  { icon: <Icon.hash />, name: "avg_session_min", type: "Float", desc: "평균 세션 길이(분)", tags: [], mask: "—", nullp: "8%", uniq: "—" },
  { icon: <Icon.hash />, name: "purchase_count", type: "Int", desc: "누적 구매 횟수 · 타겟 기여 낮음", tags: [["저기여", "low"]], mask: "—", nullp: "0%", uniq: "—" },
];

const DEID_PREFIX = ["이름", "지역", "규모", "기기", "가입", "세션", "구매"];
const SYNTH_NAMES = ["김민아", "이서준", "박지후", "최유나", "정하람", "윤도경", "장세윤", "한지안", "오세훈", "임가온", "서라온", "노하율"];
const SYNTH_SIZES = ["320-800", "900-1,500", "2,000-4,000", "6,000-9,000", "12,000-20,000"];
const SYNTH_OS = ["iOS", "Web", "Android"];
function DetailTab() {
  const [view, setView] = useState("schema"); // schema(컬럼 메타데이터) | data(행 미리보기)
  const [dataView, setDataView] = useState("graph"); // graph(스켈레톤·그래프형) | plain(스켈레톤·막대형) | real
  const [editing, setEditing] = useState(false); // 편집 모드
  const [sel, setSel] = useState({}); // { 컬럼index: "deid" | "synth" }
  const cols = [
    { icon: <Icon.key />, name: "customer_id", special: "unique" },
    { icon: <Icon.clock />, name: "time_zone", hist: H1, axis: ["UTC+01:00", "UTC+23:59"] },
    { icon: <Icon.hash />, name: "company_size", hist: H2, axis: ["0", "10,000"] },
    { icon: <Icon.typeA />, name: "device_os", dist: true },
    { icon: <Icon.calendar />, name: "signup_date", hist: H3, axis: ["2024", "2026"] },
    { icon: <Icon.hash />, name: "avg_session_min", hist: H4, axis: ["0", "1000"] },
    { icon: <Icon.hash />, name: "purchase_count", hist: H1, axis: ["1", "10"] },
  ];
  const cellD = (error, first, last) => ({ padding: "11px 14px", borderRight: last ? "none" : `1px solid ${C.borderSoft}`, background: error ? "#FEE2E2" : "transparent", color: error ? "#B91C1C" : first ? C.sub : C.text });
  const GRID = "1.6fr 0.8fr 2fr 1.3fr 1fr";

  // ── 편집 모드: 원본 행 값 + 비식별/합성 변환 ──
  const rowVal = (ci, r) => [D_NAMES[r], "UTC+12:00", D_SIZES[r], "Android", "2026.11.12", D_SESS[r], D_SESS[r]][ci];
  const distinct = useMemo(() => cols.map((_, ci) => { const m = {}; let n = 0; for (let r = 0; r < D_NAMES.length; r++) { const v = rowVal(ci, r); if (!(v in m)) m[v] = n++; } return m; }), []);
  const tf = (ci, r) => {
    const mode = sel[ci], v = rowVal(ci, r);
    if (!editing || !mode) return v;
    const di = distinct[ci][v] ?? 0;
    if (mode === "deid") return `${DEID_PREFIX[ci] || "값"} ${String.fromCharCode(65 + (di % 26))}`;
    switch (ci) {
      case 0: return SYNTH_NAMES[di % SYNTH_NAMES.length];
      case 1: return "UTC+09:00";
      case 2: return SYNTH_SIZES[di % SYNTH_SIZES.length];
      case 3: return SYNTH_OS[r % 3];
      case 4: return `2025.${String((r % 12) + 1).padStart(2, "0")}.${String((r % 27) + 1).padStart(2, "0")}`;
      default: return (parseFloat(v) + (r % 5) * 0.4).toFixed(1);
    }
  };
  const selCount = Object.keys(sel).length;
  const allOn = selCount === cols.length;
  const toggleCol = (ci) => setSel((s) => { const n = { ...s }; if (n[ci]) delete n[ci]; else n[ci] = "deid"; return n; });
  const setMode = (ci, m) => setSel((s) => ({ ...s, [ci]: m }));
  const toggleAll = () => setSel(allOn ? {} : Object.fromEntries(cols.map((_, i) => [i, "deid"])));
  const setAllMode = (m) => setSel((s) => Object.fromEntries(Object.keys(s).map((k) => [k, m])));
  const startEdit = () => { setDataView("real"); setEditing(true); };
  const cancelEdit = () => { setEditing(false); setSel({}); };

  return (
    <div style={{ padding: "20px 32px 60px" }}>
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, background: C.panel, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontSize: 18, fontWeight: 700 }}>Sample ._voc_data.csvta.csv <span style={{ color: C.faint, fontWeight: 500, fontSize: 15 }}>(99.8MB)</span></div><button style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: C.panel, color: C.sub, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.download /></button></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>{["Snapshot - 238fkj", "247 columns · 47 rows", "Updated Mar 25, 10:01 AM"].map((t) => <span key={t} style={{ fontSize: 13, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px" }}>{t}</span>)}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
            <div style={{ display: "inline-flex", background: "#F2F4F6", borderRadius: 11, padding: 4 }}>
              {[["schema", "스키마 · 247컬럼"], ["data", "데이터 미리보기"]].map(([k, lab]) => (
                <button key={k} onClick={() => setView(k)} style={{ border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT, background: view === k ? "#fff" : "transparent", color: view === k ? C.text : C.sub, boxShadow: view === k ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>{lab}</button>
              ))}
            </div>
            {view === "schema"
              ? <button style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: C.purple, background: "#F3F0FC", border: "none", borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontFamily: FONT }}><Icon.spark /> AI가 설명·태그 생성</button>
              : <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}>15 Columns <Icon.chevD /></span>}
          </div>
        </div>
        {view === "schema" ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: GRID, padding: "11px 24px", background: "#FCFCFD", borderBottom: `1px solid ${C.border}`, fontSize: 12.5, fontWeight: 600, color: C.faint }}>
              <span>컬럼</span><span>타입</span><span>설명</span><span>태그</span><span>컬럼 마스킹</span>
            </div>
            {COL_META.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: GRID, padding: "13px 24px", borderBottom: i === COL_META.length - 1 ? "none" : `1px solid ${C.borderSoft}`, fontSize: 13.5, alignItems: "center" }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}><span style={{ color: C.faint, display: "flex" }}>{m.icon}</span>{m.name}</span>
                  <span style={{ fontSize: 11, color: C.faint, marginLeft: 24 }}>결측 {m.nullp} · 고유 {m.uniq}</span>
                </span>
                <span style={{ color: C.sub, fontSize: 12.5 }}>{m.type}</span>
                <span style={{ color: C.sub, fontSize: 13, lineHeight: 1.45 }}>{m.desc}</span>
                <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{m.tags.length ? m.tags.map(([lab, k]) => (<span key={lab} style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: TAG_C[k][0], color: TAG_C[k][1] }}>{lab}</span>)) : <span style={{ color: C.faint }}>—</span>}</span>
                <span style={{ fontSize: 12.5, color: m.mask === "—" ? C.faint : C.text, fontWeight: m.mask === "—" ? 400 : 600 }}>{m.mask}</span>
              </div>
            ))}
          </div>
        ) : (
        <div>
          {editing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 24px", borderBottom: `1px solid ${C.border}`, background: "#F7F5FE" }}>
              <span onClick={toggleAll} style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, fontWeight: 600, color: C.text }}>
                <span style={{ width: 17, height: 17, borderRadius: 5, border: `1.5px solid ${allOn ? C.purple : C.border}`, background: allOn ? C.purple : "#fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{allOn && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>
                전체 컬럼 선택
              </span>
              <span style={{ fontSize: 12.5, color: C.faint }}>컬럼을 골라 <b style={{ color: C.purple, fontWeight: 600 }}>비식별화</b>하거나 <b style={{ color: "#1D9E75", fontWeight: 600 }}>합성 데이터</b>로 바꿔요.</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button onClick={cancelEdit} style={{ border: `1px solid ${C.border}`, background: "#fff", color: C.sub, borderRadius: 9, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>취소</button>
                <button onClick={cancelEdit} disabled={selCount === 0} style={{ border: "none", background: selCount ? C.dark : "#E5E7EB", color: selCount ? "#fff" : C.faint, borderRadius: 9, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: selCount ? "pointer" : "default", fontFamily: FONT }}>적용 완료</button>
              </div>
            </div>
          ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderBottom: `1px solid ${C.border}`, background: "#FCFCFD" }}>
            {[["graph", "스켈레톤 · 그래프형"], ["plain", "스켈레톤 · 막대형"], ["real", "실제 데이터"]].map(([k, lab]) => (
              <button key={k} onClick={() => setDataView(k)} style={{ border: `1px solid ${dataView === k ? WB_BLUE : C.border}`, background: dataView === k ? WB_BLUE_BG : "#fff", color: dataView === k ? WB_BLUE : C.sub, borderRadius: 8, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>{lab}</button>
            ))}
            <button onClick={startEdit} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, border: `1px solid ${C.purple}`, background: "#F3F0FC", color: C.purple, borderRadius: 8, padding: "6px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}><Icon.spark width={14} height={14} /> 컬럼 비식별·합성 편집</button>
          </div>
          )}
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 1100 }}>
              {dataView === "real" ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(150px, 1fr))`, borderBottom: `1px solid ${C.border}`, background: "#FCFCFD" }}>
                    {cols.map((c, i) => {
                      const on = editing && sel[i];
                      const modeC = sel[i] === "synth" ? "#1D9E75" : C.purple;
                      return (
                      <div key={i} style={{ padding: "12px 14px 14px", borderRight: i === cols.length - 1 ? "none" : `1px solid ${C.borderSoft}`, background: on ? (sel[i] === "synth" ? "#EEFBF4" : "#F5F3FE") : "transparent", boxShadow: on ? `inset 0 2px 0 ${modeC}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 600 }}>
                          {editing && <span onClick={() => toggleCol(i)} style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${on ? modeC : C.border}`, background: on ? modeC : "#fff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>{on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4 10-11" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span>}
                          <span style={{ color: C.faint, display: "flex" }}>{c.icon}</span><span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                        </div>
                        {editing ? (
                          <div style={{ marginTop: 10, height: 64 }}>
                            {on ? (
                              <div style={{ display: "flex", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, padding: 3 }}>
                                {[["deid", "비식별", C.purple], ["synth", "합성", "#1D9E75"]].map(([m, lab, cc]) => (
                                  <button key={m} onClick={() => setMode(i, m)} style={{ flex: 1, border: "none", borderRadius: 6, padding: "5px 0", fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: FONT, background: sel[i] === m ? cc : "transparent", color: sel[i] === m ? "#fff" : C.sub }}>{lab}</button>
                                ))}
                              </div>
                            ) : <div onClick={() => toggleCol(i)} style={{ fontSize: 11.5, color: C.faint, cursor: "pointer", paddingTop: 6 }}>선택 안 함</div>}
                          </div>
                        ) : (
                        <div style={{ marginTop: 12, height: 64 }}>
                          {c.special === "unique" && <div style={{ textAlign: "center", paddingTop: 8 }}><div style={{ fontSize: 22, fontWeight: 700 }}>893건</div><div style={{ fontSize: 12, color: C.faint }}>unique values</div></div>}
                          {c.dist && <div style={{ fontSize: 12 }}>{[["Korean", "20%"], ["En", "15%"], ["Jap", "5%"], ["Other", "60%"]].map(([k, v]) => <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}><span style={{ color: C.sub }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>)}</div>}
                          {c.hist && <div><Histogram heights={c.hist} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.faint, marginTop: 3 }}><span>{c.axis[0]}</span><span>{c.axis[1]}</span></div></div>}
                        </div>
                        )}
                      </div>
                    ); })}
                  </div>
                  {D_NAMES.map((nm, r) => (
                    <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(150px, 1fr))`, borderBottom: `1px solid ${C.borderSoft}`, fontSize: 13.5 }}>
                      {cols.map((c, ci) => {
                        const on = editing && sel[ci];
                        const err = !editing && ci === 2 && D_SIZES[r].length > 14;
                        return (
                          <div key={ci} style={{ padding: "11px 14px", borderRight: ci === cols.length - 1 ? "none" : `1px solid ${C.borderSoft}`, background: err ? "#FEE2E2" : on ? (sel[ci] === "synth" ? "#F3FBF7" : "#FAF9FE") : "transparent", color: err ? "#B91C1C" : on ? C.text : ci === 0 ? C.sub : C.text, fontWeight: on ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tf(ci, r)}</div>
                        );
                      })}
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ animation: "skelPulse 1.4s ease-in-out infinite" }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(150px, 1fr))`, borderBottom: `1px solid ${C.border}`, background: "#FCFCFD" }}>
                    {cols.map((c, i) => (
                      <div key={i} style={{ padding: "12px 14px 14px", borderRight: i === cols.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                        <div style={{ height: 9, width: `${46 + (i * 11) % 34}%`, borderRadius: 5, background: "#E4E7EB", marginBottom: dataView === "graph" ? 14 : 0 }} />
                        {dataView === "graph" && (
                          <div style={{ height: 64 }}>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 46 }}>
                              {Array.from({ length: 7 }).map((_, b) => <div key={b} style={{ flex: 1, height: `${26 + ((i * 13 + b * 19) % 66)}%`, background: "#E4E7EB", borderRadius: "2px 2px 0 0" }} />)}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}><div style={{ height: 7, width: 24, borderRadius: 4, background: "#EDEFF2" }} /><div style={{ height: 7, width: 24, borderRadius: 4, background: "#EDEFF2" }} /></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {Array.from({ length: 16 }).map((_, r) => (
                    <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, minmax(150px, 1fr))`, borderBottom: `1px solid ${C.borderSoft}` }}>
                      {cols.map((_, ci) => (
                        <div key={ci} style={{ padding: "13px 14px", borderRight: ci === cols.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}><div style={{ height: 11, borderRadius: 6, background: "#EDEFF2", width: `${42 + ((r * 7 + ci * 13) % 46)}%` }} /></div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <style>{`@keyframes skelPulse{0%,100%{opacity:1}50%{opacity:.55}}`}</style>
        </div>
        )}
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
 *  Combine (결합) — 드래그앤드랍 빌더
 * ========================================================= */
const TONE = [
  { key: "blue", line: "#BFD7FF", bg: "#F4F8FF", head: "#E8F1FF", fg: "#185FA5", badge: "기준" },
  { key: "green", line: "#BBF7D0", bg: "#F4FCF6", head: "#E6F8EC", fg: "#15803D", badge: "추가" },
];
const PV_UNION = ["customer_id", "name", "email", "signup_date"]; // 유니온: 양쪽 동일 스키마(행을 쌓음)
const PV_KEY = "customer_id";                  // 조인 키(양쪽 공통)
const PV_T1_REST = ["name", "email", "signup_date"]; // 조인: Table1 고유 칼럼
const PV_T2_REST = ["region", "age", "plan"];        // 조인: Table2 고유 칼럼(오른쪽에 붙음)
// 두 데이터셋의 칼럼 세트 + 매칭 (⇄ 교체 시 좌우 칼럼이 뒤집힘)
const CMB_MATCHED = [["customer_id", "user_identifier"], ["name", "client_reference"], ["email", "client_code"], ["signup_date", "account_number"], ["gender", "user_account"], ["country", "customer_tag"], ["plan", "client_id"], ["device", "customer_key"]];
const CMB_A_ONLY = ["region", "age"];          // A(기준) 전용
const CMB_B_ONLY = ["channel", "loyalty_tier"]; // B 전용
const buildMatchRows = (swapped) => swapped
  ? [...CMB_B_ONLY.map((c) => [c, null]), ...CMB_MATCHED.map(([a, b]) => [b, a])]
  : [...CMB_A_ONLY.map((c) => [c, null]), ...CMB_MATCHED.map(([a, b]) => [a, b])];
// 데이터 합치기 케이스 (개발자 자료 기준) — 선택한 데이터셋 쌍에 따라 전환
const CMB_CASES = [
  // Union 3종 (선택 쌍에 따라 전환) — row 종류: [기준,추가]=매칭 / [기준,null]=기준전용(추가 null) / [null,추가]=추가전용(제거)
  { k: "union-clean", method: "union", line: "칼럼 구성이 비슷해 행을 이어 붙이는 Union이 적합해요.", banner: { tone: "info", text: "두 데이터의 칼럼이 모두 일치해요. 빈 값(null)이나 제거되는 칼럼 없이 안전하게 합쳐져요." } },
  { k: "union-drop", method: "union", line: "칼럼 구성이 비슷해 행을 이어 붙이는 Union이 적합해요.", banner: { tone: "info", text: "기준 데이터와 매칭되지 않은 추가 칼럼은 결과에서 제거돼요." } },
  { k: "union-null", method: "union", line: "칼럼 구성이 비슷해 행을 이어 붙이는 Union이 적합해요.", banner: { tone: "info", text: "매칭되지 않은 칼럼의 기준 데이터 값은 그대로 유지되고, 추가된 칼럼은 빈 값(null)으로 채워져요." } },
  { k: "join-clean", method: "join", line: "공통 키로 옆에 붙이기 좋아요.", banner: null },
  { k: "join-multiply", method: "join", line: "한 기준에 여러 건이 붙어 행이 늘어날 수 있어요 (1:N).", banner: { tone: "info", text: "주문처럼 한 명에 여러 건이 있으면 그 수만큼 행이 복제돼요." } },
  { k: "join-lowmatch", method: "join", line: "매칭률이 낮아 결과 대부분이 빈칸일 수 있어요.", banner: { tone: "warn", text: "매칭 30% — 결과 다수가 빈칸이에요. 막지는 않지만 결합 효과가 적을 수 있어요." } },
];
const buildCaseRows = (caseKey, swapped) => {
  const matched = buildMatchRows(swapped).filter(([, r]) => r); // 매칭된 칼럼만 (8개)
  if (caseKey === "union-drop") return [...matched, [null, "extra_tag"]];    // 추가 전용 1개 → 제거
  if (caseKey === "union-null") return [...matched, ["loyalty_tier", null]]; // 기준 전용 1개 → 추가 null
  if (caseKey === "join-lowmatch") return matched.map(([l, r], i) => (i % 3 === 0 ? [l, null] : [l, r]));
  return matched; // union-clean / join-clean: 전부 매칭
};
// JOIN 종류 학습용 익스플레이너 — 실제 예시 데이터(고객 A · 주문 B), id로 매칭
const JOIN_A = [["1", "민경"], ["2", "철수"], ["3", "영희"]];
const JOIN_B = [["1", "노트북"], ["1", "마우스"], ["2", "키보드"], ["4", "모니터"]];
const JOIN_VIZ = {
  inner: { label: "INNER JOIN", desc: "A와 B 양쪽에 모두 매칭되는 행만", a: false, b: false, rows: [["1", "민경", "노트북"], ["1", "민경", "마우스"], ["2", "철수", "키보드"]] },
  left: { label: "LEFT JOIN", desc: "A는 전부 포함, 매칭되는 B만 붙이고 없으면 NULL (영희=주문 없음)", a: true, b: false, rows: [["1", "민경", "노트북"], ["1", "민경", "마우스"], ["2", "철수", "키보드"], ["3", "영희", null]] },
  right: { label: "RIGHT JOIN", desc: "B는 전부 포함, 매칭되는 A만 붙이고 없으면 NULL (모니터=고객id 4가 A에 없음)", a: false, b: true, rows: [["1", "민경", "노트북"], ["1", "민경", "마우스"], ["2", "철수", "키보드"], ["4", null, "모니터"]] },
  full: { label: "FULL OUTER JOIN", desc: "A, B 전부 포함하는 합집합, 매칭 안 되면 양쪽 다 NULL", a: true, b: true, rows: [["1", "민경", "노트북"], ["1", "민경", "마우스"], ["2", "철수", "키보드"], ["3", "영희", null], ["4", null, "모니터"]] },
};
const JOIN_VIZ_ORDER = ["inner", "left", "right", "full"];
const KEY_POOL = [{ a: "user_ID", b: "user_ID", au: 90, bu: 90 }, { a: "날짜", b: "date", au: 95, bu: 95 }, { a: "region_cd", b: "region_cd", au: 88, bu: 88 }, { a: "channel", b: "channel", au: 72, bu: 72 }];
const A_COLS = [{ name: "user_ID", t: "String", u: 90 }, { name: "날짜", t: "Datetime", u: 95 }, { name: "region_cd", t: "String", u: 88 }, { name: "channel", t: "String", u: 72 }];
const B_COLS = [{ name: "user_ID", t: "String", u: 90 }, { name: "date", t: "Datetime", u: 95 }, { name: "region_cd", t: "String", u: 88 }, { name: "channel", t: "String", u: 72 }];
function CombinePage({ selected, onRun }) {
  const pool = useMemo(() => Array.from({ length: 14 }, (_, i) => poolLabel(i)), []);
  const came = selected && selected.length >= 2;
  const [picked, setPicked] = useState(came ? [0, 1] : []);
  const [done, setDone] = useState(came);
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("union");
  const REC_METHOD = "union";   // AI 추천 병합 방식 (칼럼 구성이 같아 Union 권장)
  const [methodSrc, setMethodSrc] = useState(came ? "ai" : "none"); // none(미정) | user(드래그로 직접) | ai(추천받음)
  const [loading, setLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(true);
  const [autoOpen, setAutoOpen] = useState(true);
  const [autoSel, setAutoSel] = useState(AUTO_ROWS.map((r) => r[0]));
  const [reviewSel, setReviewSel] = useState(REVIEW_ROWS.map((r) => r.right));
  const [stale, setStale] = useState(false);   // 매칭 변경됨 → 반영 필요
  const [tip, setTip] = useState(false);        // ↻ 호버 툴팁
  const [drag, setDrag] = useState(null);       // {idx,x,y} 마우스 드래그 중인 데이터셋
  const dragStart = useRef(null);               // {idx,sx,sy,started}
  const suppressClick = useRef(false);          // 드래그 직후 클릭 무시
  const dropRef = useRef(null);                 // 데이터셋 드롭존 (위치 무관)
  const pickedRef = useRef(picked);
  pickedRef.current = picked;                   // 핸들러에서 최신값 읽기 (stale 방지)
  const [overZone, setOverZone] = useState(null); // 'base'|'union'|'join'|null
  const [infoOpen, setInfoOpen] = useState(false); // 방식 설명 툴팁
  const [infoPos, setInfoPos] = useState(null);
  const infoRef = useRef(null);
  const [cmpOpen, setCmpOpen] = useState(false); // 선택화면 Union·Join 비교 팝오버
  const [cmpPos, setCmpPos] = useState(null);
  const cmpRef = useRef(null);
  const [joinViz, setJoinViz] = useState("left"); // 결과 형태 학습용 익스플레이너 선택 종류
  const [joinModal, setJoinModal] = useState(false); // JOIN 종류 비교 모달
  const [matchPop, setMatchPop] = useState(false); // 매칭률 설명 팝업
  const [methodChoice, setMethodChoice] = useState(false); // 둘 다 가능 → 방식 선택 모달
  const [methodPick, setMethodPick] = useState(null); // 모달에서 고른 방식 (union|join|null)
  const [joinKeys, setJoinKeys] = useState([{ a: "user_ID", b: "user_ID", au: 90, bu: 90, at: "String", bt: "String" }]); // 복합 조인 키 (키 쌍 배열)
  const [keyMenu, setKeyMenu] = useState(null); // {i, side:'a'|'b'} 열린 키 컬럼 드롭다운
  const [editKeyRow, setEditKeyRow] = useState(-1); // 편집 중인 키 행 (펜슬 → A·B 둘 다 드롭다운)
  const [openFolders, setOpenFolders] = useState({ DataGalaxy: true }); // 좌측 폴더 트리 펼침
  const [hoverRow, setHoverRow] = useState(-1);   // 매칭 행 hover
  const [editRow, setEditRow] = useState(-1);     // 매칭 행 편집(드롭다운)
  const [swapped, setSwapped] = useState(false);   // ⇄ 기준/추가 교체
  const [matchRows, setMatchRows] = useState(() => buildMatchRows(false)); // [기준칼럼, 매칭된 추가칼럼|null]
  const [appliedRows, setAppliedRows] = useState(() => buildMatchRows(false)); // 하단 테이블에 적용된 스냅샷
  const [tableLoading, setTableLoading] = useState(false); // 하단 테이블 스켈레톤
  const matchDirty = JSON.stringify(matchRows) !== JSON.stringify(appliedRows);
  const UNION_CASES = CMB_CASES.filter((c) => c.method === "union"); // 지금은 Union 케이스만 (Join은 별도 작업)
  const caseDef = UNION_CASES[Math.min((picked[0] ?? 0), (picked[1] ?? 1)) % UNION_CASES.length]; // 선택 쌍 → Union 케이스
  const doSwap = () => { const ns = !swapped; setSwapped(ns); const nr = buildCaseRows(caseDef.k, ns); setMatchRows(nr); setAppliedRows(nr); setPicked((p) => [p[1], p[0]]); setTableLoading(true); setTimeout(() => setTableLoading(false), 2000); };
  const applyMatch = () => { setTableLoading(true); setAppliedRows(matchRows.map((r) => [...r])); setTimeout(() => setTableLoading(false), 1200); };
  const [tableH, setTableH] = useState(340);      // 하단 데이터 테이블 높이(리사이즈)
  const resizeRef = useRef(null);

  useEffect(() => {
    const move = (e) => { const s = resizeRef.current; if (!s) return; setTableH(Math.max(120, Math.min(760, s.startH - (e.clientY - s.startY)))); };
    const up = () => { if (resizeRef.current) { resizeRef.current = null; document.body.style.userSelect = ""; } };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  useEffect(() => { setLoading(false); }, [done]);
  // 데이터 2개 채워지면 AI가 방식 자동 결정 → 즉시 매칭+미리보기 (별도 단계 없음)
  useEffect(() => { if (picked.length < MAX_MERGE) { setDone(false); setMethodSrc("none"); } }, [picked.length]);
  useEffect(() => { if (done) { if (methodSrc !== "user") { setMethod(caseDef.method); setMethodSrc("ai"); } const cr = buildCaseRows(caseDef.k, swapped); setMatchRows(cr); setAppliedRows(cr); setLoading(true); const t = setTimeout(() => setLoading(false), 850); return () => clearTimeout(t); } }, [done]);

  // 좌측 행 → 우측 드롭존 마우스 드래그앤드랍 (위치 무관, 담기만 함 — 방식은 AI 자동)
  useEffect(() => {
    const hit = (ref, x, y) => { const el = ref.current; if (!el) return false; const r = el.getBoundingClientRect(); return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; };
    const move = (e) => {
      const s = dragStart.current; if (!s) return;
      if (!s.started) { if (Math.abs(e.clientX - s.sx) + Math.abs(e.clientY - s.sy) < 5) return; s.started = true; }
      setDrag({ idx: s.idx, x: e.clientX, y: e.clientY });
      setOverZone(!pickedRef.current.includes(s.idx) && hit(dropRef, e.clientX, e.clientY) ? "drop" : null);
    };
    const up = (e) => {
      const s = dragStart.current; dragStart.current = null;
      if (s && s.started) {
        suppressClick.current = true;
        if (hit(dropRef, e.clientX, e.clientY)) addOrSwapRef.current(s.idx); // 한도 초과 시 자동 교체
      }
      setDrag(null); setOverZone(null);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  const ready = done && !loading;
  const names = picked.map(poolLabel);
  // 자동 교체 토스트 + 방금 교체된 행 하이라이트
  const [swapToast, setSwapToast] = useState(null); // { out, in }
  const [swapInId, setSwapInId] = useState(-1);      // 방금 들어온 데이터셋 idx (반짝임)
  const swapTimer = useRef(null);
  const flashSwap = (outIdx, inIdx) => {
    setSwapToast({ out: dsName(outIdx), in: dsName(inIdx) });
    setSwapInId(inIdx);
    if (swapTimer.current) clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => { setSwapToast(null); setSwapInId(-1); }, 2600);
  };
  // 기준(picked[0])은 유지, 그 다음으로 먼저 선택된 것을 빼고 새 항목을 넣음
  const addOrSwap = (i) => {
    const p = pickedRef.current;
    if (p.includes(i)) return;
    if (p.length >= MAX_MERGE) { const dropIdx = p[1]; setPicked([p[0], ...p.slice(2), i]); flashSwap(dropIdx, i); }
    else setPicked([...p, i]);
  };
  const togglePick = (i) => { if (pickedRef.current.includes(i)) setPicked((p) => p.filter((x) => x !== i)); else addOrSwap(i); };
  const addOrSwapRef = useRef(addOrSwap);
  addOrSwapRef.current = addOrSwap;
  const editAuto = (idx, v) => { setAutoSel((s) => s.map((x, i) => (i === idx ? v : x))); setStale(true); };
  const editReview = (idx, v) => { setReviewSel((s) => s.map((x, i) => (i === idx ? v : x))); setStale(true); };

  // ── ERD 프리뷰 ─────────────────────────────────────────────
  const ERD_H = 44, ERD_ROW = 32;        // 헤더/행 높이 (관계선 좌표 계산용)
  const ERD_TONE = { blue: TONE[0], green: TONE[1], purple: { line: "#DDD3F7", head: "#F5F1FE", fg: "#6D4AC4" } };
  const KeyGlyph = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="8.5" cy="8.5" r="4.5" stroke="currentColor" strokeWidth="2" /><path d="M11.5 11.5L20 20m-3.2.2l3.2-3.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>;
  const DownArrow = ({ text }) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: C.faint }}>
      <svg width="16" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4v15m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {text && <span style={{ fontSize: 11.5, fontWeight: 600, color: C.sub }}>{text}</span>}
    </div>
  );
  const ErdEntity = ({ idx, name, sub, label, toneKey, cols, w }) => {
    const tone = ERD_TONE[toneKey] || TONE[0];
    return (
      <div style={{ width: w, flexShrink: 0, border: `1.5px solid ${tone.line}`, borderRadius: 12, overflow: "hidden", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: ERD_H, padding: "0 12px", background: tone.head, borderBottom: `1px solid ${tone.line}` }}>
          <span style={{ width: 26, height: 26, borderRadius: 7, background: "#fff", color: tone.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.db width={14} height={14} /></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name || poolLabel(idx)}</div>
            <div style={{ fontSize: 10.5, color: C.faint }}>{sub || "58.2KB · 8,432행"}</div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: tone.fg, background: "#fff", border: `1px solid ${tone.line}`, borderRadius: 5, padding: "2px 7px", whiteSpace: "nowrap" }}>{label}</span>
        </div>
        {cols.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, height: ERD_ROW, padding: "0 12px", fontSize: 12, borderBottom: i < cols.length - 1 ? "1px solid #00000010" : "none", background: c.tag === "add" ? "#EAF7EE" : c.tag === "null" ? "#EEF3FF" : c.key ? "#F6F3FE" : "transparent" }}>
            {c.tag === "null"
              ? <span style={{ flex: 1, color: C.faint, fontStyle: "italic" }}>{c.name}</span>
              : <>
                  <span style={{ color: c.key ? C.purple : C.faint, display: "flex", flexShrink: 0, fontWeight: 700 }}>{c.key ? <KeyGlyph /> : "#"}</span>
                  <span style={{ flex: 1, fontWeight: c.key ? 700 : 500, color: c.muted ? C.faint : C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}{!c.muted && <span style={{ color: C.faint, fontWeight: 400 }}> {c.type || "String"}</span>}</span>
                </>}
            {c.key && <span style={{ fontSize: 9.5, fontWeight: 800, color: C.purple, background: "#EEE9FE", borderRadius: 4, padding: "2px 6px", letterSpacing: 0.3 }}>{c.key}</span>}
            {c.tag === "add" && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#15803D", background: "#E6F8EC", borderRadius: 4, padding: "2px 6px" }}>추가</span>}
            {c.tag === "null" && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#6B7280", background: "#fff", border: `1px solid ${C.border}`, borderRadius: 4, padding: "1px 6px" }}>null</span>}
          </div>
        ))}
      </div>
    );
  };
  const joinBaseCols = [{ name: PV_KEY, key: "PK" }, ...PV_T1_REST.map((l) => ({ name: l }))];
  const joinAddCols = [{ name: PV_KEY, key: "FK" }, ...PV_T2_REST.map((l) => ({ name: l, tag: "add" }))];
  const joinResultCols = [{ name: PV_KEY, key: "PK" }, ...PV_T1_REST.map((l) => ({ name: l })), ...PV_T2_REST.map((l) => ({ name: l, tag: "add" }))];
  const unionSrcCols = [{ name: "customer_id", key: "PK" }, { name: "name" }, { name: "email" }, { name: "signup_date" }, { name: "+ 그 외 매칭 칼럼", muted: true, type: "" }];
  // 실제 데이터 값 미리보기용 샘플
  const GRID_BASE = [["C001", "김민준", "minjun@acme.io", "2024-01-03"], ["C002", "이서연", "seoyeon@acme.io", "2024-01-07"], ["C003", "박도윤", "doyoon@acme.io", "2024-02-01"]];
  const GRID_ADD = [["C104", "최지우", "jiwoo@beta.io", "2024-03-10"], ["C105", "정하준", "hajun@beta.io", "2024-03-12"], ["C106", "강시아", "sia@beta.io", "2024-03-15"]];
  const GRID_JOIN_EXTRA = [["서울", "29", "Pro"], ["부산", "34", "Basic"], ["대구", "41", "Pro"]];
  const GRID_W = { customer_id: 118, name: 96, email: 188, signup_date: 118, region: 88, age: 60, plan: 80 };
  // ── 풀화면 매칭 레이아웃용 데이터 ──
  const FOLDERS = [
    { name: "DataGalaxy", items: ["DataVista", "DataVista", "DataVista", "DataVista", "DataVista"] },
    { name: "File 1", items: ["Orders_2024.csv", "Orders_2025.csv"] },
    { name: "File 2", items: ["Customers.csv", "Events.csv"] },
  ];
  const LOOSE = ["DataRhythm", "DataLink_2025.csv", "DataConnector", "DataSphere", "DataHarmony", "DataStreamline", "DataSphere", ...Array(14).fill("InsightHub")];
  const ALL_DS = [...FOLDERS.flatMap((f) => f.items), ...LOOSE];
  const FOLDER_BASE = FOLDERS.map((f) => f.items.length); // 각 폴더 시작 인덱스 계산용
  const dsName = (i) => ALL_DS[i] || `Dataset ${i + 1}`;
  const MATCH_PAIRS = [["customer_id", "user_identifier"], ["name", "client_reference"], ["email", "client_code"], ["signup_data", "client_id"], ["date", "customer_key"], ["time", "account_number"], ["time_period", "user_account"], ["structure", "customer_tag"], ["structure", "customer_tag"]];
  const T2_OPTIONS = ["user_identifier", "client_reference", "client_code", "client_id", "customer_key", "account_number", "user_account", "customer_tag", "매칭 안 함"];
  // 유니온 결과는 "기준 데이터의 컬럼 구조를 따름" → 하단 테이블 컬럼 = 매칭 테이블의 기준 칼럼(matchRows)과 동일
  const _NAMES = ["김민수", "이지은", "박서준", "최유진", "정도윤", "강하늘", "윤서연", "임지호"];
  const _pad = (n) => String(n).padStart(2, "0");
  const colType = (name) => name === "customer_id" ? "key" : /age|size|count|amount|num/.test(name) ? "#" : "A";
  const colVal = (name, k) => {
    if (name === "customer_id") return "C" + (1000 + k);
    if (name === "name") return _NAMES[k % _NAMES.length];
    if (name === "email") return ["minsu", "jieun", "seojun", "yujin", "doyun", "haneul"][k % 6] + "@mail.com";
    if (name === "signup_date") return "2024-" + _pad((k % 12) + 1) + "-" + _pad((k % 27) + 1);
    if (name === "region") return ["서울", "부산", "대구", "인천"][k % 4];
    if (name === "age") return String(20 + (k % 45));
    if (name === "gender") return ["남", "여"][k % 2];
    if (name === "country") return ["KR", "US", "JP", "VN"][k % 4];
    if (name === "plan") return ["Free", "Pro", "Team"][k % 3];
    if (name === "device") return ["iOS", "Android", "Web"][k % 3];
    return "val_" + k;
  };
  // ── 선택 화면 카드/슬롯 ──────────────────────────────
  const DsCard = ({ idx, isBase, w }) => (
    <div style={{ width: w, flexShrink: 0, border: `1px solid ${C.border}`, borderRadius: 12, background: "#fff", padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: isBase ? C.purple : C.sub, background: isBase ? "#EEE9FE" : "#F3F4F6", borderRadius: 6, padding: "3px 9px" }}>{isBase ? "기준" : "추가"}</span>
        <span onClick={() => setPicked((p) => p.filter((x) => x !== idx))} title="제거" style={{ cursor: "pointer", color: C.faint, display: "flex" }}><Icon.x width={16} height={16} /></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <span style={{ width: 34, height: 34, borderRadius: 8, background: isBase ? "#EEF2FF" : "#F3F4F6", color: isBase ? C.purple : C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.db width={17} height={17} /></span>
        <div style={{ minWidth: 0 }}><div style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{poolLabel(idx)}</div><div style={{ fontSize: 12, color: C.faint }}>58.2KB · 4컬럼 · 8,432행</div></div>
      </div>
    </div>
  );
  const MethodSlot = ({ slotRef, dir, active, w, dragName }) => {
    const isU = dir === "union";
    return (
      <div ref={slotRef} style={{ width: w, minHeight: 108, border: `1.5px dashed ${active ? C.purple : C.border}`, borderRadius: 12, background: active ? "#F4F0FE" : "#FAFBFC", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 9, color: active ? C.purple : C.sub, transition: "all .12s", padding: "16px 12px", textAlign: "center" }}>
        {active ? (
          <>
            <div style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: "#fff", border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(80,60,160,0.12)", textAlign: "left" }}>
              <span style={{ width: 30, height: 30, borderRadius: 7, background: "#EEF2FF", color: C.purple, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.db width={15} height={15} /></span>
              <div style={{ minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dragName || "데이터셋"}</div><div style={{ fontSize: 11, color: C.faint }}>58.2KB · 4컬럼 · 8,432행</div></div>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: C.purple }}><Icon.download width={15} height={15} /> 여기에 놓아 {isU ? "Union" : "Join"}</span>
          </>
        ) : (
          <>
            <span style={{ width: 34, height: 34, borderRadius: 9, background: "#fff", border: `1.5px dashed ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.faint }}>{isU ? <Icon.union width={16} height={16} /> : <Icon.join width={16} height={16} />}</span>
            <span style={{ fontSize: 13.5, fontWeight: 700 }}>{isU ? "↓ 아래에 쌓기 · Union" : "→ 옆에 붙이기 · Join"}</span>
            <span style={{ fontSize: 11.5, color: C.faint, fontWeight: 600 }}>여기로 끌어다 놓기 · {isU ? "행 추가" : "열 추가"}</span>
          </>
        )}
      </div>
    );
  };
  const methodChip = (m) => (
    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: C.purple, background: "#EEE9FE", borderRadius: 999, padding: "4px 11px", whiteSpace: "nowrap" }}>
      {m === "join" ? "→ Join" : "↓ Union"}<span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.8 }}>직접 선택</span>
    </span>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignSelf: "stretch", flex: 1, minHeight: 0 }}>
      {drag && !overZone && (
        <div style={{ position: "fixed", top: drag.y + 14, left: drag.x + 14, zIndex: 200, pointerEvents: "none", display: "flex", alignItems: "center", gap: 9, padding: "9px 13px", borderRadius: 10, background: "#fff", border: `1px solid ${C.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", opacity: 0.96 }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: "#EEF4FF", color: C.blue, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.db width={14} height={14} /></span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{poolLabel(drag.idx)}</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.panel }}>
        <span style={{ fontSize: 14, color: C.sub }}>Dataset</span>
        <span style={{ color: C.faint, display: "flex" }}><Icon.chevR width={16} height={16} /></span>
        <span style={{ fontSize: 14, fontWeight: 700 }}>Combine</span>
      </div>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* LEFT — 데이터셋 트리 (선택 단계에서만) */}
        {!done && (
        <aside style={{ position: "relative", width: 280, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: "#fff", display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 16px 10px", padding: "0 12px", height: 38, border: `1px solid ${C.border}`, borderRadius: 9, background: "#fff" }}>
            <span style={{ color: C.faint, display: "flex" }}><Icon.search width={15} height={15} /></span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="검색어를 입력해주세요" style={{ border: "none", outline: "none", flex: 1, fontSize: 13, fontFamily: FONT, background: "transparent" }} />
          </div>
          {picked.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 16px 6px", padding: "0 2px" }}>
              <span style={{ fontSize: 12, color: C.faint, fontWeight: 600 }}>{picked.length}/{MAX_MERGE} 선택됨</span>
              <button onClick={() => { setPicked([]); setSwapToast(null); setSwapInId(-1); }} style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "transparent", color: C.sub, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, padding: "3px 4px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 4v6h6M20 20v-6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 10a8 8 0 0 0-14.9-3M4 14a8 8 0 0 0 14.9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                초기화
              </button>
            </div>
          )}
          <div style={{ flex: 1, overflowY: "auto", padding: "2px 8px 16px" }}>
            {(() => {
              const q2 = q.trim().toLowerCase();
              const match = (nm) => !q2 || nm.toLowerCase().includes(q2);
              const dsRow = (nm, i, indent) => {
                const checked = picked.includes(i);
                const isBase = checked && picked[0] === i;
                const justIn = swapInId === i;
                return (
                  <div key={"d" + i}
                    onMouseDown={(e) => { e.preventDefault(); dragStart.current = { idx: i, sx: e.clientX, sy: e.clientY, started: false }; }}
                    onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } togglePick(i); }}
                    style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", paddingLeft: indent ? 34 : 10, borderRadius: 9, cursor: drag && drag.idx === i ? "grabbing" : "pointer", background: justIn ? "#DDEBFF" : checked ? "#EEF4FF" : (drag && drag.idx === i ? "#F3F4F6" : "transparent"), boxShadow: justIn ? `inset 0 0 0 1.5px ${C.blue}` : "none", transition: "background .25s, box-shadow .25s", userSelect: "none" }}>
                    <span style={{ display: "flex", color: checked ? C.blue : C.sub, flexShrink: 0 }}><Icon.db width={16} height={16} /></span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: checked ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nm}</span>
                    {isBase && <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: C.blue, background: "#fff", border: `1px solid ${C.blue}`, borderRadius: 4, padding: "1px 5px" }}>기준</span>}
                    {checked && <span style={{ flexShrink: 0, display: "flex", color: C.blue }}><Icon.checkCircle width={17} height={17} /></span>}
                  </div>
                );
              };
              let idx = 0; const els = [];
              FOLDERS.forEach((f) => {
                const open = openFolders[f.name];
                els.push(
                  <div key={"f" + f.name} onClick={() => setOpenFolders((o) => ({ ...o, [f.name]: !o[f.name] }))} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 10px", borderRadius: 9, cursor: "pointer", color: C.sub, userSelect: "none" }}>
                    <span style={{ display: "flex", transform: open ? "rotate(90deg)" : "none", transition: "transform .12s", color: C.faint }}><Icon.chevR width={14} height={14} /></span>
                    <span style={{ display: "flex", color: C.faint }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 7a2 2 0 0 1 2-2h3.5l2 2H19a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg></span>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{f.name}</span>
                  </div>
                );
                f.items.forEach((nm) => { const i = idx; idx++; if (open && match(nm)) els.push(dsRow(nm, i, true)); });
              });
              LOOSE.forEach((nm) => { const i = idx; idx++; if (match(nm)) els.push(dsRow(nm, i, false)); });
              return els;
            })()}
          </div>
          <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, background: "#fff" }}>
            <button disabled={picked.length !== MAX_MERGE} onClick={() => { if (picked.length === MAX_MERGE) setMethodChoice(true); }} style={{ width: "100%", padding: "13px 0", borderRadius: 11, border: "none", background: picked.length === MAX_MERGE ? C.dark : "#EEF0F3", color: picked.length === MAX_MERGE ? "#fff" : C.faint, fontSize: 14, fontWeight: 700, cursor: picked.length === MAX_MERGE ? "pointer" : "default", fontFamily: FONT }}>{picked.length === MAX_MERGE ? "다음 →" : `데이터셋 선택 (${picked.length}/${MAX_MERGE})`}</button>
          </div>
          {/* 자동 교체 토스트 */}
          {swapToast && (
            <div style={{ position: "absolute", left: 12, right: 12, bottom: 76, display: "flex", alignItems: "center", gap: 9, padding: "11px 13px", borderRadius: 11, background: C.dark, color: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.24)", zIndex: 20, animation: "swapToastIn .22s ease-out" }}>
              <span style={{ display: "flex", flexShrink: 0, color: "#9DBBF5" }}><Icon.swap width={15} height={15} /></span>
              <span style={{ fontSize: 12.5, lineHeight: 1.45 }}><b style={{ color: "#fff" }}>{swapToast.out}</b> 대신 <b style={{ color: "#fff" }}>{swapToast.in}</b> 선택됨</span>
            </div>
          )}
          <style>{`@keyframes swapToastIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:none}}`}</style>
          {methodChoice && (() => {
            const closeM = () => { setMethodChoice(false); setMethodPick(null); };
            const goNext = () => { if (!methodPick) return; setMethod(methodPick); setMethodSrc("user"); setMethodChoice(false); setMethodPick(null); setDone(true); };
            const unionTable = (
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", fontSize: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 12px", color: C.faint, fontWeight: 600, background: "#FAFAFB" }}><span>날짜</span><span>이름</span><span>등급</span></div>
                {[["5/3", "김아민", "일반", false], ["5/18", "한석원", "VIP", false], ["6/10", "정현아", "일반", true], ["6/20", "김민수", "VIP", true]].map((r, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 12px", borderTop: `1px solid ${C.borderSoft}`, background: r[3] ? "#EAF1FF" : "#fff", color: C.text }}><span>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span></div>))}
              </div>
            );
            const joinTable = (
              <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", fontSize: 11.5 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr", padding: "8px 10px", color: C.faint, fontWeight: 600, background: "#FAFAFB" }}><span>고객 ID</span><span>구매 이력</span><span>CS 문의</span><span>포인트</span></div>
                {[["user_001", "12만", "2건", "4,200P"], ["user_002", "34만", "3건", "8,900P"], ["user_003", "52만", "0건", "900P"], ["user_004", "-", "1건", "-"]].map((r, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr", padding: "8px 10px", borderTop: `1px solid ${C.borderSoft}` }}>{r.map((c, j) => <span key={j} style={{ color: c === "-" ? C.faint : C.text }}>{c}</span>)}</div>))}
              </div>
            );
            const card = (m, name, desc, ex, table) => (
              <button onClick={() => setMethodPick(m)} style={{ textAlign: "center", background: "#fff", border: methodPick === m ? `2px solid ${C.purple}` : `1px solid ${C.border}`, borderRadius: 16, padding: 18, cursor: "pointer", fontFamily: FONT }}>
                {table}
                <div style={{ fontSize: 16, fontWeight: 700, margin: "14px 0 6px" }}>{name}</div>
                <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.55 }}>{desc}</div>
                <div style={{ fontSize: 12, color: C.faint, marginTop: 10, lineHeight: 1.5 }}>{ex}</div>
              </button>
            );
            return (
            <div onClick={closeM} style={{ position: "fixed", inset: 0, background: "rgba(17,18,22,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 24 }}>
              <div onClick={(e) => e.stopPropagation()} style={{ width: 880, maxWidth: "94vw", maxHeight: "90vh", overflow: "auto", background: "#fff", borderRadius: 18, padding: "26px 28px", boxShadow: "0 24px 64px rgba(0,0,0,0.32)", fontFamily: FONT }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>두 데이터를 Union과 Join 모두 가능합니다.</div>
                  <button onClick={closeM} style={{ display: "flex", background: "none", border: "none", cursor: "pointer", color: C.faint, padding: 2 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
                </div>
                <div style={{ fontSize: 13.5, color: C.sub, marginBottom: 20 }}>목적에 맞는 방식을 골라주세요.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {card("union", "Union", "같은 형태의 데이터를 위아래로 이어 붙여 행을 늘려요.", "예시) 월별 데이터를 하나로 합치고 싶어요", unionTable)}
                  {card("join", "Join", "공통 키 (예: 고객 ID)를 기준으로 옆에 붙여 열을 늘려요.", "예시) 고객별 정보를 하나로 모으고 싶어요", joinTable)}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                  <button onClick={closeM} style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT, color: C.sub, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 22px", cursor: "pointer" }}>취소</button>
                  <button onClick={goNext} disabled={!methodPick} style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT, color: "#fff", background: methodPick ? C.dark : "#C7CBD1", border: "none", borderRadius: 10, padding: "10px 26px", cursor: methodPick ? "pointer" : "default" }}>다음</button>
                </div>
              </div>
            </div>
            );
          })()}
          {false && (
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px 28px" }}>
              {/* 헤더 — 방식 + ⓘ 설명 툴팁 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 15, fontWeight: 700 }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: "#F3F4F6", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center" }}>{method === "join" ? <Icon.join width={15} height={15} /> : <Icon.union width={15} height={15} />}</span>
                  {method === "join" ? "Join · 옆으로 붙이기" : "Union · 위아래로 이어붙이기"}
                  <span ref={infoRef} style={{ display: "flex", color: C.faint, cursor: "help" }} onMouseEnter={() => { const r = infoRef.current.getBoundingClientRect(); setInfoPos({ top: r.bottom + 10, left: Math.max(12, Math.min(r.left - 12, window.innerWidth - 298)) }); setInfoOpen(true); }} onMouseLeave={() => setInfoOpen(false)}>
                    <Icon.infoCircle width={15} height={15} />
                    {infoOpen && infoPos && (
                      <div style={{ position: "fixed", top: infoPos.top, left: infoPos.left, width: 286, background: "#18181B", color: "#fff", borderRadius: 12, padding: 12, zIndex: 60, boxShadow: "0 14px 34px rgba(0,0,0,0.32)", fontWeight: 400 }}>
                        <div style={{ background: "#27272A", borderRadius: 8, height: 76, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 11 }}>
                          {method === "join" ? (
                            <svg width="210" height="60" viewBox="0 0 210 60" fill="none">
                              <rect x="14" y="18" width="34" height="26" rx="3" fill="#5B9BFF" /><rect x="52" y="18" width="34" height="26" rx="3" fill="#34C77B" />
                              <circle cx="50" cy="31" r="4" fill="#fff" />
                              <path d="M100 30h22m-7-6 7 6-7 6" stroke="#A1A1AA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              <rect x="140" y="18" width="28" height="26" rx="3" fill="#5B9BFF" /><rect x="168" y="18" width="28" height="26" rx="3" fill="#34C77B" />
                            </svg>
                          ) : (
                            <svg width="210" height="60" viewBox="0 0 210 60" fill="none">
                              <rect x="20" y="9" width="58" height="18" rx="3" fill="#5B9BFF" /><rect x="20" y="33" width="58" height="18" rx="3" fill="#34C77B" />
                              <path d="M100 30h22m-7-6 7 6-7 6" stroke="#A1A1AA" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              <rect x="140" y="9" width="58" height="20" rx="3" fill="#5B9BFF" /><rect x="140" y="31" width="58" height="20" rx="3" fill="#34C77B" />
                            </svg>
                          )}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 5 }}>{method === "join" ? "Join · 옆으로 붙이기 (열 ↑)" : "Union · 위아래로 이어붙이기 (행 ↑)"}</div>
                        <div style={{ fontSize: 12, color: "#D4D4D8", lineHeight: 1.65 }}>
                          {method === "join"
                            ? <>같은 키(예: 고객번호)를 가진 줄끼리 <b style={{ color: "#fff" }}>옆으로</b> 붙여 칸(열)이 늘어요. 키가 맞는 행만 연결되고, 짝이 없으면 빈값으로 둬요.</>
                            : <>같은 뜻의 칼럼끼리 두 데이터를 <b style={{ color: "#fff" }}>위아래로</b> 쌓아 줄(행)이 늘어요. 한쪽에만 있는 칼럼은 반대쪽이 빈값(Null)으로 채워져요.</>}
                        </div>
                      </div>
                    )}
                  </span>
                </span>
                <span style={{ fontSize: 12, color: C.faint, whiteSpace: "nowrap" }}>아래에서 짝을 연결해 주세요</span>
              </div>
              {/* 검토 필요 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700 }}><span style={{ display: "flex", color: "#B45309" }}><Icon.warn width={16} height={16} /></span> 검토 필요</span>
                <span style={{ fontSize: 13, color: C.sub, fontWeight: 600 }}>{REVIEW_ROWS.length}건</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", padding: "0 2px 8px", fontSize: 12.5, color: C.faint, fontWeight: 600 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>Table 1 <span style={{ fontSize: 10, fontWeight: 700, color: C.sub, background: C.chipBg, borderRadius: 4, padding: "0 5px" }}>기준</span></span><span /><span>Table 2</span>
              </div>
              {REVIEW_ROWS.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, height: 42, padding: "0 12px", border: `1px solid ${C.border}`, borderRadius: 9, background: "#FAFAFB", fontSize: 13.5 }}><TypeIcon kind={r.lt} /> {r.left} <span style={{ color: C.faint, fontSize: 12 }}>String</span></div>
                  <span style={{ display: "flex", justifyContent: "center", color: C.faint }}>→</span>
                  <MatchDropdown value={reviewSel[i]} onChange={(v) => editReview(i, v)} recommended={REVIEW_ROWS[i].right} />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12.5, color: C.faint, margin: "2px 0 22px", lineHeight: 1.5 }}><span style={{ display: "flex", flexShrink: 0, marginTop: 1 }}><Icon.infoCircle width={13} height={13} /></span> 매칭 칼럼이 없는 경우, 2번 테이블은 Null로 채워져요.</div>
              {/* AI 자동 매칭 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: C.purple }}><Icon.spark /> AI 자동 매칭</span>
                <span style={{ fontSize: 13, color: C.purple, fontWeight: 600 }}>{AUTO_ROWS.length}건</span>
              </div>
              {AUTO_ROWS.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 32px 1fr", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, height: 42, padding: "0 12px", border: `1px solid ${C.border}`, borderRadius: 9, background: "#FAFAFB", fontSize: 13.5 }}><TypeIcon kind={r[1]} /> {r[0]} <span style={{ color: C.faint, fontSize: 12 }}>String</span></div>
                  <span style={{ display: "flex", justifyContent: "center", color: C.faint }}>→</span>
                  <MatchDropdown value={autoSel[i]} onChange={(v) => editAuto(i, v)} recommended={AUTO_ROWS[i][0]} />
                </div>
              ))}
            </div>
          )}
        </aside>
        )}

        {/* RIGHT — 캔버스(빈 상태 / 시각화) */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: 0, background: "#fff" }}>

          {!done ? (
            <div style={{ minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
              <div style={{ width: 560, maxWidth: "100%", border: `1px solid ${C.border}`, borderRadius: 16, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <div style={{ padding: "22px 24px 6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>데이터셋 2개를 선택해 주세요</div>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: C.purple, background: "#EEE9FE", borderRadius: 6, padding: "3px 9px" }}>✦ AI 추천</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.faint }}>AI가 결합 방식을 추천해 드려요.</div>
                  <div style={{ fontSize: 12, color: C.faint, marginTop: 6, display: "flex", alignItems: "flex-start", gap: 5, lineHeight: 1.5 }}><span style={{ display: "flex", flexShrink: 0, marginTop: 1, color: C.faint }}><Icon.infoCircle width={13} height={13} /></span>민감 정보를 마스킹했거나 편집 권한이 없는 항목은 표시되지 않아요.</div>
                </div>
                <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Union 카드 */}
                  {[
                    {
                      method: "union",
                      accent: "#5B9BFF",
                      accentBg: "#EEF4FF",
                      goal: "명단을 더 모으고 싶어요",
                      label: "Union",
                      direction: "세로로 쌓기",
                      desc: "같은 형태의 데이터를 위아래로 이어 붙여 행(줄)을 늘려요.",
                      example: "예) 5월 신규 회원 + 6월 신규 회원",
                      hints: ["5월 신규 회원 + 6월 신규 회원", "1월 주문 내역 + 2월 주문 내역"],
                      visual: (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, width: "100%", fontSize: 12 }}>
                          {/* 5월 테이블 */}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: "#93C5FD", marginBottom: 5 }}>5월 신규 회원</div>
                            <table style={{ width: "100%", borderCollapse: "collapse", border: "1.5px solid #BFDBFE", borderRadius: 6, overflow: "hidden" }}>
                              <thead><tr style={{ background: "#DBEAFE" }}>{["날짜","이름","등급"].map(h => <th key={h} style={{ padding: "5px 8px", fontSize: 11, fontWeight: 700, color: "#1D4ED8", textAlign: "center" }}>{h}</th>)}</tr></thead>
                              <tbody>{[["5/3","김아민","일반"],["5/18","한석원","VIP"]].map(([d,n,g],i) => <tr key={i} style={{ background: i%2===0?"#F8FAFF":"#fff", borderTop: "1px solid #E5E7EB" }}><td style={{ padding:"5px 8px", textAlign:"center", color:"#374151" }}>{d}</td><td style={{ padding:"5px 8px", textAlign:"center", color:"#374151" }}>{n}</td><td style={{ padding:"5px 8px", textAlign:"center", color:"#6B7280" }}>{g}</td></tr>)}</tbody>
                            </table>
                          </div>
                          {/* 화살표 */}
                          <div style={{ color: "#D1D5DB", fontSize: 18, paddingTop: 28, flexShrink: 0 }}>→</div>
                          {/* 결과 테이블 */}
                          <div style={{ flex: 1.6 }}>
                            <div style={{ fontSize: 10, fontWeight: 600, color: "#93C5FD", marginBottom: 5 }}>5월 + 6월 통합 · 4행</div>
                            <table style={{ width: "100%", borderCollapse: "collapse", border: "1.5px solid #BFDBFE", borderRadius: 6, overflow: "hidden" }}>
                              <thead><tr style={{ background: "#DBEAFE" }}>{["날짜","이름","등급"].map(h => <th key={h} style={{ padding: "5px 8px", fontSize: 11, fontWeight: 700, color: "#1D4ED8", textAlign: "center" }}>{h}</th>)}</tr></thead>
                              <tbody>{[["5/3","김아민","일반",false],["5/18","한석원","VIP",false],["6/3","정현아","일반",true],["6/20","김민수","VIP",true]].map(([d,n,g,isNew],i) => <tr key={i} style={{ background: isNew?"#EFF6FF": i%2===0?"#F8FAFF":"#fff", borderTop:"1px solid #E5E7EB" }}><td style={{ padding:"5px 8px", textAlign:"center", color:"#374151" }}>{d}</td><td style={{ padding:"5px 8px", textAlign:"center", color:"#374151" }}>{n}</td><td style={{ padding:"5px 8px", textAlign:"center", color:"#6B7280" }}>{g}</td></tr>)}</tbody>
                            </table>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#EFF6FF", border: "1px solid #BFDBFE", display: "inline-block" }} /><span style={{ fontSize: 10, color: "#9CA3AF" }}>6월에서 추가된 행</span></div>
                          </div>
                        </div>
                      ),
                    },
                    {
                      method: "join",
                      accent: "#34C77B",
                      accentBg: "#EDFAF3",
                      goal: "각 항목에 정보를 더 붙이고 싶어요",
                      label: "Join",
                      direction: "가로로 붙이기",
                      desc: "공동 조인키 (예: 고객 ID)를 기준으로 옆에 붙여 열을 늘려요.",
                      example: "예) 고객 ID (공동) + CS 문의 이력 + 포인트 잔액",
                      hints: ["고객 ID (공동) + CS 문의 이력 + 포인트 잔액", "고객 ID (공동) + 구매 이력"],
                      visual: (
                        <div style={{ width: "100%", fontSize: 12 }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", border: "1.5px solid #A7F3D0", borderRadius: 6, overflow: "hidden" }}>
                            <thead>
                              <tr style={{ background: "#D1FAE5" }}>
                                {["고객 ID (공동)","CS 문의 이력","포인트 잔액"].map(h => <th key={h} style={{ padding:"6px 10px", fontSize:11, fontWeight:700, color:"#065F46", textAlign:"center" }}>{h}</th>)}
                                <th style={{ padding:"6px 10px", fontSize:11, fontWeight:700, color:"#059669", textAlign:"center", background:"#BBFDE8" }}>구매 이력</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[["user_001","2건","4,200P","12만"],["user_002","3건","8,900P","34만"],["user_003","0건","900P","52만"],["user_004","1건","—","—"]].map(([id,cs,pt,buy],i) => (
                                <tr key={i} style={{ background: i%2===0?"#F0FDF4":"#fff", borderTop:"1px solid #E5E7EB" }}>
                                  <td style={{ padding:"6px 10px", textAlign:"center", color:"#374151" }}>{id}</td>
                                  <td style={{ padding:"6px 10px", textAlign:"center", color:"#374151" }}>{cs}</td>
                                  <td style={{ padding:"6px 10px", textAlign:"center", color: pt==="—"?"#9CA3AF":"#374151" }}>{pt}</td>
                                  <td style={{ padding:"6px 10px", textAlign:"center", fontWeight: buy==="—"?"400":"600", color: buy==="—"?"#EF4444":"#065F46", background: buy==="—"?"#FEF2F2":"#D1FAE5" }}>{buy}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 6 }}>구매 이력이 없는 user_004는 빈칸(—)으로 표시돼요</div>
                        </div>
                      ),
                    },
                  ].map((m) => {
                    const active = method === m.method;
                    return (
                      <div
                        key={m.method}
                        style={{ display: "flex", flexDirection: "column", gap: 14, padding: "18px 18px", borderRadius: 14, border: `1.5px solid ${C.border}`, background: "#FAFAFA" }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 14.5, fontWeight: 700 }}>{m.goal}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                              <span style={{ fontSize: 11.5, fontWeight: 700, color: m.accent }}>{m.label}</span>
                              <span style={{ fontSize: 11.5, color: C.faint }}>· {m.direction}</span>
                            </div>
                            <div style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.6 }}>{m.desc}</div>
                          </div>
                        </div>
                        <div style={{ background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                          {m.visual}
                        </div>
                        <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, marginBottom: 2 }}>이런 데이터라면 골라보세요</div>
                          {m.hints.map((h, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: C.text }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: m.accent, flexShrink: 0 }} />
                              {h}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.sub, background: "#F4F0FE", borderRadius: 999, padding: "7px 14px", alignSelf: "flex-start" }}>
                    <Icon.spark width={14} height={14} /> {picked.length === 2 ? "왼쪽 아래 「다음」을 눌러 진행하세요" : "데이터셋 2개를 고르면 AI가 최적 방식을 추천해요"}
                  </div>
                </div>
              </div>
            </div>
          ) : loading ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, color: C.faint }}>
              <span style={{ width: 38, height: 38, border: "3px solid #E5E7EB", borderTopColor: C.purple, borderRadius: "50%", animation: "spin .8s linear infinite" }} />
              <div style={{ fontSize: 14.5, fontWeight: 600, color: C.text }}>AI가 칼럼을 매칭하고 있어요…</div>
              <div style={{ fontSize: 12.5, color: C.faint }}>{dsName(picked[0])} + {dsName(picked[1])}</div>
            </div>
          ) : (
            <>
              <div style={{ padding: "16px 28px 14px", borderBottom: `1px solid ${C.border}` }}>
                <button onClick={() => setPicked([])} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: C.sub, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, padding: 0, marginBottom: 12 }}>
                  <span style={{ display: "flex", transform: "rotate(180deg)" }}><Icon.chevR width={15} height={15} /></span> 데이터 재선택
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: C.purple, background: "#EEE9FE", borderRadius: 7, padding: "4px 9px" }}>✦ AI 추천</span>
                  <button onClick={() => { setMethod(method === "union" ? "join" : "union"); setMethodSrc("user"); }} title="클릭해서 Union / Join 전환" style={{ fontSize: 17, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, color: C.text, padding: 0 }}>{method === "join" ? "Join" : "Union"}</button>
                  <span ref={infoRef} style={{ display: "flex", color: C.faint, cursor: "help" }} onMouseEnter={() => { const r = infoRef.current.getBoundingClientRect(); setInfoPos({ top: r.bottom + 12, left: Math.max(12, Math.min(r.left - 16, window.innerWidth - 332)) }); setInfoOpen(true); }} onMouseLeave={() => setInfoOpen(false)}>
                    <Icon.infoCircle width={15} height={15} />
                    {infoOpen && infoPos && (
                      <div style={{ position: "fixed", top: infoPos.top, left: infoPos.left, width: 320, background: "#18181B", color: "#fff", borderRadius: 14, padding: 16, zIndex: 60, boxShadow: "0 18px 44px rgba(0,0,0,0.34)", fontWeight: 400 }}>
                        <span style={{ position: "absolute", top: -7, left: 22, width: 14, height: 14, background: "#18181B", transform: "rotate(45deg)", borderRadius: 2 }} />
                        {method === "join" ? (<>
                          <div style={{ display: "flex", gap: 8, marginBottom: 13 }}>
                            <div style={{ flex: 1, background: "#fff", borderRadius: 9, overflow: "hidden" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", background: "#F3F4F6", padding: "6px 11px" }}><span>ID</span><span>AGE</span></div>
                              {[["001", "27"], ["002", "34"], ["003", "41"]].map((r, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: 12, color: "#3F3F46", padding: "5px 11px", borderTop: "1px solid #F1F1F3" }}><span style={{ color: "#5B9BFF", fontWeight: 600 }}>{r[0]}</span><span>{r[1]}</span></div>))}
                            </div>
                            <span style={{ display: "flex", alignItems: "center", color: "#71717A", fontSize: 13 }}>＋</span>
                            <div style={{ flex: 1, background: "#fff", borderRadius: 9, overflow: "hidden" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: 10.5, fontWeight: 700, color: "#9CA3AF", background: "#F3F4F6", padding: "6px 11px" }}><span>ID</span><span>CITY</span></div>
                              {[["001", "서울"], ["003", "부산"], ["—", "—"]].map((r, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontSize: 12, color: r[0] === "—" ? "#C4787880" : "#3F3F46", padding: "5px 11px", borderTop: "1px solid #F1F1F3" }}><span style={{ color: r[0] === "—" ? "#C4787880" : "#34C77B", fontWeight: 600 }}>{r[0]}</span><span>{r[1]}</span></div>))}
                            </div>
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 7 }}>옆으로 열을 이어 붙여요.</div>
                          <div style={{ fontSize: 12.5, color: "#D4D4D8", lineHeight: 1.7 }}>공통 키(예: 고객번호)가 같은 줄끼리 두 데이터를 <b style={{ color: "#fff" }}>옆으로</b> 붙여 칼럼을 늘려요. 기준 데이터의 행은 모두 유지되고, 키가 맞지 않으면 빈값(Null)이 돼요. 현재 <b style={{ color: "#fff" }}>Left join</b>만 지원해요.</div>
                        </>) : (<>
                        <div style={{ background: "#fff", borderRadius: 9, overflow: "hidden", marginBottom: 13 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: 0.4, background: "#F3F4F6", padding: "7px 14px" }}><span>ID</span><span>AGE</span><span>CLASS</span></div>
                          {[["001", "27", "A"], ["002", "34", "B"], ["003", "41", "A"], ["004", "29", "C"], ["005", "31", "B"], ["006", "38", "A"]].map((r, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", fontSize: 12.5, color: "#3F3F46", padding: "6px 14px", borderTop: i === 4 ? "2px solid #34C77B" : "1px solid #F1F1F3" }}><span>{r[0]}</span><span>{r[1]}</span><span>{r[2]}</span></div>
                          ))}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 7 }}>위아래로 테이블을 이어 붙여요.</div>
                        <div style={{ fontSize: 12.5, color: "#D4D4D8", lineHeight: 1.7 }}>같은 뜻의 칼럼끼리 두 데이터를 <b style={{ color: "#fff" }}>위아래로</b> 쌓아 행을 추가해요. 한쪽에만 있는 칼럼은 반대 쪽의 빈값(Null)으로 채워져요. 기준 칼럼은 첫번째 선택한 데이터셋이에요.</div>
                        </>)}
                      </div>
                    )}
                  </span>
                  <span style={{ fontSize: 13.5, color: C.sub }}>{method === "join" ? "Join columns side by side on a common key." : caseDef.line}</span>
                  <div style={{ flex: 1 }} />
                  <button onClick={() => onRun(picked.map(dsName))} style={{ background: C.dark, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT }}>{method === "join" ? "Merge" : "Run Union"}</button>
                </div>
              </div>
              <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, overflow: "auto", minHeight: 0, padding: "18px 28px", display: "flex", gap: 24 }}>
                  {(() => { const removed = matchRows.filter((m) => m[0] === null).length; const kept = matchRows.filter((m) => m[0] !== null).length; const joinMode = method === "join"; const banner = joinMode ? { tone: "info", text: "700 of the 1,000 base rows don't match and will be empty." } : caseDef.banner; const statRows = joinMode
                    ? [["Columns", <><b style={{ color: C.text }}>8</b> <span style={{ fontSize: 11, color: "#15803D", background: "#E6F8EC", borderRadius: 5, padding: "1px 7px" }}>+5 ↑</span></>], ["Rows", <><b style={{ color: C.text }}>1,000</b> <span style={{ fontSize: 11, color: C.faint, background: "#F3F4F6", borderRadius: 5, padding: "1px 7px" }}>No change</span></>], [<span onClick={() => setMatchPop(true)} title="What is match rate?" style={{ display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" }}>Match rate <span style={{ display: "flex", color: C.purple }}><Icon.infoCircle width={13} height={13} /></span></span>, <b style={{ color: "#DC2626" }}>30%</b>], ["Size", <b style={{ color: C.text }}>90 MB</b>]]
                    : [["Columns", <><b style={{ color: C.text }}>{kept}</b> <span style={{ fontSize: 11, color: C.faint, background: "#F3F4F6", borderRadius: 5, padding: "1px 7px" }}>Base kept</span></>], ["Rows", <><b style={{ color: C.text }}>1,000</b> <span style={{ fontSize: 11, color: "#15803D", background: "#E6F8EC", borderRadius: 5, padding: "1px 7px" }}>+500</span></>], ["Size", <b style={{ color: C.text }}>80.5 KB</b>], ...(removed ? [["Dropped columns", <span style={{ display: "flex", alignItems: "center", gap: 4 }}><b style={{ color: "#C2410C" }}>{removed}</b> <Icon.infoCircle width={13} height={13} /></span>]] : [])]; return (
                  <>
                  <div style={{ width: 300, flexShrink: 0, order: 2 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 12 }}>Expected result</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0, fontSize: 13.5, color: C.sub }}>
                      {statRows.map((row, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 2px", borderBottom: "1px solid #00000008" }}><span>┃ {row[0]}</span><span>{row[1]}</span></div>
                      ))}
                    </div>
                    {banner && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 14, padding: "12px 13px", borderRadius: 10, fontSize: 12.5, lineHeight: 1.55, background: banner.tone === "warn" ? "#FEF6EC" : "#EEF3FE", color: banner.tone === "warn" ? "#B45309" : "#3A63C0" }}>
                        <span style={{ display: "flex", flexShrink: 0, marginTop: 1 }}>{banner.tone === "warn" ? <Icon.warn width={14} height={14} /> : <Icon.infoCircle width={14} height={14} />}</span>
                        <span>{banner.text}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, order: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    {joinMode && <span style={{ display: "flex", color: C.sub }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 7a4 4 0 1 0-3.9 5L8 15v3h3v-2h2v-2h1.1A4 4 0 0 0 15 7z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
                    <span style={{ fontSize: 14.5, fontWeight: 700 }}>{joinMode ? "Join key" : "Column mapping"}</span>
                    <span style={{ fontSize: 12.5, color: C.faint, fontWeight: 600 }}>{joinMode ? `· 키 ${joinKeys.length}개로 연결` : `${matchRows.length} total`}</span>
                    {joinMode && <button onClick={() => { setJoinKeys((ks) => [{ a: null, b: null, au: 0, bu: 0, at: null, bt: null }, ...ks]); setEditKeyRow(0); setKeyMenu({ i: 0, side: "a" }); }} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: 600, fontFamily: FONT, color: C.purple, background: "none", border: "none", cursor: "pointer", padding: 0 }}>+ 키 추가</button>}
                  </div>
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: joinMode ? "visible" : "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", background: "#FAFAFB", borderBottom: `1px solid ${C.border}`, height: 50, borderRadius: "12px 12px 0 0" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "0 16px", fontSize: 14, fontWeight: 700 }}><span style={{ display: "flex", color: C.sub }}><Icon.db width={15} height={15} /></span>{dsName(picked[0])} <span style={{ fontSize: 12, fontWeight: 600, color: C.faint }}>(base)</span></div>
                      <button onClick={doSwap} title={joinMode ? "Swap base ↔ target (Left ↔ Right join)" : "Swap base ↔ target"} style={{ width: 44, display: "flex", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: joinMode ? C.purple : C.sub }}><svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M7 10l-3 3 3 3M4 13h12M17 14l3-3-3-3M20 11H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "0 16px", fontSize: 14, fontWeight: 700 }}><span style={{ display: "flex", color: C.sub }}><Icon.db width={15} height={15} /></span>{dsName(picked[1])}</div>
                    </div>
                    {joinMode ? joinKeys.map((k, i) => {
                      const editing = editKeyRow === i;
                      const cell = (side) => {
                        const val = side === "a" ? k.a : k.b;
                        const typ = side === "a" ? k.at : k.bt;
                        const cols = side === "a" ? A_COLS : B_COLS;
                        const open = keyMenu && keyMenu.i === i && keyMenu.side === side;
                        if (!editing) {
                          return (
                            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", height: 56 }}>
                              {side === "a" && <span style={{ display: "flex", color: val ? C.purple : C.border, flexShrink: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 7a4 4 0 1 0-3.9 5L8 15v3h3v-2h2v-2h1.1A4 4 0 0 0 15 7z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
                              <span style={{ fontSize: 14, fontWeight: val ? 600 : 500, color: val ? C.text : C.faint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{val || "컬럼 선택"}</span>
                              {val && <span style={{ fontSize: 12.5, color: C.faint, flexShrink: 0 }}>{typ}</span>}
                            </div>
                          );
                        }
                        return (
                          <div style={{ flex: 1, minWidth: 0, position: "relative", padding: "0 12px" }}>
                            <button onClick={() => setKeyMenu(open ? null : { i, side })} style={{ width: "100%", display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${open ? C.purple : C.border}`, borderRadius: 8, cursor: "pointer", fontFamily: FONT, padding: "0 11px", height: 38, color: val ? C.text : C.faint }}>
                              <span style={{ fontSize: 13.5, fontWeight: val ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{val || "컬럼 선택"}</span>
                              {val && <span style={{ fontSize: 12, color: C.faint, flexShrink: 0 }}>{typ}</span>}
                              <span style={{ display: "flex", color: C.faint, marginLeft: "auto", flexShrink: 0 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                            </button>
                            {open && <>
                              <div onClick={() => setKeyMenu(null)} style={{ position: "fixed", inset: 0, zIndex: 21 }} />
                              <div style={{ position: "absolute", top: "100%", left: 12, right: 12, zIndex: 22, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.13)", overflow: "hidden", marginTop: 2 }}>
                                {cols.map((c, ci) => (
                                  <button key={c.name} onClick={() => { setJoinKeys((ks) => ks.map((x, j) => j === i ? (side === "a" ? { ...x, a: c.name, au: c.u, at: c.t } : { ...x, b: c.name, bu: c.u, bt: c.t }) : x)); setKeyMenu(null); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: val === c.name ? "#F5F3FF" : "#fff", border: "none", borderTop: ci ? `1px solid ${C.borderSoft}` : "none", cursor: "pointer", fontFamily: FONT, fontSize: 13.5, color: C.text }}>
                                    <span>{c.name}</span>
                                    <span style={{ fontSize: 12, color: C.faint }}>{c.t}</span>
                                    <span style={{ marginLeft: "auto", fontSize: 11, color: c.u < 90 ? "#B45309" : C.faint, background: c.u < 90 ? "#FEF6EC" : "#F3F4F6", borderRadius: 5, padding: "1px 7px" }}>고유 {c.u}%</span>
                                  </button>
                                ))}
                              </div>
                            </>}
                          </div>
                        );
                      };
                      return (
                      <div key={i} onMouseEnter={() => setHoverRow(i)} onMouseLeave={() => setHoverRow(-1)} style={{ display: "flex", alignItems: "center", minHeight: 56, borderTop: `1px solid ${C.borderSoft}`, background: editing ? "#FAFAFF" : hoverRow === i ? "#FAFAFB" : "#fff" }}>
                        {cell("a")}
                        <span style={{ width: 44, display: "flex", justifyContent: "center", color: k.a && k.b ? C.purple : C.border, flexShrink: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        {cell("b")}
                        {editing
                          ? <button onClick={() => { setEditKeyRow(-1); setKeyMenu(null); }} title="완료" style={{ width: 48, flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: C.purple, fontWeight: 700, fontSize: 12.5, fontFamily: FONT }}>완료</button>
                          : <button onClick={() => { setEditKeyRow(i); setKeyMenu(null); }} title="키 수정" style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: C.faint, opacity: hoverRow === i ? 1 : 0, transition: "opacity .12s" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L18.5 9.5l-4-4L4 16v4zM13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
                        {joinKeys.length > 1
                          ? <button onClick={() => { setJoinKeys((ks) => ks.filter((_, j) => j !== i)); setKeyMenu(null); setEditKeyRow(-1); }} title="이 키 쌍 삭제" style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center", background: "none", border: "none", cursor: "pointer", color: C.faint }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
                          : <span style={{ width: 40, flexShrink: 0 }} />}
                      </div>
                      );
                    }) : matchRows.map(([l, rr], i) => (
                      <div key={i} onMouseEnter={() => setHoverRow(i)} onMouseLeave={() => setHoverRow(-1)} style={{ display: "flex", alignItems: "center", height: 52, borderTop: `1px solid ${C.borderSoft}`, background: editRow === i ? "#FAF8FF" : hoverRow === i ? "#FAFAFB" : "#fff" }}>
                        <div style={{ flex: 1, padding: "0 16px", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>{l ? <><span style={{ color: C.faint }}>#</span>{l} <span style={{ color: C.faint, fontSize: 12.5 }}>String</span></> : <span style={{ color: C.faint }}>—</span>}</div>
                        <span style={{ width: 44, display: "flex", justifyContent: "center", color: rr ? C.purple : C.border }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M10 14a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M14 10a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        <div style={{ flex: 1, padding: "0 16px", display: "flex", alignItems: "center", gap: 10 }}>
                          {editRow === i ? (
                            <>
                              <select autoFocus onBlur={() => setEditRow(-1)} value={rr || "__none"} onChange={(e) => { const v = e.target.value === "__none" ? null : e.target.value; setMatchRows((rows) => rows.map((row, idx) => idx === i ? [row[0], v] : row)); }} style={{ flex: 1, height: 40, padding: "0 12px", border: `1.5px solid ${C.purple}`, borderRadius: 9, background: "#fff", fontSize: 14, fontFamily: FONT, color: C.text, cursor: "pointer", outline: "none", boxShadow: "0 2px 8px rgba(80,60,160,0.12)" }}>
                                <option value="__none">매칭 안 함 (제거)</option>
                                {T2_OPTIONS.filter((o) => o !== "매칭 안 함").map((o) => <option key={o} value={o}>{o}</option>)}
                                {rr && !T2_OPTIONS.includes(rr) && <option value={rr}>{rr}</option>}
                              </select>
                              <button onClick={() => setEditRow(-1)} style={{ fontSize: 12.5, fontWeight: 700, color: C.purple, background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}>완료</button>
                            </>
                          ) : l === null ? (
                            <>
                              <span style={{ flex: 1, fontSize: 14, color: C.sub, textDecoration: "line-through", textDecorationColor: "#D4787880" }}>{rr}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#C2410C", background: "#FEF1EC", borderRadius: 6, padding: "3px 9px" }}>제거</span>
                            </>
                          ) : (
                            <>
                              <span onClick={() => setEditRow(i)} title="매칭 수정" style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: rr ? C.text : C.faint, cursor: "pointer" }}>
                                {rr || "-"}
                                <span style={{ display: "flex", color: C.purple, opacity: hoverRow === i ? 1 : 0, transition: "opacity .12s" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 20h4L18.5 9.5l-4-4L4 16v4zM13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                              </span>
                              {rr
                                ? <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, border: `1px solid ${ERD_TONE.purple.line}`, borderRadius: 6, padding: "3px 9px" }}>매칭</span>
                                : <span style={{ fontSize: 11, fontWeight: 600, color: C.faint, background: "#F3F4F6", borderRadius: 6, padding: "3px 9px" }}>매칭 칼럼 없음</span>}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {joinMode && joinKeys.length > 1 && <p style={{ fontSize: 12, color: C.sub, margin: "10px 0 0", display: "flex", alignItems: "flex-start", gap: 5, lineHeight: 1.5 }}><span style={{ display: "flex", flexShrink: 0, marginTop: 1, color: C.faint }}><Icon.infoCircle width={13} height={13} /></span>키를 추가하면 둘 다 일치하는 행만 매칭돼요. 매칭이 줄 수 있어요.</p>}
                  {joinMode && (() => {
                    const med = "#9DC0F7", light = "#E4EEFC", empty = "#F3F4F6";
                    const VZ = {
                      left:  { sub: "A 전체 + B에서 일치하는 것만 결합돼요.", a: med,   b: empty, legend: [["fill", "값 채움", "920행"], ["empty", "빈칸", "90행"]] },
                      right: { sub: "B 전체 + A에서 일치하는 것만 결합돼요.", a: empty, b: med,   legend: [["fill", "값 채움", "800행"], ["empty", "빈칸", "30행"]] },
                      inner: { sub: "A · B 둘 다 있는 것만 남아요. 한쪽에만 있으면 사라져요.", a: empty, b: empty, legend: [["fill", "값 채움", "920행"], ["empty", "제거", "800행"]] },
                      outer: { sub: "A · B 전부 남아요. 짝이 없는 행은 반대쪽이 빈칸으로 채워져요.", a: "hatch", b: light, legend: [["fill", "양쪽 매칭", "400행"], ["hatch", "A만 있음 → B 빈칸", "80행"], ["light", "B만 있음 → A 빈칸", "80행"]] },
                    };
                    const TYPES = ["left", "right", "inner", "outer"];
                    const vt = VZ[joinViz] || VZ.left;
                    const fillOf = (v) => v === "hatch" ? "url(#vennHatch)" : v;
                    const swatch = (kind) => kind === "hatch" ? "repeating-linear-gradient(45deg,#E4EEFC,#E4EEFC 3px,#9DC0F7 3px,#9DC0F7 4px)" : kind === "fill" ? med : kind === "light" ? light : "#fff";
                    return (
                    <div style={{ marginTop: 28 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ display: "flex", color: C.sub }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.7" /><rect x="13" y="4" width="8" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.7" strokeDasharray="2.4 2.4" /></svg></span>
                          <span style={{ fontSize: 14.5, fontWeight: 700 }}>결합 방식을 선택하세요</span>
                        </span>
                        <button onClick={() => setJoinModal(true)} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: 600, fontFamily: FONT, color: C.purple, background: "none", border: "none", cursor: "pointer", padding: 0 }}>예시 설명 보러가기 <span style={{ display: "flex" }}><Icon.chevR width={14} height={14} /></span></button>
                      </div>
                      <p style={{ fontSize: 12.5, color: C.faint, margin: "0 0 14px" }}>{vt.sub}</p>
                      <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                          <div style={{ display: "inline-flex", background: "#F1F2F4", borderRadius: 10, padding: 4, gap: 2 }}>
                            {TYPES.map((t) => (
                              <button key={t} onClick={() => setJoinViz(t)} style={{ fontSize: 13.5, fontWeight: 600, fontFamily: FONT, border: "none", cursor: "pointer", borderRadius: 7, padding: "7px 20px", background: joinViz === t ? "#fff" : "transparent", color: joinViz === t ? C.text : C.faint, boxShadow: joinViz === t ? "0 1px 3px rgba(0,0,0,0.12)" : "none" }}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 44 }}>
                          <svg width="260" height="150" viewBox="0 0 260 150" fill="none">
                            <defs>
                              <clipPath id="vennClipA"><circle cx="100" cy="75" r="58" /></clipPath>
                              <pattern id="vennHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><rect width="7" height="7" fill={light} /><line x1="0" y1="0" x2="0" y2="7" stroke="#9DC0F7" strokeWidth="2.4" /></pattern>
                            </defs>
                            <circle cx="100" cy="75" r="58" fill={fillOf(vt.a)} />
                            <circle cx="160" cy="75" r="58" fill={fillOf(vt.b)} />
                            <g clipPath="url(#vennClipA)"><circle cx="160" cy="75" r="58" fill={med} /></g>
                            <circle cx="100" cy="75" r="58" fill="none" stroke="#A9C4EE" strokeWidth="1.4" />
                            <circle cx="160" cy="75" r="58" fill="none" stroke="#A9C4EE" strokeWidth="1.4" />
                            <text x="70" y="81" fontSize="15" fontWeight="700" fill={C.text} fontFamily={FONT}>A</text>
                            <text x="186" y="81" fontSize="15" fontWeight="700" fill={C.text} fontFamily={FONT}>B</text>
                          </svg>
                          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                            {vt.legend.map(([kind, label, val], i) => (
                              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: C.sub }}>
                                <span style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `1px solid ${C.border}`, background: swatch(kind) }} />
                                <span>{label} : <b style={{ color: C.text }}>{val}</b></span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    ); })()}
                  {matchPop && (() => {
                    const keyIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M15 7a4 4 0 1 0-3.9 5L8 15v3h3v-2h2v-2h1.1A4 4 0 0 0 15 7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
                    const A = [["1", "정민경"], ["2", "김철수"], ["3", "한영희"]];
                    const B = [["1", "노트북"], ["1", "마우스"], ["2", "키보드"], ["4", "모니터"]];
                    const RES = [["1", "정민경", "노트북", true], ["1", "정민경", "마우스", true], ["2", "김철수", "키보드", true], ["3", "한영희", null, false]];
                    const SrcTbl = ({ label, base, head, rows }) => (
                      <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700 }}>{label}</span>
                          {base && <span style={{ fontSize: 11, fontWeight: 700, color: C.sub, background: "#EEF0F3", borderRadius: 6, padding: "2px 8px" }}>기준</span>}
                        </div>
                        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", background: "#FAFAFB", borderBottom: `1px solid ${C.border}`, fontSize: 12, fontWeight: 700, color: C.faint, padding: "10px 14px" }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.purple }}>{keyIcon}{head[0]}</span><span>{head[1]}</span></div>
                          {rows.map(([k, v], i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", fontSize: 13.5, padding: "11px 14px", borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}><span style={{ color: C.sub }}>{k}</span><span>{v}</span></div>))}
                        </div>
                      </div>
                    );
                    return (
                    <div onClick={() => setMatchPop(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,18,22,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
                      <div onClick={(e) => e.stopPropagation()} style={{ width: 620, maxWidth: "94vw", maxHeight: "88vh", overflow: "auto", background: "#fff", borderRadius: 18, padding: "24px 28px 22px", boxShadow: "0 24px 64px rgba(0,0,0,0.32)", fontFamily: FONT }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                          <div style={{ fontSize: 18, fontWeight: 800 }}>매칭률이 무엇을 의미하나요?</div>
                          <button onClick={() => setMatchPop(false)} style={{ display: "flex", background: "none", border: "none", cursor: "pointer", color: C.faint, padding: 2 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
                        </div>
                        <div style={{ fontSize: 13.5, color: C.sub, lineHeight: 1.6, marginBottom: 22 }}>조인 키가 양쪽에서 <b style={{ color: C.text }}>일치하는 기준 행</b>의 비율이에요. 일치하면 값이 채워지고, 짝이 없으면 <b style={{ color: C.text }}>빈칸(null)</b>이 돼요.</div>

                        <div style={{ display: "flex", gap: 24, marginBottom: 6, flexWrap: "wrap" }}>
                          <SrcTbl label="A  고객 데이터" base head={["고객 ID", "이름"]} rows={A} />
                          <SrcTbl label="B  주문 데이터" head={["고객 ID", "상품"]} rows={B} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 18px" }}>
                          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.border}`, color: C.faint }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                        </div>

                        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Join 결과</div>
                        <div style={{ fontSize: 13, color: C.faint, lineHeight: 1.6, marginBottom: 10 }}>기준 데이터를 기준으로 매칭되는 주문만 붙어요. 짝이 없으면 null(빈값)으로 처리돼요.</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 800, color: C.purple, marginBottom: 12 }}><span style={{ display: "flex" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15l-1.8-4.2L5.5 9l4.7-1.3L12 3z" fill="currentColor" /></svg></span>매칭률 67% <span style={{ fontSize: 12.5, fontWeight: 600, color: C.faint }}>· 기준 3행 중 2행</span></div>

                        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1fr 1.4fr", fontSize: 12.5, fontWeight: 700, color: C.faint, background: "#FAFAFB", padding: "11px 16px", borderBottom: `1px solid ${C.border}` }}><span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.purple }}>{keyIcon}고객 ID</span><span>이름</span><span>상품</span></div>
                          {RES.map(([id, nm, prod, ok], i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "0.8fr 1fr 1.4fr", fontSize: 13.5, borderTop: i ? `1px solid ${C.borderSoft}` : "none", alignItems: "center" }}>
                              <span style={{ color: C.sub, padding: "13px 16px" }}>{id}</span>
                              <span style={{ padding: "13px 16px" }}>{nm}</span>
                              <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", background: ok ? "#EAF1FF" : "repeating-linear-gradient(45deg,#F7F8FA,#F7F8FA 6px,#ECEEF1 6px,#ECEEF1 7px)" }}>
                                {ok ? <><span>{prod}</span><span style={{ fontSize: 11, fontWeight: 700, color: C.purple, background: "#D8E6FE", borderRadius: 6, padding: "2px 9px" }}>매칭</span></>
                                    : <span style={{ color: C.faint, fontStyle: "italic" }}>null</span>}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5, color: C.sub, lineHeight: 1.5, background: "#F7F8FA", borderRadius: 10, padding: "13px 15px", marginTop: 14 }}>
                          <span><b style={{ color: C.purple }}>● 매칭</b> &nbsp;고객 1·2 → 주문에 같은 ID가 있어 값이 채워져요.</span>
                          <span><b style={{ color: "#9CA3AF" }}>◌ 미매칭</b> &nbsp;고객 3(한영희) → 주문에 없어 빈칸(null).</span>
                          <span><b style={{ color: "#9CA3AF" }}>– 제외</b> &nbsp;주문 4(모니터) → 기준(고객)에 없어 결과에서 빠져요.</span>
                        </div>
                        <div style={{ marginTop: 14, padding: "13px 15px", borderRadius: 10, background: "#EEF3FE", color: "#3A63C0", fontSize: 13, lineHeight: 1.55 }}>기준 <b>3행 중 2행</b>이 연결돼요 → <b>매칭률 67%</b>. 나머지 1행(한영희)은 붙는 칼럼이 빈칸이 돼요.</div>

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
                          <button onClick={() => setMatchPop(false)} style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT, color: C.sub, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 22px", cursor: "pointer" }}>취소</button>
                          <button onClick={() => setMatchPop(false)} style={{ fontSize: 14, fontWeight: 700, fontFamily: FONT, color: "#fff", background: C.dark, border: "none", borderRadius: 10, padding: "10px 26px", cursor: "pointer" }}>확인</button>
                        </div>
                      </div>
                    </div>
                    ); })()}
                  {joinModal && (() => { const vz = JOIN_VIZ.left; const lite = "#E4EEFC", med = "#9DC0F7", dark = "#4F86E8"; const aFill = med, bFill = lite; return (
                    <div onClick={() => setJoinModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(17,18,22,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
                      <div onClick={(e) => e.stopPropagation()} style={{ width: 620, maxWidth: "94vw", maxHeight: "88vh", overflow: "auto", background: "#fff", borderRadius: 18, padding: "22px 26px 26px", boxShadow: "0 24px 64px rgba(0,0,0,0.32)", fontFamily: FONT }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
                          <div style={{ fontSize: 16, fontWeight: 800 }}>조인 결과 <span style={{ fontWeight: 600, color: C.faint }}>— 예시로 보기</span></div>
                          <button onClick={() => setJoinModal(false)} style={{ display: "flex", background: "none", border: "none", cursor: "pointer", color: C.faint, padding: 2 }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
                        </div>
                        <div style={{ fontSize: 12.5, color: C.faint, marginBottom: 18 }}>기준 데이터(고객)의 모든 행을 남기고, 공통 키로 매칭되는 행을 옆에 붙여요. 짝이 없으면 빈 값(NULL)이 돼요.</div>

                        <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
                          {[{ t: "고객 (A)", h: ["id", "이름"], rows: JOIN_A }, { t: "주문 (B)", h: ["고객id", "상품"], rows: JOIN_B }].map((tb, ti) => (
                            <div key={ti} style={{ flex: "1 1 240px", border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: "#3A63C0", padding: "10px 14px 8px" }}>{tb.t}</div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", fontSize: 11.5, fontWeight: 600, color: C.faint, padding: "0 14px 6px" }}>{tb.h.map((h, i) => <span key={i}>{h}</span>)}</div>
                              {tb.rows.map((r, i) => (<div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", fontSize: 13, color: C.text, padding: "6px 14px", borderTop: `1px solid ${C.borderSoft}` }}><span style={{ color: C.sub }}>{r[0]}</span><span>{r[1]}</span></div>))}
                            </div>
                          ))}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 20 }}>
                          <svg width="260" height="160" viewBox="0 0 260 160" fill="none">
                            <defs><clipPath id="vennModalA"><circle cx="100" cy="80" r="60" /></clipPath></defs>
                            <circle cx="100" cy="80" r="60" fill={aFill} stroke="#6BA0F0" strokeWidth="1.4" />
                            <circle cx="160" cy="80" r="60" fill={bFill} stroke="#6BA0F0" strokeWidth="1.4" />
                            <circle cx="160" cy="80" r="60" fill={dark} clipPath="url(#vennModalA)" />
                            <text x="68" y="87" fontSize="15" fontWeight="700" fill="#1F2937" fontFamily={FONT}>기준</text>
                            <text x="172" y="87" fontSize="15" fontWeight="700" fill="#1F2937" fontFamily={FONT}>추가</text>
                          </svg>
                          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0.3, marginTop: 6 }}>기준(고객) 데이터를 다 살려요</div>
                          <div style={{ fontSize: 13, color: C.sub, textAlign: "center", maxWidth: 460, lineHeight: 1.55 }}>기준 행은 모두 남고, 매칭되는 주문만 붙어요. 짝이 없으면 NULL이에요 (영희 = 주문 없음).</div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.sub }}>결과 <span style={{ fontWeight: 500, color: C.faint }}>(id로 매칭)</span></span>
                          <span style={{ fontSize: 12.5, color: C.faint }}>{vz.rows.length} rows</span>
                        </div>
                        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
                          <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 1fr", fontSize: 12, fontWeight: 700, color: C.faint, background: "#FAFAFB", padding: "10px 16px", borderBottom: `1px solid ${C.border}` }}><span>id</span><span>이름</span><span>상품</span></div>
                          {vz.rows.map((r, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 1fr", fontSize: 13.5, padding: "11px 16px", borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
                              {r.map((c, j) => <span key={j} style={{ color: c === null ? "#DC2626" : (j === 0 ? C.sub : C.text), fontWeight: c === null ? 700 : 400 }}>{c === null ? "NULL" : c}</span>)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ); })()}
                  </div>
                  </>
                  ); })()}
                </div>
                <div style={{ flexShrink: 0, background: "#F6F7F9", borderTop: `1px solid ${C.border}` }}>
                  <div onMouseDown={(e) => { resizeRef.current = { startY: e.clientY, startH: tableH }; document.body.style.userSelect = "none"; }} title="드래그해서 높이 조절" style={{ height: 14, cursor: "ns-resize", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 44, height: 4, borderRadius: 2, background: "#C7CBD1" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px 11px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>테이블 결과 <span style={{ fontSize: 11.5, fontWeight: 500, color: C.faint }}>· 미리보기</span></span>
                    <button onClick={() => matchDirty && applyMatch()} disabled={!matchDirty} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, fontFamily: FONT, borderRadius: 8, padding: "6px 12px", cursor: matchDirty ? "pointer" : "default", border: matchDirty ? "none" : `1px solid ${C.border}`, background: matchDirty ? C.purple : "#fff", color: matchDirty ? "#fff" : C.faint }}>수정 업데이트 <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                  </div>
                </div>
                <div style={{ height: tableH, flexShrink: 0, overflow: "auto", background: "#fff" }}>
                  {tableLoading ? (
                    <div style={{ minWidth: "fit-content" }}>
                      <div style={{ display: "flex", background: "#FAFAFB", borderBottom: `1px solid ${C.border}` }}>
                        {appliedRows.map((_, i) => <div key={i} style={{ width: i === 0 ? 160 : 140, flexShrink: 0, padding: "14px 16px" }}><span style={{ display: "block", height: 10, borderRadius: 5, background: "#E6E8EC" }} /></div>)}
                      </div>
                      {Array.from({ length: 11 }).map((_, r) => (
                        <div key={r} style={{ display: "flex", borderBottom: "1px solid #00000008" }}>
                          {appliedRows.map((_, i) => <div key={i} style={{ width: i === 0 ? 160 : 140, flexShrink: 0, padding: "13px 16px" }}><span style={{ display: "block", height: 9, width: i % 3 === 1 ? "55%" : "80%", borderRadius: 5, background: "#EEF0F3" }} /></div>)}
                        </div>
                      ))}
                    </div>
                  ) : (() => {
                    const joinMode = method === "join";
                    const cols = appliedRows.map(([l]) => l);          // 적용된 매칭 기준 칼럼
                    const matched = appliedRows.map(([, rcol]) => !!rcol); // 추가에 매칭이 있나
                    const cell = (name, i, k, isNull) => <div key={i} style={{ width: i === 0 ? 160 : 140, flexShrink: 0, padding: "11px 16px", fontSize: 13, color: isNull ? C.faint : C.text, fontStyle: isNull ? "italic" : "normal", background: isNull ? "#F4F4F6" : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isNull ? "null" : colVal(name, k)}</div>;
                    return joinMode ? (() => {
                      const extra = Math.min(2, Math.max(1, cols.length - 1));   // 오른쪽 붙는 컬럼 수
                      const baseN = cols.length - extra;
                      const isAdd = (i) => i >= baseN;
                      return (
                      <div style={{ minWidth: "fit-content" }}>
                        <div style={{ display: "flex", background: "#fff", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0 }}>
                          {cols.map((name, i) => <div key={i} style={{ width: i === 0 ? 160 : 140, flexShrink: 0, padding: "12px 16px", fontSize: 12.5, fontWeight: 600, color: C.sub, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, background: isAdd(i) ? "#EFF4FF" : "#fff", boxShadow: isAdd(i) && i === baseN ? "inset 1px 0 0 #D4E2FB" : "none" }}><span style={{ color: C.faint, fontSize: 11 }}>{colType(name) === "key" ? "🔑" : colType(name)}</span>{name}{isAdd(i) && i === baseN && <span style={{ fontSize: 10, fontWeight: 700, color: C.blue, marginLeft: 2 }}>붙는 컬럼 →</span>}</div>)}
                        </div>
                        {Array.from({ length: 20 }).map((_, r) => { const k = ((picked[0] || 0) + 1) * 7 + r; const rowMatched = (r % 10) < 3; return (
                          <div key={r} style={{ display: "flex", borderBottom: "1px solid #00000008" }}>{cols.map((name, i) => { const nul = isAdd(i) && !rowMatched; return (<div key={i} style={{ width: i === 0 ? 160 : 140, flexShrink: 0, padding: "11px 16px", fontSize: 13, color: nul ? C.faint : C.text, fontStyle: nul ? "italic" : "normal", background: isAdd(i) ? "#F7FAFF" : "transparent", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{nul ? "null" : colVal(name, k)}</div>); })}</div>
                        ); })}
                      </div>
                      ); })() : (
                      <div style={{ minWidth: "fit-content" }}>
                        <div style={{ display: "flex", background: "#fff", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0 }}>
                          {cols.map((name, i) => <div key={i} style={{ width: i === 0 ? 160 : 140, flexShrink: 0, padding: "12px 16px", fontSize: 12.5, fontWeight: 600, color: matched[i] ? C.sub : C.faint, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: C.faint, fontSize: 11 }}>{colType(name) === "key" ? "🔑" : colType(name)}</span>{name}</div>)}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#EFF4FF", fontSize: 12.5, fontWeight: 700, color: C.blue }}>{dsName(picked[0])} <span style={{ fontWeight: 500, color: C.faint }}>· 기준</span></div>
                        {Array.from({ length: 20 }).map((_, r) => { const k = ((picked[0] || 0) + 1) * 7 + r; return (
                          <div key={"b" + r} style={{ display: "flex", borderBottom: "1px solid #00000008" }}>{cols.map((name, i) => cell(name, i, k, false))}</div>
                        ); })}
                        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "#EAF7EE", fontSize: 12.5, fontWeight: 700, color: "#15803D" }}>{dsName(picked[1])} <span style={{ fontWeight: 500, color: C.faint }}>· 추가되는 행</span></div>
                        {Array.from({ length: 20 }).map((_, r) => { const k = ((picked[1] || 0) + 1) * 7 + r; return (
                          <div key={"a" + r} style={{ display: "flex", borderBottom: "1px solid #00000008" }}>{cols.map((name, i) => cell(name, i, k, !matched[i]))}</div>
                        ); })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
 *  Root
 * ========================================================= */
function AskAIBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, fontFamily: FONT, color: C.text, background: "transparent", border: "none", cursor: "pointer", padding: "6px 8px", whiteSpace: "nowrap" }}>
      <span style={{ color: WB_BLUE, display: "flex" }}><Icon.spark /></span> Ask AI
    </button>
  );
}
function TopBar({ crumb, onAsk }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: `1px solid ${C.border}`, background: C.panel, flexShrink: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{crumb}</span>
      <AskAIBtn onClick={onAsk} />
    </div>
  );
}
const ASK_CONVOS = [
  { id: 1, title: "내 데이터셋 목록", time: "42분 전", group: "current", messages: [
    { role: "user", text: "내 데이터셋 목록 보여줘" },
    { role: "ai", text: "현재 6개 데이터셋이 있어요. AI Ready 2 · Caution 2 · Critical 1. 가장 최근 업데이트는 CUBIG Data v2예요." },
  ] },
  { id: 2, title: "이상탐지 데이터 추천", time: "3일 전", group: "recent", messages: [
    { role: "user", text: "이상탐지에 쓸 만한 데이터 알려줘" },
    { role: "ai", text: "customers_clean_dataset.csv가 적합해요. 결측 0%이고 라벨이 포함돼 있어 바로 학습·평가에 쓸 수 있어요." },
  ] },
  { id: 3, title: "정제 효과 요약", time: "1주 전", group: "recent", messages: [
    { role: "user", text: "정제하면 뭐가 좋아져?" },
    { role: "ai", text: "정제 후 재현율 +28%p, PR-AUC +0.29 개선이 예상돼요. 정상/이상 점수 분포가 더 벌어집니다." },
  ] },
];
const ASK_PROMPTS = ["내 데이터셋 목록 보여줘", "2024분기 데이터셋 찾아줘", "AI 준비도 낮은 데이터 알려줘"];
function AskAIPanel({ onClose }) {
  const [active, setActive] = useState(null); // 선택된 대화 객체 (null = New chat)
  const [histOpen, setHistOpen] = useState(false);
  const open = (c) => { setActive(c); setHistOpen(false); };
  const startPrompt = (p) => setActive({ id: "tmp", title: p, messages: [{ role: "user", text: p }, { role: "ai", text: "(데모) 요청을 분석하고 있어요…" }] });
  const inputBox = (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 14px 11px" }}>
      <div style={{ fontSize: 14, color: C.faint }}>무엇을 도와드릴까요?</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
        <span onClick={() => setActive(null)} title="새 채팅" style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub, cursor: "pointer", fontSize: 16 }}>+</span>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: WB_BLUE, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </div>
    </div>
  );
  const convoRow = (c) => (
    <div key={c.id} onClick={() => open(c)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "10px 10px", borderRadius: 8, cursor: "pointer" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F5F6F8")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      <span style={{ fontSize: 13.5, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 12, color: C.faint }}>{c.time}</span>
        <span title="삭제" style={{ display: "flex", color: C.faint, cursor: "pointer" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V5h6v2m-8 0 1 13h8l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      </span>
    </div>
  );
  return (
    <div style={{ width: 360, flexShrink: 0, height: "100%", background: "#fff", borderLeft: `1px solid ${C.border}`, display: "flex", flexDirection: "column", fontFamily: FONT, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Ask AI</span>
        <span style={{ display: "flex", gap: 14, alignItems: "center", color: C.faint }}>
          <span onClick={() => setHistOpen((o) => !o)} title="대화 목록" style={{ display: "flex", cursor: "pointer", color: histOpen ? WB_BLUE : C.faint }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
          <span onClick={onClose} style={{ display: "flex", cursor: "pointer" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
        </span>
      </div>

      {histOpen && (
        <>
          <div onClick={() => setHistOpen(false)} style={{ position: "absolute", inset: 0, top: 53, zIndex: 4 }} />
          <div style={{ position: "absolute", top: 50, left: 12, right: 12, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 14px 36px rgba(0,0,0,0.14)", zIndex: 5, padding: 10, maxHeight: "70%", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.border}`, borderRadius: 9, padding: "8px 11px", marginBottom: 10 }}>
              <span style={{ color: C.faint, display: "flex" }}><Icon.search /></span>
              <input placeholder="대화 검색…" style={{ border: "none", outline: "none", flex: 1, fontSize: 13.5, fontFamily: FONT, background: "transparent" }} />
            </div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.faint, padding: "4px 10px" }}>Current</div>
            {ASK_CONVOS.filter((c) => c.group === "current").map(convoRow)}
            <div style={{ fontSize: 11.5, fontWeight: 600, color: C.faint, padding: "10px 10px 4px" }}>Recent</div>
            {ASK_CONVOS.filter((c) => c.group === "recent").map(convoRow)}
          </div>
        </>
      )}

      {active ? (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.faint, marginBottom: 14 }}>{active.title}</div>
            {active.messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                <div style={{ maxWidth: "82%", background: m.role === "user" ? WB_BLUE_BG : "#F2F4F6", color: C.text, borderRadius: 12, padding: "10px 13px", fontSize: 13.5, lineHeight: 1.55 }}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "0 18px 18px" }}>{inputBox}</div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", padding: "22px 18px" }}>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>New chat</div>
          {inputBox}
          <div style={{ marginTop: 8 }}>
            {ASK_PROMPTS.map((p, i) => (
              <div key={i} onClick={() => startPrompt(p)} style={{ fontSize: 14, color: C.text, padding: "14px 4px", borderTop: `1px solid ${C.borderSoft}`, cursor: "pointer" }}>{p}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
const UPLOAD_POOL = [
  { size: "CSV · 58.2KB · 8,432행", est: "~40초" },
  { size: "CSV · 1.2MB · 96,120행", est: "~2분" },
  { size: "CSV · 340KB · 24,900행", est: "~1분" },
  { size: "CSV · 4.8MB · 412,000행", est: "~5분" },
  { size: "CSV · 88KB · 3,100행", est: "~50초" },
];
function UploadModal({ onClose, onStart }) {
  const [files, setFiles] = useState([]);
  const [tip, setTip] = useState(false);
  const add = () => setFiles((f) => (f.length >= 5 ? f : [...f, { name: "CUBIG Data.csv", size: UPLOAD_POOL[f.length].size, est: UPLOAD_POOL[f.length].est, purpose: "" }]));
  const setP = (i, v) => setFiles((f) => f.map((x, j) => (j === i ? { ...x, purpose: v } : x)));
  const rm = (i) => setFiles((f) => f.filter((_, j) => j !== i));
  const canStart = files.length > 0 && files.every((x) => x.purpose.trim());
  const estSec = (est) => { const n = parseFloat(String(est || "1분").replace(/[^0-9.]/g, "")) || 1; return String(est).includes("초") ? n : n * 60; };
  const maxEst = files.length ? files.reduce((a, b) => (estSec(a.est) >= estSec(b.est) ? a : b)).est : null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,18,22,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 720, maxWidth: "94vw", maxHeight: "90vh", overflow: "auto", background: "#fff", borderRadius: 18, padding: "24px 28px", boxShadow: "0 24px 64px rgba(0,0,0,0.32)", fontFamily: FONT }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ fontSize: 18, fontWeight: 800 }}>Upload data</span>{files.length > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: C.sub, background: "#F2F4F6", borderRadius: 20, padding: "3px 10px" }}>{files.length}/5</span>}</div>
            <button onClick={onClose} style={{ display: "flex", background: "none", border: "none", cursor: "pointer", color: C.faint }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></button>
          </div>
          <div style={{ fontSize: 13, color: C.sub, marginTop: 7, lineHeight: 1.5 }}>업로드하면 품질·결측·이상치·컨텍스트를 점검하는 <b style={{ fontWeight: 600, color: C.text }}>프로파일링</b>을 해요.</div>
        </div>
        {files.length === 0 ? (
          <div onClick={add} style={{ border: `1.5px dashed ${C.border}`, borderRadius: 14, minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, cursor: "pointer" }}>
            <span style={{ width: 46, height: 46, borderRadius: 12, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.sub }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" /><path d="M12 11v6M9 14h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></span>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>Click or drag files to upload</div>
            <div style={{ fontSize: 12.5, color: C.faint }}>Up to 100MB · 100–10,000 rows / 100 columns</div>
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>{["CSV", "XLSX", "XLS"].map((t) => <span key={t} style={{ fontSize: 11, color: C.sub, border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 8px" }}>{t}</span>)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 26, flexWrap: "wrap", justifyContent: "center" }}>
              <span style={{ fontSize: 12, color: C.faint }}>업로드하면</span>
              {["품질·결측 점검", "이상치 탐지", "컨텍스트 요약"].map((t) => <span key={t} style={{ fontSize: 11.5, fontWeight: 500, color: WB_BLUE, background: WB_BLUE_BG, borderRadius: 20, padding: "3px 10px" }}>{t}</span>)}
              <span style={{ fontSize: 12, color: C.faint }}>을 자동 진단해요</span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 4px 8px", fontSize: 12.5, color: C.faint, fontWeight: 600 }}><span>Uploaded Data</span><span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4, width: "fit-content" }}>Data purpose <span style={{ color: "#E5484D" }}>*</span><span onMouseEnter={() => setTip(true)} onMouseLeave={() => setTip(false)} style={{ display: "flex", cursor: "help", color: C.faint }}><Icon.infoCircle width={13} height={13} /></span>{tip && <div style={{ position: "absolute", top: "150%", left: 0, width: 280, background: "#18181B", color: "#fff", fontSize: 12, fontWeight: 400, lineHeight: 1.55, borderRadius: 10, padding: "10px 12px", zIndex: 5, boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}>이 데이터를 어떻게 사용할 계획인지 알려주세요. 보다 정확한 프로파일링에 도움이 돼요. 용도가 데이터와 맞지 않으면 다시 입력을 요청할 수 있어요.</div>}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {files.map((f, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "center", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <span style={{ width: 34, height: 34, borderRadius: 9, background: "#E7F7EE", color: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.sheet width={17} height={17} /></span>
                    <div style={{ minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div><div style={{ fontSize: 12, color: C.faint }}>{f.size} · <span style={{ color: WB_BLUE, fontWeight: 500 }}>진단 예상 {f.est}</span></div></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input value={f.purpose} onChange={(e) => setP(i, e.target.value)} placeholder="예: 회귀 예측 / AB Test" style={{ flex: 1, minWidth: 0, border: `1px solid ${C.border}`, borderRadius: 10, padding: "11px 13px", fontSize: 14, fontFamily: FONT, outline: "none", background: "#FCFCFD" }} />
                    <span onClick={() => rm(i)} title="삭제" onMouseEnter={(e) => { e.currentTarget.style.background = "#F2F4F6"; e.currentTarget.style.color = C.sub; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.faint; }} style={{ display: "flex", flexShrink: 0, width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", color: C.faint, cursor: "pointer" }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
                  </div>
                </div>
              ))}
              {files.length < 5 && <button onClick={add} style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 600, color: C.sub, background: "#fff", cursor: "pointer", fontFamily: FONT }}>+ 파일 추가</button>}
            </div>
          </div>
        )}
        {files.length > 0 && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 11, background: "#F6F7F9", borderRadius: 12, padding: "13px 15px", marginTop: 16 }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: "#EAEDF1", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.clock width={15} height={15} /></span>
            <div><div style={{ fontSize: 13, fontWeight: 600 }}>진단은 <b style={{ color: WB_BLUE }}>가장 큰 파일 기준 약 {maxEst}</b> 걸려요.</div><div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>단순 업로드가 아니라 품질·결측·이상치·분포를 한 줄씩 점검하기 때문에, 데이터가 클수록 더 걸려요.</div></div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
          <span style={{ fontSize: 12.5, color: C.faint }}>Maximum 5 files</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600, color: C.text, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 16px", cursor: "pointer", fontFamily: FONT }}>Upload guide</button>
            <button onClick={() => canStart && onStart(files)} disabled={!canStart} style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", background: canStart ? C.dark : "#C7CBD1", border: "none", borderRadius: 10, padding: "9px 18px", cursor: canStart ? "pointer" : "default", fontFamily: FONT }}>Start Data Profiling</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ProfilingTray({ files, onClose }) {
  const STAGES = ["파일 읽는 중", "스키마 분석", "결측·이상 점검", "분포 계산", "컨텍스트 요약"];
  const estSec = (est) => { const n = parseFloat(String(est || "1분").replace(/[^0-9.]/g, "")) || 1; return String(est).includes("초") ? n : n * 60; };
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState(0);
  const [doneList, setDoneList] = useState([]);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    const s = setInterval(() => setStage((x) => (x + 1) % STAGES.length), 2200);
    const timers = files.map((f, i) => setTimeout(() => setDoneList((d) => (d.includes(i) ? d : [...d, i])), Math.max(1200, (estSec(f.est) / 30) * 1000)));
    return () => { clearInterval(t); clearInterval(s); timers.forEach(clearTimeout); };
  }, [files.length]);
  const doneCount = doneList.length;
  const allDone = doneCount >= files.length;
  const mmss = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;
  // 남은 시간(대략) = 아직 진단 중인 파일 중 가장 큰 예상 시간 (병렬이라 합이 아님)
  const pending = files.filter((_, i) => !doneList.includes(i));
  const remEst = pending.length ? pending.reduce((a, b) => (estSec(a.est) >= estSec(b.est) ? a : b)).est : null;
  const remLabel = remEst ? `약 ${String(remEst).replace(/[~약\s]/g, "")} 남음` : null;
  return (
    <div style={{ position: "fixed", bottom: 0, right: 24, width: 330, background: "#fff", border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: "14px 14px 0 0", boxShadow: "0 -8px 32px rgba(0,0,0,0.12)", zIndex: 260, fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 15px" }}>
        {allDone ? <span style={{ color: "#1D9E75", display: "flex" }}><Icon.checkCircle /></span> : <span style={{ display: "flex", alignItems: "flex-end", gap: 2, width: 24, height: 20, flexShrink: 0 }}>{[13, 19, 15, 20, 12].map((h, b) => <span key={b} style={{ width: 3, height: h, borderRadius: 1.5, background: WB_BLUE, transformOrigin: "bottom", animation: `scanBar 1.1s ease-in-out ${b * 0.12}s infinite` }} />)}</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{allDone ? "데이터 프로파일링 완료" : "AI가 데이터를 진단하는 중"}</div>
          <div style={{ fontSize: 12, color: C.faint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{allDone ? `${files.length}개 진단 완료 · 총 ${mmss} 소요` : `${STAGES[stage]} · ${doneCount}/${files.length} 완료 · ${mmss} 경과`}</div>
        </div>
        {!allDone && remLabel && <span style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: WB_BLUE, background: WB_BLUE_BG, borderRadius: 999, padding: "3px 9px" }}><Icon.clock width={11} height={11} /> {remLabel}</span>}
        <span onClick={onClose} style={{ display: "flex", cursor: "pointer", color: C.faint }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
      </div>
      <div style={{ padding: "6px 8px", borderTop: `1px solid ${C.borderSoft}` }}>
        {files.map((f, i) => {
          const isDone = doneList.includes(i);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px" }}>
              <span style={{ width: 26, height: 26, borderRadius: 6, background: "#E7F7EE", color: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.sheet width={14} height={14} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                {!isDone && <div style={{ height: 4, borderRadius: 999, background: "#EEF0F3", overflow: "hidden", marginTop: 5, position: "relative" }}><div style={{ position: "absolute", top: 0, bottom: 0, width: "45%", background: WB_BLUE, borderRadius: 999, animation: "trayIndet 1.2s ease-in-out infinite" }} /></div>}
                {isDone && <div style={{ fontSize: 11.5, color: "#1D9E75", marginTop: 3 }}>진단 완료</div>}
              </div>
              {isDone
                ? <span style={{ display: "flex", flexShrink: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#22C55E" /><path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                : <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: WB_BLUE, fontWeight: 500, flexShrink: 0 }}><Icon.clock width={11} height={11} /> {f.est || "~1분"}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 7, padding: "10px 14px", borderTop: `1px solid ${C.borderSoft}`, background: "#FAFAFB", fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
        <span style={{ display: "flex", flexShrink: 0, color: C.faint, marginTop: 1 }}><Icon.infoCircle width={13} height={13} /></span>
        {allDone ? "진단이 끝났어요. 목록에서 확인하세요." : <span>업로드가 아니라 <b style={{ color: C.sub, fontWeight: 600 }}>품질·결측·이상치·컨텍스트를 점검하는 중</b>이에요. 창을 닫아도 계속되고, 파일이 크면 예상보다 걸릴 수 있어요.</span>}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes trayPulse{0%,100%{opacity:1}50%{opacity:.4}}@keyframes trayIndet{0%{transform:translateX(-120%)}100%{transform:translateX(360%)}}@keyframes scanBar{0%,100%{opacity:.35;transform:scaleY(.55)}50%{opacity:1;transform:scaleY(1)}}`}</style>
    </div>
  );
}

/* ── Union 컬럼 매칭 확인 화면 (AI가 매칭 → 완료) ─────────────── */
const UM_BASE_NAME = "Datset_name";
const UM_ADD_NAME = "CUBIG Data_2025";
const UM_COLS = ["time_period_01", "time_period_02", "time_period_03", "time_period_04", "time_period_05", "time_period_06"];
const UM_PREVIEW_COLS = [
  { name: "Source", kind: "src" },
  { name: "time_period_02", kind: "#" },
  { name: "time_period_03", kind: "#" },
  { name: "time_period_04", kind: "#" },
  { name: "time_period_05", kind: "A" },
  { name: "time_period_06", kind: "A" },
  { name: "time_period_07", kind: "A" },
];
function UnionMatchPage({ onBack, onConfirm, err = false }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1900); return () => clearTimeout(t); }, []);
  const sk = (w, h = 13) => ({ height: h, width: w, borderRadius: 6, background: "#EAECEF", animation: "umPulse 1.3s ease-in-out infinite" });
  const canRun = !loading && !err; // 매칭이 정상일 때만 결합 가능

  // 결과 미리보기 행 (Datset_1 5행 + Datset_2 나머지)
  const rows = Array.from({ length: 13 }, (_, i) => ({ src: i < 5 ? "Datset_1" : "Datset_2", ds2: i >= 5 }));
  const kindGlyph = (k) => k === "src" ? <Icon.db width={13} height={13} /> : k === "#" ? <Icon.hash width={12} height={12} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>A</span>;

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", alignSelf: "stretch", overflow: "hidden" }}>
      {/* breadcrumb + 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 24px", fontSize: 13.5, color: C.faint }}>
        <span onClick={onBack} style={{ cursor: "pointer" }}>Dataset</span>
        <Icon.chevR width={14} height={14} />
        <span onClick={onBack} style={{ cursor: "pointer" }}>데이터 결합</span>
        <Icon.chevR width={14} height={14} />
        <span style={{ color: C.text, fontWeight: 600 }}>Union</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 24px 16px" }}>
        <span style={{ width: 30, height: 30, borderRadius: 8, background: "#EEF2FF", color: C.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>AI</span>
        <span style={{ fontSize: 17, fontWeight: 700 }}>Union</span>
        <span style={{ fontSize: 13.5, color: C.faint }}>같은 형태의 데이터를 위아래로 이어 붙여 행을 늘려요.</span>
      </div>

      {/* 스크롤 본문 */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "4px 24px 28px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 11, marginBottom: 14 }}>
            <span style={{ width: 18, height: 18, border: `2px solid #DDD6FE`, borderTopColor: C.purple, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite", marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>AI가 두 데이터의 컬럼을 맞춰보고 있어요…</div>
              <div style={{ fontSize: 12.5, color: C.faint, marginTop: 3 }}>이름·타입·값 분포를 비교해 짝을 찾는 중이라, 컬럼이 많으면 조금 더 걸려요.</div>
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>컬럼 매칭 결과를 확인해주세요</div>
        )}

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* 매칭 카드 */}
          <div style={{ flex: 1, minWidth: 0, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 44px minmax(0,1fr) 70px", alignItems: "center", padding: "15px 18px", borderBottom: `1px solid ${C.borderSoft}` }}>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{UM_BASE_NAME} <span style={{ color: C.faint, fontWeight: 500 }}>(기준)</span></span>
              <span style={{ display: "flex", justifyContent: "center", color: C.faint }}><Icon.swap width={15} height={15} /></span>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>{UM_ADD_NAME}</span>
              <span />
            </div>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 44px minmax(0,1fr) 70px", alignItems: "center", padding: "14px 18px", borderBottom: i === 5 ? "none" : `1px solid ${C.borderSoft}` }}>
                    <div style={sk("58%")} />
                    <div style={{ display: "flex", justifyContent: "center", color: "#DDE0E4" }}><Icon.link width={14} height={14} /></div>
                    <div style={sk("58%")} />
                    <div />
                  </div>
                ))
              : UM_COLS.map((c, i) => (
                  <div key={c} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 44px minmax(0,1fr) 70px", alignItems: "center", padding: "14px 18px", borderBottom: i === UM_COLS.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                    <span style={{ fontSize: 13.5 }}>{c} <span style={{ color: C.faint, fontSize: 12 }}>String</span></span>
                    <span style={{ display: "flex", justifyContent: "center", color: C.purple }}><Icon.link width={14} height={14} /></span>
                    <span style={{ fontSize: 13.5 }}>{c} <span style={{ color: C.faint, fontSize: 12 }}>String</span></span>
                    <span style={{ display: "flex", justifyContent: "flex-end" }}><span style={{ fontSize: 11.5, fontWeight: 600, color: C.purple, border: `1px solid #D8D3F5`, background: "#F5F3FE", borderRadius: 6, padding: "3px 9px" }}>매칭</span></span>
                  </div>
                ))}
          </div>

          {/* 예상 결과 패널 */}
          <div style={{ width: 300, flexShrink: 0, border: `1px solid ${C.border}`, borderRadius: 14, background: "#fff", padding: "18px 18px 20px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>예상 결과</div>
            {[["총 컬럼", loading ? null : "12"], ["총 행", loading ? null : "1,200"], ["총 용량", loading ? null : "120MB"], ["완전 중복행", loading ? null : "0", true]].map(([label, val, info], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderLeft: `2px solid ${C.borderSoft}`, paddingLeft: 12, marginBottom: 2 }}>
                <span style={{ fontSize: 13, color: C.sub, display: "flex", alignItems: "center", gap: 5 }}>{label}{info && <Icon.infoCircle width={13} height={13} />}</span>
                {loading
                  ? <span style={{ width: 13, height: 13, border: `2px solid ${C.border}`, borderTopColor: C.purple, borderRadius: "50%", display: "inline-block", animation: "spin .8s linear infinite" }} />
                  : <span style={{ fontSize: 16, fontWeight: 700 }}>{val}</span>}
              </div>
            ))}
            <div style={{ marginTop: 14, background: err ? "#FEF2F2" : "#F5F4FE", borderRadius: 10, padding: "12px 13px" }}>
              {err ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#DC2626" }}><Icon.infoCircle width={14} height={14} /> 결합을 진행할 수 없어요</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 5, lineHeight: 1.5 }}>매칭이 맞지 않아 결과가 어긋나요. 위 매칭을 맞춰주세요.</div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: C.purple }}><Icon.spark width={14} height={14} /> 컬럼 {loading ? 0 : 6}개가 모두 매칭됐어요</div>
                  <div style={{ fontSize: 12, color: C.faint, marginTop: 5, lineHeight: 1.5 }}>컬럼 6개가 같아 안전하게 합쳐져요. 빈 값이나 제거되는 칼럼이 없어요.</div>
                </>
              )}
            </div>
            <button
              disabled={!canRun}
              onClick={() => canRun && onConfirm && onConfirm([UM_BASE_NAME, UM_ADD_NAME])}
              style={{ width: "100%", marginTop: 14, height: 46, borderRadius: 11, border: "none", background: canRun ? C.dark : "#C9CCD1", color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: canRun ? "pointer" : "default", fontFamily: FONT }}>
              데이터 결합하기
            </button>
          </div>
        </div>

        {/* 결과 미리보기 */}
        <div style={{ fontSize: 15, fontWeight: 700, margin: "30px 0 14px" }}>결과 미리보기</div>
        {err ? (
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, background: "#fff", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 6 }}>
            <span style={{ display: "flex", color: "#E0A100", marginBottom: 4 }}><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3.5 22 20H2L12 3.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M12 10v4M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg></span>
            <div style={{ fontSize: 14.5, fontWeight: 700 }}>매칭이 맞지 않아 결과가 어긋나 미리보기가 보이지 않아요</div>
            <div style={{ fontSize: 13, color: C.faint }}>칼럼 값을 조정해보세요.</div>
          </div>
        ) : (
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
          <div style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 900 }}>
              {/* 헤더 */}
              <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${UM_PREVIEW_COLS.length - 1}, minmax(150px,1fr))`, background: "#FAFBFC", borderBottom: `1px solid ${C.border}` }}>
                {UM_PREVIEW_COLS.map((col, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 14px", fontSize: 12.5, color: C.sub, fontWeight: 600, borderRight: i === UM_PREVIEW_COLS.length - 1 ? "none" : `1px solid ${C.borderSoft}` }}>
                    <span style={{ color: C.faint, display: "flex" }}>{kindGlyph(col.kind)}</span>{col.name}
                  </div>
                ))}
              </div>
              {/* 행 */}
              {loading
                ? Array.from({ length: 8 }).map((_, r) => (
                    <div key={r} style={{ display: "grid", gridTemplateColumns: `160px repeat(${UM_PREVIEW_COLS.length - 1}, minmax(150px,1fr))`, borderBottom: r === 7 ? "none" : `1px solid ${C.borderSoft}` }}>
                      {UM_PREVIEW_COLS.map((_, c) => (
                        <div key={c} style={{ padding: "13px 14px" }}><div style={sk(c === 0 ? "70px" : "54px", 11)} /></div>
                      ))}
                    </div>
                  ))
                : rows.map((row, r) => (
                    <div key={r} style={{ display: "grid", gridTemplateColumns: `160px repeat(${UM_PREVIEW_COLS.length - 1}, minmax(150px,1fr))`, borderBottom: r === rows.length - 1 ? "none" : `1px solid ${C.borderSoft}`, background: row.ds2 ? "#F5F8FF" : "#fff" }}>
                      {UM_PREVIEW_COLS.map((col, c) => (
                        <div key={c} style={{ padding: "12px 14px", fontSize: 12.5, color: c === 0 ? C.text : C.sub, fontFamily: c === 0 ? "ui-monospace, monospace" : "ui-monospace, monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {c === 0 ? row.src : c === 1 ? "UTC+09:00" : "ios"}
                        </div>
                      ))}
                    </div>
                  ))}
            </div>
          </div>
        </div>
        )}
      </div>
      <style>{`@keyframes umPulse{0%,100%{opacity:1}50%{opacity:.45}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

/* ── 홈 랜딩 (히어로 + 시작 지점 캐러셀 + 하단 카드) ─────────── */
const HOME_SLIDES = [
  { tag: "설문조사", title: "합성 페르소나 1만 명의 응답을\n패널 모집 없이 받으세요", desc: "응답 분포를 통계적으로 재현해, 리서치를 4주에서 1시간으로 단축해요.", cta: "에이전트 실행하기", go: "Agent Analysis", viz: "survey" },
  { tag: "가격 전략", title: "신제품 출시 전에,\n가격 반응을 시뮬레이션하세요", desc: "가격대별 수용도를 비교해 최적 지점을 찾아요.", cta: "에이전트 실행하기", go: "Agent Analysis", viz: "price" },
  { tag: "이탈 예측", title: "고객이 떠나기 전에\n이탈 신호를 잡으세요", desc: "이탈 위험 고객을 조기에 찾아, 늦지 않게 붙잡아요.", cta: "에이전트 실행하기", go: "Agent Analysis", viz: "churn" },
  { tag: "PR 시뮬레이션", title: "발표 전에\n메시지 반응을 검증하세요", desc: "대중 반응을 예측해, 메시지와 타이밍을 조정해요.", cta: "에이전트 실행하기", go: "Agent Analysis", viz: "pr" },
  { tag: "전략 제안", title: "고객을 행동·인구 통계에 따라\nROI 기반 전략을 시뮬레이션하세요", desc: "어떤 고객에 집중할지 확인하세요.", cta: "에이전트 실행하기", go: "Agent Analysis", viz: "strategy" },
  { tag: "데이터 진단", title: "모델 학습 전에,\n데이터가 준비됐는지 진단하세요", desc: "6가지 축으로 AI 준비도를 측정하고, 무엇부터 고칠지 짚어 드려요.", cta: "데이터 진단하기", go: "Dataset", viz: "diag" },
  { tag: "데이터 전처리", title: "값과 분포를 바로잡고,\nAI에 필요한 맥락을 더하세요", desc: "결측치·이상치·민감정보 치환·합성 증강을 한 번에 처리해요.", cta: "데이터 정제하기", go: "Dataset", viz: "preprocess" },
];
function HomeViz({ kind }) {
  const Frame = ({ children, pad = 16 }) => (
    <div style={{ width: "100%", background: "#F1F3F6", borderRadius: 16, padding: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.07)" }}>
      <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${C.borderSoft}`, padding: pad, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>{children}</div>
    </div>
  );
  const pbar = (label, pct, color, key) => (
    <div key={key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10.5, margin: "5px 0" }}>
      <span style={{ width: 62, flexShrink: 0, color: C.faint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <span style={{ flex: 1, height: 6, borderRadius: 99, background: "#EEF0F3", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} /></span>
      <span style={{ width: 30, textAlign: "right", color: C.text, fontWeight: 600 }}>{pct}%</span>
    </div>
  );
  const Toggle = ({ on }) => (
    <span style={{ width: 30, height: 17, borderRadius: 99, background: on ? WB_BLUE : "#D6D8DD", position: "relative", flexShrink: 0, display: "inline-block" }}><span style={{ position: "absolute", top: 2, left: on ? 15 : 2, width: 13, height: 13, borderRadius: "50%", background: "#fff", transition: "left .15s" }} /></span>
  );
  const AXES = ["Privacy", "Integrity", "Contextuality", "Conciseness", "Operational R.", "Traceability"];

  if (kind === "diag") {
    const bef = [20, 10, 10, 9, 25, 32], aft = [99, 99, 98, 97, 100, 100];
    const panel = (title, chip, chipColor, pct, statusBg, statusFg, status, vals, colorFn, note) => (
      <div style={{ flex: 1, minWidth: 0, border: `1px solid ${C.borderSoft}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderBottom: `1px solid ${C.borderSoft}` }}><span style={{ fontSize: 11, fontWeight: 700 }}>{title}</span><span style={{ fontSize: 9, color: C.faint, background: "#F1F2F4", borderRadius: 4, padding: "1px 5px" }}>{chip}</span></div>
        <div style={{ padding: "10px 10px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 11, fontWeight: 600 }}>AI Readiness</span><span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontSize: 15, fontWeight: 800, color: chipColor }}>{pct}%</span><span style={{ fontSize: 9, fontWeight: 700, color: statusFg, background: statusBg, borderRadius: 4, padding: "1px 5px" }}>{status}</span></span></div>
          {AXES.map((a, i) => pbar(a, vals[i], colorFn(vals[i]), i))}
          <div style={{ display: "flex", gap: 5, marginTop: 8, background: note.bg, borderRadius: 7, padding: "7px 8px" }}><span style={{ color: note.fg, flexShrink: 0, fontSize: 10 }}>●</span><div><div style={{ fontSize: 9.5, fontWeight: 700, color: note.fg }}>AI 분석 결과</div><div style={{ fontSize: 9, color: C.faint, lineHeight: 1.4, marginTop: 1 }}>{note.text}</div></div></div>
        </div>
      </div>
    );
    return <Frame pad={12}><div style={{ display: "flex", gap: 8 }}>
      {panel("Before", "v1", C.red, 19, "#FDE7E7", C.red, "Critical", bef, (v) => v < 20 ? C.red : C.yellow, { bg: "#FDF2F2", fg: C.red, text: "정합성과 컨텍스트 개선이 필요합니다." })}
      {panel("After", "Snapshot · d34kqdf", C.greenText, 99, "#DCFCE7", C.greenText, "AI Ready", aft, () => "#22C55E", { bg: "#F0FDF4", fg: C.greenText, text: "AI 준비 완료 — 신뢰할 수 있는 분석 기준을 충족해요." })}
    </div></Frame>;
  }

  if (kind === "preprocess") {
    const row = (title, on, chips) => (
      <div style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 9, padding: "9px 11px", marginBottom: 7 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><span style={{ fontSize: 9.5, fontWeight: 700, color: WB_BLUE }}>✦ AI 추천</span><div style={{ fontSize: 11.5, fontWeight: 600, marginTop: 2 }}>{title}</div></div><Toggle on={on} /></div>
        {chips && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 7 }}>{chips.map((c, i) => <span key={i} style={{ fontSize: 9, color: i === 0 ? "#fff" : C.sub, background: i === 0 ? C.dark : "#F1F2F4", borderRadius: 5, padding: "2px 6px" }}>{c}</span>)}</div>}
      </div>
    );
    const rowPlain = (title, on) => (
      <div style={{ flex: 1, border: `1px solid ${C.borderSoft}`, borderRadius: 9, padding: "9px 11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 11, fontWeight: 600, color: on ? C.text : C.faint }}>{title}</span><Toggle on={on} /></div>
    );
    return <Frame><div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}>데이터 품질 개선</div>
      {row("민감 데이터 탐지 및 마스킹", true, ["전체 이름", "전화번호", "국가 ID", "이메일 주소", "은행 계좌 번호"])}
      <div style={{ display: "flex", gap: 7, marginBottom: 7 }}>
        <div style={{ flex: 1, border: `1px solid ${C.borderSoft}`, borderRadius: 9, padding: "9px 11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><span style={{ fontSize: 9.5, fontWeight: 700, color: WB_BLUE }}>✦ AI 추천</span><div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>결측값 처리</div></div><Toggle on={true} /></div>
        <div style={{ flex: 1, border: `1px solid ${C.borderSoft}`, borderRadius: 9, padding: "9px 11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}><div><span style={{ fontSize: 9.5, fontWeight: 700, color: WB_BLUE }}>✦ AI 추천</span><div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>이상치·범주 정제</div></div><Toggle on={true} /></div>
      </div>
      <div style={{ display: "flex", gap: 7 }}>{rowPlain("저신호 열 제거", false)}{rowPlain("행 증강·클래스 균형", false)}</div>
    </Frame>;
  }

  if (kind === "survey") {
    const bars = [
      ["5달러 미만", 24, "#84CC16"],
      ["5달러 - 9.99달러", 14, "#D9DCE2"],
      ["10달러 - 14.99달러", 50, C.blue],
      ["5달러 - 9.99달러", 14, "#D9DCE2"],
      ["15달러 - 19.99달러", 0, "#D9DCE2"],
    ];
    const hexIcon = (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 3l7.5 4.3v9.4L12 21l-7.5-4.3V7.3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    );
    const persona = (name, meta) => (
      <div style={{ flexShrink: 0, width: 214, border: `1px solid ${C.borderSoft}`, borderRadius: 12, padding: "13px 15px", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
          <span style={{ width: 28, height: 28, borderRadius: 9, background: "#F3F4F6", color: C.faint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{hexIcon}</span>
          <div style={{ minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{name}</div><div style={{ fontSize: 11, color: C.faint, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{meta}</div></div>
        </div>
        <div style={{ height: 8, borderRadius: 5, background: "#EEF0F3", marginBottom: 8 }} />
        <div style={{ height: 8, borderRadius: 5, background: "#EEF0F3", width: "62%", marginBottom: 15 }} />
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 0", textAlign: "center", fontSize: 12.5, fontWeight: 600, color: C.sub }}>View Detail</div>
      </div>
    );
    const avatars = [
      ["#EBD3BE", "#CBA184"], ["#C6D0FA", "#8A98E8"], ["#BFE6D0", "#84C2A0"],
      ["#AFC7EE", "#6F94D6"], ["#D8C2EC", "#A981D6"], ["#F2C4CF", "#DD97A9"],
    ];
    return (
      <div style={{ flex: 1, alignSelf: "stretch", position: "relative", overflow: "hidden", background: "linear-gradient(158deg, #EDF2FF 0%, #DEE9FF 52%, #CBDCFF 100%)" }}>
        {/* 디바이스 카드 (우/하단으로 살짝 잘려나가는 목업) */}
        <div style={{ position: "absolute", top: 28, left: 30, right: -58, bottom: -44, background: "#fff", borderRadius: 18, border: "1px solid rgba(15,23,42,0.05)", boxShadow: "0 26px 64px rgba(37,64,120,0.18)", padding: "22px 24px", overflow: "hidden" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.text, marginBottom: 16 }}>Q1. 합리적인 월 구독 가격은 얼마라고 생각하십니까?</div>
          <div style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: "16px 18px" }}>
            {bars.map(([l, p, c], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, margin: "10px 0" }}>
                <span style={{ width: 108, flexShrink: 0, fontSize: 12.5, fontWeight: 600, color: C.text }}>{l}</span>
                <span style={{ height: 12, width: Math.round(p * 3.3), background: c, borderRadius: 6, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: p === 0 ? C.faint : C.text }}>{p}%</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 15 }}>
            {persona("정민주", "여자, 32세, 디자이너")}
            {persona("강혁준", "남자, 42세, CEO")}
          </div>
        </div>
        {/* 플로팅 알림 — 1만명 투표 완료 + 아바타 스택 */}
        <div style={{ position: "absolute", right: 8, bottom: 66, background: "#fff", borderRadius: 18, boxShadow: "0 20px 46px rgba(37,64,120,0.24)", padding: "13px 17px", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill={C.purple} /><path d="m7.8 12.2 2.7 2.7L16.4 9" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.purple }}>1만명 투표 완료</span>
          </div>
          <div style={{ display: "flex" }}>
            {avatars.map(([a, b], i) => (
              <span key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(140deg, ${a}, ${b})`, border: "2.5px solid #fff", marginLeft: i ? -10 : 0, boxShadow: "0 1px 3px rgba(0,0,0,0.14)" }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kind === "price") return <Frame>
    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>PSM 가격-수요 곡선 · 주요 교차점</div>
    <div style={{ position: "relative", border: `1px solid ${C.borderSoft}`, borderRadius: 8, padding: "10px 8px 4px" }}>
      <svg viewBox="0 0 300 120" style={{ width: "100%", height: "auto" }}>
        <polyline fill="none" stroke="#33A87C" strokeWidth="1.8" points="6,20 60,44 120,66 180,86 240,100 294,108" />
        <polyline fill="none" stroke="#E9B93C" strokeWidth="1.8" strokeDasharray="4 3" points="6,14 60,32 120,54 180,78 240,96 294,106" />
        <polyline fill="none" stroke="#8479D6" strokeWidth="1.8" strokeDasharray="4 3" points="6,108 60,92 120,66 180,40 240,22 294,14" />
        <polyline fill="none" stroke="#E05A8E" strokeWidth="1.8" points="6,112 60,104 120,84 180,56 240,32 294,20" />
        <circle cx="120" cy="66" r="3" fill={C.text} />
      </svg>
      <div style={{ position: "absolute", top: 30, left: "34%", fontSize: 9, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 7px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", whiteSpace: "nowrap" }}><span style={{ color: "#22C55E" }}>●</span> IPP (무관심 가격대) <b>$1,181.82</b></div>
    </div>
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      {[["$1,408.00", "Premium Strategy", "#EEF2FF", C.purple], ["$1,311.48", "Balanced Strategy", "#E6F1FB", C.blue]].map(([v, s, bg, fg], i) => (
        <div key={i} style={{ flex: 1, border: `1px solid ${C.borderSoft}`, borderRadius: 9, padding: "10px 11px" }}><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 15, fontWeight: 800 }}>{v}</span><span style={{ fontSize: 9, fontWeight: 700, color: fg, background: bg, borderRadius: 5, padding: "2px 6px" }}>{s}</span></div><div style={{ height: 5, background: "#EEF0F3", borderRadius: 99, marginTop: 8 }} /></div>
      ))}
    </div>
  </Frame>;

  if (kind === "churn") return <Frame>
    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>이탈률 추이 · 위험 고객 조기 탐지</div>
    <svg viewBox="0 0 300 150" style={{ width: "100%", height: "auto" }}>
      {[30, 60, 90, 120].map((y) => <line key={y} x1="6" y1={y} x2="294" y2={y} stroke="#EEF0F3" strokeWidth="1" />)}
      <polygon fill="#EEEDFE" points="6,120 54,104 108,110 162,74 216,58 294,26 294,138 6,138" />
      <polyline fill="none" stroke={C.purple} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" points="6,120 54,104 108,110 162,74 216,58 294,26" />
      <circle cx="162" cy="74" r="3.4" fill={C.purple} /><circle cx="294" cy="26" r="3.4" fill={C.purple} />
    </svg>
  </Frame>;

  if (kind === "strategy") return <Frame>
    <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}>페르소나 군집</div>
    {[["프리미엄 애호가", "Main Target", "프리미엄 애호가에게 자원의 40~50%를 집중하는 것이 가장 높은 ROI를 기대할 수 있어요."], ["가치 최적화 선호자", null, "가격 대비 가치를 꼼꼼히 따지는 층으로, 할인·번들·리뷰에 민감하게 반응해요. 명확한 가치 제안과 묶음 혜택이 효과적이에요."]].map(([n, badge, d], i) => (
      <div key={i} style={{ border: `1px solid ${C.borderSoft}`, borderRadius: 10, padding: "11px 12px", marginBottom: i === 0 ? 8 : 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}><span style={{ width: 22, height: 22, borderRadius: 6, background: "#F1F2F4", color: C.sub, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon.spark width={12} height={12} /></span><span style={{ fontSize: 12.5, fontWeight: 700 }}>{n}</span>{badge && <span style={{ fontSize: 9.5, fontWeight: 700, color: C.blue, background: "#E6F1FB", borderRadius: 5, padding: "2px 7px" }}>{badge}</span>}</div>
        <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.55, background: "#FAFBFC", borderRadius: 7, padding: "8px 10px" }}>{d}</div>
      </div>
    ))}
  </Frame>;

  return null;
}
function HomePage({ user = "minkyung", onNav = () => {} }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const N = HOME_SLIDES.length;
  const go = (n) => setIdx((n + N) % N);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "ArrowRight") go(idx + 1); else if (e.key === "ArrowLeft") go(idx - 1); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [idx]);
  // 3초마다 자동 전환 (호버 시 일시정지, 수동 이동 시 타이머 리셋, 모션 최소화 선호 시 정지)
  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % N), 3000);
    return () => clearInterval(t);
  }, [paused, idx, N]);
  const bottomCard = (icon, title, desc) => (
    <div className="st-card" role="button" tabIndex={0} onClick={() => {}} style={{ flex: 1, display: "flex", alignItems: "center", gap: 14, border: `1px solid ${C.border}`, borderRadius: 14, padding: "16px 18px", background: "#fff", cursor: "pointer" }}>
      <span style={{ width: 40, height: 40, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div><div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>{desc}</div></div>
      <span className="st-card-arr" style={{ color: C.faint, display: "flex" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    </div>
  );
  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
      <style>{`
        .st-pill{transition:background .15s ease,color .15s ease}
        .st-pill:not(.on):hover{background:#E6E8EC;color:${C.text}}
        .st-pill:focus-visible{outline:2px solid ${C.purple};outline-offset:2px}
        .st-cta{transition:background .15s ease,box-shadow .18s cubic-bezier(.22,.61,.36,1),transform .18s cubic-bezier(.22,.61,.36,1)}
        .st-cta:hover{background:#5457E5;box-shadow:0 8px 20px rgba(99,102,241,.32);transform:translateY(-1px)}
        .st-cta:active{transform:translateY(0);box-shadow:0 3px 10px rgba(99,102,241,.28)}
        .st-cta:focus-visible{outline:2px solid ${C.purple};outline-offset:3px}
        .st-card{transition:border-color .18s ease,box-shadow .18s ease,transform .18s cubic-bezier(.22,.61,.36,1)}
        .st-card:hover{border-color:#D5D8DE;box-shadow:0 10px 26px rgba(16,24,40,.08);transform:translateY(-2px)}
        .st-card:focus-visible{outline:2px solid ${C.purple};outline-offset:2px}
        .st-card-arr{transition:color .18s ease,transform .18s cubic-bezier(.22,.61,.36,1)}
        .st-card:hover .st-card-arr{color:${C.purple};transform:translate(2px,-2px)}
        @media (prefers-reduced-motion: reduce){
          .st-anim{animation:none!important;opacity:1!important;transform:none!important}
          .st-cta,.st-card,.st-card-arr,.st-pill{transition:none!important}
          .st-cta:hover,.st-card:hover{transform:none!important}
        }
      `}</style>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 32px 48px" }}>
        <div style={{ fontSize: 14, color: C.sub, fontWeight: 500 }}>Welcome, {user}</div>
        <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.3, marginTop: 8, textWrap: "balance" }}>
          <span style={{ color: C.text }}>Syntitan은 진단 · 개선 · 검증까지 데이터로 증명합니다.</span><br />
          <span style={{ color: C.sub }}>모델 교체 전, 데이터가 준비되었는지 확인하세요.</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, margin: "34px 0 14px" }}>어디서 시작하고 싶으신가요?</div>

        {/* 필 탭 — 6개를 라벨로 노출 (발견성↑) */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          {HOME_SLIDES.map((s, i) => {
            const on = i === idx;
            return (
              <button key={i} className={`st-pill${on ? " on" : ""}`} aria-pressed={on} onClick={() => go(i)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 99, fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: FONT, border: "1.5px solid transparent", background: on ? C.purple : "#F1F2F4", color: on ? "#fff" : C.sub }}>
                {s.tag}
              </button>
            );
          })}
        </div>

        {/* 캐러셀 — 탭 전환 시 콘텐츠가 아래에서 위로 올라오며 교체 · 뒤에 카드가 겹쳐 쌓인 스택 효과 */}
        <div style={{ position: "relative" }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {/* 뒤에 깔린 스택 레이어 — 탭 전환 시 카드 아래에서 위로 확실히 올라와 자리잡음 */}
          <div key={`deck2-${idx}`} className="st-anim" aria-hidden style={{ position: "absolute", left: 24, right: 24, bottom: -16, height: 40, background: "#fff", border: `1px solid ${C.borderSoft}`, borderRadius: 18, boxShadow: "0 8px 16px rgba(0,0,0,0.05)", zIndex: 0, animation: "deckSettle2 .68s cubic-bezier(.2,.7,.3,1) .08s both" }} />
          <div key={`deck1-${idx}`} className="st-anim" aria-hidden style={{ position: "absolute", left: 12, right: 12, bottom: -9, height: 40, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 18, zIndex: 1, animation: "deckSettle1 .6s cubic-bezier(.2,.7,.3,1) .04s both" }} />
        <div style={{ position: "relative", zIndex: 2, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden", background: "#fff" }}>
          <style>{`@keyframes homeRise{0%{opacity:0;transform:translateY(34px)}100%{opacity:1;transform:none}}@keyframes homeRiseImg{0%{opacity:0;transform:translateY(64px) scale(.985)}100%{opacity:1;transform:none}}@keyframes deckSettle1{0%{opacity:0;transform:translateY(28px)}16%{opacity:1}86%{transform:translateY(-2px)}100%{opacity:1;transform:none}}@keyframes deckSettle2{0%{opacity:0;transform:translateY(38px)}14%{opacity:1}86%{transform:translateY(-3px)}100%{opacity:1;transform:none}}`}</style>
          <div style={{ overflow: "hidden" }}>
            {(() => {
              const s = HOME_SLIDES[idx];
              return (
                <div key={idx} style={{ boxSizing: "border-box", display: "flex", gap: 28, alignItems: "center", padding: "34px 36px", minHeight: 300 }}>
                  <div className="st-anim" style={{ flex: 1, minWidth: 0, animation: "homeRise .5s cubic-bezier(.22,.61,.36,1) both" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.4, margin: "0 0 10px" }}>{s.title.split("\n").map((line, li) => <span key={li}>{line}{li === 0 && s.title.includes("\n") ? <br /> : null}</span>)}</div>
                    <div style={{ fontSize: 14, color: C.sub, lineHeight: 1.6, marginBottom: 22 }}>{s.desc}</div>
                    <button className="st-cta" onClick={() => onNav(s.go)} style={{ background: C.purple, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: FONT }}>{s.cta} <Icon.chevR width={16} height={16} /></button>
                  </div>
                  <div className="st-anim" style={{ flexShrink: 0, display: "flex", justifyContent: "center", animation: "homeRiseImg .58s cubic-bezier(.22,.61,.36,1) .06s both", ...(s.viz === "survey" ? { alignSelf: "stretch", alignItems: "stretch", width: 512, margin: "-34px -36px -34px 0" } : { width: 468, alignItems: "center" }) }}><HomeViz kind={s.viz} /></div>
                </div>
              );
            })()}
          </div>
        </div>
        </div>

        {/* 하단 카드 */}
        <div style={{ display: "flex", gap: 16, marginTop: 60 }}>
          {bottomCard(<Icon.spark width={18} height={18} />, "Claude Code에서 SynTitan 사용하기", "데이터셋 조회·전처리·버전 비교를 Claude Code에서 한 번에 진행하세요.")}
          {bottomCard(<span style={{ width: 22, height: 22, borderRadius: 6, background: C.dark, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>◎</span>, "DTS 시작하기", "민감 데이터를 AI-Ready 데이터셋으로 변환하세요.")}
        </div>
      </div>
    </div>
  );
}

export default function DatasetsApp() {
  const [screen, setScreen] = useState("home"); // home | list | detail | merge | merging | result
  const [tab, setTab] = useState("AI 준비도");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [profiling, setProfiling] = useState(null);
  const [selected, setSelected] = useState([]);
  const [combineNav, setCombineNav] = useState(0); // Combine 재진입 시 빈 화면 리셋용
  const [mergeJob, setMergeJob] = useState(null); // { names, done } – 백그라운드에서도 유지
  const [datasets, setDatasets] = useState(DATASETS);
  const [folders, setFolders] = useState([{ id: "f1", name: "마케팅 분석" }, { id: "f2", name: "영업 리드" }]);
  const [activeFolder, setActiveFolder] = useState(null); // null = 전체

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

  const sidebarActive = screen === "home" ? "Home"
    : screen === "agent" ? "Agent Analysis"
    : screen === "workbench" ? "Performance Proof"
    : (screen === "combine" || screen === "union" || screen === "merge" || screen === "merging" || screen === "result") ? "Combine"
    : "Edit Dataset";

  const handleNav = (label) => {
    if (label === "Home") { setSelected([]); setScreen("home"); }
    else if (label === "Agent Analysis") setScreen("agent");
    else if (label === "Performance Proof") setScreen("workbench");
    else if (label === "Combine") { setSelected([]); setCombineNav((n) => n + 1); setScreen("combine"); }
    else if (label === "Edit Dataset" || label === "Dataset") { setSelected([]); setScreen("list"); }
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
    <div style={{ width: "100%", minWidth: 1280, maxWidth: 1920, margin: "0 auto", display: "flex", height: "100vh", overflow: "hidden", background: C.bg, fontFamily: FONT, color: C.text }}>
      <Sidebar active={sidebarActive} onNav={handleNav} />
      <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        {screen === "home" && (
          <>
            <TopBar crumb="Home" onAsk={() => setAskOpen(true)} />
            <HomePage onNav={handleNav} />
          </>
        )}
        {screen === "agent" && (
          <>
            <TopBar crumb="Agent Analysis" onAsk={() => setAskOpen(true)} />
            <div style={scrollArea}><AgentAnalysisPage /></div>
          </>
        )}
        {screen === "workbench" && (
          <>
            <TopBar crumb="Performance Proof" onAsk={() => setAskOpen(true)} />
            <PerfWorkbench />
          </>
        )}
        {screen === "list" && (
          <>
            <TopBar crumb="Dataset" onAsk={() => setAskOpen(true)} />
            <div style={{ flex: 1, minWidth: 0, minHeight: 0, display: "flex", background: "#fff" }}>
              <DatasetsPage datasets={datasets} setDatasets={setDatasets} folders={folders} setFolders={setFolders} activeFolder={activeFolder} setActiveFolder={setActiveFolder} selected={selected} setSelected={setSelected} onOpen={() => { setScreen("detail"); setTab("AI 준비도"); }} onMerge={() => setScreen("combine")} onMergeDirect={() => { setSelected(datasets.slice(0, 2).map((d) => d.id)); setScreen("combine"); }} onAsk={() => setAskOpen(true)} onUpload={() => setUploadOpen(true)} />
            </div>
          </>
        )}
        {screen === "detail" && (
          <>
            <DetailHeader tab={tab} setTab={setTab} onBack={() => setScreen("list")} onRefine={() => setScreen("refine")} onHistory={() => setHistoryOpen(true)} onAsk={() => setAskOpen(true)} />
            <div style={scrollArea}>{tab === "AI 준비도" ? <AIReadinessTab /> : <DetailTab />}</div>
            {historyOpen && <VersionHistory onClose={() => setHistoryOpen(false)} />}
          </>
        )}
        {screen === "refine" && <RefinePage onBack={() => setScreen("detail")} />}
        {screen === "combine" && <CombinePage key={`combine-${combineNav}-${selected.join("-")}`} selected={selected} onRun={() => setScreen("union")} />}
        {screen === "union" && <UnionMatchPage onBack={() => setScreen("combine")} onConfirm={startMerge} />}
        {screen === "merge" && <MergePage key={`merge-${selected.join("-")}`} selected={selected} onBack={() => { setSelected([]); setScreen("list"); }} onRun={startMerge} />}
        {screen === "merging" && <MergingPage names={mergeJob?.names || DEFAULT_NAMES} onLeave={() => setScreen("list")} />}
        {screen === "result" && <ResultPage names={resultNames} onClose={closeResult} />}

        {/* 백그라운드 병합 트레이 (목록에서만 노출) */}
        {screen === "list" && mergeJob && (
          <MergeTray job={mergeJob} onOpen={() => setScreen("result")} onClose={mergeJob.done ? () => setMergeJob(null) : undefined} />
        )}

        {/* Ask AI — 헤더 없는 화면엔 우상단에 띄움 */}
        {!askOpen && (screen === "refine" || screen === "combine") && (
          <div style={{ position: "absolute", top: 14, right: 24, zIndex: 80 }}><AskAIBtn onClick={() => setAskOpen(true)} /></div>
        )}
      </main>
      {askOpen && <AskAIPanel onClose={() => setAskOpen(false)} />}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onStart={(files) => { setUploadOpen(false); setProfiling(files); }} />}
      {profiling && <ProfilingTray files={profiling} onClose={() => setProfiling(null)} />}
    </div>
  );
}
