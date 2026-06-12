import { Fragment, useMemo, useState } from "react";

/* =========================================================
 *  B2B Audit Log (Owner / Admin only)
 *  - 인증 · 데이터셋 · 전처리 · 릴리즈 · Agent · Report · 권한
 *  - 기간 / 사용자 / 카테고리 필터 + CSV 내보내기
 *  - 전처리 완료 이벤트는 행 클릭 시 상세 패널 확장
 * ========================================================= */

const CATEGORIES = [
  { key: "auth", label: "인증" },
  { key: "dataset", label: "데이터셋" },
  { key: "preprocess", label: "전처리" },
  { key: "release", label: "릴리즈" },
  { key: "agent", label: "Agent" },
  { key: "report", label: "Report" },
  { key: "permission", label: "권한" },
];

const RESULT_BADGE = {
  성공: { bg: "#ECFDF3", fg: "#027A48", bd: "#ABEFC6" },
  실패: { bg: "#FEF3F2", fg: "#B42318", bd: "#FECDCA" },
};

/* ---------- 샘플 데이터 ---------- */
const SEED_LOGS = [
  {
    id: 1,
    ts: "2026-04-06 14:23:05",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "auth",
    event: "로그인 성공",
    target: "—",
    detail: "웹에서 로그인",
    result: "성공",
    ip: "211.234.56.78",
  },
  {
    id: 2,
    ts: "2026-04-06 14:25:12",
    user: { name: "—", email: "minsu@company.com" },
    category: "auth",
    event: "로그인 실패",
    target: "—",
    detail: "비밀번호 불일치",
    result: "실패",
    ip: "211.234.56.78",
  },
  {
    id: 3,
    ts: "2026-04-06 18:00:33",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "auth",
    event: "로그아웃",
    target: "—",
    detail: "—",
    result: "성공",
    ip: "211.234.56.78",
  },
  {
    id: 4,
    ts: "2026-04-06 10:15:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "dataset",
    event: "업로드",
    target: "고객_이탈_2024Q4",
    detail: "파일 크기: 24.3MB · 행: 50,000 · 컬럼: 32 → 스냅샷 생성 · v1 릴리즈",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 5,
    ts: "2026-04-06 10:32:17",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "dataset",
    event: "조회",
    target: "고객_이탈_2024Q4",
    detail: "—",
    result: "성공",
    ip: "211.234.56.78",
  },
  {
    id: 6,
    ts: "2026-04-06 11:05:44",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "dataset",
    event: "이름 변경",
    target: "고객_이탈_2024Q4",
    detail: "고객_이탈_raw → 고객_이탈_2024Q4",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 7,
    ts: "2026-04-06 16:45:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "dataset",
    event: "삭제",
    target: "테스트_데이터_v2",
    detail: "—",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 8,
    ts: "2026-04-06 11:20:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "실행 시작",
    target: "고객_이탈_2024Q4",
    detail: "Missing Value Treatment",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 9,
    ts: "2026-04-06 11:23:47",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "preprocess",
    event: "완료",
    target: "고객_이탈_2024Q4",
    detail: "모듈: Missing Value Treatment · 스냅샷: a3f8c2d",
    result: "성공",
    ip: "10.0.1.52",
    meta: {
      module: "Missing Value Treatment",
      snapshot: "a3f8c2da3f8c2da3f8c2da3f8c2da3f8c2d",
      rows: [
        { label: "결측값 보정", value: "총 410개 보정 — 성별 230개, 나이 180개" },
        { label: "신호 컬럼 추가", value: "2개 컬럼 추가 — 성별_결측여부, 나이_결측여부" },
      ],
    },
  },
  {
    id: 10,
    ts: "2026-04-06 14:10:22",
    user: { name: "김민수", email: "minsu@company.com" },
    category: "preprocess",
    event: "실패",
    target: "매출_2024",
    detail: "모듈: Outlier, Distribution & Category Refinement · 컬럼 '과금액' 데이터 타입 불일치",
    result: "실패",
    ip: "211.234.56.78",
  },
  {
    id: 11,
    ts: "2026-04-06 15:00:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "release",
    event: "릴리즈 생성",
    target: "고객_이탈_2024Q4",
    detail: 'v2 · "Q4 최종본"',
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 12,
    ts: "2026-04-06 15:30:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "agent",
    event: "실행 시작",
    target: "고객_이탈_2024Q4 (v2)",
    detail: "이탈 예측 분석",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 13,
    ts: "2026-04-06 15:45:22",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "agent",
    event: "실행 완료",
    target: "고객_이탈_2024Q4 (v2)",
    detail: "신제품 가격 전략",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 14,
    ts: "2026-04-06 15:30:00",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "report",
    event: "리포트 조회",
    target: "[Churn Prediction] ecommerce",
    detail: "—",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 15,
    ts: "2026-04-06 15:45:22",
    user: { name: "박지영", email: "jiyoung@company.com" },
    category: "report",
    event: "리포트 다운로드",
    target: "[Churn Prediction] ecommerce",
    detail: "—",
    result: "성공",
    ip: "10.0.1.52",
  },
  {
    id: 16,
    ts: "2026-04-06 09:00:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "사용자 초대",
    target: "newuser@company.com",
    detail: "Member 역할로 초대",
    result: "성공",
    ip: "10.0.1.10",
  },
  {
    id: 17,
    ts: "2026-04-06 09:15:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "역할 변경",
    target: "박지영",
    detail: "Member → Admin",
    result: "성공",
    ip: "10.0.1.10",
  },
  {
    id: 18,
    ts: "2026-04-06 09:20:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "데이터셋 권한 변경",
    target: "고객_이탈_2024Q4",
    detail: "김민수에게 편집 권한 부여",
    result: "성공",
    ip: "10.0.1.10",
  },
  {
    id: 19,
    ts: "2026-04-06 17:00:00",
    user: { name: "이정훈", email: "junghoon@company.com" },
    category: "permission",
    event: "사용자 제거",
    target: "formeruser@company.com",
    detail: "조직에서 제거",
    result: "성공",
    ip: "10.0.1.10",
  },
];

const PAGE_SIZE = 50;

/* ---------- util ---------- */
const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const catLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label ?? key;

function toCSV(rows) {
  const head = ["일시", "사용자", "이메일", "카테고리", "이벤트 유형", "대상 리소스", "내용", "결과", "IP"];
  const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const body = rows.map((r) =>
    [r.ts, r.user.name, r.user.email, catLabel(r.category), r.event, r.target, r.detail, r.result, r.ip]
      .map(esc)
      .join(",")
  );
  return [head.map(esc).join(","), ...body].join("\n");
}

/* ========================================================= */
export default function AuditLog() {
  const [from, setFrom] = useState(daysAgoISO(30));
  const [to, setTo] = useState(todayISO());
  const [userFilter, setUserFilter] = useState([]); // [] = 전체
  const [categoryFilter, setCategoryFilter] = useState(CATEGORIES.map((c) => c.key));
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const uniqueUsers = useMemo(() => {
    const map = new Map();
    SEED_LOGS.forEach((l) => {
      if (!map.has(l.user.email)) map.set(l.user.email, l.user);
    });
    return [...map.values()];
  }, []);

  const filtered = useMemo(() => {
    return SEED_LOGS.filter((l) => {
      const d = l.ts.slice(0, 10);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (userFilter.length && !userFilter.includes(l.user.email)) return false;
      if (!categoryFilter.includes(l.category)) return false;
      return true;
    });
  }, [from, to, userFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => {
    setFrom(daysAgoISO(30));
    setTo(todayISO());
    setUserFilter([]);
    setCategoryFilter(CATEGORIES.map((c) => c.key));
    setPage(1);
  };

  const exportCSV = () => {
    const blob = new Blob(["\uFEFF" + toCSV(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log_${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCategory = (key) => {
    setPage(1);
    setCategoryFilter((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleUser = (email) => {
    setPage(1);
    setUserFilter((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  return (
    <div style={S.page}>
      {/* ---------- Header ---------- */}
      <div style={S.header}>
        <div>
          <div style={S.h1}>감사 로그</div>
          <div style={S.sub}>조직 내 모든 활동을 시간순으로 추적합니다. 보관 기간: 최근 365일 (기본 조회: 최근 30일)</div>
        </div>
        <button style={S.btnPrimary} onClick={exportCSV}>
          <IconDownload /> CSV 내보내기
        </button>
      </div>

      {/* ---------- Filter Bar ---------- */}
      <div style={S.filterBar}>
        <div style={S.filterGroup}>
          <div style={S.filterLabel}>기간</div>
          <div style={S.dateRow}>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              style={S.dateInput}
            />
            <span style={{ color: "#667085" }}>—</span>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              style={S.dateInput}
            />
          </div>
        </div>

        <div style={{ ...S.filterGroup, position: "relative" }}>
          <div style={S.filterLabel}>사용자</div>
          <button
            style={S.select}
            onClick={() => setUserDropdownOpen((o) => !o)}
          >
            <span>
              {userFilter.length === 0
                ? "전체 사용자"
                : userFilter.length === 1
                ? uniqueUsers.find((u) => u.email === userFilter[0])?.name ?? userFilter[0]
                : `${userFilter.length}명 선택`}
            </span>
            <IconChevron />
          </button>
          {userDropdownOpen && (
            <div style={S.dropdown}>
              <div style={S.dropdownHeader}>
                <button
                  style={S.linkBtn}
                  onClick={() => setUserFilter([])}
                >
                  전체 해제
                </button>
              </div>
              {uniqueUsers.map((u) => (
                <label key={u.email} style={S.checkRow}>
                  <input
                    type="checkbox"
                    checked={userFilter.includes(u.email)}
                    onChange={() => toggleUser(u.email)}
                  />
                  <span style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#101828" }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#667085" }}>{u.email}</div>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div style={{ ...S.filterGroup, flex: 1 }}>
          <div style={S.filterLabel}>카테고리</div>
          <div style={S.chipRow}>
            {CATEGORIES.map((c) => {
              const active = categoryFilter.includes(c.key);
              return (
                <button
                  key={c.key}
                  onClick={() => toggleCategory(c.key)}
                  style={{ ...S.chip, ...(active ? S.chipActive : {}) }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <button style={S.btnGhost} onClick={reset}>
          초기화
        </button>
      </div>

      {/* ---------- Table ---------- */}
      <div style={S.tableWrap}>
        <table style={S.table}>
          <colgroup>
            <col style={{ width: 160 }} />
            <col style={{ width: 180 }} />
            <col style={{ width: 96 }} />
            <col style={{ width: 140 }} />
            <col style={{ width: 200 }} />
            <col />
            <col style={{ width: 80 }} />
            <col style={{ width: 130 }} />
            <col style={{ width: 28 }} />
          </colgroup>
          <thead>
            <tr>
              <th style={S.th}>일시</th>
              <th style={S.th}>사용자</th>
              <th style={S.th}>카테고리</th>
              <th style={S.th}>이벤트 유형</th>
              <th style={S.th}>대상 리소스</th>
              <th style={S.th}>내용</th>
              <th style={S.th}>결과</th>
              <th style={S.th}>IP</th>
              <th style={S.th}></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 && (
              <tr>
                <td colSpan={9} style={S.empty}>
                  조건에 해당하는 로그가 없습니다.
                </td>
              </tr>
            )}
            {pageRows.map((r) => {
              const hasDetail = r.category === "preprocess" && r.event === "완료" && r.meta;
              const isOpen = expanded === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    style={{
                      ...S.tr,
                      cursor: hasDetail ? "pointer" : "default",
                      background: isOpen ? "#F9FAFB" : "transparent",
                    }}
                    onClick={() => hasDetail && setExpanded(isOpen ? null : r.id)}
                  >
                    <td style={S.td}>{r.ts}</td>
                    <td style={S.td}>
                      <div style={{ fontSize: 13, color: "#101828" }}>{r.user.name}</div>
                      <div style={{ fontSize: 12, color: "#667085" }}>{r.user.email}</div>
                    </td>
                    <td style={S.td}>{catLabel(r.category)}</td>
                    <td style={S.td}>{r.event}</td>
                    <td style={S.td}>
                      <span style={S.resource}>{r.target}</span>
                    </td>
                    <td style={{ ...S.td, color: "#475467" }}>{r.detail}</td>
                    <td style={S.td}>
                      <ResultBadge value={r.result} />
                    </td>
                    <td style={{ ...S.td, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}>
                      {r.ip}
                    </td>
                    <td style={S.td}>
                      {hasDetail && (
                        <span style={{ transform: isOpen ? "rotate(90deg)" : "none", display: "inline-block", color: "#98A2B3" }}>
                          ▸
                        </span>
                      )}
                    </td>
                  </tr>
                  {hasDetail && isOpen && (
                    <tr>
                      <td colSpan={9} style={{ padding: 0, background: "#F9FAFB", borderBottom: "1px solid #EAECF0" }}>
                        <DetailPanel meta={r.meta} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ---------- Pagination ---------- */}
      <div style={S.pager}>
        <div style={{ color: "#667085", fontSize: 13 }}>
          총 <b style={{ color: "#101828" }}>{filtered.length.toLocaleString()}</b>건 · 페이지 {page} / {totalPages}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button style={S.pagerBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>
            이전
          </button>
          <button style={S.pagerBtn} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
function ResultBadge({ value }) {
  const t = RESULT_BADGE[value] ?? RESULT_BADGE["성공"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        fontSize: 12,
        fontWeight: 500,
      }}
    >
      {value}
    </span>
  );
}

function DetailPanel({ meta }) {
  return (
    <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 10, columnGap: 16 }}>
      <div style={S.detailKey}>모듈</div>
      <div style={S.detailVal}>{meta.module}</div>

      <div style={S.detailKey}>스냅샷 해시</div>
      <div style={{ ...S.detailVal, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, wordBreak: "break-all" }}>
        {meta.snapshot}
      </div>

      {meta.rows.map((r, i) => (
        <Fragment key={i}>
          <div style={S.detailKey}>{r.label}</div>
          <div style={S.detailVal}>{r.value}</div>
        </Fragment>
      ))}
    </div>
  );
}

/* ---------- icons ---------- */
function IconDownload() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ---------- styles ---------- */
const S = {
  page: {
    padding: "28px 32px",
    background: "#FFFFFF",
    minHeight: "100vh",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Pretendard, Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: "#101828",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  h1: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 13, color: "#667085" },

  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    background: "#101828",
    color: "#fff",
    border: "1px solid #101828",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  btnGhost: {
    padding: "8px 14px",
    background: "#fff",
    color: "#344054",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    alignSelf: "flex-end",
  },

  filterBar: {
    display: "flex",
    gap: 16,
    padding: 16,
    border: "1px solid #EAECF0",
    borderRadius: 10,
    background: "#FFFFFF",
    marginBottom: 16,
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  filterGroup: { display: "flex", flexDirection: "column", gap: 6, minWidth: 180 },
  filterLabel: { fontSize: 12, fontWeight: 500, color: "#344054" },
  dateRow: { display: "flex", alignItems: "center", gap: 6 },
  dateInput: {
    padding: "7px 10px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    fontSize: 13,
    color: "#101828",
    background: "#fff",
  },

  select: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    minWidth: 180,
    padding: "7px 12px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    background: "#fff",
    fontSize: 13,
    color: "#101828",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    width: 260,
    background: "#fff",
    border: "1px solid #EAECF0",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(16,24,40,0.12)",
    zIndex: 20,
    padding: 6,
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "4px 8px",
    borderBottom: "1px solid #F2F4F7",
    marginBottom: 4,
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#475467",
    fontSize: 12,
    cursor: "pointer",
    padding: 0,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },

  chipRow: { display: "flex", flexWrap: "wrap", gap: 6 },
  chip: {
    padding: "6px 12px",
    border: "1px solid #101828",
    borderRadius: 999,
    background: "#fff",
    color: "#101828",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  },
  chipActive: {
    background: "#101828",
    color: "#fff",
    borderColor: "#101828",
  },

  tableWrap: {
    border: "1px solid #EAECF0",
    borderRadius: 10,
    overflow: "hidden",
    background: "#fff",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" },
  th: {
    padding: "10px 12px",
    textAlign: "left",
    background: "#F9FAFB",
    borderBottom: "1px solid #EAECF0",
    fontSize: 12,
    fontWeight: 500,
    color: "#475467",
  },
  tr: { borderBottom: "1px solid #F2F4F7" },
  td: {
    padding: "12px",
    verticalAlign: "top",
    color: "#101828",
    wordBreak: "break-word",
  },
  resource: {
    padding: "2px 8px",
    background: "#F2F4F7",
    borderRadius: 6,
    fontSize: 12,
    color: "#344054",
  },
  empty: {
    padding: "48px 16px",
    textAlign: "center",
    color: "#98A2B3",
    fontSize: 13,
  },

  detailKey: { fontSize: 12, color: "#667085" },
  detailVal: { fontSize: 13, color: "#101828" },

  pager: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  pagerBtn: {
    padding: "6px 12px",
    border: "1px solid #D0D5DD",
    borderRadius: 8,
    background: "#fff",
    color: "#344054",
    fontSize: 13,
    cursor: "pointer",
  },
};
