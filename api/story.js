import { callClaude, TONES } from "./_lib/claude.js";
import { fetchNasa } from "./_lib/nasa.js";
import {
  getApodCache,
  upsertApodCache,
  getStoryCache,
  upsertStoryCache,
} from "./_lib/supabaseAdmin.js";
import { normalizeDate, normalize } from "./_lib/apodNormalize.js";
import { injectName } from "./_lib/storyTemplate.js";

// POST /api/story  body: { date, tone, name? }
// 캐시 키 = (date + tone). name은 캐시에서 제외하고 템플릿 치환으로 개인화.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const body = req.body || {};
  const { date: reqDate } = normalizeDate(body.date);
  const tone = String(body.tone || "").trim();

  if (!TONES.includes(tone)) {
    return res.status(400).json({ error: "invalid_tone", allowed: TONES });
  }

  // 1) 스토리 캐시 조회 (date+tone) — hit이면 Claude 호출 0
  const cachedStory = await getStoryCache(reqDate, tone);
  let storyText = cachedStory?.story_text || null;
  let fallback = null;
  const cached = !!storyText;

  if (!storyText) {
    // 2) APOD 확보: 캐시 → 없으면 NASA 1회 조회 후 캐싱
    let apod = await getApodCache(reqDate);
    if (!apod) {
      try {
        const r = await fetchNasa(reqDate);
        if (r.ok) {
          const norm = normalize(r.data, reqDate);
          await upsertApodCache(norm);
          apod = norm;
        }
      } catch {
        /* 키 미설정 등 — 아래에서 apod 없음으로 처리 */
      }
    }
    if (!apod) {
      return res
        .status(424)
        .json({ error: "apod_required", hint: "GET /api/apod 먼저 호출하세요" });
    }

    // 3) Claude 호출 → 실패 시 APOD 원문 요약 폴백
    try {
      const result = await callClaude(apod.title, apod.explanation, tone);
      storyText = result.story;
      await upsertStoryCache(reqDate, tone, storyText, result.model);
    } catch (e) {
      if (e.code === "ANTHROPIC_API_KEY_MISSING") {
        return res.status(500).json({ error: e.code });
      }
      // 폴백: 원문 설명 앞부분 요약 (캐싱하지 않음 — 다음 시도 때 재생성)
      storyText = summarize(apod.explanation, apod.title);
      fallback = "story_generation_failed";
    }
  }

  // 4) 이름 개인화 (템플릿 치환, 비용 0)
  const story = injectName(storyText, body.name, tone);

  return res.status(200).json({ date: reqDate, tone, story, cached, fallback });
}

// Claude 실패 시 최소 폴백: APOD 영문 설명 앞부분 + 제목
function summarize(explanation, title) {
  const head = String(explanation || "").replace(/\s+/g, " ").trim().slice(0, 180);
  return `${title}\n\n${head}${head.length >= 180 ? "…" : ""}`;
}
