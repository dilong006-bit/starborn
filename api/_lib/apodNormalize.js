// APOD 날짜/응답 정규화 + 폴백 헬퍼 (순수 함수 — 외부 의존 없음, 단위 테스트 용이)

export const APOD_MIN_DATE = "1995-06-16"; // 허블 APOD 최초 기록일

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** UTC 기준 오늘 'YYYY-MM-DD' */
export function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

/** 'YYYY-MM-DD'에서 n일 전 날짜 문자열 (UTC 안전) */
export function addDays(date, n) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function prevDay(date) {
  return addDays(date, -1);
}

export function isToday(date) {
  return date === todayUTC();
}

/**
 * 입력 날짜를 [1995-06-16, today]로 클램프.
 * @returns {{ date: string, notice: null | "clamped_min" | "clamped_max" | "invalid_defaulted" }}
 */
export function normalizeDate(input) {
  const today = todayUTC();
  if (!input || !DATE_RE.test(String(input).trim())) {
    return { date: today, notice: input ? "invalid_defaulted" : null };
  }
  const date = String(input).trim();
  if (date < APOD_MIN_DATE) return { date: APOD_MIN_DATE, notice: "clamped_min" };
  if (date > today) return { date: today, notice: "clamped_max" };
  return { date, notice: null };
}

/** copyright: 개행/중복 공백 정규화 + trim. 비면 null. */
export function cleanCopyright(raw) {
  if (!raw) return null;
  const cleaned = String(raw).replace(/\s+/g, " ").trim();
  return cleaned.length ? cleaned : null;
}

/**
 * NASA 원시 응답을 apod_cache 스키마 형태로 정규화.
 * @param {object} raw NASA APOD JSON
 * @param {string} date 정규화된 요청 날짜(폴백 반영된 실제 날짜)
 */
export function normalize(raw, date) {
  const mediaType = raw.media_type === "video" ? "video" : "image";
  return {
    date: raw.date || date,
    title: raw.title || "(제목 없음)",
    explanation: raw.explanation || "",
    url: raw.url || "",
    hdurl: raw.hdurl || null,
    media_type: mediaType,
    thumbnail_url: raw.thumbnail_url || null,
    copyright: cleanCopyright(raw.copyright),
  };
}

/**
 * 정규화 결과 → 클라이언트 응답 형태.
 * 카드용 이미지는 초고해상도 hdurl이 아니라 중간 해상도 url 사용(카드 과부하 방지).
 * video는 thumbnail_url을 이미지로 사용(있을 때).
 */
export function toClient(norm, fallback = null) {
  const imageUrl =
    norm.media_type === "video" ? norm.thumbnail_url || null : norm.url || null;
  return {
    date: norm.date,
    title: norm.title,
    explanation: norm.explanation,
    imageUrl,
    mediaType: norm.media_type,
    copyright: norm.copyright,
    fallback,
  };
}
