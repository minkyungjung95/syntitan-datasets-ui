import { useState } from "react";

/* =========================================================
 *  Settings > MCP — Claude Code 연결
 *  PRD 6-1 / 6-2 UI 명세
 *  - Owner 화면 / Member 화면 두 가지를 분리 노출
 * ========================================================= */

const MCP_COMMAND =
  "claude mcp add syntitan https://mcp.syntitan.ai/v1 --header \"Authorization: Bearer ${SYNTITAN_TOKEN}\"";

export default function McpSettings() {
  return (
    <div style={PAGE.wrap}>
      <div style={PAGE.intro}>
        <div style={PAGE.kicker}>SynTitan · Settings &gt; MCP</div>
        <div style={PAGE.title}>Claude Code 연결 화면</div>
        <div style={PAGE.subtitle}>
          Org Owner / Admin 화면과 Member 화면 두 가지를 분리해서 정리했습니다.
        </div>
      </div>

      <SectionLabel index="01" role="Org Owner / Admin" />
      <OwnerScreen />

      <SectionLabel index="02" role="Member" />
      <MemberScreen />
    </div>
  );
}

/* =========================================================
 *  Owner 화면 — 토글 ON / OFF 두 상태를 같은 화면에서 토글로 확인
 * ========================================================= */
function OwnerScreen() {
  const [allowed, setAllowed] = useState(true);
  const [connected, setConnected] = useState(false);
  const [confirmOff, setConfirmOff] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(MCP_COMMAND).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggle = () => {
    if (allowed) setConfirmOff(true);
    else setAllowed(true);
  };

  return (
    <ScreenFrame caption="Org Owner / Admin · 토글 직접 조작 + 본인 연결 상태 확인">
      <DemoTabs
        items={[
          {
            label: "조직 허용 ON · 미연결",
            active: allowed && !connected,
            onClick: () => { setAllowed(true); setConnected(false); },
          },
          {
            label: "조직 허용 ON · 연결됨",
            active: allowed && connected,
            onClick: () => { setAllowed(true); setConnected(true); },
          },
          {
            label: "조직 허용 OFF",
            active: !allowed,
            onClick: () => { setAllowed(false); setConnected(false); },
          },
        ]}
      />

      <ModalShell active="mcp">
        <ModalHeader />
        <div style={SHELL.body}>
          <Card>
            <CardHead>
              <ClaudeBadge />
              <CardTitleBlock />
              <Toggle on={allowed} onClick={handleToggle} />
            </CardHead>

            {allowed ? (
              <CardBody>
                <CommandBlock onCopy={handleCopy} copied={copied} />
                <StepsList />
                <ConnectionStatus
                  connected={connected}
                  onDisconnect={() => setConnected(false)}
                  onConnect={() => setConnected(true)}
                />
              </CardBody>
            ) : (
              <OffBanner
                tone="info"
                title="현재 비활성화 상태"
                desc="토글을 켜면 본인을 포함한 조직 멤버가 개인 단위로 Claude Code에 연결할 수 있습니다. 끄면 모든 멤버의 인증 토큰이 폐기됩니다."
              />
            )}
          </Card>

          <FooterNote />
        </div>
      </ModalShell>

      {confirmOff && (
        <ConfirmDialog
          onCancel={() => setConfirmOff(false)}
          onConfirm={() => {
            setAllowed(false);
            setConnected(false);
            setConfirmOff(false);
          }}
        />
      )}
    </ScreenFrame>
  );
}

/* =========================================================
 *  Member 화면 — 토글은 읽기 전용 / 본인 연결 상태만 조작
 * ========================================================= */
function MemberScreen() {
  // 데모용: 관리자가 켜놨는지(allowed) + 본인 연결 여부(connected)
  const [allowed, setAllowed] = useState(true);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(MCP_COMMAND).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ScreenFrame caption="Member · 토글은 읽기 전용, 본인 연결만 조작">
      {/* 데모 컨트롤 (실제 UI에는 없음) */}
      <DemoTabs
        items={[
          {
            label: "관리자 허용 ON · 미연결",
            active: allowed && !connected,
            onClick: () => {
              setAllowed(true);
              setConnected(false);
            },
          },
          {
            label: "관리자 허용 ON · 연결됨",
            active: allowed && connected,
            onClick: () => {
              setAllowed(true);
              setConnected(true);
            },
          },
          {
            label: "관리자 허용 OFF",
            active: !allowed,
            onClick: () => {
              setAllowed(false);
              setConnected(false);
            },
          },
        ]}
      />

      <ModalShell active="mcp">
        <ModalHeader />
        <div style={SHELL.body}>
          <Card>
            <CardHead>
              <ClaudeBadge />
              <CardTitleBlock />
              <Toggle on={allowed} disabled />
            </CardHead>

            {allowed ? (
              <CardBody>
                <CommandBlock onCopy={handleCopy} copied={copied} />
                <StepsList />
                <ConnectionStatus
                  connected={connected}
                  onDisconnect={() => setConnected(false)}
                  onConnect={() => setConnected(true)}
                />
              </CardBody>
            ) : (
              <OffBanner
                tone="lock"
                title="관리자가 이 기능을 비활성화한 상태입니다."
                desc="사용하려면 관리자에게 문의해 주세요."
              />
            )}
          </Card>

          <FooterNote />
        </div>
      </ModalShell>
    </ScreenFrame>
  );
}

/* =========================================================
 *  Shared building blocks
 * ========================================================= */

function ModalShell({ children, active }) {
  return (
    <div style={SHELL.outer}>
      <aside style={SHELL.side}>
        <button style={SHELL.close} aria-label="닫기">
          <CloseIcon />
        </button>
        <nav style={SHELL.nav}>
          <NavItem label="My Profile"   active={active === "profile"} />
          <NavItem label="Organization" active={active === "org"} />
          <NavItem label="Plan & Billing" active={active === "plan"} />
          <NavItem label="MCP"          active={active === "mcp"} />
        </nav>
      </aside>
      <main style={SHELL.main}>{children}</main>
    </div>
  );
}

function ModalHeader() {
  return (
    <header style={SHELL.header}>
      <div style={SHELL.h1}>SynTitan MCP</div>
      <div style={SHELL.sub}>Add your favorite apps and tools to SynTitan.</div>
    </header>
  );
}

function Card({ children }) {
  return <section style={CARD.outer}>{children}</section>;
}

function CardHead({ children }) {
  return (
    <div style={CARD.head}>
      <div style={CARD.headLeft}>{children.slice(0, 2)}</div>
      {children[2]}
    </div>
  );
}

function CardTitleBlock() {
  return (
    <div>
      <div style={CARD.title}>Claude Code</div>
      <div style={CARD.desc}>
        터미널의 Claude Code에서 자연어로 타이탄 데이터셋·진단·이력을 조회합니다.
      </div>
    </div>
  );
}

function CardBody({ children }) {
  return <div style={CARD.body}>{children}</div>;
}

function NavItem({ label, active }) {
  return (
    <div
      style={{
        ...SHELL.navItem,
        ...(active ? SHELL.navItemActive : null),
      }}
    >
      {label}
    </div>
  );
}

/* ---------- 명령어 박스 + 단계 안내 ---------- */
function CommandBlock({ onCopy, copied }) {
  return (
    <div>
      <div style={CMD.label}>연결 명령어</div>
      <div style={CMD.box}>
        <code style={CMD.code}>{MCP_COMMAND}</code>
        <button style={CMD.copy} onClick={onCopy} aria-label="명령어 복사">
          {copied ? (
            <>
              <CheckIcon /> <span>복사됨</span>
            </>
          ) : (
            <>
              <CopyIcon /> <span>복사</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StepsList() {
  return (
    <ol style={STEPS.list}>
      <li style={STEPS.item}>
        <span style={STEPS.num}>1</span>
        <span style={STEPS.text}>위 명령어를 터미널에 붙여넣고 실행</span>
      </li>
      <li style={STEPS.item}>
        <span style={STEPS.num}>2</span>
        <span style={STEPS.text}>
          브라우저가 열리면 타이탄 로그인 후{" "}
          <span style={STEPS.em}>"Claude Code 접근 허용"</span> 클릭
        </span>
      </li>
      <li style={STEPS.item}>
        <span style={STEPS.num}>3</span>
        <span style={STEPS.text}>터미널로 돌아오면 연결 완료</span>
      </li>
    </ol>
  );
}

/* ---------- 내 연결 상태 ---------- */
function ConnectionStatus({ connected, onDisconnect }) {
  return (
    <div style={STATUS.row}>
      <div style={STATUS.left}>
        <div style={STATUS.label}>내 연결 상태</div>
        {connected ? (
          <div style={STATUS.connected}>
            <Dot color="#12B76A" />
            <span>연결됨</span>
            <span style={STATUS.metaDot}>·</span>
            <span style={STATUS.meta}>2026-05-19 14:23 인증</span>
          </div>
        ) : (
          <div style={STATUS.idle}>
            <Dot color="#D0D5DD" />
            <span>아직 연결되지 않음 — 위 명령어를 실행하면 자동으로 연결됩니다</span>
          </div>
        )}
      </div>
      {connected && (
        <button style={STATUS.danger} onClick={onDisconnect}>
          연결 해제
        </button>
      )}
    </div>
  );
}

function Dot({ color }) {
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: color,
        display: "inline-block",
      }}
    />
  );
}

function OffBanner({ tone, title, desc }) {
  return (
    <div style={tone === "lock" ? BANNER.lock : BANNER.info}>
      {tone === "lock" ? <LockIcon /> : <InfoIcon />}
      <div>
        <div style={BANNER.title}>{title}</div>
        <div style={BANNER.desc}>{desc}</div>
      </div>
    </div>
  );
}

/* ---------- Footer 정책 안내 ---------- */
function FooterNote() {
  return (
    <div style={FOOT.wrap}>
      <div style={FOOT.title}>알아두기</div>
      <ul style={FOOT.list}>
        <li>각 멤버의 개인 인증 정보는 본인 권한 범위에서만 작동합니다.</li>
        <li>마스킹되지 않은 PII가 있는 데이터셋의 값은 응답에 포함되지 않습니다.</li>
        <li>모든 MCP 호출은 감사 로그에 자동 기록됩니다.</li>
        <li>조회 도구는 크레딧이 차감되지 않으며, 실행 도구는 타이탄 내 실행과 동일하게 차감됩니다.</li>
      </ul>
    </div>
  );
}

/* ---------- 확인 다이얼로그 ---------- */
function ConfirmDialog({ onCancel, onConfirm }) {
  return (
    <div style={DIALOG.scrim}>
      <div style={DIALOG.box}>
        <div style={DIALOG.title}>Claude Code 연결을 비활성화할까요?</div>
        <div style={DIALOG.desc}>
          현재 연결된 멤버의 인증 토큰이 모두 폐기되며, 즉시 호출이 차단됩니다.
          다시 켜더라도 멤버는 명령어를 재실행해 연결해야 합니다.
        </div>
        <div style={DIALOG.actions}>
          <button style={DIALOG.cancel} onClick={onCancel}>
            취소
          </button>
          <button style={DIALOG.confirm} onClick={onConfirm}>
            비활성화
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Toggle ---------- */
function Toggle({ on, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-pressed={on}
      style={{
        position: "relative",
        width: 40,
        height: 22,
        borderRadius: 999,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        background: on ? "#171719" : "#D5D6D9",
        opacity: disabled ? 0.55 : 1,
        transition: "background 120ms ease",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 20 : 2,
          width: 18,
          height: 18,
          borderRadius: 999,
          background: "#FFFFFF",
          boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
          transition: "left 120ms ease",
        }}
      />
    </button>
  );
}

/* ---------- Screen frame & labels ---------- */
function ScreenFrame({ caption, children }) {
  return (
    <div style={FRAME.wrap}>
      {caption && <div style={FRAME.caption}>{caption}</div>}
      <div style={FRAME.stage}>{children}</div>
    </div>
  );
}

function SectionLabel({ index, role }) {
  return (
    <div style={SECTION.wrap}>
      <div style={SECTION.index}>{index}</div>
      <div style={SECTION.role}>{role}</div>
      <div style={SECTION.line} />
    </div>
  );
}

function DemoTabs({ items }) {
  return (
    <div style={TABS.wrap}>
      <div style={TABS.label}>상태</div>
      <div style={TABS.row}>
        {items.map((t) => (
          <button
            key={t.label}
            onClick={t.onClick}
            style={{ ...TABS.tab, ...(t.active ? TABS.tabActive : null) }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */
function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 3L11 11M11 3L3 11" stroke="#171719" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 11V3.5C3 2.67 3.67 2 4.5 2H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="#7B7E85" strokeWidth="1.2" />
      <path d="M8 7.2V11.2" stroke="#7B7E85" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5.2" r="0.85" fill="#7B7E85" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.4" stroke="#7B7E85" strokeWidth="1.3" />
      <path d="M5 7V5C5 3.34 6.34 2 8 2C9.66 2 11 3.34 11 5V7" stroke="#7B7E85" strokeWidth="1.3" />
    </svg>
  );
}
function ClaudeBadge() {
  return (
    <div style={CARD.logo}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5.6 18L9.3 6H12L8.3 18H5.6ZM12.6 18L16.3 6H19L15.3 18H12.6Z"
          fill="#D97757"
        />
      </svg>
    </div>
  );
}

/* =========================================================
 *  Styles
 * ========================================================= */
const PAGE = {
  wrap: {
    minHeight: "100vh",
    background: "#F4F4F5",
    fontFamily:
      "Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#171719",
    padding: "40px 32px 80px",
    boxSizing: "border-box",
  },
  intro: {
    maxWidth: 980,
    margin: "0 auto 28px",
  },
  kicker: {
    fontSize: 11.5,
    fontWeight: 600,
    color: "#7B7E85",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: 700, color: "#171719", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#7B7E85" },
};

const SECTION = {
  wrap: {
    maxWidth: 980,
    margin: "44px auto 14px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  index: {
    fontSize: 11,
    fontWeight: 700,
    color: "#FFFFFF",
    background: "#171719",
    borderRadius: 999,
    padding: "3px 8px",
    letterSpacing: 0.4,
  },
  role: { fontSize: 14, fontWeight: 700, color: "#171719" },
  line: { flex: 1, height: 1, background: "#E5E5E5" },
};

const FRAME = {
  wrap: {
    maxWidth: 980,
    margin: "0 auto",
    background: "#FFFFFF",
    border: "1px solid #EAEAEA",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
  },
  caption: {
    fontSize: 12,
    color: "#7B7E85",
    marginBottom: 12,
    fontWeight: 500,
  },
  stage: {
    background: "#F8F8F9",
    border: "1px solid #EFEFEF",
    borderRadius: 14,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
};

const TABS = {
  wrap: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  label: { fontSize: 11.5, color: "#7B7E85", fontWeight: 600 },
  row: {
    display: "flex",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    padding: 3,
    borderRadius: 9,
    gap: 2,
  },
  tab: {
    padding: "5px 10px",
    background: "transparent",
    color: "#52535C",
    border: "none",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  tabActive: { background: "#171719", color: "#FFFFFF" },
};

const SHELL = {
  outer: {
    width: "100%",
    maxWidth: 880,
    minHeight: 540,
    display: "flex",
    background: "#FFFFFF",
    borderRadius: 14,
    boxShadow:
      "0 16px 40px rgba(16, 24, 40, 0.10), 0 2px 6px rgba(16, 24, 40, 0.05)",
    overflow: "hidden",
    border: "1px solid #EAEAEA",
  },
  side: {
    width: 200,
    padding: "20px 14px",
    background: "#FAFAFA",
    borderRight: "1px solid #EFEFEF",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  close: {
    width: 26,
    height: 26,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  nav: { display: "flex", flexDirection: "column", gap: 2 },
  navItem: {
    padding: "9px 12px",
    borderRadius: 8,
    fontSize: 13.5,
    fontWeight: 500,
    color: "#52535C",
  },
  navItemActive: { background: "#EFEFEF", color: "#171719", fontWeight: 600 },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  header: {
    padding: "22px 28px 16px",
    borderBottom: "1px solid #F0F0F0",
  },
  h1: { fontSize: 17, fontWeight: 700, color: "#171719", marginBottom: 4 },
  sub: { fontSize: 12.5, color: "#7B7E85" },
  body: {
    flex: 1,
    padding: "20px 28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
};

const CARD = {
  outer: {
    border: "1px solid #EAEAEA",
    borderRadius: 12,
    background: "#FFFFFF",
    overflow: "hidden",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "16px 18px",
    borderBottom: "1px solid #F2F2F2",
  },
  headLeft: { display: "flex", alignItems: "flex-start", gap: 12 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#FBEFE8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: { fontSize: 14, fontWeight: 600, color: "#171719", lineHeight: "20px" },
  desc: {
    fontSize: 12.5,
    color: "#7B7E85",
    lineHeight: "18px",
    marginTop: 2,
    maxWidth: 440,
  },
  body: {
    padding: "16px 18px 18px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
};

const CMD = {
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#52535C",
    marginBottom: 8,
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0E0E10",
    color: "#F4F4F5",
    borderRadius: 10,
    padding: "10px 12px",
    gap: 12,
  },
  code: {
    fontFamily:
      "'JetBrains Mono', 'SF Mono', ui-monospace, Menlo, Consolas, monospace",
    fontSize: 12,
    lineHeight: "18px",
    color: "#F4F4F5",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
    minWidth: 0,
  },
  copy: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "5px 10px",
    background: "rgba(255,255,255,0.10)",
    color: "#F4F4F5",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 7,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 500,
    flexShrink: 0,
  },
};

const STEPS = {
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  item: { display: "flex", alignItems: "flex-start", gap: 10 },
  num: {
    width: 20,
    height: 20,
    borderRadius: 999,
    background: "#171719",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  text: { fontSize: 13, color: "#3F4046", lineHeight: "20px" },
  em: { color: "#171719", fontWeight: 600 },
};

const STATUS = {
  row: {
    padding: "12px 14px",
    background: "#FAFAFA",
    border: "1px solid #EFEFEF",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 11.5, color: "#7B7E85", fontWeight: 500 },
  connected: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#171719",
  },
  idle: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    color: "#7B7E85",
  },
  metaDot: { color: "#D0D5DD", margin: "0 2px" },
  meta: { fontSize: 12, color: "#7B7E85", fontWeight: 400 },
  danger: {
    padding: "7px 12px",
    background: "#FFFFFF",
    color: "#B42318",
    border: "1px solid #F9CCC8",
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
  },
  ghost: {
    padding: "7px 12px",
    background: "#FFFFFF",
    color: "#171719",
    border: "1px solid #E5E5E5",
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 500,
    cursor: "pointer",
  },
};

const BANNER = {
  info: {
    margin: "14px 18px 18px",
    padding: "14px",
    background: "#FAFAFA",
    border: "1px solid #EFEFEF",
    borderRadius: 10,
    color: "#52535C",
    fontSize: 12.5,
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  lock: {
    margin: "14px 18px 18px",
    padding: "14px",
    background: "#FAFAFA",
    border: "1px solid #EFEFEF",
    borderRadius: 10,
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: 600,
    color: "#171719",
    marginBottom: 2,
  },
  desc: {
    fontSize: 12.5,
    color: "#7B7E85",
    lineHeight: "18px",
  },
};

const FOOT = {
  wrap: {
    padding: "14px 16px",
    background: "#FAFAFA",
    border: "1px solid #EFEFEF",
    borderRadius: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: "#52535C",
    marginBottom: 8,
  },
  list: {
    margin: 0,
    paddingLeft: 18,
    color: "#52535C",
    fontSize: 12.5,
    lineHeight: "20px",
  },
};

const DIALOG = {
  scrim: {
    position: "fixed",
    inset: 0,
    background: "rgba(16,24,40,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  box: {
    width: 420,
    background: "#FFFFFF",
    borderRadius: 14,
    padding: "22px 22px 18px",
    boxShadow: "0 16px 32px rgba(16,24,40,0.18)",
  },
  title: { fontSize: 15, fontWeight: 700, color: "#171719", marginBottom: 8 },
  desc: { fontSize: 13, color: "#52535C", lineHeight: "20px", marginBottom: 18 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 8 },
  cancel: {
    padding: "8px 14px",
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    color: "#171719",
    cursor: "pointer",
  },
  confirm: {
    padding: "8px 14px",
    background: "#B42318",
    border: "1px solid #B42318",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#FFFFFF",
    cursor: "pointer",
  },
};
