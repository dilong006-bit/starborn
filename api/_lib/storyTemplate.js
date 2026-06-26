// 이름 개인화 — LLM 재호출 없이 템플릿 치환 (비용 0, 캐시 무력화 방지).
// 스토리 본문은 (date+tone)으로 캐싱되고, 이름은 여기서만 입혀진다.

const NAME_RE = /^[\p{L}\p{N} ]{1,20}$/u; // 글자/숫자/공백 1~20자만 허용(주입 방지)

/** 사용자 이름 정규화. 유효하지 않으면 null. */
export function sanitizeName(raw) {
  if (!raw) return null;
  const name = String(raw).replace(/\s+/g, " ").trim();
  if (!name || !NAME_RE.test(name)) return null;
  return name;
}

const TONE_OPENER = {
  essay: (n) => `${n}님에게,`,
  fortune: (n) => `${n}님을 위한 오늘의 우주 운세`,
  poem: (n) => `${n}님께`,
};

/**
 * 이름이 있으면 톤에 맞는 짧은 인사말을 본문 앞에 덧붙인다.
 * 이름이 없거나 유효하지 않으면 원문 그대로.
 */
export function injectName(story, rawName, tone) {
  const name = sanitizeName(rawName);
  if (!name) return story;
  const opener = (TONE_OPENER[tone] || TONE_OPENER.essay)(name);
  return `${opener}\n\n${story}`;
}
